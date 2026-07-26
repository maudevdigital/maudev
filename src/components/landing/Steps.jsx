import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import CtaButton from "@/components/landing/CtaButton";

// Tres pasos. Nada más. Cada palabra extra aquí es una razón para dudar.

const STEPS_IMAGE = "/img/proceso.webp"; // ver docs/prompts-imagenes.md

const steps = [
  {
    n: "01",
    title: t("Me cuentas", "You tell me"),
    body: t(
      "Un mensaje por WhatsApp explicando qué tarea te quita tiempo. Te respondo el mismo día si tiene solución y cuánto cuesta.",
      "One WhatsApp message explaining which task eats your time. I reply the same day with whether it's solvable and what it costs."
    ),
  },
  {
    n: "02",
    title: t("Lo construyo", "I build it"),
    body: t(
      "Precio cerrado por escrito antes de empezar. Te muestro avances reales durante el proceso, no promesas.",
      "Closed price in writing before starting. You see real progress during the build, not promises."
    ),
  },
  {
    n: "03",
    title: t("Funciona solo", "It runs itself"),
    body: t(
      "Queda andando en tu negocio con 30 días de garantía. El código es tuyo: si mañana no me quieres, te lo llevas.",
      "It goes live in your business with a 30-day warranty. The code is yours: if you don't want me tomorrow, you keep it."
    ),
  },
];

export default function Steps() {
  return (
    <section id="proceso" className="scroll-mt-20 border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {t("Cómo funciona", "How it works")}
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t("Tres pasos. Sin reuniones eternas.", "Three steps. No endless meetings.")}
            </h2>

            <ol className="mt-10 space-y-8">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <span className="font-mono text-sm font-bold text-primary/60" aria-hidden="true">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-lg font-bold">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-10">
              <CtaButton context="proceso" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5">
            <img
              src={STEPS_IMAGE}
              alt={t(
                "Diagrama de un flujo automatizado conectando WhatsApp, calendario y facturación",
                "Diagram of an automated flow connecting WhatsApp, calendar and invoicing"
              )}
              width={1200}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
