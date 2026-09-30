// Worker de captación de leads de maudev.cl
//
// Recibe el POST del formulario de /contacto, lo guarda en Cloudflare D1 y envía
// un email de aviso a contacto@maudev.cl vía Resend.
//
// Rutas (todas POST):
//   /                 lead del formulario de contacto
//   /derechos         solicitud de derechos ARCOP (Ley 21.719), con folio y plazo
//   /consentimiento   registro de la elección de cookies, sin datos personales
// Y un cron diario que borra lo que ya cumplió el plazo de conservación que
// promete /privacidad. Prometer "12 meses" y no borrar nunca es peor que no
// prometer nada. Vive en Cloudflare, gratis
// y siempre encendido, así que el formulario nunca queda muerto por
// infraestructura caída.
//
// La URL pública de este worker es la que va en VITE_LEAD_WEBHOOK_URL.
//
// Secrets (wrangler secret put NOMBRE):
//   RESEND_API_KEY     obligatorio para el correo
//   TURNSTILE_SECRET   opcional — si está, se exige captcha (ver abajo)
//
// ── Por qué hay defensas ──
// Este es un endpoint PÚBLICO y SIN AUTENTICACIÓN que escribe en la base y manda
// correos. La URL está en el JavaScript del sitio, o sea que es pública de facto.
// El chequeo de Origin NO protege: solo decide qué cabecera CORS devolver; el
// navegador la respeta, pero curl no manda Origin y la petición se procesa igual.
// Sin lo de acá abajo, cualquiera puede llenar la base de basura, inundar la
// casilla y quemar la cuota de Resend.

const ALLOWED_ORIGINS = [
  "https://maudev.cl",
  "https://www.maudev.cl",
  // Cloudflare Pages: alias de produccion y de la rama develop. Sin estos, el
  // formulario del preview muere en el preflight: corsHeaders cae al primer
  // origen de la lista y responde Access-Control-Allow-Origin: maudev.cl, que
  // no coincide con el origen que pregunta y el navegador lo rechaza.
  //
  // Las URLs por despliegue (<hash>.maudev.pages.dev) no estan cubiertas a
  // proposito: se prueba en los alias estables, no en cada build.
  "https://maudev.pages.dev",
  "https://develop.maudev.pages.dev",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5180",
];

// Remitente en el dominio verificado en Resend. Destino: la casilla del negocio.
const FROM = "Maudev Leads <leads@maudev.cl>";
const TO = "contacto@maudev.cl";

// Largos máximos por campo. Sin esto, un `message` de 10 MB se guarda entero
// en D1 y se manda completo por correo.
const LIMITS = {
  name: 120,
  email: 200,
  whatsapp: 40,
  interest: 120,
  message: 2000,
  source: 120,
  submitted_at: 40,
  page_path: 200,
  referrer: 300,
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 120,
  utm_term: 120,
  utm_content: 120,
};

