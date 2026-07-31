import { ArrowRight, Blocks, BriefcaseBusiness, MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { trackAction } from "@/lib/MetaPixelTracker";

const solutions = [
  {
    number: "01",
    icon: MessagesSquare,
    title: "Atiende y vende",
    description: "Responde, agenda, cobra y hace seguimiento sin convertir cada contacto en una tarea manual.",
    examples: ["WhatsApp", "Reservas", "Pagos", "Ecommerce"],
    href: "/automatizacion",
    link: "Explorar automatización",
  },
  {
    number: "02",
    icon: BriefcaseBusiness,
    title: "Ordena tu operación",
    description: "Conecta inventario, documentos, pedidos y facturación para trabajar con una sola fuente de información.",
    examples: ["Inventario", "Facturación", "Pedidos", "Procesos internos"],
    href: "/software-a-medida",
    link: "Ver software a medida",
  },
  {
    number: "03",
    icon: Blocks,
    title: "Construye tu plataforma",
    description: "Convierte una idea o proceso propio en una herramienta web clara, administrable y lista para operar.",
    examples: ["Portales", "Dashboards", "Sistemas internos", "Sitios web"],
    href: "/desarrollo-web",
    link: "Revisar plataformas web",
  },
];

export default function SolutionsOverview() {
  return (
    <section id="soluciones" className="section-pad scroll-mt-20" aria-labelledby="soluciones-title">
      <div className="site-container">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="eyebrow">Tres formas de destrabar el trabajo</span>
          <h2 id="soluciones-title" className="section-title mt-4">Partimos por el proceso, no por la tecnología.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Definimos qué conviene automatizar, qué necesita software propio y qué puede resolverse con una web bien construida.
          </p>
        </div>

        <div className="border-t border-border">
          {solutions.map(({ number, icon: Icon, title, description, examples, href, link }) => (
            <article key={title} className="solution-row group">
              <div className="flex items-center gap-3 lg:block">
                <span className="font-mono text-xs font-semibold text-primary">{number}</span>
                <Icon className="h-5 w-5 text-primary lg:mt-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{description}</p>
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
