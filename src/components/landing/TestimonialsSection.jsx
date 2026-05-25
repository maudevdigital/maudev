import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Carlos R.",
    role: "Gerente de operaciones",
    location: "Santiago, Chile",
    text: "Automatizaron el flujo de cotizaciones que antes hacíamos a mano en planillas. Hoy los pedidos entran al sistema solos y respondemos en minutos. El soporte post-entrega fue excelente.",
    rating: 5,
    tag: "Automatización",
    initials: "CR",
  },
  {
    name: "Valentina M.",
    role: "Fundadora de curso",
    location: "Colombia",
    text: "Necesitaba una landing page de alta conversión para mi curso. El resultado superó mis expectativas: diseño profesional, carga rápida y los leads aumentaron un 40% desde el primer mes.",
    rating: 5,
    tag: "Landing Page",
    initials: "VM",
  },
  {
    name: "Diego F.",
    role: "E-commerce de repuestos",
    location: "México",
    text: "Desarrollaron nuestra tienda con búsqueda por modelo de vehículo y pagos integrados. Vendemos sin fricción y el panel de administración nos ahorra horas cada semana. Muy buena comunicación.",
    rating: 5,
    tag: "E-commerce",
    initials: "DF",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-150 h-75 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// resultados</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            Lo que dicen los clientes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proyectos reales, resultados concretos. Cada testimonio refleja un proyecto entregado con compromiso y calidad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="h-6 w-6 text-primary/20 mb-4 shrink-0" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex items-center gap-3">
                  {/* Avatar con iniciales */}
                  <div className="h-9 w-9 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-foreground">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
