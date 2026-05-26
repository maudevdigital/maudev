import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { t } from "@/lib/i18n";

const faqs = [
  {
    q: t("¿Qué tipos de proyectos desarrollan?", "What kinds of projects do you build?"),
    a: t(
      "Landing pages con SEO, aplicaciones web y plataformas SaaS, sistemas internos y dashboards, automatización de procesos con bots e integraciones, y conexión de pasarelas de pago y APIs. Si tu negocio tiene un proceso digital, lo diseñamos, construimos y dejamos funcionando.",
      "Landing pages with SEO, web apps and SaaS platforms, internal systems and dashboards, process automation with bots and integrations, and payment gateway and API connections. If your business has a digital process, we design it, build it and leave it running."
    ),
  },
  {
    q: t("¿Cuánto cuesta un proyecto?", "How much does a project cost?"),
    a: t(
      "Depende del alcance. Una landing de conversión parte desde $390.000 CLP y un proyecto de automatización desde $290.000 CLP; el software a medida se cotiza por proyecto. En el diagnóstico inicial defines el alcance y recibes un precio fijo por escrito antes de empezar, sin costos ocultos.",
      "It depends on the scope. A conversion landing starts from CLP $390,000 and an automation project from CLP $290,000; custom software is quoted per project. In the initial assessment you define the scope and get a fixed price in writing before starting, with no hidden costs."
    ),
  },
  {
    q: t("¿Cuánto tiempo tarda la entrega?", "How long does delivery take?"),
    a: t(
      "Una landing: aproximadamente 5 a 10 días. Proyectos medianos como apps, bots o sistemas internos: 2 a 4 semanas. Plataformas completas: el plazo se define en el roadmap inicial. Los tiempos se acuerdan antes de comenzar y se respetan.",
      "A landing: roughly 5 to 10 days. Medium projects like apps, bots or internal systems: 2 to 4 weeks. Full platforms: the timeline is defined in the initial roadmap. Timelines are agreed before starting and are honored."
    ),
  },
  {
    q: t("¿El código me pertenece al 100%?", "Do I own the code 100%?"),
    a: t(
      "Sí. Al cierre del proyecto recibes todo el código fuente y la documentación técnica. No quedas atado a nosotros: puedes seguir el desarrollo por tu cuenta o con cualquier otro equipo, sin restricciones.",
      "Yes. At project close you receive all the source code and technical documentation. You're not tied to us: you can continue development on your own or with any other team, with no restrictions."
    ),
  },
  {
    q: t("¿Puedo solicitar cambios durante el desarrollo?", "Can I request changes during development?"),
    a: t(
      "Sí. Trabajamos de forma iterativa con entregas parciales para que revises y ajustes antes de la versión final. Los cambios dentro del alcance acordado no tienen costo adicional; si el alcance crece, lo conversamos y ajustamos el presupuesto de forma transparente.",
      "Yes. We work iteratively with partial deliveries so you can review and adjust before the final version. Changes within the agreed scope have no extra cost; if the scope grows, we discuss it and adjust the budget transparently."
    ),
  },
  {
    q: t("¿Con qué clientes trabajan y cómo se paga?", "Who do you work with and how is payment handled?"),
    a: t(
      "Trabajamos 100% remoto con clientes en Chile, Latinoamérica y Estados Unidos, en español o inglés. En Chile aceptamos transferencia en CLP; para clientes internacionales recibimos pagos en USD o en USDT (cripto). El esquema de pago se acuerda en el roadmap antes de comenzar.",
      "We work 100% remotely with clients in Chile, Latin America and the United States, in Spanish or English. In Chile we accept CLP transfers; for international clients we accept payments in USD or USDT (crypto). The payment scheme is agreed in the roadmap before starting."
    ),
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("preguntas frecuentes", "frequently asked")}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {t("Preguntas frecuentes", "Frequently asked questions")}
          </h2>
          <p className="text-muted-foreground">
            {t(
              "Respuestas directas a las dudas más comunes antes de iniciar un proyecto.",
              "Straight answers to the most common questions before starting a project."
            )}
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
