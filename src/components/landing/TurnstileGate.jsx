import { useEffect, useRef } from "react";
import { SITE_KEY, cargarTurnstile, guardarToken, registrarReinicio } from "@/lib/turnstile";

// Verificación anti-bots, montada en las pantallas que envían leads.
//
// La primera versión pedía el token recién al pulsar "enviar", con quince
// segundos de plazo. Se comprobó en producción que no sirve: cuando Cloudflare
// decide que hace falta interacción, dibuja un desafío y espera un clic. El
// visitante veía el botón girando, un recuadro apareciendo en una esquina sin
// ninguna explicación, y a los quince segundos un error. Peor: si el envío
// salía sin token, el worker lo rechazaba con 403 y el lead se perdía.
//
// Ahora el widget se monta con la página, así que para cuando alguien termina
// de escribir el formulario el token ya está resuelto y el envío es inmediato.
// En modo "interaction-only" no dibuja absolutamente nada mientras no haga
// falta interacción, que es el caso de casi todo el mundo.
//
// El recuadro sí es visible cuando aparece —y va con una línea que explica qué
// es—, porque un desafío escondido es un formulario que no se puede enviar.
export default function TurnstileGate() {
  const caja = useRef(null);
  const idWidget = useRef(null);

  useEffect(() => {
    if (!SITE_KEY || !caja.current) return;
    let vivo = true;

    cargarTurnstile()
      .then(() => {
        if (!vivo || !caja.current || !window.turnstile) return;

        idWidget.current = window.turnstile.render(caja.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (token) => guardarToken(token),
          // Los tokens caducan a los cinco minutos. Alguien puede tardar más
          // que eso en escribir su mensaje, así que se pide otro y el envío no
          // se encuentra con un token vencido.
          "expired-callback": () => {
            guardarToken(null);
            if (idWidget.current !== null) window.turnstile.reset(idWidget.current);
          },
          "error-callback": () => guardarToken(null),
        });

        // Cada token sirve una sola vez. Al consumirlo se pide el siguiente,
        // para que un reintento del visitante no se quede sin verificación.
        registrarReinicio(() => {
          if (idWidget.current !== null && window.turnstile) {
            try {
              window.turnstile.reset(idWidget.current);
            } catch {
              // El widget ya no está montado; el próximo montaje lo repone.
            }
          }
        });
      })
      .catch(() => {
        // Sin verificación se sigue: que un bloqueador de scripts impida
        // escribirnos sería peor que el problema que esto resuelve.
      });

    return () => {
      vivo = false;
      if (idWidget.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(idWidget.current);
        } catch {
          // El widget ya no existe; nada que limpiar.
        }
        idWidget.current = null;
      }
      guardarToken(null);
      registrarReinicio(null);
    };
  }, []);

  if (!SITE_KEY) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-60 flex justify-center px-4">
      <div className="pointer-events-auto flex flex-col items-center gap-2 empty:hidden">
        <div ref={caja} />
      </div>
    </div>
  );
}
