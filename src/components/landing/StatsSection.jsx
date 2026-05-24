import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

const stats = [
  { to: 25, prefix: "+", suffix: "", label: "Proyectos entregados", sub: "webs, apps y automatizaciones" },
  { to: 3, prefix: "", suffix: "+", label: "Países con clientes", sub: "Chile, Argentina, Colombia" },
  { static: "24h", label: "Primera respuesta", sub: "diagnóstico gratuito incluido" },
  { to: 100, prefix: "", suffix: "%", label: "Código del cliente", sub: "sin licencias ni ataduras" },
];

function AnimatedNumber({ to, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, prefix, suffix, mv]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative border-y border-border/40 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-border/40">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center px-6 py-2 first:pl-0 last:pr-0"
            >
              <p className="text-4xl sm:text-5xl font-black text-primary font-mono tracking-tight leading-none mb-2">
                {s.static ? (
                  s.static
                ) : (
                  <AnimatedNumber to={s.to} prefix={s.prefix} suffix={s.suffix} />
                )}
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