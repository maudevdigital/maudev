import { ArrowRight, Code2, Palette, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { trackAction } from "@/lib/MetaPixelTracker";

// Catálogo ampliado disponible desde el desplegable de servicios.
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
    href: "/apps-moviles",
  },
  {
    id: "diseno",
    icono: Palette,
    titulo: "Diseño e identidad",
    resumen: "Marca, interfaz y sistema visual, pensados para que tu equipo los pueda usar solo.",
    stack: ["Figma", "SVG", "Design tokens"],
    remate: "Archivos editables entregados, no solo imágenes",
    href: "/diseno",
  },
];

export default function Capabilities() {
  return (
    <section className="py-6" aria-labelledby="capacidades-titulo">
      <div className="grid gap-8">
        <div>
          <h2 id="capacidades-titulo" className="text-xl font-semibold">
            Más posibilidades para tu proyecto.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Diseñamos y desarrollamos cada proyecto según lo que tu equipo necesita.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capacidades.map(({ id, icono: Icono, titulo, resumen, stack, remate, href }) => (
            <article key={id} className="panel flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-primary">
                  <Icono className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold tracking-[-0.02em]">{titulo}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{resumen}</p>

              <details className="plan-details mt-4">
                <summary>Herramientas que usamos</summary>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {stack.map((tec) => (
                  <li
                    key={tec}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {tec}
                  </li>
                ))}
              </ul>
              </details>

              <p className="my-4 flex items-start gap-2 text-xs font-semibold leading-relaxed">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {remate}
              </p>

              <Link
                to={href}
                onClick={() => trackAction("capacidad_click", { capacidad: id })}
                className="group mt-auto inline-flex items-center gap-1.5 border-t border-border pt-4 text-xs font-bold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
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
