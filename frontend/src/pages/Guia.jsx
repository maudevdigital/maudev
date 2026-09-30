import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import PageNotFound from "@/lib/PageNotFound";
import { founder } from "@/data/site";
import { useSeo } from "@/lib/useSeo";
import guias from "@/data/guias.json";

// /guias/:slug. El contenido viene del panel admin (Markdown → HTML en el build,
// ver scripts/descargar-guias.mjs), así que llega completo en el HTML estático.
const fechaLarga = (iso) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }) : "";

export default function Guia() {
  const { slug } = useParams();
  const guia = guias.find((g) => g.slug === slug);
  const otras = guias.filter((g) => g.slug !== slug && g.categoria === guia?.categoria).slice(0, 3);
  const url = `https://maudev.cl/guias/${slug}`;

  useSeo({
    title: guia ? `${guia.titulo} · Maudev` : "Guía no encontrada · Maudev",
    description: guia?.descripcion,
    path: `/guias/${slug}`,
    type: "article",
    image: "/og-image.png",
    noindex: !guia,
    jsonLd: guia && {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: guia.titulo,
          description: guia.descripcion,
          datePublished: guia.publicado_el,
          dateModified: guia.actualizado_el,
          inLanguage: "es-CL",
          mainEntityOfPage: url,
          author: { "@type": "Person", name: founder.name, jobTitle: founder.role },
          publisher: { "@id": "https://maudev.cl/#organizacion", "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
            { "@type": "ListItem", position: 2, name: "Guías", item: "https://maudev.cl/guias" },
            { "@type": "ListItem", position: 3, name: guia.titulo, item: url },
          ],
        },
      ],
    },
  });

  if (!guia) return <PageNotFound />;

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <article className="pb-16 pt-30 sm:pt-36">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Guías", href: "/guias" }, { label: guia.titulo }]} />
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">{guia.titulo}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guia.descripcion}</p>
              <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 border-y border-border py-3 font-mono text-xs text-muted-foreground">
                <span>Actualizado el {fechaLarga(guia.actualizado_el)}</span>
                <span aria-hidden="true">·</span>
                <span>{guia.minutos} min de lectura</span>
                <span aria-hidden="true">·</span>
                <span>Por {founder.name}, {founder.role.split("·")[0].trim()}</span>
              </p>
              {/* HTML generado en el build desde Markdown seguro (src/lib/markdown.js). */}
              <div className="guia-contenido mt-10" dangerouslySetInnerHTML={{ __html: guia.html }} />

              <aside className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
                <p className="text-xl font-extrabold tracking-tight">¿Tu sitio ya cumple?</p>
                <p className="mt-2 text-sm text-muted-foreground">Ocho preguntas, dos minutos. Tus respuestas no se envían ni se guardan.</p>
                <Link to="/ley-21719#autodiagnostico" className="btn btn-primary mt-5 h-11 px-5 text-sm">
                  Hacer el autodiagnóstico <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </aside>

              {otras.length > 0 && (
                <nav aria-label="Otras guías" className="mt-12">
                  <p className="eyebrow">Sigue leyendo</p>
                  <ul className="mt-4 grid gap-3">
                    {otras.map((g) => (
                      <li key={g.slug}>
                        <Link to={`/guias/${g.slug}`} className="panel-hover flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 font-semibold">
                          {g.titulo} <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
