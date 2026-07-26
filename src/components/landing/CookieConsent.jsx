import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/i18n";
import { getConsent, setConsent, initConsent, GRANTED, DENIED } from "@/lib/consent";

// ─────────────────────────────────────────────────────────────────────────────
// Banner de cookies.
//
// Criterios de diseño, en orden de importancia:
//
// 1. Legal: nada de analítica ni publicidad antes de aceptar (Ley 21.719).
//    Rechazar tiene que ser tan fácil como aceptar — un botón "Rechazar"
//    visible, no escondido en un submenú de "preferencias".
// 2. Conversión: barra discreta abajo, NO un muro modal. No tapa el contenido
//    ni el botón de WhatsApp, y no bloquea la navegación.
// 3. Reversible: se puede reabrir desde el footer, porque la política promete
//    que se puede cambiar de opinión.
//
// Para reabrirlo desde cualquier parte: window.dispatchEvent(new Event("maudev:open-cookies"))
// ─────────────────────────────────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Si ya había aceptado antes, carga los scripts sin volver a preguntar.
    initConsent();
    if (getConsent() === null) {
      // Pequeño retraso: que el visitante vea el contenido antes que el aviso.
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener("maudev:open-cookies", open);
    return () => window.removeEventListener("maudev:open-cookies", open);
  }, []);

  const decide = (value) => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="dialog"
          aria-live="polite"
          aria-label={t("Aviso de cookies", "Cookie notice")}
          className="print-hidden fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(
                "Usamos cookies para medir qué páginas funcionan y si un anuncio trajo un contacto. Si prefieres que no, el sitio funciona exactamente igual.",
                "We use cookies to measure which pages work and whether an ad brought in a contact. If you'd rather not, the site works exactly the same."
              )}{" "}
              <Link
                to="/privacidad"
                className="text-primary underline underline-offset-2 hover:no-underline"
                onClick={() => setVisible(false)}
              >
                {t("Más detalles", "More details")}
              </Link>
            </p>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide(DENIED)}
                className="h-10 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {t("Rechazar", "Reject")}
              </button>
              <button
                type="button"
                onClick={() => decide(GRANTED)}
                className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("Aceptar", "Accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
