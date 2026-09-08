import { Navigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Check, Image as ImageIcon, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import FinalCta from "@/components/landing/FinalCta";
import { familias, getSubservicio, nivelesLabel, subservicios } from "@/data/subservices";
import { getProjectById } from "@/data/projects";
import { formatFrom } from "@/data/currencies";
import { IVA_NOTA } from "@/data/pricing";
import { PRECIO_A_CONVENIR, publicaPrecio } from "@/data/from-price";
import { useCurrency } from "@/lib/useCurrency";
import { useSeo } from "@/lib/useSeo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Una página por servicio, generada desde el catálogo.
//
// Antes el footer y el mega-menú ofrecían diecinueve servicios y solo existían
// seis destinos: trece enlaces caían en la página de su familia y el visitante
// aterrizaba en algo que no era lo que pinchó. Además, cada uno de estos
// servicios tiene su propia búsqueda —"cuánto cuesta una landing page",
// "sistema de punto de venta"— y sin página propia no hay nada que posicionar.
//
// Son datos, no diecinueve archivos: el contenido vive en subservices.js y esta
// plantilla lo arma. Agregar un servicio ahí publica su página, su enlace en el
// menú, en el footer y en el sitemap.
export default function SubservicePage() {
  const { slug } = useParams();
  const servicio = getSubservicio(slug);
  const moneda = useCurrency();

  const familia = familias.find((f) => f.id === servicio?.familia);
  const caso = servicio?.caso ? getProjectById(servicio.caso) : null;
  const desde = servicio?.precios.find((p) => p !== null);
  // Sin caso publicado no se muestra cifra: ver publicaPrecio en data/from-price.
  const conPrecio = servicio ? publicaPrecio(servicio.id) : false;
  // El otro extremo de la fusión: si esta página es una variante, su hermano es
  // el servicio del que es nivel; si es el servicio, su hermano es la variante.
  const hermano = servicio
    ? subservicios.find((otro) =>
        servicio.nivelDe ? otro.id === servicio.nivelDe : otro.nivelDe === servicio.id
      )
    : null;

  // useSeo va ANTES del return temprano: un hook detrás de un return se salta
  // en unos renders y no en otros, y React exige el mismo orden siempre.
  useSeo(
    servicio
      ? {
        title: servicio.metaTitle || `${servicio.nombre} en Chile · Precio y qué incluye · Maudev`,
        description:
          servicio.metaDescription ||
          `${servicio.resumen} ${conPrecio ? `Desde ${formatFrom(desde, "CLP")} ${IVA_NOTA}. ` : ""}Precio por escrito antes de empezar y accesos a tu nombre.`,
        path: servicio.path,
        jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: servicio.nombre,
          description: servicio.resumen,
          provider: { "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
          areaServed: { "@type": "Country", name: "Chile" },
          url: `https://maudev.cl${servicio.path}`,
        },
        ...(servicio.faqs?.length
          ? [{
              "@type": "FAQPage",
              mainEntity: servicio.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }]
          : []),
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
            { "@type": "ListItem", position: 2, name: familia.label, item: `https://maudev.cl${familia.pagina}` },
            { "@type": "ListItem", position: 3, name: servicio.nombre, item: `https://maudev.cl${servicio.path}` },
          ],
        },
          ],
        },
      }
      : { noindex: true }
  );

  // Un slug inexistente no puede quedar como página en blanco con estado 200:
  // eso es un soft 404. Se manda a la página de desarrollo web.
  if (!servicio) return <Navigate to="/desarrollo-web" replace />;

  const mensaje = `Hola, vengo de maudev.cl. Quiero cotizar "${servicio.nombre}".`;

  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden pb-16 pt-30 sm:pt-36">
          <div className="site-container relative">
            <Breadcrumbs items={[{ label: familia.label, href: familia.pagina }, { label: servicio.nombre }]} />

            <div className="mt-4 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div>
                <span className="eyebrow">{familia.label}</span>
                <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  {servicio.nombre}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {servicio.intro || servicio.resumen}
                </p>

                {/* Enlace entre un servicio y su variante, en las dos
                    direcciones. Sin esto las variantes quedarían huérfanas: se
                    salieron de la grilla del catálogo, así que ningún enlace
                    interno llegaría a ellas y el buscador las trataría como
                    páginas sueltas por mucho que sigan en el sitemap. */}
                {hermano && (
                  <p className="mt-5 text-sm text-muted-foreground">
                    {servicio.nivelDe ? "Es el nivel de entrada de " : "¿Buscas solo "}
                    <Link to={hermano.path} className="font-semibold text-primary underline underline-offset-2 hover:no-underline">
                      {hermano.nombre}
                    </Link>
                    {servicio.nivelDe ? ", que lo lleva hasta el final." : "? Tiene su propia página."}
                  </p>
                )}

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={getWhatsAppUrl(mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAction("whatsapp_click", { ubicacion: `servicio-${servicio.id}` })}
                    className="btn btn-primary h-14 px-7"
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Cotizar por WhatsApp
                  </a>
                  <Link
                    to="/contacto"
                    className="btn btn-ghost h-14 px-6"
                  >
                    Escribir por el formulario
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Imagen del servicio. Si aún no existe el archivo, el marco
                    muestra el prompt con el que hay que generarla: el hueco
                    queda como tarea a la vista y no como espacio olvidado. */}
                {servicio.imagen ? (
                  <figure className="panel overflow-hidden">
                    <img
                      src={servicio.imagen}
                      alt={`${servicio.nombre}: ${servicio.resumen}`}
                      width="1200"
                      height="800"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover"
                    />
                  </figure>
                ) : (
                  <div className="panel flex aspect-[3/2] flex-col justify-between gap-3 p-5">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Imagen pendiente · prompt
                    </p>
                    <p className="overflow-y-auto text-[11px] leading-relaxed text-muted-foreground">
                      {servicio.prompt}
                    </p>
                  </div>
                )}

              {/* Qué incluye: es lo primero que se pregunta quien ya sabe que
                  quiere este servicio. */}
              <aside className="panel panel-solid p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Qué incluye
                </p>
                <ul className="mt-5 space-y-3">
                  {servicio.incluye.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-5 font-display text-2xl font-bold tracking-[-0.03em]">
                  {conPrecio ? (
                    <>
                      Desde {formatFrom(desde, moneda)}
                      <span className="ml-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {IVA_NOTA}
                      </span>
                    </>
                  ) : (
                    <>
                      {PRECIO_A_CONVENIR}
                      <span className="mt-1 block font-sans text-[11px] font-medium normal-case tracking-normal text-muted-foreground">
                        Se fija por escrito tras el diagnóstico
                      </span>
                    </>
                  )}
                </p>
              </aside>
              </div>
            </div>
          </div>
        </section>

        {/* La escalera de niveles: el mismo servicio cuesta distinto según hasta
            dónde quieras llevarlo, y decirlo acá evita la conversación de
            "¿por qué a mí me cotizaron otro precio?". */}
        <section className="section-pad border-y border-border bg-secondary/40" aria-labelledby="niveles-titulo">
          <div className="site-container">
            <span className="eyebrow">Según hasta dónde lo lleves</span>
            <h2 id="niveles-titulo" className="section-title mt-4">
              El mismo servicio, en tres alcances.
            </h2>

            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              {servicio.precios.map((precio, i) => (
                <div key={nivelesLabel[i]} className="panel panel-hover p-6">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    {nivelesLabel[i]}
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-bold tracking-[-0.03em]">
                    {precio === null ? (
                      <span className="text-base font-semibold text-muted-foreground">
                        No aplica en este nivel
                      </span>
                    ) : !conPrecio ? (
                      <span className="text-base font-semibold text-muted-foreground">
                        {PRECIO_A_CONVENIR}
                      </span>
                    ) : (
                      <>
                        {formatFrom(precio, moneda)}
                        <span className="ml-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {IVA_NOTA}
                        </span>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Los montos son el piso de un alcance típico. El precio final se fija por escrito después de revisar qué necesitas y no cambia durante el proyecto.
            </p>

            <Link
              to={familia.pagina}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Ver todo lo de {familia.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {servicio.secciones?.length > 0 && (
          <section className="section-pad" aria-labelledby="detalle-titulo">
            <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <span className="eyebrow">En detalle</span>
                <h2 id="detalle-titulo" className="section-title mt-4">
                  Lo que conviene saber antes de encargarla.
                </h2>
              </div>
              <div className="max-w-2xl">
                {servicio.secciones.map(({ titulo, parrafos }) => (
                  <article key={titulo} className="border-t border-border py-8 first:border-t-0 first:pt-0">
                    <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{titulo}</h3>
                    {parrafos.map((texto) => (
                      <p key={texto.slice(0, 40)} className="mt-4 leading-relaxed text-muted-foreground">
                        {texto}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Captura de un proyecto REAL, no una maqueta. El plano de arriba
            explica qué recibes; esto muestra cómo se ve publicado. Una maqueta
            inventada se vería mejor —no tuvo cliente ni presupuesto— y por eso
            mismo le restaría valor a los cuatro proyectos que sí existen. */}
        {/* Con qué está construido. Cada herramienta va con su para qué: una
            lista de nombres sueltos la copia cualquiera, y no le sirve al
            cliente que está comparando dos cotizaciones y no sabe qué
            preguntar. */}
        {servicio.tecnologias?.length > 0 && (
          <section className="section-pad" aria-labelledby="stack-titulo">
            <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <span className="eyebrow">Tecnologías</span>
                <h2 id="stack-titulo" className="section-title mt-4">
                  Con qué está construido.
                </h2>
                <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
                  Sin constructores ni plantillas: cada pieza está elegida por lo que resuelve, y queda documentada para que otro desarrollador pueda continuar el proyecto.
                </p>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                {servicio.tecnologias.map(({ nombre, para }) => (
                  <div key={nombre} className="panel panel-hover p-5">
                    <dt className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {nombre}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{para}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {caso && (
          <section className="section-pad border-t border-border" aria-labelledby="caso-titulo">
            <div className="site-container">
              <span className="eyebrow">Así se ve publicado</span>
              <h2 id="caso-titulo" className="section-title mt-4">
                Un {servicio.nombre.toLowerCase()} que ya está funcionando.
              </h2>

              <figure className="panel mt-10 overflow-hidden">
                <img
                  src={caso.image}
                  alt={`Sitio de ${caso.title}, ${caso.industry}`}
                  width="1280"
                  height="2560"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
                <figcaption className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm">
                    <strong className="font-semibold text-foreground">{caso.title}</strong>
                    <span className="text-muted-foreground"> · {caso.industry}</span>
                  </span>
                  <Link
                    to={`/casos/${caso.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                  >
                    Ver el caso completo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </figcaption>
              </figure>
            </div>
          </section>
        )}

        {servicio.faqs?.length > 0 && (
          <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="faq-titulo">
            <div className="site-container">
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2 id="faq-titulo" className="section-title mt-4">
                Lo que preguntan antes de decidir.
              </h2>
              <div className="mt-10 max-w-3xl">
                {servicio.faqs.map(({ q, a }) => (
                  <details key={q} className="faq-item">
                    <summary>{q}</summary>
                    <p className="pb-6 leading-relaxed text-muted-foreground">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <FinalCta />
      </main>
    </PageShell>
  );
}
