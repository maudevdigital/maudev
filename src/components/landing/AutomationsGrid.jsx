import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { t } from "@/lib/i18n";
import { AUTOMATIONS } from "@/data/automations";
import CtaButton from "@/components/landing/CtaButton";
import RegionToggle from "@/components/landing/RegionToggle";
import { getRegion, priceFor } from "@/lib/region";

// ─────────────────────────────────────────────────────────────────────────────
// Reemplaza a /servicios + /automatizaciones (índice) + /precios.
//
// Cada tarjeta muestra lo único que el cliente necesita para decidir si le
// sirve: qué es, qué resuelve y cuánto cuesta. El detalle largo vive en
// /automatizaciones/:slug, que es donde llegan los anuncios.
// ─────────────────────────────────────────────────────────────────────────────

export default function AutomationsGrid() {
  // La región elige qué precio se muestra. El toggle re-renderiza esta sección.
  const [region, setRegionState] = useState(getRegion);

  return (
    <section id="automatizaciones" className="scroll-mt-20 border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            {t("Qué automatizo", "What I automate")}
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {t("Elige el dolor que quieres que desaparezca.", "Pick the headache you want gone.")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              "Precio fijo por escrito antes de empezar. Sin mensualidad obligatoria.",
              "Fixed price in writing before we start. No mandatory monthly fee."
            )}
          </p>
          <div className="mt-5">
            <RegionToggle onChange={setRegionState} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUTOMATIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              >
                <Link
                  to={`/automatizaciones/${a.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mb-1.5 text-base font-bold leading-snug">{a.name}</h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.tagline}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {priceFor(a, region).main}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/50 p-8 text-center">
          <p className="text-lg font-semibold">
            {t("¿No calza ninguna con tu caso?", "None of these fit your case?")}
          </p>
          <p className="mb-2 max-w-md text-sm text-muted-foreground">
            {t(
              "Cuéntame qué tarea te está comiendo las horas y te digo si se puede automatizar. Gratis y sin compromiso.",
              "Tell me which task is eating your hours and I'll tell you if it can be automated. Free, no strings."
            )}
          </p>
          <CtaButton context="grid-automatizaciones" />
        </div>
      </div>
    </section>
  );
}