// De dónde vino el lead. El sitio ya enviaba estos campos y acá se descartaban,
// así que la pregunta más útil del negocio —qué trae clientes— quedaba sin
// responder. No usa cookies y cubre el 100% de los envíos, acepte o no el
// visitante la medición.
const ATRIBUCION = ["page_path", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

// Campo trampa: va oculto en el formulario. Un humano no lo ve y lo deja vacío;
// muchos bots rellenan todo lo que encuentran. Si viene con algo, es bot.
const HONEYPOT_FIELD = "empresa_web";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Los derechos que reconoce la Ley 21.719, con las mismas etiquetas que /privacidad.
const DERECHOS = {
  acceso: "Acceso",
  rectificacion: "Rectificación",
  supresion: "Supresión",
  oposicion: "Oposición",
  portabilidad: "Portabilidad",
  bloqueo: "Bloqueo",
};
// Plazos del artículo 11 de la Ley 21.719, los mismos que promete /privacidad:
// 30 días corridos para responder, y 2 días hábiles para el bloqueo temporal.
const PLAZO_RESPUESTA_DIAS = 30;
const PLAZO_BLOQUEO_DIAS_HABILES = 2;

// Fecha límite en hora de Chile (AAAA-MM-DD). Los días hábiles se cuentan
// saltando sábados y domingos, sin descontar feriados: así el plazo registrado
// nunca queda después del legal (a lo más, un día antes).
function fechaLimite(tipo) {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
  const d = new Date(`${hoy}T12:00:00Z`);
  if (tipo === "bloqueo") {
    let restantes = PLAZO_BLOQUEO_DIAS_HABILES;
    while (restantes > 0) {
      d.setUTCDate(d.getUTCDate() + 1);
      const dia = d.getUTCDay();
      if (dia !== 0 && dia !== 6) restantes -= 1;
    }
  } else {
    d.setUTCDate(d.getUTCDate() + PLAZO_RESPUESTA_DIAS);
  }
  return d.toISOString().slice(0, 10);
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

const json = (body, status, cors) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

/** Recorta al límite y devuelve null si queda vacío. */
function clean(value, max) {
  const v = String(value ?? "").trim().slice(0, max);
  return v || null;
}

/** Verifica el token de Cloudflare Turnstile. */
async function turnstileOk(token, secret, ip) {
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
    });
    const out = await res.json().catch(() => ({}));
    return out.success === true;
  } catch {
    return false;
  }
}

// Escapa el contenido que escribe el visitante: sin esto, un lead podría inyectar
// HTML en el correo (el mensaje va dentro de un <td>).
function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(d) {
  const row = (label, value) =>
    `<tr><td style="padding:2px 12px 2px 0"><b>${label}:</b></td><td>${esc(value) || "—"}</td></tr>`;
  return `<h2 style="font-family:sans-serif">Nuevo lead desde maudev.cl</h2>
<table style="font-family:sans-serif;font-size:14px;line-height:1.6">
${row("Nombre", d.name)}
${row("Email", d.email)}
${row("WhatsApp", d.whatsapp)}
${row("Interés", d.interest)}
${row("Mensaje", d.message)}
${row("Origen", d.source)}
${row("Enviado", d.submitted_at)}
${row("Verificación", d.verificacion)}
${row("Página", d.page_path)}
${row("Llegó desde", d.referrer)}
${d.utm_source ? row("Campaña", [d.utm_source, d.utm_medium, d.utm_campaign].filter(Boolean).join(" / ")) : ""}
</table>
<p style="font-family:sans-serif;font-size:13px;color:#666">Responde este correo para contactar al lead directamente.</p>`;
}

async function enviarCorreo(env, payload) {
  if (!env.RESEND_API_KEY) return { ok: false };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: FROM, to: [TO], ...payload }),
    });
    return { ok: res.ok, detail: await res.json().catch(() => ({})) };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

