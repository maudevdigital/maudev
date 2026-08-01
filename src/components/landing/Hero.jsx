import { Link } from "react-router-dom";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import { priceIn } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";
import { trackAction } from "@/lib/MetaPixelTracker";

// Hero: una frase, dos cifras, una acción.
//
// Antes traía además un párrafo descriptivo y tres pruebas de confianza. Todo
// eso vuelve a aparecer más abajo en la página, así que acá solo diluía: quien
// llega decide con el titular y el precio, no leyendo. El resto del peso lo
// lleva el tratamiento —retícula, mono, panel de vidrio— y no más texto.
export default function Hero() {
  const moneda = useCurrency();

  return (
    <section className="hero-section">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <ParticleField className="-z-10 mask-[radial-gradient(ellipse_at_center,black_55%,transparent_100%)]" />

      <div className="site-container relative w-full">
        <span className="eyebrow">Diseño y desarrollo web · Chile</span>

        <h1 className="hero-title mt-7">Tu sitio web, hecho para que te contacten.</h1>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
          <CtaButton size="lg" context="hero" />
          <Link
            to="/#casos"
            onClick={() => trackAction("proyectos_reales_click", { ubicacion: "hero" })}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-primary"
          >
            Ver proyectos
          </Link>
        </div>

        {/* Las dos cifras que deciden, en panel de vidrio como el header */}
        <dl className="panel mt-14 inline-grid grid-cols-2 divide-x divide-border">
          {[
            ["Landing desde", priceIn("landing", moneda)],
            ["Mantención desde", priceIn("mantencion", moneda)],
          ].map(([label, value]) => (
            <div key={label} className="px-6 py-5 sm:px-8">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1.5 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
