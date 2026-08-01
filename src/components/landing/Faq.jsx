import { ChevronDown } from "lucide-react";

export const faqs = [
  {
    q: "¿Cuánto demora un proyecto?",
    a: "Depende del alcance. Una landing puede estar publicada en una a dos semanas; un sitio corporativo toma entre tres y cinco. La propuesta deja las etapas y la fecha de entrega por escrito antes de empezar.",
  },
  {
    q: "¿Cómo se calcula el precio?",
    a: "Se calcula según el proceso, las integraciones, las excepciones y el nivel de diseño necesario. Primero definimos el alcance y después entregamos un precio cerrado para ese alcance.",
  },
  {
    q: "¿Hay pagos mensuales?",
    a: "El desarrollo no exige una mensualidad. Algunos servicios externos —como hosting, mensajería o pasarelas de pago— sí pueden tener costos propios, que se informan antes de implementar.",
  },
  {
    q: "¿Qué ocurre después de la entrega?",
    a: "Implementamos, documentamos y explicamos el uso. El proyecto incluye una garantía de funcionamiento y puedes contratar soporte posterior si lo necesitas.",
  },
  {
    q: "¿Pueden conectarse sistemas que ya utilizo?",
    a: "Muchas veces sí, mediante sus APIs o conectores disponibles. Lo comprobamos durante el diagnóstico antes de prometer una integración.",
  },
  {
    q: "¿Trabajan con empresas fuera de Chile?",
    a: "Sí. El trabajo puede realizarse de forma remota. La propuesta aclara moneda, facturación, horarios y servicios disponibles para cada país.",
  },
];

export default function Faq() {
  return (
    <section id="preguntas" className="section-pad scroll-mt-20" aria-labelledby="preguntas-title">
      <div className="site-container grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
        <div>
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 id="preguntas-title" className="section-title mt-4">Lo importante antes de empezar.</h2>
        </div>
        <div className="border-t border-border">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="faq-item group" open={index === 0}>
              <summary>
                <span>{faq.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
