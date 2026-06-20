// Supabase Edge Function: notify-lead
// ─────────────────────────────────────────────────────────────────────────────
// Envía un correo (vía Resend) cada vez que entra un nuevo lead o suscripción.
// Se dispara con un Database Webhook sobre INSERT en la tabla public.leads, así
// captura TODOS los orígenes (contacto, cotizador, diagnóstico, lead capture…)
// sin tocar el frontend. Los leads igual quedan guardados en la base; esto solo
// agrega el aviso por correo.
//
// Variables de entorno (configurar con `supabase secrets set`):
//   RESEND_API_KEY   API key de https://resend.com (empieza con "re_")
//   RESEND_FROM      remitente; debe ser de un dominio verificado en Resend,
//                    ej: "Maudev Leads <leads@maudev.cl>". Si aún no verificas
//                    dominio, usa "Maudev <onboarding@resend.dev>" (solo envía a
//                    tu propio correo de la cuenta Resend mientras tanto).
//   NOTIFY_TO        a quién avisar (ej: contacto@maudev.cl)
//   WEBHOOK_SECRET   (opcional) secreto compartido; se valida contra el header
//                    x-webhook-secret que pone el webhook
//
// Ver README.md en esta carpeta para el paso a paso de despliegue.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") || "Maudev <onboarding@resend.dev>";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface Lead {
  name?: string;
  email?: string;
  whatsapp?: string;
  interest?: string;
  message?: string;
  source?: string;
  page_path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_date?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validación simple del secreto compartido (si se configuró)
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!RESEND_API_KEY || !NOTIFY_TO) {
    console.error("Faltan RESEND_API_KEY o NOTIFY_TO");
    return new Response("Email not configured", { status: 500 });
  }

  let payload: { record?: Lead } & Lead;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // El webhook de Supabase manda { type, table, record, ... }.
  // También aceptamos el lead directo para poder probar la función a mano.
  const lead: Lead = payload?.record ?? payload;
  if (!lead?.email) {
    // No es un lead válido: respondemos 200 para que el webhook no reintente.
    return new Response("No lead in payload", { status: 200 });
  }

  const utm = [lead.utm_source, lead.utm_medium, lead.utm_campaign]
    .filter(Boolean)
    .join(" / ");

  const fields: [string, unknown][] = [
    ["Nombre", lead.name],
    ["Email", lead.email],
    ["WhatsApp / Teléfono", lead.whatsapp],
    ["Interés", lead.interest],
    ["Origen", lead.source],
    ["Página", lead.page_path],
    ["Campaña (UTM)", utm],
    ["Mensaje", lead.message],
  ];

  const visible = fields.filter(([, v]) => v != null && String(v).trim() !== "");

  const rowsHtml = visible
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 12px;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 12px;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const subject = `🔔 Nuevo lead: ${lead.name || lead.email}`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#f1f5f9;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f172a;padding:18px 22px;">
      <span style="color:#22d3ee;font-weight:800;font-size:18px;letter-spacing:-0.02em;">maudev</span>
      <span style="color:#94a3b8;font-size:13px;"> · nuevo lead</span>
    </div>
    <div style="padding:22px;">
      <h1 style="margin:0 0 14px;font-size:17px;color:#0f172a;">Te escribió ${escapeHtml(lead.name || lead.email)}</h1>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
      <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;margin-top:18px;background:#06b6d4;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:10px;">Responder por correo</a>
    </div>
    <div style="padding:14px 22px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
      Aviso automático desde maudev.cl · el lead ya quedó guardado en tu base de datos.
    </div>
  </div>
</body></html>`;

  const text = visible.map(([label, value]) => `${label}: ${value}`).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [NOTIFY_TO],
        reply_to: lead.email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return new Response(JSON.stringify({ error: detail }), { status: 502 });
    }
  } catch (err) {
    console.error("Error enviando correo:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
