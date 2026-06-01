import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/i18n";

const faqs = [
  {
    num: "01",
    q: t("¿Qué tipos de proyectos desarrollan?", "What kinds of projects do you build?"),
    a: t(
      "Landing pages con SEO, aplicaciones web y plataformas SaaS, sistemas internos y dashboards, automatización de procesos con bots e integraciones, y conexión de pasarelas de pago y APIs. Si tu negocio tiene un proceso digital, lo diseñamos, construimos y dejamos funcionando.",
      "Landing pages with SEO, web apps and SaaS platforms, internal systems and dashboards, process automation with bots and integrations, and payment gateway and API connections. If your business has a digital process, we design it, build it and leave it running."
    ),
    tag: t("Servicios", "Services"),
  },
  {
    num: "02",
    q: t("¿Cuánto cuesta un proyecto?", "How much does a project cost?"),
    a: t(
      "Depende del alcance. Una landing de conversión parte desde $390.000 CLP y un proyecto de automatización desde $290.000 CLP; el software a medida se cotiza por proyecto. En el diagnóstico inicial defines el alcance y recibes un precio fijo por escrito antes de empezar, sin costos ocultos.",
      "It depends on the scope. A conversion landing starts from CLP $390,000 and an automation project from CLP $290,000; custom software is quoted per project. In the initial assessment you define the scope and get a fixed price in writing before starting, with no hidden costs."
    ),
    tag: t("Precios", "Pricing"),
  },
  {
    num: "03",
    q: t("¿Cuánto tiempo tarda la entrega?", "How long does delivery take?"),
    a: t(
      "Una landing: aproximadamente 5 a 10 días. Proyectos medianos como apps, bots o sistemas internos: 2 a 4 semanas. Plataformas completas: el plazo se define en el roadmap inicial. Los tiempos se acuerdan antes de comenzar y se respetan.",
      "A landing: roughly 5 to 10 days. Medium projects like apps, bots or internal systems: 2 to 4 weeks. Full platforms: the timeline is defined in the initial roadmap. Timelines are agreed before starting and are honored."
    ),
    tag: t("Plazos", "Timelines"),
  },
  {
    num: "04",
    q: t("¿El código me pertenece al 100%?", "Do I own the code 100%?"),
    a: t(
      "Sí. Al cierre del proyecto recibes todo el código fuente y la documentación técnica. No quedas atado a nosotros: puedes seguir el desarrollo por tu cuenta o con cualquier otro equipo, sin restricciones.",
      "Yes. At project close you receive all the source code and technical documentation. You're not tied to us: you can continue development on your own or with any other team, with no restrictions."
    ),
    tag: t("Propiedad", "Ownership"),
  },
  {
    num: "05",
    q: t("¿Puedo solicitar cambios durante el desarrollo?", "Can I request changes during development?"),
    a: t(
      "Sí. Trabajamos de forma iterativa con entregas parciales para que revises y ajustes antes de la versión final. Los cambios dentro del alcance acordado no tienen costo adicional; si el alcance crece, lo conversamos y ajustamos el presupuesto de forma transparente.",
      "Yes. We work iteratively with partial deliveries so you can review and adjust before the final version. Changes within the agreed scope have no extra cost; if the scope grows, we discuss it and adjust the budget transparently."
    ),
    tag: t("Proceso", "Process"),
  },
  {
    num: "06",
    q: t("¿Con qué clientes trabajan y cómo se paga?", "Who do you work with and how is payment handled?"),
    a: t(
      "Trabajamos 100% remoto con clientes en Chile, Latinoamérica y Estados Unidos, en español o inglés. En Chile aceptamos transferencia en CLP; para clientes internacionales recibimos pagos en USD o en USDT (cripto). El esquema de pago se acuerda en el roadmap antes de comenzar.",
      "We work 100% remotely with clients in Chile, Latin America and the United States, in Spanish or English. In Chile we accept CLP transfers; for international clients we accept payments in USD or USDT (crypto). The payment scheme is agreed in the roadmap before starting."
    ),
    tag: t("Pagos", "Payments"),
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">
              // {t("preguntas frecuentes", "frequently asked")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-3">
              {t("Todo lo que necesitas", "Everything you need")}
              <br />
              <span className="text-primary">{t("saber antes de empezar", "to know before starting")}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              {t(
                "Respuestas directas a las dudas más comunes. ¿Tienes una pregunta diferente?",
                "Straight answers to the most common questions. Have a different question?"
              )}
            </p>
          </div>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors whitespace-nowrap shrink-0"
          >
            <HelpCircle className="h-4 w-4" />
            {t("Hacer otra pregunta", "Ask another question")}
          </Link>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <div
                className={`bg-card border rounded-2xl overflow-hidden transition-all duration-200 ${
                  open === i
                    ? "border-primary/30 shadow-sm shadow-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  {/* Número */}
                  <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/15 px-2 py-1 rounded-md shrink-0 hidden sm:block">
                    {faq.num}
                  </span>
                  <span className="flex-1 text-sm font-semibold leading-snug">{faq.q}</span>
                  {/* Tag */}
                  <span className="hidden md:block text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground border border-border/60 shrink-0">
                    {faq.tag}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-border/40">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t("¿No encontraste lo que buscabas?", "Didn't find what you were looking for?")}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t("Escríbenos directamente", "Write to us directly")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
