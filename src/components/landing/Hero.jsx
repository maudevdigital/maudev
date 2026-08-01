import { ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import { proofPoints } from "@/data/site";
import { priceLabel } from "@/data/pricing";
import { trackAction } from "@/lib/MetaPixelTracker";

// Hero tipográfico, sin visual a la derecha.
//
// La columna de la derecha llevaba primero un wireframe gris y después una
// captura de un sitio; ninguna de las dos aportaba. Mostrar páginas acá compite
// con la sección de proyectos, que es donde el trabajo se explica con su
// problema y su resultado. Sin ese peso muerto, el titular puede ocupar el
// ancho completo y el precio queda a la vista sin pelear con una imagen.
export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      <ParticleField className="-z-10 mask-[radial-gradient(ellipse_at_center,black_55%,transparent_100%)]" />

      <div className="site-container relative w-full">
        <span className="eyebrow">Diseño y desarrollo web en Chile</span>
        <h1 className="hero-title mt-6">Tu sitio web, hecho para que te contacten.</h1>

        <div className="mt-10 grid gap-10 border-t border-border pt-9 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            Diseñamos y programamos páginas rápidas y claras. Después las mantenemos, y conectamos lo que se pueda automatizar.
          </p>

          <div>
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Landing desde</dt>
                <dd className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">{priceLabel("landing")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mantención desde</dt>
                <dd className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">{priceLabel("mantencion")}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <CtaButton size="lg" context="hero" />
              <Link
                to="/#casos"
                onClick={() => trackAction("proyectos_reales_click", { ubicacion: "hero" })}
                className="group inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              >
                Ver proyectos reales
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-xs font-semibold text-muted-foreground">
          {proofPoints.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
