import { ArrowRight, Check, PlugZap } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import CtaButton from "@/components/landing/CtaButton";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { getProjectById } from "@/data/projects";
import { getService } from "@/data/services";
import { subservicios } from "@/data/subservices";
import { formatFrom } from "@/data/currencies";
import { IVA_NOTA } from "@/data/pricing";
import { PRECIO_A_CONVENIR, publicaPrecio } from "@/data/from-price";
import { useCurrency } from "@/lib/useCurrency";
import { useSeo } from "@/lib/useSeo";
import { trackAction } from "@/lib/MetaPixelTracker";

export default function ServicePage({ serviceKey }) {
  const service = getService(serviceKey);
  const project = getProjectById(service.relatedCase);
  const moneda = useCurrency();

  // El orden lo manda la página, no el catálogo: cada familia decide con qué
  // servicio conviene que el visitante empiece a mirar.
  const agrupados = (service.subservicios || [])
    .map((id) => subservicios.find((sub) => sub.id === id))
    .filter((sub) => !sub?.nivelDe)
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.navLabel,
        description: service.intro,
        provider: { "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
        areaServed: { "@type": "Country", name: "Chile" },
        url: `https://maudev.cl${service.path}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
          { "@type": "ListItem", position: 2, name: service.navLabel, item: `https://maudev.cl${service.path}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  useSeo({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
    image: "/og-image.png",
    jsonLd,
  });

  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container relative">
            <Breadcrumbs items={[{ label: service.navLabel }]} />
            <div className="grid items-end gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
              <div>
                <span className="eyebrow">{service.eyebrow}</span>
                <h1 className="display-title mt-5">{service.title}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{service.intro}</p>
                <div className="mt-9"><CtaButton size="lg" context={`servicio-${serviceKey}`} /></div>
              </div>
              <aside className="rounded-2xl bg-ink p-6 text-white sm:p-8" aria-label="Señales de que este servicio puede ayudarte">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Puede servirte si</p>
                <ul className="mt-6 space-y-4">
                  {service.signals.map((signal) => (
                    <li key={signal} className="flex gap-3 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/72">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> {signal}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="eyebrow">El problema</span>
              <h2 className="section-title mt-4">{service.problemTitle}</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{service.problem}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Para quién sirve</p>
              <ul className="mt-5 border-t border-border">
                {service.audience.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-b border-border py-4 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="site-container">
            <span className="eyebrow">Ejemplos concretos</span>
            <h2 className="section-title mt-4">Qué podemos construir.</h2>
            <div className="mt-12 grid border-t border-border md:grid-cols-2">
              {service.examples.map((example, index) => (
                <article key={example.title} className={`border-b border-border py-7 md:p-8 ${index % 2 ? "md:border-l" : "md:pl-0"}`}>
                  <span className="font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em]">{example.title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{example.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad bg-ink text-white">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="eyebrow eyebrow-on-dark">Implementación</span>
              <h2 className="section-title mt-4 text-white">De la idea a un proceso operando.</h2>
            </div>
            <ol className="border-t border-white/12">
              {service.implementation.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/12 py-5">
                  <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-white/82">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-pad border-b border-border">
          <div className="site-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <PlugZap className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em]">Integraciones posibles</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Se confirman según los accesos y capacidades técnicas de cada proveedor.</p>
            </div>
            <ul className="flex flex-wrap content-start gap-3">
              {service.integrations.map((item) => <li key={item} className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold">{item}</li>)}
            </ul>
          </div>
        </section>

        {/* Los servicios de la familia, con su precio de entrada.
            Esta página es la que la miga de pan promete como categoría, y hasta
            ahora no enlazaba ninguno de los servicios que agrupa: el visitante
            llegaba a la categoría y quedaba sin salida hacia lo concreto, y las
            diecinueve páginas de servicio recibían enlaces solo desde el menú y
            el pie. Sale de subservices.js, así que no puede quedar desfasado. */}
        {agrupados.length > 0 && (
          <section className="section-pad border-t border-border" aria-labelledby="familia-titulo">
            <div className="site-container">
              <span className="eyebrow">Lo que incluye esta categoría</span>
              <h2 id="familia-titulo" className="section-title mt-4">
                Elige por dónde empezar.
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                Cada uno tiene su página con el detalle, lo que incluye y sus tres alcances. Los
                montos son netos y son el piso de un alcance típico.
              </p>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {agrupados.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      to={sub.path}
                      className="panel panel-hover group flex h-full flex-col p-6 transition-colors"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-display text-lg font-bold tracking-[-0.02em]">
                          {sub.nombre}
                        </span>
                        <ArrowRight
                          className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {sub.resumen}
                      </span>
                      <span className="mt-5 font-mono text-xs font-bold uppercase tracking-wider text-primary">
                        {publicaPrecio(sub.id) ? (
                          <>
                            Desde {formatFrom(sub.precios.find((precio) => precio !== null), moneda)}
                            <span className="ml-1.5 font-sans font-medium text-muted-foreground">
                              {IVA_NOTA}
                            </span>
                          </>
                        ) : (
                          PRECIO_A_CONVENIR
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {project && (
          <section className="section-pad">
            <div className="site-container">
              <span className="eyebrow">Caso relacionado</span>
              <article className="case-feature mt-8">
                <div className="case-media">
                  <img src={project.image} alt={`Vista del proyecto ${project.title}`} width="1280" height="2560" loading="lazy" className="h-full w-full object-cover object-top" />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{project.industry}</p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">{project.title}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{project.tagline}</p>
                  <Link to={`/casos/${project.id}`} onClick={() => trackAction("caso_exito_click", { proyecto: project.id, ubicacion: serviceKey })} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    Leer caso completo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </section>
        )}

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
            <div><span className="eyebrow">Preguntas frecuentes</span><h2 className="section-title mt-4">Antes de decidir.</h2></div>
            <div className="border-t border-border">
              {service.faqs.map((faq, index) => (
                <details key={faq.q} className="faq-item group" open={index === 0}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
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
