import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Qué tipos de proyectos desarrollan?",
    a: "Landing pages con SEO, aplicaciones web y plataformas SaaS, sistemas internos y dashboards, automatización de procesos con bots e integraciones, y conexión de pasarelas de pago y APIs. Si tu negocio tiene un proceso digital, lo diseñamos, construimos y dejamos funcionando.",
  },
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Depende del alcance. Una landing de conversión parte desde $390.000 CLP y un proyecto de automatización desde $290.000 CLP; el software a medida se cotiza por proyecto. En el diagnóstico inicial defines el alcance y recibes un precio fijo por escrito antes de empezar, sin costos ocultos.",
  },
  {
    q: "¿Cuánto tiempo tarda la entrega?",
    a: "Una landing: aproximadamente 5 a 10 días. Proyectos medianos como apps, bots o sistemas internos: 2 a 4 semanas. Plataformas completas: el plazo se define en el roadmap inicial. Los tiempos se acuerdan antes de comenzar y se respetan.",
  },
  {
    q: "¿El código me pertenece al 100%?",
    a: "Sí. Al cierre del proyecto recibes todo el código fuente y la documentación técnica. No quedas atado a nosotros: puedes seguir el desarrollo por tu cuenta o con cualquier otro equipo, sin restricciones.",
  },
  {
    q: "¿Puedo solicitar cambios durante el desarrollo?",
    a: "Sí. Trabajamos de forma iterativa con entregas parciales para que revises y ajustes antes de la versión final. Los cambios dentro del alcance acordado no tienen costo adicional; si el alcance crece, lo conversamos y ajustamos el presupuesto de forma transparente.",
  },
  {
    q: "¿Con qué clientes trabajan y cómo se paga?",
    a: "Trabajamos 100% remoto con clientes en Chile, Latinoamérica y Estados Unidos, en español o inglés. En Chile aceptamos transferencia en CLP; para clientes internacionales recibimos pagos en USD o en USDT (cripto). El esquema de pago se acuerda en el roadmap antes de comenzar.",
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
