import { pricing, priceLabel } from "@/data/pricing";

// Bloque "desde" de una página de servicio.
//
// Se muestra el piso, no una tarifa cerrada, y la frase que lo acompaña dice
// exactamente eso. Publicar el rango filtra: quien busca una web sí compara
// precio antes de escribir, y el que descarta por el monto iba a descartar
// igual, solo que tres correos después.
export default function PriceRange({ plans, note }) {
  if (!plans?.length) return null;

  return (
    <section aria-labelledby="precios-titulo" className="section-pad border-t border-border">
      <div className="site-container">
        <span className="eyebrow">Referencia de inversión</span>
        <h2 id="precios-titulo" className="section-title mt-5">
          Desde cuánto parte cada formato.
        </h2>

        <dl className="mt-12 border-t border-border">
          {plans.map((key) => {
            const plan = pricing[key];
            return (
              <div
                key={key}
                className="grid gap-2 border-b border-border py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
              >
                <div>
                  <dt className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {plan.label}
                  </dt>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {plan.summary}
                  </p>
                </div>
                <dd className="font-mono text-lg font-semibold text-foreground sm:text-right sm:text-xl">
                  <span className="mr-1.5 text-xs font-normal uppercase tracking-wider text-muted-foreground">
                    desde
                  </span>
                  {priceLabel(key)}
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {note ||
            "Es el piso de un alcance típico, no una tarifa cerrada. El precio final se fija por escrito después de revisar qué necesitas, y no cambia durante el proyecto salvo que tú pidas agregar algo."}
        </p>
      </div>
    </section>
  );
}
