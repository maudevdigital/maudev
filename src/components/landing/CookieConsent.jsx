import { useEffect, useState } from "react";
import { getConsent, setConsent, initConsent, GRANTED, DENIED } from "@/lib/consent";

// ─────────────────────────────────────────────────────────────────────────────
// Aviso de cookies: barra inferior, no bloqueante.
//
// Antes era un modal centrado con fondo oscuro que impedía tocar el sitio hasta
// decidir. Cumplía, pero lo primero que veía una visita nueva era un muro: en
// una página que se vende por su diseño, esa es la peor primera impresión
// posible, y es la razón número uno de rebote en el primer segundo.
//
// Ahora la barra informa y deja pasar. Dos caminos, ninguno escondido:
//   · "Aceptar" activa la medición.
//   · "Configurar" abre las opciones, con rechazar tan a mano como aceptar.
//
// Lo que NO cambia: la medición sigue apagada hasta que haya una decisión
// explícita. El texto dice —como corresponde— que usar el sitio implica aceptar
// los términos y la política, porque eso sí se acepta por uso; las cookies de
// medición y publicidad no, y activarlas por "seguir navegando" es exactamente
// lo que la Ley 21.719 y el RGPD no admiten. Por eso mientras la barra está
// arriba no se ha cargado ningún script de terceros.
//
// Reabrir desde cualquier parte:
//   window.dispatchEvent(new Event("maudev:open-cookies"))
// ─────────────────────────────────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [opciones, setOpciones] = useState(false);

  useEffect(() => {
    // Si ya había decidido antes, aplica su elección sin volver a preguntar.
    initConsent();
    if (getConsent() === null) setVisible(true);
  }, []);

  useEffect(() => {
    const abrir = () => {
      setOpciones(true);
      setVisible(true);
    };
    window.addEventListener("maudev:open-cookies", abrir);
    return () => window.removeEventListener("maudev:open-cookies", abrir);
  }, []);

  const decidir = (valor) => {
    setConsent(valor);
    setOpciones(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
      className="print-hidden fixed inset-x-0 bottom-0 z-100 p-3 sm:p-4"
    >
      <div className="panel panel-solid mx-auto max-w-300 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <h2 id="cookie-title" className="font-display text-base font-bold tracking-[-0.02em]">
              Cookies y condiciones de uso
            </h2>
            <p id="cookie-description" className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Al usar este sitio aceptas nuestros{" "}
              <a href="/terminos" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                términos y condiciones
              </a>{" "}
              y nuestra{" "}
              <a href="/privacidad" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                política de privacidad
              </a>
              . Usamos cookies para medir qué páginas funcionan y si un anuncio trajo un contacto; esas
              no se activan hasta que las aceptes, y el sitio funciona exactamente igual sin ellas.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row-reverse lg:w-auto">
            <button
              type="button"
              onClick={() => decidir(GRANTED)}
              className="btn btn-primary h-11 px-6 text-sm sm:min-w-36"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => setOpciones((v) => !v)}
              aria-expanded={opciones}
              aria-controls="cookie-opciones"
              className="btn btn-ghost h-11 px-5 text-sm"
            >
              Configurar
            </button>
          </div>
        </div>

        {opciones && (
          <div id="cookie-opciones" className="mt-5 border-t border-border pt-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-foreground">Necesarias · siempre activas</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Recuerdan tu tema claro u oscuro, tu moneda y esta misma decisión. Sin ellas el
                  sitio no puede funcionar y no identifican a nadie.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Medición y publicidad · opcionales</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Google Analytics y Meta, para saber qué páginas sirven y si un anuncio trajo un
                  contacto. Puedes rechazarlas y navegar igual, o cambiar de opinión cuando quieras
                  desde el pie de página.
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decidir(DENIED)}
                className="btn btn-ghost h-11 px-5 text-sm"
              >
                Rechazar las opcionales
              </button>
              <button
                type="button"
                onClick={() => decidir(GRANTED)}
                className="btn btn-primary h-11 px-6 text-sm"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
