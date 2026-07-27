// Worker de captación de leads de maudev.cl
//
// Recibe el POST del formulario de /contacto y envía un email de aviso a
// contacto@maudev.cl vía Resend. Reemplaza la dependencia de un n8n hosteado
// para lo esencial (avisar el lead): esto vive en Cloudflare, gratis y siempre
// encendido, así que el formulario nunca queda muerto por infraestructura caída.
//
// La URL pública de este worker es la que va en VITE_LEAD_WEBHOOK_URL.
//
// Secret: RESEND_API_KEY → wrangler secret put RESEND_API_KEY

const ALLOWED_ORIGINS = [
  "https://maudev.cl",
  "https://www.maudev.cl",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5180",
];

// Remitente en el dominio verificado en Resend. Destino: la casilla del negocio.
const FROM = "Maudev Leads <leads@maudev.cl>";
const TO = "contacto@maudev.cl";

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
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
${row("Interés", d.interest || d.content_name)}
${row("Mensaje", d.message)}
${row("Origen", d.source)}
${row("Enviado", d.submitted_at)}
</table>
<p style="font-family:sans-serif;font-size:13px;color:#666">Responde este correo para contactar al lead directamente.</p>`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // 1. Guardar en D1 primero: es la fuente durable del lead. Si la base falla,
    //    el email queda como respaldo; no perdemos el lead por un tema de DB.
    let stored = false;
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO leads (name, email, whatsapp, interest, message, source, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
          .bind(
            data.name ?? null,
            data.email ?? null,
            data.whatsapp ?? null,
            data.interest ?? data.content_name ?? null,
            data.message ?? null,
            data.source ?? null,
            data.submitted_at ?? null
          )
          .run();
        stored = true;
      } catch {
        // seguimos: el email es el respaldo
      }
    }

    // 2. Email de aviso (notificación) vía Resend.
    let emailed = false;
    let emailDetail;
    if (env.RESEND_API_KEY) {
      const emailPayload = {
        from: FROM,
        to: [TO],
        subject: `🎯 Nuevo lead: ${data.name || "sin nombre"} — ${data.interest || data.content_name || "sin interés"}`,
        html: buildHtml(data),
      };
      // reply_to al email del lead, si lo dejó, para responder directo.
      if (data.email) emailPayload.reply_to = data.email;
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify(emailPayload),
        });
        emailDetail = await res.json().catch(() => ({}));
        emailed = res.ok;
      } catch (err) {
        emailDetail = String(err);
      }
    }

    // 3. El lead se considera capturado si quedó GUARDADO o AVISADO. Solo
    //    devolvemos error (para que el sitio pida reintentar) si fallan ambas
    //    vías — únicamente ahí se perdería de verdad.
    if (!stored && !emailed) {
      return new Response(
        JSON.stringify({ error: "No se pudo capturar el lead", detail: emailDetail }),
        { status: 502, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, stored, emailed, id: emailDetail?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  },
};
