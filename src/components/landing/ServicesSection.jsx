import { Globe, Bot, CreditCard, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    title: "Landing pages & SEO",
    desc: "Páginas de alta conversión posicionadas en Google. Diseño profesional, carga rápida, métricas integradas y formularios de captura de leads desde el primer día.",
    tags: ["SEO", "Conversión", "CRO"],
  },
  {
    icon: Code2,
    num: "02",
    title: "Software y apps a medida",
    desc: "Dashboards, CRMs, plataformas SaaS y sistemas internos. Desde el prototipo hasta el despliegue en producción con escalabilidad real.",
    tags: ["React", "Node.js", "Supabase"],
  },
  {
    icon: Bot,
    num: "03",
    title: "Automatización de procesos",
    desc: "Workflows que eliminan trabajo manual: bots de calificación, respuestas automáticas, integraciones entre herramientas y pipelines de datos en tiempo real.",
    tags: ["Webhooks", "n8n", "CRM"],
  },
  {
    icon: CreditCard,
    num: "04",
    title: "Integración de pagos y APIs",
    desc: "Pasarelas de cobro, suscripciones recurrentes y facturación automática. Conectamos Stripe, MercadoPago o pagos en USDT con cualquier API externa.",
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
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// servicios</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            Todo lo que necesitas <span className="text-primary">en un solo equipo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desde la captación hasta la automatización: estrategia, diseño, código y soporte reunidos en un flujo continuo.
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

        <div className="mt-12 text-center">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
          >
            Consultar sobre un proyecto <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

