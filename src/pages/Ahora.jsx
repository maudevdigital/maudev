import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Hammer, Rocket, PenLine, CalendarCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { nowItems, lastUpdated } from "@/data/now";
import { availability, CTA_LABEL } from "@/data/site";
import moment from "moment";

const statusMeta = {
  building: { icon: Hammer, label: t("Construyendo", "Building") },
  shipped: { icon: Rocket, label: t("Lanzado", "Shipped") },
  writing: { icon: PenLine, label: t("Escribiendo", "Writing") },
  open: { icon: CalendarCheck, label: t("Agenda", "Schedule") },
};

export default function Ahora() {
  useEffect(() => {
    document.title = t("Ahora · Maudev", "Now · Maudev");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-32 pb-24 lg:pt-40 overflow-hidden min-h-screen">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <span className="kicker">{t("ahora", "now")}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-5">
            {t("En qué estamos", "What we're working on")} <span className="text-primary">{t("trabajando", "right now")}</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-3 max-w-xl">
            {t(
              "Transparencia simple: esto es lo que está pasando dentro de maudev este mes. Sin marketing, solo el estado real del taller.",
              "Simple transparency: this is what's happening inside maudev this month. No marketing, just the real state of the workshop."
            )}
          </p>
          <p className="text-xs font-mono text-muted-foreground mb-12">
            {t("Última actualización:", "Last updated:")} {moment(lastUpdated).format("DD/MM/YYYY")}
          </p>

          <div className="space-y-4">
            {nowItems.map((item, i) => {
              const meta = statusMeta[item.status] || statusMeta.building;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <meta.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 border border-primary/15 px-2 py-0.5 rounded-md">
                      {meta.label}
                    </span>
                    <h2 className="font-bold mt-2 mb-1">{item.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <div className={`h-1.5 w-1.5 rounded-full ${availability.open ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-xs font-mono text-primary tracking-wider uppercase">
                {availability.label} · {availability.period}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {t("¿Quieres que tu proyecto aparezca en esta lista el próximo mes?", "Want your project on this list next month?")}
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {CTA_LABEL}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
