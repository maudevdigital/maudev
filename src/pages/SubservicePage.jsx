import { Navigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import FinalCta from "@/components/landing/FinalCta";
import { familias, getSubservicio, nivelesLabel } from "@/data/subservices";
import { formatFrom } from "@/data/currencies";
import { IVA_NOTA } from "@/data/pricing";
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
  const desde = servicio?.precios.find((p) => p !== null);

  // useSeo va ANTES del return temprano: un hook detrás de un return se salta
  // en unos renders y no en otros, y React exige el mismo orden siempre.
  useSeo(
    servicio
      ? {
        title: `${servicio.nombre} en Chile · Precio y qué incluye · Maudev`,
        description: `${servicio.resumen} Desde ${formatFrom(desde, "CLP")} ${IVA_NOTA}. Precio por escrito antes de empezar y accesos a tu nombre.`,
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
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="site-container relative">
            <Breadcrumbs items={[{ label: familia.label, href: familia.pagina }, { label: servicio.nombre }]} />

            <div className="mt-4 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div>
                <span className="eyebrow">{familia.label}</span>
                <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  {servicio.nombre}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {servicio.resumen}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={getWhatsAppUrl(mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAction("whatsapp_click", { ubicacion: `servicio-${servicio.id}` })}
                    className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Cotizar por WhatsApp
                  </a>
                  <Link
                    to="/contacto"
                    className="inline-flex h-14 items-center justify-center rounded-xl border border-border px-6 font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Escribir por el formulario
                  </Link>
                </div>
              </div>

              {/* Qué incluye, arriba y a la derecha: es lo primero que se
                  pregunta quien ya sabe que quiere este servicio. */}
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
                  Desde {formatFrom(desde, moneda)}
                  <span className="ml-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {IVA_NOTA}
                  </span>
                </p>
              </aside>
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
                <div key={nivelesLabel[i]} className="panel p-6">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    {nivelesLabel[i]}
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-bold tracking-[-0.03em]">
                    {precio === null ? (
                      <span className="text-base font-semibold text-muted-foreground">
                        No aplica en este nivel
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

        <FinalCta />
      </main>
    </PageShell>
  );
}
