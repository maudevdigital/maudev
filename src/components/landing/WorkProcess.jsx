import { Check } from "lucide-react";

// Antes eran tres párrafos en tres columnas: nada que mirar y mucho aire.
// Ahora cada etapa dice cuándo ocurre y qué recibes al terminarla, que es la
// duda real de quien encarga un sitio y nunca ha encargado uno. Los plazos son
// de cada etapa, no del proyecto completo, y así van rotulados.
const stages = [
  {
    number: "01",
    title: "Diagnóstico",
    when: "Días 1 a 3",
    text: "Revisamos a qué te dedicas, a quién le vendes y qué debe lograr el sitio.",
    deliverables: ["Alcance por escrito", "Precio cerrado", "Fecha de entrega"],
  },
  {
    number: "02",
    title: "Desarrollo",
    when: "1 a 4 semanas",
    text: "Diseñamos y programamos por etapas, con avances que puedes ver y comentar.",
    deliverables: ["Diseño para aprobar", "Enlace de avance", "Ronda de ajustes"],
  },
  {
    number: "03",
    title: "Implementación",
    when: "Días finales",
    text: "Publicamos el sitio, te entregamos los accesos y queda con mantención si la quieres.",
    deliverables: ["Sitio publicado", "Accesos a tu nombre", "Garantía de funcionamiento"],
  },
];

export default function WorkProcess() {
  return (
    <section
      id="proceso"
      className="section-pad scroll-mt-20 border-y border-border bg-secondary/55"
      aria-labelledby="proceso-title"
    >
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">Cómo trabajamos</span>
          <h2 id="proceso-title" className="section-title mt-4">
            Tres etapas, con decisiones claras en cada una.
          </h2>
        </div>

        <ol className="mt-14 grid gap-3 md:grid-cols-3">
          {stages.map((stage) => (
            <li key={stage.number} className="panel flex flex-col p-7 lg:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-primary">{stage.number}</span>
                <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {stage.when}
                </span>
              </div>

              {/* Barra de avance: ubica la etapa dentro del proyecto completo */}
              <span className="mt-6 flex gap-1" aria-hidden="true">
                {stages.map((other) => (
                  <span
                    key={other.number}
                    className={`h-1 flex-1 rounded-full ${
                      other.number <= stage.number ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </span>

              <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em]">{stage.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{stage.text}</p>

              <div className="mt-7 border-t border-border pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Qué recibes
                </p>
                <ul className="mt-3 space-y-2">
                  {stage.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-semibold">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
