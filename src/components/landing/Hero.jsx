import { useCallback, useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";
import CtaButton from "@/components/landing/CtaButton";
import ParticleField from "@/components/landing/ParticleField";

const project = getFeaturedProjects()[0];

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
    <section
      ref={seccionRef}
      onMouseMove={seguirPuntero}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-spot" aria-hidden="true" />
      <ParticleField className="hero-particles" />
      <div className="site-container">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Estudio digital · Chile</span>
            <h1 id="hero-title" className="hero-title mt-6">
              Tu negocio,<br />su mejor <span className="text-primary">versión digital.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Diseñamos sitios web que explican lo que haces y facilitan que te contacten.
              Te acompañamos desde la primera idea hasta la publicación.
            </p>
            {/* El hero recibe el tráfico más frío del sitio: alguien que leyó
                una frase y todavía no sabe si servimos para lo suyo. Este botón
                abría WhatsApp, así que ese visitante entraba directo al
                teléfono, sin haber visto precios ni trabajo, y esa conversación
                además no queda registrada como lead: un clic a WhatsApp no
                dispara generate_lead ni la API de Conversiones, así que ni la
                atribución de anuncios ni lo que eligió en el cotizador
                sobreviven. WhatsApp sigue en el sitio, pero abajo, donde la
                persona ya leyó y elige hablar. */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <CtaButton context="hero" size="md" />
              <a
                href="#casos"
                onClick={() => trackAction("ver_trabajo_click", { ubicacion: "hero" })}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:text-primary"
              >
                Ver nuestro trabajo <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-7 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              Alcance, precio y plazos claros desde el inicio.
            </p>
          </div>
          <div className="hero-showcase">
            <div className="flex items-center justify-between gap-3 px-1 pb-5 text-sm">
              <span className="font-medium">Ideas que ya están en línea</span>
              <span className="rounded-full bg-card/80 px-3 py-1 text-xs text-muted-foreground">Proyecto real</span>
            </div>
            <Link to={`/casos/${project.id}`} className="showcase-browser group block" aria-label={`Conocer el proyecto ${project.title}`}>
              <div className="flex items-center gap-1.5 border-b border-border bg-card px-4 py-3" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="ml-3 text-xs text-muted-foreground">{project.title} · Diseño y desarrollo web</span>
              </div>
              <img src={project.image} alt={`Diseño del sitio web de ${project.title}`} width="1280" height="2560" fetchPriority="high" className="showcase-image" />
              <div className="flex items-center justify-between gap-4 bg-card p-5">
                <div>
                  <p className="text-xs text-muted-foreground">{project.industry}</p>
                  <p className="mt-1 font-semibold">{project.title}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Link>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Diseño propio. Pensado para personas reales.
            </p>
          </div>
        </div>
        <div className="hero-footnote">
          <span>De tu primera web a una operación conectada.</span>
          <a href="#soluciones" className="inline-flex items-center gap-2 font-medium text-foreground hover:text-primary">
            Encuentra lo que necesitas <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
