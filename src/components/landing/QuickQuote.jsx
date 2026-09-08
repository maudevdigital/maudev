import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatFrom } from "@/data/currencies";
import { proofPoints } from "@/data/site";
import { IVA_NOTA, pricing } from "@/data/pricing";
import { quoteSizes, quoteTypes } from "@/data/quote";
import { useCurrency } from "@/lib/useCurrency";
import { trackAction } from "@/lib/MetaPixelTracker";

// Cotizador de diez segundos.
//
// Reemplaza a un panel de precios estático. La diferencia no es visual: quien
// toca dos botones ya declaró qué quiere, y llega a la conversación sabiendo el
// orden de magnitud. Eso filtra al que iba a descartar por precio de todos
// modos —que igual iba a descartar, solo que tres correos después— y le ahorra
// la primera ronda de preguntas al que sí sigue.
//
// El monto sale de los mismos valores de pricing.js, así que no hay una segunda
// tabla de precios que se pueda desincronizar. El resultado se rotula como
// estimado y el CTA pide precio POR ESCRITO: la cifra orienta, no compromete.

// Los montos se leen de pricing.js y NO se copian acá: tenerlos duplicados ya
// había dejado al cotizador mostrando precios viejos cuando cambió la tabla.
// Las opciones viven en data/quote.js porque /contacto traduce de vuelta lo
// que se elige acá.
const tipos = quoteTypes;
const tamanos = quoteSizes;

const Opcion = ({ activo, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={activo}
    className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      activo
        ? "border-primary bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default function QuickQuote() {
  const moneda = useCurrency();
  const [tipo, setTipo] = useState(tipos[1]);
  const [tamano, setTamano] = useState(tamanos[0]);

  // Se redondea al múltiplo de 10.000 antes de convertir, para que el estimado
  // se lea como una referencia y no como una cotización cerrada.
  const estimado = Math.round((pricing[tipo.plan].from * tamano.factor) / 10000) * 10000;

  const elegir = (setter, valor, campo) => {
    setter(valor);
    trackAction("cotizador_rapido", { campo, valor: valor.id });
  };

  return (
    <section className="panel panel-solid" aria-labelledby="cotizador-titulo">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 id="cotizador-titulo" className="text-base font-semibold">
          Estima tu inversión
        </h2>
        <span className="text-sm font-semibold text-primary">{moneda}</span>
      </div>

      <div className="space-y-5 px-6 py-5">
        <fieldset>
          <legend className="text-sm font-bold text-foreground">¿Qué necesitas?</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {tipos.map((opcion) => (
              <Opcion key={opcion.id} activo={tipo.id === opcion.id} onClick={() => elegir(setTipo, opcion, "tipo")}>
                {opcion.label}
              </Opcion>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold text-foreground">¿Cuántas secciones?</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {tamanos.map((opcion) => (
              <Opcion key={opcion.id} activo={tamano.id === opcion.id} onClick={() => elegir(setTamano, opcion, "tamano")}>
                {opcion.label}
              </Opcion>
            ))}
          </div>
        </fieldset>
      </div>

      <dl className="border-t border-border px-6 py-5" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm font-semibold text-muted-foreground">
            Estimado desde
            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider">{IVA_NOTA}</span>
          </dt>
          <dd className="font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            {formatFrom(estimado, moneda)}
          </dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <dt className="text-sm font-semibold text-muted-foreground">Plazo aproximado</dt>
          <dd className="font-mono text-sm font-semibold text-foreground">{tipo.semanas} semanas</dd>
        </div>
      </dl>

      <div className="border-t border-border p-4">
        {/* Navegación interna con <Link>: el <a> anterior recargaba el sitio
            completo para cambiar de vista, y esa espera cae justo en el clic de
            mayor intención de toda la página. */}
        <Link
          to={`/contacto?intencion=cotizar&tipo=${tipo.id}&tamano=${tamano.id}`}
          onClick={() => trackAction("cotizador_enviar", { tipo: tipo.id, tamano: tamano.id, estimado })}
          className="group btn btn-primary w-full justify-between px-4 py-3"
        >
          <span className="text-sm font-bold">Pedir precio por escrito</span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        <p className="mt-2.5 px-1 text-xs leading-relaxed text-muted-foreground">
          Es una referencia, no una cotización. El precio final se fija por escrito después de revisar qué necesitas.
        </p>
      </div>

      {/* Las garantías cierran el panel, no la columna del titular: acá caen
          justo donde el visitante acaba de ver una cifra, que es el momento en
          que aparece la desconfianza. Bajo el CTA, en cambio, competían con el
          botón por la misma mirada. */}
      <ul className="grid grid-cols-3 gap-px border-t border-border bg-border">
        {proofPoints.map((punto) => (
          <li key={punto} className="bg-card px-3 py-3.5 text-center">
            <span className="mx-auto mb-2 block h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            <span className="block text-[11px] font-semibold leading-tight text-muted-foreground">
              {punto}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
