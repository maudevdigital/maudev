import { useCallback, useEffect, useRef } from "react";
import { CalendarClock, MessageCircle } from "lucide-react";
import { CAL_URL } from "@/data/catalog";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import CountryFlags from "@/components/landing/CountryFlags";
import ParticleField from "@/components/landing/ParticleField";
import QuickQuote from "@/components/landing/QuickQuote";
import RotatingAudience from "@/components/landing/RotatingAudience";
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

      <div className="site-container relative grid w-full items-center gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        {/* ── Izquierda: mensaje y acción ── */}
        <div>
          <span className="eyebrow">Diseño y desarrollo web · Chile</span>

          <h1 className="hero-title mt-7">Tu sitio web, hecho para que te contacten.</h1>

          <RotatingAudience />

          {/* Las dos acciones del hero son las dos formas reales de empezar
              una conversación: escribir ahora o reservar una hora. Ambas salen
              del sitio, así que van como <a> y no como <Link>. El cotizador de
              la derecha cubre a quien todavía no quiere hablar con nadie. */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={getWhatsAppUrl("Hola, vengo de maudev.cl y quiero conversar sobre un sitio web para mi negocio.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("whatsapp_click", { ubicacion: "hero" })}
              className="btn btn-primary h-14 px-7"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              Hablar por WhatsApp
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("agendar_click", { ubicacion: "hero" })}
              className="btn btn-ghost h-14 px-6"
            >
              <CalendarClock className="h-5 w-5 shrink-0" aria-hidden="true" />
              Agendar 30 min
            </a>
          </div>

          <CountryFlags />

        </div>

        {/* ── Derecha: cotizador ── */}
        <QuickQuote />

      </div>
    </section>
  );
}
