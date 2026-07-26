import { Link } from "react-router-dom";
import { ShieldCheck, Clock, KeyRound } from "lucide-react";
import { t } from "@/lib/i18n";
import { CTA_SECONDARY } from "@/data/site";
import CtaButton from "@/components/landing/CtaButton";

// Cierre. La garantía va aquí y no en su propia sección: es lo último que el
// cliente necesita leer antes de apretar el botón, no un tema aparte.

const guarantees = [
  { icon: ShieldCheck, text: t("30 días de garantía", "30-day warranty") },
  { icon: Clock, text: t("Precio fijo por escrito", "Fixed price in writing") },
  { icon: KeyRound, text: t("El código queda tuyo", "The code stays yours") },
];

export default function FinalCta() {
  return (
    <section id="contacto" className="scroll-mt-20 border-t border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {t("Cuéntame qué te está quitando el tiempo.", "Tell me what's eating your time.")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          {t(
            "Un mensaje, sin formularios. Te respondo el mismo día si tiene solución y cuánto cuesta — aunque la respuesta sea que no lo necesitas.",
            "One message, no forms. I'll tell you the same day if it's solvable and what it costs — even if the answer is that you don't need it."
          )}
        </p>

        <div className="mt-9 flex justify-center">
          <CtaButton size="lg" context="cierre" />
        </div>

        <Link
          to="/contacto"
          className="mt-5 inline-block text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {CTA_SECONDARY}
        </Link>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {guarantees.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
