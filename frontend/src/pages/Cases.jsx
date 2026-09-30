import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { getProjectsInDisplayOrder } from "@/data/projects";
import { trackAction } from "@/lib/MetaPixelTracker";
import { useSeo } from "@/lib/useSeo";

export default function Cases() {
  const projects = getProjectsInDisplayOrder();

  useSeo({
    title: "Portafolio · Sitios web y sistemas que hicimos en Chile · Maudev",
    description: "Sitios web y sistemas que construimos, explicados por el problema que resolvían y lo que cambió después.",
    path: "/casos",
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
        { "@type": "ListItem", position: 2, name: "Casos", item: "https://maudev.cl/casos" },
      ],
    },
  });

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-16 pt-30 sm:pt-36 lg:pb-24 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Casos" }]} />
            <span className="eyebrow">Proyectos reales</span>
            <h1 className="mt-5 max-w-[14ch] text-5xl font-extrabold leading-[0.99] tracking-[-0.04em] sm:text-6xl lg:text-7xl">El trabajo se entiende mejor cuando se ve funcionando.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Cada caso parte con un problema concreto y termina con una herramienta que el cliente puede usar y controlar.
            </p>
          </div>
        </section>

        <section className="pb-24 lg:pb-32">
          <div className="site-container space-y-8 lg:space-y-12">
            {projects.map((project, index) => (
              <article key={project.id} className={`case-feature ${index % 2 ? "lg:[&>.case-media]:order-2" : ""}`}>
                <div className="case-media">
                  <img src={project.image} alt={`Vista del proyecto ${project.title}`} width="1280" height="2560" loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover object-top" />
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${project.title}`} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-black/65 text-white backdrop-blur-sm">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{project.industry}</p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">{project.title}</h2>
                  <p className="mt-3 font-semibold text-foreground/80">{project.tagline}</p>
                  <dl className="mt-7 space-y-4 text-sm leading-relaxed">
                    <div><dt className="font-bold text-foreground">Problema</dt><dd className="mt-1 text-muted-foreground">{project.summaryProblem}</dd></div>
                    <div><dt className="font-bold text-foreground">Beneficio</dt><dd className="mt-1 text-muted-foreground">{project.summaryOutcome}</dd></div>
                  </dl>
                  <Link to={`/casos/${project.id}`} onClick={() => trackAction("caso_exito_click", { proyecto: project.id, ubicacion: "casos" })} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    Leer caso completo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* Cuatro proyectos con dos frases cada uno no sostienen una página de
            portafolio, ni para quien la lee ni para posicionarla. Esto explica
            qué se puede leer en ellos y qué no, que es más honesto que inflar
            la lista con trabajos que no existen. */}
        <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="leer-titulo">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <span className="eyebrow">Cómo leer esto</span>
              <h2 id="leer-titulo" className="section-title mt-4">
                Cuatro proyectos reales, no una galería.
              </h2>
            </div>

            <div className="max-w-2xl">
              <article className="border-t border-border py-8 first:border-t-0 first:pt-0">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Son capturas de lo que está publicado</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  No hay maquetas ni conceptos. Cada imagen es el sitio funcionando, tomada de la
                  dirección real, y puedes abrirla y recorrerla tú mismo.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Una maqueta inventada se vería mejor —no tuvo cliente, ni presupuesto, ni un dueño
                  cambiando de opinión a mitad de camino— y por eso mismo no diría nada sobre cómo
                  trabajamos.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Están contados por el problema, no por el diseño</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Cada caso parte por qué estaba pasando antes: pedidos que se copiaban a mano,
                  reservas que se perdían en mensajes, un catálogo que nadie podía actualizar. Esa es
                  la parte que se parece a tu situación; el color del botón no.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Verás rubros distintos a propósito: repuestos, barbería, servicios profesionales y
                  software de gestión. Lo que se repite entre ellos es el método, no la industria.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Lo que no vas a encontrar</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Porcentajes de aumento de ventas ni cifras de tráfico. No porque los proyectos no
                  hayan servido, sino porque atribuir una venta a un sitio web exige medición previa
                  que en la mayoría de estos casos no existía, y publicar un número que no podemos
                  sostener sería inventarlo.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Tampoco hay testimonios todavía. Cuando los haya, van a ser de estos mismos
                  clientes y con nombre.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Si tu rubro no está acá</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  No significa que no se pueda. Las preguntas que hay que resolver —qué vendes, cómo
                  te contactan, qué pasa después— son las mismas en casi todos los negocios, y el
                  trabajo cambia menos de lo que parece entre un taller y una consultora.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Los precios de cada servicio están publicados en{" "}
                  <Link to="/precios" className="font-semibold text-primary hover:underline">la página de precios</Link>,
                  así que puedes estimar tu caso antes de escribir.
                </p>
              </article>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
    </PageShell>
  );
}
