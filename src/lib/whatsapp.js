// El número de WhatsApp del negocio, en un solo lugar.
//
// Hoy el valor por defecto es un número PERSONAL, y está publicado en unos
// trece puntos del sitio. Para reemplazarlo por uno de empresa no hay que tocar
// código ni revisar esos trece puntos: basta definir VITE_WHATSAPP_NUMBER.
//
// Dónde definirla: en producción, como secret en Settings → Secrets → Actions
// del repositorio, porque el build corre en GitHub Actions (ya está cableada en
// deploy.yml). En el panel de Cloudflare NO sirve: Vite congela las VITE_* al
// compilar y Cloudflare solo recibe el dist ya hecho. En desarrollo, .env.local.
//
// Formato: código de país sin "+", espacios ni guiones. Para Chile, +56 9 8484
// 8226 se escribe 56984848226. Igual se limpia lo que llegue, porque copiar el
// número desde el teléfono trae espacios y wa.me los rechaza en silencio: el
// enlace abre WhatsApp igual, pero sin destinatario.
const NUMERO_PERSONAL_POR_DEFECTO = "56984848226";

const configurado = import.meta.env.VITE_WHATSAPP_NUMBER || "";
const WA_NUMBER = String(configurado || NUMERO_PERSONAL_POR_DEFECTO).replace(/\D/g, "");

const WA_MESSAGE = encodeURIComponent(
  "Hola, vi tu sitio web y me gustaría saber más sobre tus servicios.",
);

export const whatsappEnabled = true;

export function getWhatsAppUrl(customMessage) {
  const message = customMessage ? encodeURIComponent(customMessage) : WA_MESSAGE;
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}
