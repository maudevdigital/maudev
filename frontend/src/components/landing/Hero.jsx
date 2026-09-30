import { ArrowDown, ArrowUpRight, Check, Circle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";
import CtaButton from "@/components/landing/CtaButton";

const project = getFeaturedProjects()[0];

export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="site-container">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Estudio digital · Chile</span>
            <h1 id="hero-title" className="hero-title mt-6">
              Tu negocio,<br />su mejor <span className="text-muted-foreground">versión digital.</span>
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
            {/* El producto como argumento (lección de Supabase y Linear): sobre un
                proyecto real, cómo lo sigue el cliente en su portal. Los datos
                son de ejemplo y lo dice; ninguna cifra se presenta como real. */}
            <div className="producto-panel p-4" aria-label="Ejemplo del portal de clientes">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Portal de clientes</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Ejemplo</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">Ley 21.719 · Adecuación</p>
                <span className="font-mono text-sm font-semibold text-primary">60%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <div className="h-full w-3/5 rounded-full bg-primary" />
              </div>
              <ul className="mt-3 grid gap-1.5 text-xs">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />Diagnóstico<span className="ml-auto text-muted-foreground">Completada</span></li>
                <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />Canal ARCOP<span className="ml-auto text-muted-foreground">En curso</span></li>
                <li className="flex items-center gap-2"><Circle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />Documentación<span className="ml-auto text-muted-foreground">Pendiente</span></li>
              </ul>
            </div>
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
