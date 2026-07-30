import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { availability, proofPoints } from "@/data/site";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import HeroChat from "@/components/landing/HeroChat";

// ─────────────────────────────────────────────────────────────────────────────
// Hero. Una promesa, una prueba, un botón.
//
// El H1 va estático (sin animación) porque es el LCP: se pinta de inmediato
// sin esperar a que cargue el JS. Todo lo demás entra con fade.
//
// La prueba de la derecha es HTML (HeroChat), no una imagen: el texto de la
// conversación queda indexable y el bloque se adapta al tema. Por eso la
// bajada puede ser corta — lo que antes explicaba el párrafo, ahora se ve.
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden="true" />
      <ParticleField className="mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />

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

          <p className="mb-8 max-w-md text-lg leading-relaxed text-muted-foreground">
            {t(
              "Automatizo responder, agendar y cobrar en tu PYME. En días, no en meses.",
              "I automate replying, booking and invoicing for your business. In days, not months."
            )}
          </p>

          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CtaButton size="lg" context="hero" />
            <span className="font-mono text-xs text-muted-foreground">
              {t("Respuesta el mismo día", "Same-day reply")}
            </span>
          </div>

          {/* Credenciales en una sola línea mono: pesan como dato, no como lista */}
          <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs text-muted-foreground">
            {proofPoints.map((p) => (
              // El separador va DESPUÉS del texto: si la lista se parte en dos
              // líneas, el punto cierra la de arriba en vez de abrir la de abajo.
              <li
                key={p}
                className="after:ml-2.5 after:text-primary/40 after:content-['·'] last:after:content-none"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna prueba ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <HeroChat />
        </motion.div>
      </div>
    </section>
  );
}
