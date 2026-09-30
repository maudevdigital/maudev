import { useState } from "react";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads";
import { trackLeadEvent, trackAction } from "@/lib/MetaPixelTracker";
import { getWhatsAppUrl } from "@/lib/whatsapp";

// Envío de leads en un solo lugar. Antes este bloque (crear lead + trackear en
// Meta/GA + loading + toasts) estaba copiado en los 4 formularios. Cada form
// ahora solo arma su payload y llama a submit(); la validación de campos sigue
// viviendo en cada form (varían por formulario).
//
// submit({ lead, track, successMessage, whatsappFallback })
//   lead:  objeto que se guarda (→ worker lead-intake vía submitLead)
//   track: opcional, payload para trackLeadEvent (Pixel + CAPI + GA4)
//   successMessage: texto del toast de éxito. Pasar null para no mostrar toast
//                   (cuando el form maneja su propio mensaje/redirección).
//   whatsappFallback: mensaje a precargar si el envío falla y hay que salir por
//                     WhatsApp. Sin él se usa el genérico.
export function useLeadSubmit() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async ({ lead, track, successMessage, whatsappFallback } = {}) => {
    setLoading(true);
    try {
      await submitLead(lead);
      if (track) await trackLeadEvent(track);
      setSent(true);
      if (successMessage !== null) {
        toast.success(successMessage || "Mensaje enviado. Te contactaremos pronto.");
      }
      return true;
    } catch {
      // El envío puede fallar por red, por el webhook o porque la verificación
      // anti-bots rechazó el intento. En los tres casos el visitante no puede
      // hacer nada útil reintentando a ciegas, así que se le ofrece la vía que
      // no depende de nada de esto y que además es el CTA principal del sitio.
      //
      // Antes ese texto solo NOMBRABA WhatsApp, sin dejar cómo abrirlo: el
      // aviso terminaba en un callejón sin salida justo después de que la
      // persona escribió todo el formulario. Ahora va el botón que lo abre, con
      // el mensaje precargado si el formulario indicó uno.
      trackAction("formulario_fallo", { formulario: track?.params?.source || "desconocido" });
      toast.error("No pudimos enviar el mensaje.", {
        description: "Escríbenos por WhatsApp y te respondemos igual.",
        duration: 12000,
        action: {
          label: "Abrir WhatsApp",
          onClick: () => {
            trackAction("whatsapp_click", { ubicacion: "fallo-formulario" });
            window.open(getWhatsAppUrl(whatsappFallback), "_blank", "noopener,noreferrer");
          },
        },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, sent, setSent };
}
