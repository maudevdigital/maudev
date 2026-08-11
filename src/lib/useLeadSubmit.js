import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/maudev";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";

// Envío de leads en un solo lugar. Antes este bloque (crear lead + trackear en
// Meta/GA + loading + toasts) estaba copiado en los 4 formularios. Cada form
// ahora solo arma su payload y llama a submit(); la validación de campos sigue
// viviendo en cada form (varían por formulario).
//
// submit({ lead, track, successMessage })
//   lead:  objeto que se guarda (→ webhook n8n vía api.entities.Lead.create)
//   track: opcional, payload para trackLeadEvent (Pixel + CAPI + GA4)
//   successMessage: texto del toast de éxito. Pasar null para no mostrar toast
//                   (cuando el form maneja su propio mensaje/redirección).
export function useLeadSubmit() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async ({ lead, track, successMessage } = {}) => {
    setLoading(true);
    try {
      await api.entities.Lead.create(lead);
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
      toast.error("No pudimos enviar el mensaje. Escríbenos por WhatsApp y te respondemos igual.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, sent, setSent };
}
