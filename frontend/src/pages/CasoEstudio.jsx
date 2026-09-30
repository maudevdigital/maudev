import { useEffect } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { getProjectById } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";
import { useSeo } from "@/lib/useSeo";

export default function CasoEstudio() {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  useSeo(project ? {
    title: `${project.title} · Caso de estudio · Maudev`,
    description: project.tagline,
    path: `/casos/${project.id}`,
    image: project.image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
        { "@type": "ListItem", position: 2, name: "Casos", item: "https://maudev.cl/casos" },
        { "@type": "ListItem", position: 3, name: project.title, item: `https://maudev.cl/casos/${project.id}` },
      ],
    },
  } : { title: "Caso no encontrado · Maudev", noindex: true });

  useEffect(() => {
    if (project) trackAction("proyecto_visualizado", { proyecto: project.id });
  }, [project]);

  if (!project) return <Navigate to="/casos" replace />;

  const blocks = [
    ["01", "El problema", project.problem],
    ["02", "La solución", project.solution],
    ["03", "El beneficio", project.outcome],
  ];

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-14 pt-30 sm:pt-36 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Casos", href: "/casos" }, { label: project.title }]} />
            <Link to="/casos" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a casos
            </Link>
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{project.industry}</p>
                <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">{project.title}</h1>
                <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted-foreground">{project.tagline}</p>
              </div>
              <div className="border-l border-border pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Rol de Maudev</p>
                <p className="mt-2 font-semibold">{project.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 lg:pb-24">
          <div className="site-container">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.35rem] border border-border bg-secondary shadow-[0_30px_80px_hsl(var(--ink)/0.12)]">
              <img src={project.image} alt={`Vista del proyecto ${project.title}`} width="1280" height={project.id === "systempro" ? "720" : "2560"} decoding="async" className="h-full w-full object-cover object-top" />
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 inline-flex h-11 items-center gap-2 rounded-xl bg-black/75 px-5 text-sm font-bold text-white backdrop-blur-sm hover:bg-black">
                  Ver proyecto <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container">
            <div className="grid border-t border-border lg:grid-cols-3">
              {blocks.map(([number, title, text], index) => (
                <article key={title} className={`border-b border-border py-8 lg:px-9 lg:py-10 ${index > 0 ? "lg:border-l" : "lg:pl-0"}`}>
                  <span className="font-mono text-xs font-semibold text-primary">{number}</span>
                  <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.035em]">{title}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-2" aria-label="Tecnologías utilizadas">
              {project.stack.map((item) => <span key={item} className="rounded-xl border border-border bg-background px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{item}</span>)}
            </div>
          </div>
        </section>
        <FinalCta />
      </main>
    </PageShell>
  );
}
