import { ArrowRight, LifeBuoy, MonitorSmartphone, Workflow } from "lucide-react";
import Capabilities from "@/components/landing/Capabilities";
import { Link } from "react-router-dom";
import { trackAction } from "@/lib/MetaPixelTracker";
import { IVA_NOTA, priceIn } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";

// El orden es la estrategia: primero la web, que es lo que se vende; después lo
// que la sostiene en el tiempo, y al final lo que la conecta con la operación.
// El precio "desde" va en la primera y la segunda porque son compras que el
// visitante ya está comparando; la automatización se cotiza por proceso.
const solutions = [
  {
    number: "01",
    icon: MonitorSmartphone,
    title: "Tu sitio web",
    description: "La página que explica a qué te dedicas, muestra tu trabajo y convierte al que llega en una consulta concreta.",
    examples: ["Landing pages", "Sitios corporativos", "Tiendas online", "Sistemas de reserva"],
    priceKey: "landing",
    href: "/desarrollo-web",
    link: "Ver desarrollo web",
  },
  {
    number: "02",
    icon: LifeBuoy,
    title: "Que siga funcionando",
    description: "Respaldos, actualizaciones y los cambios chicos de cada mes, para que el sitio no se degrade sin que nadie mire.",
    examples: ["Respaldos", "Seguridad", "Monitoreo", "Cambios de contenido"],
    priceKey: "mantencion",
    href: "/mantencion",
    link: "Ver plan de mantención",
  },
  {
    number: "03",
    icon: Workflow,
    title: "Conectado a tu operación",
    description: "Cuando el sitio ya trae consultas, automatizamos lo que viene después: responder, agendar, cobrar y hacer seguimiento.",
    examples: ["WhatsApp", "Reservas", "Pagos", "Facturación"],
    priceKey: null,
    href: "/automatizacion",
    link: "Ver automatización",
  },
];

export default function SolutionsOverview() {
  const moneda = useCurrency();

  return (
    <section id="soluciones" className="section-pad scroll-mt-20" aria-labelledby="soluciones-title">
      <div className="site-container">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="eyebrow">Qué hacemos</span>
          <h2 id="soluciones-title" className="section-title mt-4">Lo que necesitas, en el momento que lo necesitas.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Crea tu presencia en línea, mantén tu sitio al día o conecta las tareas de tu negocio.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, title, description, examples, priceKey, href, link }) => (
            <article key={title} className="service-card panel group">
              <span className="service-card-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div className="mt-6">
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{description}</p>
                {priceKey && (
                  <p className="mt-4 font-mono text-sm font-semibold text-foreground">
                    desde {priceIn(priceKey, moneda)}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">{IVA_NOTA}</span>
                  </p>
                )}
              </div>
              <details className="plan-details my-4">
                <summary>Ver qué podemos incluir</summary>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {examples.map((example) => (
                  <li key={example} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {example}
                  </li>
                ))}
              </ul>
              </details>
              <Link
                to={href}
                onClick={() => trackAction("solucion_click", { solucion: title })}
                className="service-card-link"
              >
                {link} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
        <details className="service-extras">
          <summary>
            También hacemos software, apps y diseño de marca
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          </summary>
          <Capabilities />
        </details>
      </div>
    </section>
  );
}
