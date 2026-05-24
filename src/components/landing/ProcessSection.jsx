import { MessageSquare, FileSearch, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Consulta inicial",
    desc: "Describes tu proyecto. Sin formularios, sin esperas — una conversacion directa para entender exactamente lo que necesitas construir.",
    detail: "Disponible por Telegram, WhatsApp o email",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Roadmap y cotizacion",
    desc: "En menos de 24 horas recibes un documento tecnico con alcance, tiempos reales y precio fijo. Sin letra chica, sin sorpresas.",
    detail: "Respuesta garantizada en menos de 24h",
  },
  {
    icon: Code2,
    step: "03",
    title: "Desarrollo iterativo",
    desc: "Ciclos cortos con entregas parciales. Podas ver el avance, probar y ajustar antes de la entrega final. Comunicacion constante.",
    detail: "Acceso a versiones intermedias del proyecto",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Entrega y soporte",
    desc: "Codigo documentado, guia de uso y soporte incluido. El proyecto funciona desde el primer dia en tu entorno.",
    detail: "Soporte post-entrega sin costo adicional",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute right-0 top-0 w-125 h-full bg-linear-to-l from-primary/3 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left — sticky header */}
          <div className="lg:sticky lg:top-32">
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// proceso</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              Como trabajamos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Un proceso claro de cuatro pasos. Sin burocracia, sin demoras innecesarias, con foco total en entregar codigo que funcione.
            </p>
            <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2.5 rounded-lg hover:bg-primary/5 transition-colors">
              Iniciar proyecto ahora
            </a>
          </div>

          {/* Right — vertical timeline */}
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-primary/40 via-primary/10 to-transparent" />

            <div className="space-y-0">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative flex gap-8 pb-10 last:pb-0 group"
                >
                  {/* dot on the line */}
                  <div className="relative shrink-0 w-12 flex justify-center">
                    <div className="relative z-10 h-12 w-12 rounded-xl bg-card border border-border group-hover:border-primary/50 flex items-center justify-center transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex-1 pt-2.5 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-primary font-bold tracking-widest">{s.step}</span>
                      <h3 className="text-base font-bold">{s.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
                    <span className="inline-flex items-center text-[11px] font-mono text-muted-foreground/60 border border-border/50 px-2.5 py-1 rounded-md bg-secondary/30">
                      {s.detail}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}