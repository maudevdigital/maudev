import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getProjectById } from "@/data/projects";

// La demo del hero.
//
// Antes eran barras grises simulando una página. Para un estudio que vende
// sitios, un wireframe gris comunica "hacemos bocetos": la muestra tiene que
// ser trabajo terminado. Así que va una captura real de un proyecto publicado,
// dentro de su navegador.
//
// El teléfono es un recurso de composición, no una prueba: muestra la MISMA
// captura de escritorio recortada, no el render móvil del sitio. Por eso va
// aria-hidden y ningún texto afirma que demuestre que es responsive. Si algún
// día se quiere esa prueba de verdad, scripts/capture-portfolio.mjs puede
// generar una captura con viewport móvil.
//
// La imagen es la que ya usa el portafolio, así que no suma peso nuevo al
// repositorio, y lleva fetchPriority alto porque compite con el H1 por ser el
// LCP del hero.

const PROYECTO = "scissorhands"; // negocio local: el visitante se reconoce ahí

export default function SitePreview() {
  const project = getProjectById(PROYECTO);
  if (!project) return null;

  return (
    <figure className="site-preview-stage">
      {/* Ventana de escritorio */}
      <div className="site-frame">
        <div className="site-frame-chrome">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          <span className="site-frame-url">scissorhands.cl</span>
        </div>
        <div className="site-frame-viewport">
          <img
            src={project.image}
            alt={`Sitio web de ${project.title} visto en un computador`}
            width="1280"
            height="2560"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      {/* El mismo sitio en el teléfono: la prueba de que es responsive */}
      <div className="site-phone" aria-hidden="true">
        <div className="site-phone-viewport">
          <img src={project.image} alt="" width="1280" height="2560" loading="lazy" decoding="async" />
        </div>
      </div>

      <figcaption className="site-preview-caption">
        <span>
          <strong className="font-semibold text-foreground">{project.title}</strong>
          <span className="text-muted-foreground"> · {project.industry}</span>
        </span>
        <Link
          to={`/casos/${project.id}`}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          Ver el caso
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  );
}
