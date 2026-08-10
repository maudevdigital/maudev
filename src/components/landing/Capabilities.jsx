import { ArrowRight, Code2, Palette, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { trackAction } from "@/lib/MetaPixelTracker";

// Capacidades: con qué está construido lo que entregamos.
//
// Va bajo el portafolio a propósito. El visitante acaba de ver cuatro sitios
// funcionando; esta sección responde la pregunta que sigue —"¿y con qué lo
// hacen?"— sin obligarlo a entrar a una página de servicio.
//
// El remate de cada tarjeta es un compromiso verificable y no una métrica: los
// "Lighthouse 95+ garantizado" o "escala a 100K usuarios" que se estilan en el
// rubro son números que nadie audita y que, si un cliente los mide y no dan,
// cuestan la relación completa. Lo que sí se puede afirmar es cómo se trabaja y
// qué queda en manos de quien paga.
const capacidades = [
  {
    id: "web",
    icono: Globe,
    titulo: "Sitios web",
    resumen: "Sitios corporativos y landings programados a mano, sin plantillas ni constructores.",
    stack: ["React", "Vite", "Tailwind", "Cloudflare"],
    remate: "El código y los accesos quedan a tu nombre",
    href: "/desarrollo-web",
  },
  {
    id: "software",
    icono: Code2,
    titulo: "Software a medida",
    resumen: "Sistemas que se arman alrededor de tu operación, no al revés.",
    stack: ["Node.js", "PostgreSQL", "n8n", "Cloudflare Workers"],
    remate: "Sin licencias mensuales atadas a un proveedor",
    href: "/software-a-medida",
  },
  {
    id: "apps",
    icono: Smartphone,
    titulo: "Apps móviles",
    resumen: "Android y iPhone desde un solo desarrollo, o nativas cuando el caso lo pide.",
    stack: ["React Native", "Expo", "PWA"],
    remate: "Publicada con tu propia cuenta de desarrollador",
    href: "/software-a-medida",
  },
  {
    id: "diseno",
    icono: Palette,
    titulo: "Diseño e identidad",
    resumen: "Marca, interfaz y sistema visual, pensados para que tu equipo los pueda usar solo.",
    stack: ["Figma", "SVG", "Design tokens"],
    remate: "Archivos editables entregados, no solo imágenes",
    href: "/contacto",
  },
];

export default function Capabilities() {
  return (
    <section className="section-pad border-y border-border bg-secondary/40" aria-labelledby="capacidades-titulo">
      <div className="site-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <span className="eyebrow">Capacidades</span>
          <h2 id="capacidades-titulo" className="section-title mt-4">
            Construido a mano, no armado con plantillas.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Cada proyecto se diseña, se programa y se mantiene acá mismo. Sin subcontratar, sin gestores de contenido pesados y sin dejarte amarrado a una herramienta que no controlas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {capacidades.map(({ id, icono: Icono, titulo, resumen, stack, remate, href }) => (
            <article key={id} className="panel flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-primary">
                  <Icono className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold tracking-[-0.02em]">{titulo}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{resumen}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {stack.map((tec) => (
                  <li
                    key={tec}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {tec}
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {remate}
              </p>

              <Link
                to={href}
                onClick={() => trackAction("capacidad_click", { capacidad: id })}
                className="group mt-auto inline-flex items-center gap-1.5 border-t border-border pt-4 text-xs font-bold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ver página completa
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
