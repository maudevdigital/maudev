const WA_NUMBER = "56984848226";
const WA_MESSAGE = encodeURIComponent(
  "Hola, vi tu sitio web y me gustaría saber más sobre tus servicios.",
);

export const whatsappEnabled = true;

export function getWhatsAppUrl(customMessage) {
  const message = customMessage ? encodeURIComponent(customMessage) : WA_MESSAGE;
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}
