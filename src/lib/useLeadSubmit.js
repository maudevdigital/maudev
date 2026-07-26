import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/maudev";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { t } from "@/lib/i18n";

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
        toast.success(successMessage || t("Mensaje enviado. Te contactaremos pronto.", "Message sent. We'll get back to you soon."));
      }
      return true;
    } catch {
      toast.error(t("No pudimos enviar el mensaje. Intenta nuevamente.", "We couldn't send your message. Please try again."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, sent, setSent };
}
