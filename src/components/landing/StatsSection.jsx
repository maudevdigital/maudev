import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DollarSign, Code2, Clock, Globe } from "lucide-react";
import { t } from "@/lib/i18n";

const signals = [
  {
    icon: DollarSign,
    value: t("Precio fijo", "Fixed price"),
    label: t("Por proyecto", "Per project"),
    sub: t("Sin sorpresas en la factura", "No surprises on the bill"),
  },
  {
    icon: Code2,
    value: t("Código tuyo", "Your code"),
    label: t("100% propiedad del cliente", "100% client-owned"),
    sub: t("Sin licencias ni lock-in", "No licenses, no lock-in"),
  },
  {
    icon: Clock,
    value: "24h",
    label: t("Primera respuesta", "First reply"),
    sub: t("Diagnóstico gratuito incluido", "Free consult included"),
  },
  {
    icon: Globe,
    value: t("Remoto", "Remote"),
    label: t("Chile · LatAm · EEUU", "Chile · LatAm · USA"),
    sub: t("Español e inglés", "Spanish and English"),
  },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative border-y border-border/40 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-border/40">
          {signals.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center px-6 py-2 first:pl-0 last:pr-0"
            >
              <div className="flex justify-center mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight leading-none mb-1">
                {s.value}
              </p>
              <p className="text-sm font-semibold text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
