import { Globe, Bot, CreditCard, Code2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const services = [
  {
    icon: Globe,
    num: "01",
    title: t("Que tu web te traiga clientes", "A website that brings you customers"),
    desc: t(
      "Una landing que aparece en Google, carga al instante y convierte visitas en consultas reales — mientras tú atiendes tu negocio. Diseño profesional, SEO técnico y captura de leads desde el primer día.",
      "A landing page that ranks on Google, loads instantly and turns visits into real inquiries — while you run your business. Professional design, technical SEO and lead capture from day one."
    ),
    tags: ["SEO", t("Conversión", "Conversion"), "CRO"],
  },
  {
    icon: Code2,
    num: "02",
    title: t("El sistema que tu negocio necesita", "The system your business needs"),
    desc: t(
      "Deja las planillas y los parches. Dashboards, CRMs y plataformas hechas para tu operación real: del prototipo a producción, con código que crece contigo y queda a tu nombre.",
      "Ditch the spreadsheets and workarounds. Dashboards, CRMs and platforms built for your real operation: from prototype to production, with code that grows with you and stays in your name."
    ),
    tags: ["React", "Node.js", "Supabase"],
  },
  {
    icon: Bot,
    num: "03",
    title: t("Recupera horas cada semana", "Get hours back every week"),
    desc: t(
      "Lo que hoy haces a mano — responder consultas, hacer seguimiento de leads, copiar datos entre herramientas — lo dejamos corriendo solo. Tú decides en qué usar el tiempo que se libera.",
      "What you do by hand today — answering inquiries, following up leads, copying data between tools — we leave running on its own. You decide what to do with the time you get back."
    ),
    tags: ["Webhooks", "n8n", "CRM"],
  },
  {
    icon: CreditCard,
    num: "04",
    title: t("Cobra automático, sin perseguir pagos", "Charge automatically, stop chasing payments"),
    desc: t(
      "Pasarelas de cobro, suscripciones recurrentes y facturación que funcionan solas. Conectamos Stripe, MercadoPago o pagos en USDT con cualquier API externa.",
      "Payment gateways, recurring subscriptions and billing that run on their own. We connect Stripe, MercadoPago or USDT payments with any external API."
    ),
    tags: ["Stripe", "MercadoPago", "USDT"],
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-150 h-150 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("servicios", "services")}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {t("Todo lo que necesitas", "Everything you need")} <span className="text-primary">{t("en un solo equipo", "in a single team")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Desde la captación hasta la automatización: estrategia, diseño, código y soporte reunidos en un flujo continuo.",
              "From lead capture to automation: strategy, design, code and support brought together in one continuous flow."
            )}
          </p>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              className="group relative bg-card p-8 transition-colors duration-300 hover:bg-secondary/40"
            >
              <span className="absolute top-6 right-6 text-xs font-mono text-muted-foreground/40 font-bold tracking-widest">
                {s.num}
              </span>
              <div className="h-12 w-12 rounded-xl border border-border bg-secondary/60 flex items-center justify-center mb-5 transition-colors group-hover:border-foreground/30">
                <s.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-md bg-secondary border border-border/60 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
          >
            {CTA_LABEL} <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/precios"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t("Ver precios publicados", "See published pricing")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

