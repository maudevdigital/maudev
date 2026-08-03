import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";

const featured = getFeaturedProjects();

// Portafolio.
//
// Va tercero, justo después de los niveles: quien acaba de ver un precio quiere
// saber qué recibe por él, y la respuesta honesta a eso es trabajo publicado, no
// más texto. Cada tarjeta lleva el rubro arriba —el visitante busca su propio
// rubro antes que la marca— y el resultado, no la tecnología usada.
//
// Las tarjetas usan el lenguaje de panel del resto del sitio: mismo borde, mismo
// radio y el hairline superior. La imagen manda, así que el panel se limita a
// enmarcarla.

export default function CaseStudies() {
  return (
    <section id="casos" className="section-pad scroll-mt-20" aria-labelledby="casos-title">
      <div className="site-container">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow">Trabajo comprobable</span>
            <h2 id="casos-title" className="section-title mt-4">Esto es lo que recibes por ese precio.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Proyectos publicados y funcionando hoy, explicados por el problema que resolvían y lo que cambió después.
            </p>
          </div>
          <Link to="/casos" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            Ver todos los casos <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid snap-x snap-mandatory grid-flow-col auto-cols-[82vw] gap-3 overflow-x-auto pb-4 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {featured.map((project) => (
            <article key={project.id} className="panel panel-solid group flex snap-start flex-col">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary">
                <img
                  src={project.image}
                  alt={`Vista del proyecto ${project.title}`}
                  width="1280"
                  height="2560"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
                />
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${project.title} en una pestaña nueva`}
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{project.industry}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summaryOutcome}</p>
                <Link
                  to={`/casos/${project.id}`}
                  onClick={() => trackAction("caso_exito_click", { proyecto: project.id, ubicacion: "home" })}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Ver caso <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:hidden">Desliza para ver los cuatro proyectos.</p>
      </div>
    </section>
  );
}
