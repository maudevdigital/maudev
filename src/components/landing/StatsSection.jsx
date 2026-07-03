import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Server, BadgeDollarSign, Code2, LifeBuoy } from "lucide-react";
import { t } from "@/lib/i18n";

// Franja "todo incluido" bajo el hero: deja claro que el proyecto se entrega
// funcionando de punta a punta (dominio, servidor, SSL, métricas) y a nombre
// del cliente. Solo compromisos verificables.
const items = [
  {
    icon: Server,
    title: t("Dominio, hosting y SSL", "Domain, hosting & SSL"),
    sub: t("Todo configurado, funcionando y a tu nombre", "Everything set up, running and in your name"),
  },
  {
    icon: BadgeDollarSign,
    title: t("Precio fijo por escrito", "Fixed price in writing"),
    sub: t("Sin sorpresas ni costos ocultos en la factura", "No surprises or hidden costs on the bill"),
  },
  {
    icon: Code2,
    title: t("Código 100% tuyo", "Code 100% yours"),
    sub: t("Repositorio, accesos y credenciales traspasados", "Repository, access and credentials handed over"),
  },
  {
    icon: LifeBuoy,
    title: t("Soporte post-entrega", "Post-delivery support"),
    sub: t("30 días de correcciones incluidas", "30 days of fixes included"),
  },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative border-y border-border/40 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <span className="kicker">{t("todo incluido", "everything included")}</span>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            {t(
              "Entregamos proyectos funcionando, no archivos sueltos: dominio, servidor y todo lo necesario para operar queda configurado desde el día uno.",
              "We deliver working projects, not loose files: domain, server and everything needed to operate is configured from day one."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-snug mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
