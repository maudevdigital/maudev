import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Qué tipos de proyectos desarrollan?",
    a: "Trabajamos en todo el espectro del software: landing pages con SEO, aplicaciones web y SaaS, sistemas internos y dashboards, bots y automatizaciones, indicadores Pine Script para TradingView y Expert Advisors en MQL5 para MetaTrader 5. Si tiene lógica digital, lo construimos.",
  },
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "El precio depende del alcance y la complejidad. Una landing optimizada para SEO puede partir desde $300 USD, un indicador técnico desde $80 USD, y una plataforma SaaS completa requiere un presupuesto acordado en el roadmap. Siempre recibes cotización detallada antes de comenzar, sin letra chica.",
  },
  {
    q: "¿Cuánto tiempo tarda la entrega?",
    a: "Una landing o indicador básico: 5-10 días. Proyectos medianos (apps, bots, sistemas): 2-4 semanas. Plataformas completas: plazos definidos en el roadmap inicial. Los tiempos siempre se establecen antes de comenzar y se cumplen.",
  },
  {
    q: "¿El código me pertenece al 100%?",
    a: "Sí. Todo el código fuente te es entregado junto con documentación técnica. No dependes de nosotros para hacer cambios, y puedes llevarlo a cualquier otro desarrollador sin restricciones.",
  },
  {
    q: "¿Puedo solicitar cambios durante el desarrollo?",
    a: "Sí. El proceso es iterativo con entregas parciales para que valides y ajustes antes de la versión final. Cambios dentro del alcance acordado no tienen costo adicional. Si el alcance crece, lo discutimos y ajustamos el precio de forma transparente.",
  },
  {
    q: "¿Trabajan con clientes fuera de Chile?",
    a: "Sí. Trabajamos con clientes en toda Latinoamérica, España, Estados Unidos y Europa. La comunicación es en español o inglés según lo prefiera el cliente. El trabajo es 100% remoto.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// preguntas frecuentes</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground">
            Respuestas directas a las dudas más comunes antes de iniciar un proyecto.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-border/80"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="text-sm font-semibold">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
