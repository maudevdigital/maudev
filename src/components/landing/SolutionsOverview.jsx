import { ArrowRight, LifeBuoy, MonitorSmartphone, Search, Smartphone, Timer, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { trackAction } from "@/lib/MetaPixelTracker";
import { priceIn } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";

// Los tres síntomas que traen a la gente acá. Vivían en una sección propia
// justo antes de esta, diciendo prácticamente lo mismo: primero el problema y
// acto seguido la solución. Fundidos, el visitante lee el diagnóstico y el
// remedio en una sola pantalla en vez de dos.
const sintomas = [
  { icon: Search, title: "No te encuentran", text: "Te buscan por tu rubro y aparece la competencia, no tú." },
  { icon: Smartphone, title: "Se ve mal en el celular", text: "Ahí llega la mayoría, y ahí es donde se pierde el contacto." },
  { icon: Timer, title: "Carga lento", text: "Tres segundos de espera bastan para que vuelvan atrás." },
];

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
          <h2 id="soluciones-title" className="section-title mt-4">Primero el sitio. Después, que trabaje solo.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            La mayoría te busca antes de escribirte. Si lo que encuentran no carga, no se entiende o no dice a qué te dedicas, no te escriben: se van, y nunca te enteras de que estuvieron ahí.
          </p>
        </div>

        <ul className="mb-12 grid gap-3 sm:grid-cols-3">
          {sintomas.map(({ icon: Icon, title, text }) => (
            <li key={title} className="panel flex items-start gap-4 p-5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block text-sm font-bold">{title}</strong>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="grid gap-3">
          {solutions.map(({ number, icon: Icon, title, description, examples, priceKey, href, link }) => (
            <article key={title} className="solution-row panel panel-pad group">
              <div className="flex items-center gap-3 lg:block">
                <span className="font-mono text-xs font-semibold text-primary">{number}</span>
                <Icon className="h-5 w-5 text-primary lg:mt-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{description}</p>
                {priceKey && (
                  <p className="mt-4 font-mono text-sm font-semibold text-foreground">
                    desde {priceIn(priceKey, moneda)}
                  </p>
                )}
              </div>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {examples.map((example) => (
                  <li key={example} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {example}
                  </li>
                ))}
              </ul>
              <Link
                to={href}
                onClick={() => trackAction("solucion_click", { solucion: title })}
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
