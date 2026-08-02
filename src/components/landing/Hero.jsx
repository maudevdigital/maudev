import { useCallback, useEffect, useRef } from "react";
import { CalendarClock, MessageCircle } from "lucide-react";
import { CAL_URL } from "@/data/catalog";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { currencyList } from "@/data/currencies";
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
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 font-semibold text-primary-foreground shadow-[0_14px_35px_hsl(var(--primary)/0.18)] transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              Hablar por WhatsApp
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("agendar_click", { ubicacion: "hero" })}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-border px-6 font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CalendarClock className="h-5 w-5 shrink-0" aria-hidden="true" />
              Agendar 30 min
            </a>
          </div>

          {/* Alcance, no prueba social.
              Los círculos son los países cuya moneda cotizamos, que es un hecho
              verificable del propio sitio: el selector del header los tiene. No
              son clientes ni llevan estrellas, porque no hay clientes en esos
              países ni calificaciones que respalden un puntaje. El día que
              existan testimonios reales, este bloque se reemplaza por ellos. */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-5">
            <ul className="flex -space-x-2" aria-hidden="true">
              {currencyList.map((moneda) => (
                <li
                  key={moneda.code}
                  title={moneda.code}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-secondary font-mono text-[10px] font-bold text-muted-foreground"
                >
                  {moneda.country}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-snug text-muted-foreground">
              <strong className="font-semibold text-foreground">Cotizamos en tu moneda.</strong>{" "}
              Trabajamos a distancia con toda Latinoamérica.
            </p>
          </div>

        </div>

        {/* ── Derecha: cotizador ── */}
        <QuickQuote />

      </div>
    </section>
  );
}
