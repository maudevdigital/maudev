import { BadgeCheck, Code2, MessagesSquare } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { founder } from "@/data/site";
import { useSeo } from "@/lib/useSeo";

const principles = [
  { icon: MessagesSquare, title: "Hablar claro", text: "Explicamos decisiones, límites y costos sin pedirte que aprendas jerga técnica." },
  { icon: Code2, title: "Construir para operar", text: "Priorizamos sitios rápidos, accesibles y fáciles de mantener en el tiempo." },
  { icon: BadgeCheck, title: "Prometer lo comprobable", text: "No usamos cifras, plazos ni resultados que el proyecto no pueda respaldar." },
];

export default function About() {
  useSeo({
    title: "Sobre Maudev · Desarrollo web en Chile con trato directo · Maudev",
    description: "Cómo trabaja Maudev: desarrollo web con comunicación directa, precio cerrado por escrito y los accesos siempre a tu nombre.",
    path: "/nosotros",
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
        { "@type": "ListItem", position: 2, name: "Nosotros", item: "https://maudev.cl/nosotros" },
      ],
    },
  });

  return (
    <PageShell>
      <main>
        <section className="pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Nosotros" }]} />
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <div>
                <span className="eyebrow">Sobre Maudev</span>
                <h1 className="mt-5 max-w-[13ch] text-5xl font-extrabold leading-[0.99] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Tecnología entendible, desde la primera conversación.</h1>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Maudev es una empresa chilena enfocada en automatización y software para equipos que necesitan resolver tareas concretas, sin sumar complejidad innecesaria.
                </p>
                <div className="mt-8 border-l border-primary pl-5">
                  <p className="font-bold text-foreground">{founder.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{founder.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div><span className="eyebrow">Cómo pensamos</span><h2 className="section-title mt-4">Un buen sistema deja menos dudas que antes.</h2></div>
            <div className="grid gap-8 sm:grid-cols-3">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title} className="border-t border-border pt-5">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="site-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="eyebrow">Trabajo directo</span>
              <h2 className="section-title mt-4">La persona que diagnostica también entiende la implementación.</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>Eso reduce traspasos, mensajes contradictorios y decisiones perdidas entre áreas. Cuando el proyecto necesita especialistas adicionales, el alcance lo deja claro.</p>
              <p>El objetivo no es que dependas permanentemente de Maudev, sino que recibas una solución documentada y bajo tu control.</p>
            </div>
          </div>
        </section>
        {/* La página prometía "hablas conmigo" y no explicaba qué significa eso
            en la práctica. Estas cuatro secciones responden lo que un cliente
            necesita saber de un proveedor chico antes de confiarle un proyecto,
            que es exactamente la desventaja que hay que despejar frente a una
            agencia grande. */}
        <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="como-titulo">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <span className="eyebrow">Cómo trabajamos</span>
              <h2 id="como-titulo" className="section-title mt-4">
                Lo que puedes esperar, dicho antes.
              </h2>
            </div>

            <div className="max-w-2xl">
              <article className="border-t border-border py-8 first:border-t-0 first:pt-0">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">El precio se cierra por escrito y no se mueve</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Se fija después de revisar qué necesitas y antes de que pagues nada. Si el proyecto
                  toma más tiempo del previsto, ese riesgo es nuestro, no tuyo. Lo que sí se cotiza
                  aparte es lo que pidas después y no estaba en el alcance, y se dice en el momento.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Se paga la mitad al empezar y la mitad contra la entrega aprobada. Sin cobros
                  intermedios ni mensualidades por usar lo que ya te entregamos.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Los accesos quedan a tu nombre desde el primer día</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Dominio, alojamiento, repositorio y cuentas de terceros se crean con tu correo y tu
                  tarjeta, no con los nuestros. Suena a detalle administrativo y es lo que decide si
                  mañana puedes cambiar de proveedor sin pedirle permiso a nadie.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  El código es tuyo y se entrega documentado, para que otro desarrollador pueda
                  continuarlo. No trabajamos con sitios que solo funcionan mientras nos sigas pagando.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Te vamos a decir cuándo no nos necesitas</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Hay casos que se resuelven mejor con una herramienta de mercado que cuesta una
                  fracción, y lo decimos aunque signifique no vender. Es la razón por la que varias
                  páginas de este sitio explican en qué situación conviene no contratar ese servicio.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Tampoco prometemos porcentajes de conversión ni plazos que no podamos sostener. Si
                  no se puede comprobar, no aparece escrito en ninguna parte de este sitio.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Somos chicos, y eso tiene las dos caras</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A favor: hablas directo con quien construye, sin ejecutivo de cuentas ni teléfono
                  descompuesto entre lo que pediste y lo que se programó. Las decisiones se toman en
                  la misma conversación.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  En contra: no tomamos diez proyectos a la vez ni sostenemos un equipo de turnos.
                  Cuando un proyecto necesita especialistas adicionales, el alcance lo dice desde el
                  principio en vez de descubrirse a mitad de camino.
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
