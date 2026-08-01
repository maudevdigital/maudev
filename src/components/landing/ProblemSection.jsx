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
            <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-0">
              {examples.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className={`sm:px-6 ${index === 0 ? "sm:pl-0" : "sm:border-l sm:border-border"}`}>
                  <Icon className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
