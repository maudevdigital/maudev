import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { t } from "@/lib/i18n";
import { availability, proofPoints } from "@/data/site";
import CtaButton from "@/components/landing/CtaButton";

// ─────────────────────────────────────────────────────────────────────────────
// Hero. Una promesa, una prueba, un botón.
//
// El H1 va estático (sin animación) porque es el LCP: se pinta de inmediato
// sin esperar a que cargue el JS. Todo lo demás entra con fade.
// ─────────────────────────────────────────────────────────────────────────────

const HERO_IMAGE = "/img/hero-whatsapp.webp"; // ver docs/prompts-imagenes.md

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden="true" />
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
        {/* ── Columna texto ── */}
        <div>
          {availability.open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                {availability.label} · {availability.period}
              </span>
            </motion.div>
          )}

          <h1 className="mb-5 text-[2.15rem] font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {t("Tu negocio responde ", "Your business replies ")}
            <span className="text-primary glow-text">{t("solo.", "on its own.")}</span>
            <br />
            {t("Incluso a las 3 AM.", "Even at 3 AM.")}
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t(
              "Automatizo la parte aburrida de tu PYME: responder, agendar, cobrar y hacer seguimiento. Se instala en días, no en meses.",
              "I automate the boring half of your business: replying, booking, invoicing and following up. Installed in days, not months."
            )}
          </p>

          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CtaButton size="lg" context="hero" />
            <span className="font-mono text-xs text-muted-foreground">
              {t("Respuesta el mismo día", "Same-day reply")}
            </span>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {proofPoints.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna imagen ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
            <img
              src={HERO_IMAGE}
              alt={t(
                "Conversación de WhatsApp donde un asistente automático responde y agenda a un cliente",
                "WhatsApp conversation where an automated assistant replies and books a customer"
              )}
              width={1024}
              height={1024}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
