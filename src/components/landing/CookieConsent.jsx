import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { getConsent, setConsent, initConsent, GRANTED, DENIED } from "@/lib/consent";

// ─────────────────────────────────────────────────────────────────────────────
// Muro de consentimiento de cookies.
//
// Criterios de diseño, en orden de importancia:
//
// 1. Legal: nada de analítica ni publicidad antes de decidir (Ley 21.719).
//    Rechazar tiene que ser tan fácil como aceptar — ambos botones a la vista,
//    ninguno escondido en un submenú.
// 2. Bloqueante: modal central con backdrop. El visitante NO puede interactuar
//    con el sitio hasta que acepte o rechace. No se cierra por Esc ni clic fuera;
//    la única salida es elegir. (Por eso el default de Consent Mode es "denied":
//    mientras el muro está arriba, no se ha cargado ningún script de terceros.)
// 3. Reversible: se puede reabrir desde el footer, porque la política promete
//    que se puede cambiar de opinión.
//
// Para reabrirlo desde cualquier parte: window.dispatchEvent(new Event("maudev:open-cookies"))
// ─────────────────────────────────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    // Si ya había aceptado antes, carga los scripts sin volver a preguntar.
    initConsent();
    if (getConsent() === null) setVisible(true);
  }, []);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener("maudev:open-cookies", open);
    return () => window.removeEventListener("maudev:open-cookies", open);
  }, []);

  // Bloquea el scroll del body mientras el muro está arriba.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const focusable = dialogRef.current?.querySelectorAll("button, a[href]") || [];
    focusable[0]?.focus();
    const trapFocus = (event) => {
      if (event.key !== "Tab" || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", trapFocus);
      previousFocus?.focus?.();
    };
  }, [visible]);

  const decide = (value) => {
    setConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
          className="print-hidden fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            ref={dialogRef}
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl shadow-black/40 sm:p-7"
          >
            <h2 id="cookie-title" className="text-lg font-semibold text-foreground">
              {t("Antes de continuar", "Before you continue")}
            </h2>
            <p id="cookie-description" className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t(
                "Usamos cookies para medir qué páginas funcionan y si un anuncio trajo un contacto. Si prefieres que no, el sitio funciona exactamente igual.",
                "We use cookies to measure which pages work and whether an ad brought in a contact. If you'd rather not, the site works exactly the same."
              )}{" "}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                {t("Más detalles", "More details")}
              </a>
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => decide(GRANTED)}
                className="h-11 flex-1 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("Aceptar", "Accept")}
              </button>
              <button
                type="button"
                onClick={() => decide(DENIED)}
                className="h-11 flex-1 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {t("Rechazar", "Reject")}
              </button>
            </div>
          </div>
        </div>
  );
}
