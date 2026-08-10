import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/landing/PageShell";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import { catalog } from "@/data/catalog";
import { nivelesLabel, subservicios } from "@/data/subservices";
import { formatFrom } from "@/data/currencies";
import { IVA_NOTA } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";
import { useSeo } from "@/lib/useSeo";

// ─────────────────────────────────────────────────────────────────────────────
// Precios: los diecinueve servicios con sus tres niveles, en una sola pantalla.
//
// La versión anterior de esta página era tres planes escritos a mano, en
// dólares, heredados de la etapa en que el negocio se contaba desde la
// automatización. Estaba en noindex —o sea, no aportaba nada al
// posicionamiento— y era una cuarta lista de precios conviviendo con las tres
// que sí se derivan del catálogo: exactamente la forma en que aparecieron los
// números contradictorios que hubo que corregir antes.
//
// Se reconstruye en vez de eliminarse porque la URL vale: "cuánto cuesta una
// página web en Chile" es de las búsquedas más frecuentes del rubro, y publicar
// la tabla completa es el argumento central del negocio. Lo que se elimina es
// la lista escrita a mano.
//
// Todo sale de subservices.js y el orden es el mismo del menú, así que un
// servicio nuevo aparece acá sin tocar este archivo.
// ─────────────────────────────────────────────────────────────────────────────

const porRuta = new Map(subservicios.map((servicio) => [servicio.path, servicio]));

const familiasConPrecio = catalog.map((familia) => ({
  id: familia.id,
  label: familia.label,
  servicios: familia.items.map((item) => porRuta.get(item.href)).filter(Boolean),
}));

const condiciones = [
  {
    titulo: "50% y 50%",
    texto: "Anticipo al empezar y el saldo contra la entrega aprobada. Sin cobros intermedios.",
  },
  {
    titulo: "Precio cerrado",
    texto: "Se fija por escrito antes de empezar y no cambia durante el proyecto, aunque nos demoremos más de lo previsto.",
  },
  {
    titulo: "Los accesos son tuyos",
    texto: "Dominio, hosting, repositorio y cuentas quedan a tu nombre desde el primer día.",
  },
];

export default function Precios() {
  const moneda = useCurrency();

  useSeo({
    title: "Precios de páginas web, software y diseño en Chile · Maudev",
    description:
      "Los precios de los diecinueve servicios, publicados. Página web desde $290.000, tienda online, apps, sistemas y marca, cada uno en tres alcances. Valores netos, precio cerrado por escrito.",
    path: "/precios",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
        { "@type": "ListItem", position: 2, name: "Precios", item: "https://maudev.cl/precios" },
      ],
    },
  });

  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden pb-14 pt-30 sm:pt-36">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="site-container relative">
            <Breadcrumbs items={[{ label: "Precios" }]} />
            <span className="eyebrow mt-4 block">Precios</span>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Lo que cuesta cada cosa, publicado.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Casi nadie en el rubro publica precios, y esa es justamente la razón por la que pedir
              tres cotizaciones toma dos semanas. Acá está la tabla completa: los diecinueve
              servicios, cada uno en tres alcances.
            </p>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              Son valores netos, el piso de un alcance típico. El precio exacto se fija por escrito
              después de revisar qué necesitas, antes de que pagues nada, y de ahí no se mueve.
            </p>
          </div>
        </section>

        {/* Las cuatro familias van en una sola sección con separación propia:
            como cuatro secciones independientes, el aire entre ellas era tanto
            que la tabla dejaba de leerse como una tabla. */}
        <div className="section-pad border-t border-border pt-14">
          {familiasConPrecio.map((familia) => (
            <section
              key={familia.id}
              className="mt-16 first:mt-0"
              aria-labelledby={`precios-${familia.id}`}
            >
            <div className="site-container">
              <h2
                id={`precios-${familia.id}`}
                className="font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
              >
                {familia.label}
              </h2>

              {/* Encabezado de niveles: solo desde sm, donde las cuatro columnas
                  caben. En móvil cada precio lleva su propia etiqueta, que es
                  más largo de leer pero no obliga a desplazar la tabla. */}
              <div className="mt-8 hidden grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] gap-4 border-b border-border pb-3 sm:grid">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Servicio
                </span>
                {nivelesLabel.map((nivel) => (
                  <span
                    key={nivel}
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"
                  >
                    {nivel}
                  </span>
                ))}
              </div>

              <ul className="mt-4 sm:mt-0">
                {familia.servicios.map((servicio) => (
                  <li
                    key={servicio.id}
                    className="grid gap-3 border-b border-border py-5 sm:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0">
                      <Link
                        to={servicio.path}
                        className="group inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {servicio.nombre}
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Link>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">
                        {servicio.resumen}
                      </p>
                    </div>

                    {servicio.precios.map((precio, i) => (
                      <div key={nivelesLabel[i]} className="flex items-baseline gap-2 sm:block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary sm:hidden">
                          {nivelesLabel[i]}
                        </span>
                        {precio === null ? (
                          <span className="text-sm text-muted-foreground/70">No aplica</span>
                        ) : (
                          <span className="font-display font-bold tracking-[-0.02em]">
                            {formatFrom(precio, moneda)}
                          </span>
                        )}
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
            </section>
          ))}
        </div>

        <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="condiciones-titulo">
          <div className="site-container">
            <span className="eyebrow">Cómo se paga</span>
            <h2 id="condiciones-titulo" className="section-title mt-4">
              Las condiciones, también por adelantado.
            </h2>

            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              {condiciones.map(({ titulo, texto }) => (
                <div key={titulo} className="panel panel-hover p-6">
                  <dt className="font-display text-lg font-bold tracking-[-0.02em]">{titulo}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Todos los montos son netos: se suma {IVA_NOTA.replace("+ ", "")}. Los precios están en
              pesos chilenos y la conversión a otra moneda es referencial, con el tipo de cambio del
              día. Lo recurrente —dominio, alojamiento y servicios de terceros— se paga directo al
              proveedor y se transparenta en la propuesta.
            </p>
          </div>
        </section>

        <FinalCta />
      </main>
    </PageShell>
  );
}
