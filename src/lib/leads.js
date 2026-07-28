// Envío de leads del sitio. Único punto de salida: así el día de mañana se
// cambia el destino en UN solo lugar.
//
// Destino: VITE_LEAD_WEBHOOK_URL → worker de Cloudflare (workers/lead-intake/),
// que guarda el lead en D1 y avisa por correo vía Resend.
//
// ⚠️ Ya NO hay fallback. Antes caía al worker `ig-autopost/notify-lead`, pero
// ese worker se dio de baja junto con el flujo de subida automática a redes.
// Dejarlo apuntando ahí hacía que los formularios murieran en silencio contra
// una URL inexistente.
//
// Consecuencia: si `VITE_LEAD_WEBHOOK_URL` no está configurada en las variables
// de entorno de Cloudflare Pages, el formulario falla de forma explícita y
// ruidosa (mejor eso que perder un lead sin enterarse). El CTA principal del
// sitio es WhatsApp, que no depende de esto.
//
// El payload se reenvía tal cual lo arma cada formulario (name, email, whatsapp,
// interest, message, source, atribución de campaña, etc.).

const LEAD_WEBHOOK = import.meta.env.VITE_LEAD_WEBHOOK_URL || "";

export async function submitLead(data) {
  if (!LEAD_WEBHOOK) {
    // Falla temprano y con mensaje claro, en vez de hacer fetch a la nada.
    console.error(
      "[maudev] VITE_LEAD_WEBHOOK_URL no está configurada: el formulario no tiene dónde enviar el lead. " +
      "Configúrala en Cloudflare Pages → Settings → Environment variables."
    );
    throw new Error("Lead webhook not configured");
  }

  const res = await fetch(LEAD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, submitted_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    throw new Error(`Lead submit failed: ${res.status}`);
  }
  // El webhook puede responder vacío o con JSON; no lo necesitamos.
  return res.json().catch(() => ({ ok: true }));
}
