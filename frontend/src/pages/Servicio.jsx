import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import Planes from "@/components/landing/Planes";
import { capacidades, clp } from "@shared/oferta";
import { paginasServicio } from "@/data/paginas-servicio";
import { useSeo } from "@/lib/useSeo";
import { trackAction } from "@/lib/MetaPixelTracker";

// Plantilla única de servicio: IA, Desarrollo y Soporte. Precios, planes y fases
// salen de shared/oferta.js; los textos, de data/paginas-servicio.js.
// Un servicio con planes muestra las tarjetas; uno sin planes (Desarrollo)
// muestra ejemplos con precio "desde".
export default function Servicio({ id }) {
  const oferta = capacidades[id];
  const texto = paginasServicio[id];
  const conPlanes = !oferta.ejemplos;
  const fases = oferta.planes.at(-1).fases;

  useSeo({
    ...oferta.seo,
    path: oferta.path,
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: oferta.nombre,
          description: texto.intro,
          provider: { "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
          areaServed: { "@type": "Country", name: "Chile" },
          url: `https://maudev.cl${oferta.path}`,
        },
        {
          "@type": "FAQPage",
          mainEntity: texto.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    },
  });

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: oferta.navLabel }]} />
            <span className="eyebrow">{texto.eyebrow}</span>
            <h1 className="mt-5 max-w-[18ch] text-5xl font-extrabold leading-[0.99] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{texto.titulo}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{texto.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#precios" className="btn btn-primary h-14 px-8 text-base">Ver precios</a>
              <Link to="/contacto" onClick={() => trackAction("cta_principal_click", { ubicacion: `hero-${id}` })} className="btn btn-ghost h-14 px-8 text-base">Conversemos</Link>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container">
            <span className="eyebrow">Qué resuelve</span>
            <h2 className="section-title mt-4">{texto.usosTitulo}</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {texto.usos.map((u) => (
                <article key={u.titulo} className="border-t border-border pt-5">
                  <h3 className="text-lg font-bold">{u.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{u.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="precios" className="section-pad scroll-mt-24">
          <div className="site-container">
            <span className="eyebrow">Precios</span>
            <h2 className="section-title mt-4">{conPlanes ? texto.planesTitulo : texto.ejemplosTitulo}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{conPlanes ? texto.planesNota : texto.ejemplosNota}</p>
            {conPlanes ? (
              <Planes planes={oferta.planes} />
            ) : (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {oferta.ejemplos.map((e) => (
                  <article key={e.nombre} className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <h3 className="text-2xl font-extrabold tracking-tight">{e.nombre}</h3>
                    <p className="cifra mt-3 text-xl font-bold text-primary">Desde {clp(e.desde)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.texto}</p>
                  </article>
                ))}
              </div>
            )}
            {!conPlanes && (
              <Link
                to={`/contacto?plan=${oferta.planes[0].id}`}
                onClick={() => trackAction("cta_principal_click", { ubicacion: `precios-${id}` })}
                className="btn btn-primary mt-10 h-12 px-6 text-sm"
              >
                Cotizar mi proyecto <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="eyebrow">Cómo trabajamos</span>
              <h2 className="section-title mt-4">Etapas que ves avanzar.</h2>
              <p className="mt-5 text-muted-foreground">Son las mismas fases que después sigues en tu portal de clientes.</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {fases.map((fase, i) => (
                <li key={fase} className="flex items-baseline gap-4 border-t border-border pt-4">
                  <span className="cifra font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{fase}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-pad">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="section-title mt-4">{texto.confianza.titulo}</h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">{texto.confianza.texto}</p>
          </div>
        </section>

        <section className="section-pad border-t border-border">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div><span className="eyebrow">Preguntas</span><h2 className="section-title mt-4">Lo que más nos preguntan.</h2></div>
            <div className="border-t border-border">
              {texto.faqs.map((f) => (
                <details key={f.q} className="faq-item group">
                  <summary><span>{f.q}</span></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
    </PageShell>
  );
}
