import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import QuickQuote from "@/components/landing/QuickQuote";
import { trackAction } from "@/lib/MetaPixelTracker";

export default function Hero() {
  const seccionRef = useRef(null);
  const frameRef = useRef(0);

  // El foco de luz se actualiza dentro de un rAF: mousemove dispara decenas de
  // veces por segundo y escribir la variable CSS en cada evento provoca
  // repintados de más sin que el ojo note la diferencia.
  const seguirPuntero = useCallback((evento) => {
    const nodo = seccionRef.current;
    if (!nodo) return;
    const { clientX, clientY } = evento;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const caja = nodo.getBoundingClientRect();
      nodo.style.setProperty("--mx", `${clientX - caja.left}px`);
      nodo.style.setProperty("--my", `${clientY - caja.top}px`);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <section ref={seccionRef} onMouseMove={seguirPuntero} className="hero-section">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <ParticleField className="-z-10 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <div className="site-container relative grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        {/* ── Izquierda: mensaje y acción ── */}
        <div>
          <span className="eyebrow">Diseño y desarrollo web · Chile</span>

          <h1 className="hero-title mt-7">Tu sitio web, hecho para que te contacten.</h1>

          <div className="mt-11 flex flex-col gap-6 sm:flex-row sm:items-center">
            <CtaButton size="lg" context="hero" />
            <Link
              to="/#casos"
              onClick={() => trackAction("proyectos_reales_click", { ubicacion: "hero" })}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-primary"
            >
              Ver proyectos
            </Link>
          </div>
        </div>

        {/* ── Derecha: cotizador ── */}
        <QuickQuote />

      </div>
    </section>
  );
}
