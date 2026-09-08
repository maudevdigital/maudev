import { ArrowDown, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { getFeaturedProjects } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";

const project = getFeaturedProjects()[0];

export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
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
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={getWhatsAppUrl("Hola, vengo de maudev.cl y quiero conversar sobre un sitio web para mi negocio.")}
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackAction("whatsapp_click", { ubicacion: "hero" })}
                className="btn btn-primary min-h-12 px-6 text-sm"
              >
                Conversemos de tu proyecto <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#casos" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:text-primary">
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
