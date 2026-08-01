import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";
import { CAL_URL } from "@/data/catalog";
import { priceIn } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";
import { trackAction } from "@/lib/MetaPixelTracker";

// Lo que va a la derecha: las cifras y la vía rápida para agendar.
//
// No es una imagen ni una maqueta. En una página que vende sitios web, el
// espacio de la derecha rinde más mostrando lo que el visitante realmente está
// buscando —cuánto cuesta y cómo hablar contigo— que una ilustración.
const datos = [
  { key: "landing", label: "Landing", detalle: "Una página, una acción" },
  { key: "sitio", label: "Sitio corporativo", detalle: "Varias páginas de servicio" },
  { key: "mantencion", label: "Mantención", detalle: "Respaldos y cambios del mes" },
];

export default function Hero() {
  const moneda = useCurrency();
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

        {/* ── Derecha: precios y agenda ── */}
        <div className="panel panel-solid">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Desde cuánto parte
            </p>
            <span className="font-mono text-[10px] font-semibold text-primary">{moneda}</span>
          </div>

          <dl className="px-6 py-2">
            {datos.map(({ key, label, detalle }) => (
              <div key={key} className="flex items-baseline justify-between gap-4 border-b border-border py-4 last:border-b-0">
                <div className="min-w-0">
                  <dt className="text-sm font-bold text-foreground">{label}</dt>
                  <p className="mt-0.5 text-xs text-muted-foreground">{detalle}</p>
                </div>
                <dd className="shrink-0 font-display text-lg font-bold tracking-[-0.03em] sm:text-xl">
                  {priceIn(key, moneda)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-border p-4">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("agendar_click", { ubicacion: "hero" })}
              className="group flex items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-3 transition-colors hover:bg-primary/10"
            >
              <span className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                Agendar 30 minutos
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <p className="mt-2.5 px-1 text-xs leading-relaxed text-muted-foreground">
              Sin compromiso. Te decimos qué necesitas y cuánto costaría.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
