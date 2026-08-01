import { ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import AutomationFlow from "@/components/landing/AutomationFlow";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import { proofPoints } from "@/data/site";
import { trackAction } from "@/lib/MetaPixelTracker";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      {/* La máscara apaga las partículas en los bordes para que no compitan
          con el texto ni se corten de golpe contra el límite de la sección. */}
      <ParticleField className="-z-10 mask-[radial-gradient(ellipse_at_center,black_55%,transparent_100%)]" />
      <div className="site-container relative grid w-full items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="max-w-3xl">
          <span className="eyebrow">Automatización y software para empresas</span>
          <h1 className="display-title mt-5">Automatizamos las tareas que frenan tu negocio.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Conectamos respuestas, reservas, pagos, facturación, inventario y seguimiento en sistemas que trabajan por ti.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CtaButton size="lg" context="hero" />
            <Link
              to="/#casos"
              onClick={() => trackAction("proyectos_reales_click", { ubicacion: "hero" })}
              className="group inline-flex h-14 items-center gap-2 rounded-full px-2 text-sm font-bold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            >
              Ver proyectos reales
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5 text-xs font-semibold text-muted-foreground">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-2">
          <AutomationFlow />
        </div>
      </div>
    </section>
  );
}
