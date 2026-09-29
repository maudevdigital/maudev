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

// El token de Turnstile se resuelve acá y no en cada formulario: son cuatro y
// todos salen por esta función, así que protegerlos es una línea en vez de
// cuatro parches. Mientras no exista VITE_TURNSTILE_SITE_KEY esto devuelve null
// sin cargar nada y el envío se comporta igual que antes.
import { obtenerTokenTurnstile } from "@/lib/turnstile";

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

  const turnstileToken = await obtenerTokenTurnstile();

  const res = await fetch(LEAD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      ...(turnstileToken ? { turnstileToken } : {}),
      submitted_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    throw new Error(`Lead submit failed: ${res.status}`);
  }
  // El webhook puede responder vacío o con JSON; no lo necesitamos.
  return res.json().catch(() => ({ ok: true }));
}

// Mismo worker, otra ruta: new URL resuelve bien tenga o no barra final la base.
const rutaWorker = (ruta) => new URL(ruta, LEAD_WEBHOOK.endsWith("/") ? LEAD_WEBHOOK : `${LEAD_WEBHOOK}/`);

/** Solicitud de derechos ARCOP. Devuelve { folio, vence_el } o lanza. */
export async function submitDerechos(data) {
  if (!LEAD_WEBHOOK) throw new Error("Lead webhook not configured");
  const turnstileToken = await obtenerTokenTurnstile();
  const res = await fetch(rutaWorker("derechos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, ...(turnstileToken ? { turnstileToken } : {}) }),
  });
  if (!res.ok) throw new Error(`Derechos submit failed: ${res.status}`);
  return res.json();
}

/**
 * Deja constancia de la elección de cookies. No espera respuesta ni reintenta:
 * si falla, la elección del visitante se respeta igual. text/plain evita el
 * preflight de CORS, y keepalive que se pierda si la página cambia enseguida.
 */
export function registrarConsentimiento(registro) {
  if (!LEAD_WEBHOOK) return;
  fetch(rutaWorker("consentimiento"), {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(registro),
    keepalive: true,
  }).catch(() => {});
}