// El folio es lo que la persona cita si vuelve a escribir, y la fecha límite
// va en el asunto del correo: es el dato que no se puede pasar por alto.
async function recibirSolicitud(raw, env, cors, verificacion) {
  const tipo = clean(raw.tipo, 20);
  const nombre = clean(raw.nombre, LIMITS.name);
  const email = clean(raw.email, LIMITS.email);
  const detalle = clean(raw.detalle, LIMITS.message);
  if (!DERECHOS[tipo]) return json({ error: "Tipo de solicitud inválido" }, 400, cors);
  if (!email || !EMAIL_RE.test(email)) return json({ error: "Email inválido" }, 400, cors);

  const folio = crypto.randomUUID().slice(0, 8).toUpperCase();
  const venceEl = fechaLimite(tipo);

  let stored = false;
  if (env.DB) {
    try {
      await env.DB.prepare(
        "INSERT INTO solicitudes_derechos (folio, tipo, nombre, email, detalle, vence_el) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(folio, tipo, nombre || null, email, detalle || null, venceEl).run();
      stored = true;
    } catch {
      // seguimos: el correo es el respaldo
    }
  }

  const correo = await enviarCorreo(env, {
    subject: `⚖️ Derecho de ${DERECHOS[tipo].toLowerCase()} · folio ${folio} · responder antes del ${venceEl}`,
    reply_to: email,
    html: `<h2>Solicitud de derechos · Ley 21.719</h2>
      <p><b>Folio:</b> ${folio}<br><b>Derecho:</b> ${esc(DERECHOS[tipo])}<br><b>Responder antes del:</b> ${venceEl}</p>
      <p><b>Nombre:</b> ${esc(nombre || "—")}<br><b>Email:</b> ${esc(email)}</p>
      <p><b>Detalle:</b><br>${esc(detalle || "—").replace(/\n/g, "<br>")}</p>
      <p style="color:#666">Guardada en D1: ${stored ? "sí" : "NO"} · Verificación: ${esc(verificacion)}.
      Antes de entregar datos, verifica la identidad de quien pide.</p>`,
  });

  if (!stored && !correo.ok) return json({ error: "No se pudo registrar la solicitud" }, 502, cors);
  return json({ ok: true, folio, vence_el: venceEl }, 200, cors);
}

// Prueba de consentimiento: qué eligió un navegador y cuándo. Sin IP ni
// user-agent: un identificador aleatorio que genera el propio navegador no
// identifica a nadie, y basta para demostrar que el aviso se mostró y se respondió.
async function registrarConsentimiento(raw, env, cors) {
  const id = clean(raw.id, 36);
  if (!UUID_RE.test(id) || typeof raw.analytics !== "boolean" || typeof raw.marketing !== "boolean") {
    return json({ error: "Datos inválidos" }, 400, cors);
  }
  try {
    await env.DB.prepare(
      "INSERT INTO consentimientos (navegador_id, analitica, marketing, version) VALUES (?, ?, ?, ?)"
    ).bind(id, raw.analytics ? 1 : 0, raw.marketing ? 1 : 0, clean(raw.version, 20) || null).run();
  } catch {
    return json({ error: "No se pudo registrar" }, 502, cors);
  }
  return json({ ok: true }, 200, cors);
}

// Borrado de lo que cumplió su plazo de conservación. Los plazos son los de
// /privacidad; si cambian allá, cambian acá (y en backend/src/retencion.ts).
//
// No hay cron: la cuenta gratuita admite 5 y están ocupados. Corre en segundo
// plano con cada envío que recibe este worker y cada vez que se abre el panel
// admin, así que lo vencido se borra la próxima vez que hay actividad.
async function borrarVencidos(env) {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM leads WHERE created_at < datetime('now', '-12 months')"),
    env.DB.prepare("DELETE FROM consentimientos WHERE creado_en < datetime('now', '-24 months')"),
    env.DB.prepare("DELETE FROM solicitudes_derechos WHERE creado_en < datetime('now', '-24 months')"),
  ]);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST" && env.DB) ctx.waitUntil(borrarVencidos(env).catch(() => {}));
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    let raw;
    try {
      raw = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    // ── 1. Honeypot ──
    // Respondemos 200 a propósito: si devolviéramos un error, el bot sabría que
    // lo detectamos y probaría otra cosa. Así cree que funcionó y se va.
    if (clean(raw[HONEYPOT_FIELD], 200)) {
      return json({ ok: true }, 200, cors);
    }

    const ruta = new URL(request.url).pathname.replace(/\/+$/, "");
    // El consentimiento se registra al pulsar el aviso de cookies, sin captcha:
    // no manda correos ni guarda datos personales, y su validación es estricta.
    if (ruta === "/consentimiento") return registrarConsentimiento(raw, env, cors);

    // ── 2. Captcha (solo si está configurado) ──
    // Mientras TURNSTILE_SECRET no exista, el worker sigue funcionando igual.
    // Así se puede desplegar hoy y encender el captcha después, sin romper nada.
    //
    // El resultado viaja al correo. Con la validación apagada, que llegue un
    // aviso no dice nada sobre el captcha —el worker acepta con token o sin él—,
    // así que sin esta línea no había forma de saber si el sitio está
    // generando tokens antes de encender el secreto. Encendido, sirve para ver
    // de un vistazo si un lead pasó la verificación.
    const tokenRecibido = Boolean(clean(raw.turnstileToken, 3000));
    let verificacion;

    if (env.TURNSTILE_SECRET) {
      const ip = request.headers.get("CF-Connecting-IP");
      const ok = await turnstileOk(raw.turnstileToken, env.TURNSTILE_SECRET, ip);
      if (!ok) return json({ error: "Verificación fallida" }, 403, cors);
      verificacion = "superada";
    } else {
      verificacion = tokenRecibido
        ? "token recibido · validación apagada"
        : "SIN TOKEN · validación apagada";
    }

    if (ruta === "/derechos") return recibirSolicitud(raw, env, cors, verificacion);

    // ── 3. Normalizar y validar ──
    const data = {
      name: clean(raw.name, LIMITS.name),
      email: clean(raw.email, LIMITS.email),
      whatsapp: clean(raw.whatsapp, LIMITS.whatsapp),
      interest: clean(raw.interest ?? raw.content_name, LIMITS.interest),
      message: clean(raw.message, LIMITS.message),
      source: clean(raw.source, LIMITS.source),
      submitted_at: clean(raw.submitted_at, LIMITS.submitted_at) || new Date().toISOString(),
      verificacion,
      ...Object.fromEntries(ATRIBUCION.map((k) => [k, clean(raw[k], LIMITS[k])])),
    };

    // El referente lo pone el navegador en la cabecera; si el sitio no lo mandó,
    // se toma de ahí. Es el dato que dice si llegó por Google, por Instagram o
    // escribiendo la dirección.
    if (!data.referrer) data.referrer = clean(request.headers.get("Referer"), LIMITS.referrer);

    // Un lead sin forma de contactarlo no sirve de nada.
    if (!data.email && !data.whatsapp) {
      return json({ error: "Falta email o WhatsApp" }, 400, cors);
    }
    if (data.email && !EMAIL_RE.test(data.email)) {
      return json({ error: "Email inválido" }, 400, cors);
    }

    // ── 4. Guardar en D1 primero: es la fuente durable del lead. Si la base
    //      falla, el email queda como respaldo; no perdemos el lead por la DB.
    let stored = false;
    if (env.DB) {
      try {
        const columnas = ["name", "email", "whatsapp", "interest", "message", "source", "submitted_at", ...ATRIBUCION];
        await env.DB.prepare(
          `INSERT INTO leads (${columnas.join(", ")}) VALUES (${columnas.map(() => "?").join(", ")})`
        )
          .bind(...columnas.map((c) => data[c] ?? null))
          .run();
        stored = true;
      } catch {
        // seguimos: el email es el respaldo
      }
    }

    // ── 5. Email de aviso vía Resend ──
    const emailPayload = {
      subject: `🎯 Nuevo lead: ${data.name || "sin nombre"} — ${data.interest || "sin interés"}`,
      html: buildHtml(data),
    };
    // reply_to al email del lead, si lo dejó, para responder directo.
    if (data.email) emailPayload.reply_to = data.email;
    const { ok: emailed, detail: emailDetail } = await enviarCorreo(env, emailPayload);

    // ── 6. El lead se considera capturado si quedó GUARDADO o AVISADO. Solo
    //      devolvemos error (para que el sitio pida reintentar) si fallan ambas
    //      vías — únicamente ahí se perdería de verdad.
    if (!stored && !emailed) {
      return json({ error: "No se pudo capturar el lead", detail: emailDetail }, 502, cors);
    }

    return json({ ok: true, stored, emailed, id: emailDetail?.id }, 200, cors);
  },
};
