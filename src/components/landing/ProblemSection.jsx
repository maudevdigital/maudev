import { Search, Smartphone, Timer } from "lucide-react";

const examples = [
  { icon: Search, title: "No te encuentran", text: "Te buscan por tu rubro y aparece la competencia, no tú." },
  { icon: Smartphone, title: "Se ve mal en el celular", text: "Ahí llega la mayoría, y ahí es donde se pierde el contacto." },
  { icon: Timer, title: "Carga lento", text: "Tres segundos de espera bastan para que vuelvan atrás." },
];

export default function ProblemSection() {
  return (
    <section className="section-pad border-y border-border bg-secondary/55" aria-labelledby="problema-title">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="eyebrow">Por qué importa</span>
            <h2 id="problema-title" className="section-title mt-4">Si tu sitio no explica lo que haces, el cliente se va donde el que sí lo explica.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              La mayoría de las personas te va a buscar antes de escribirte. Si lo que encuentran carga lento, no se entiende en el celular o no dice con claridad a qué te dedicas, no te escriben: se van, y nunca te enteras de que estuvieron ahí.
            </p>
            {/* Cada síntoma va en su propia tarjeta y en su propia fila: antes
                eran tres textos diminutos flotando en el vacío de la sección.
                El número grande le da el peso visual que el aire no daba. */}
            <ul className="mt-10 grid gap-3">
              {examples.map(({ icon: Icon, title, text }, index) => (
                <li
                  key={title}
                  className="group flex items-start gap-5 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/40 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-3xl font-extrabold leading-none text-border transition-colors group-hover:text-primary/30"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <strong className="text-base font-bold">{title}</strong>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
