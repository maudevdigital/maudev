import { TrendingUp, Globe, Bot, CreditCard, BarChart3, Code2, ArrowRight } from "lucide-react";
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
    color: "from-primary/20 to-primary/5 border-primary/20",
    iconColor: "text-primary bg-primary/10",
  },
  {
    icon: Code2,
    num: "02",
    title: "Software y apps a medida",
    desc: "Dashboards, CRMs, plataformas SaaS y sistemas internos. Desde el prototipo hasta el despliegue en producción con escalabilidad real.",
    tags: ["React", "Node.js", "Supabase"],
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    iconColor: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Bot,
    num: "03",
    title: "Automatización de procesos",
    desc: "Workflows que eliminan trabajo manual: bots de calificación, respuestas automáticas, integraciones entre herramientas y pipelines de datos en tiempo real.",
    tags: ["Webhooks", "n8n", "CRM"],
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    iconColor: "text-purple-400 bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    num: "04",
    title: "Scripts TradingView",
    desc: "Indicadores y estrategias en Pine Script con lógica personalizada, alertas inteligentes y backtesting para tomar decisiones con datos.",
    tags: ["Pine Script", "Alertas", "Backtesting"],
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    iconColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    num: "05",
    title: "Expert Advisors MT5",
    desc: "EAs e indicadores personalizados para MetaTrader 5 en MQL5. Trading algorítmico, gestión de riesgo automática y reportes de rendimiento.",
    tags: ["MQL5", "EA", "Risk Mgmt"],
    color: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
    iconColor: "text-orange-400 bg-orange-500/10",
  },
  {
    icon: CreditCard,
    num: "06",
    title: "Integración de pagos y APIs",
    desc: "Pasarelas de cobro, suscripciones recurrentes, facturación automática y conexión con cualquier API externa. El dinero fluye sin fricción.",
    tags: ["Stripe", "MercadoPago", "APIs"],
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/20",
    iconColor: "text-pink-400 bg-pink-500/10",
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
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              className={`group relative bg-linear-to-br ${s.color} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl ${s.iconColor} flex items-center justify-center`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-muted-foreground/60 font-bold tracking-widest">{s.num}</span>
              </div>
              <h3 className="text-base font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-md bg-background/50 border border-border/60 text-muted-foreground">
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

