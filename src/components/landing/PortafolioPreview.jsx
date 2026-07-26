import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects as allProjects } from "@/data/projects";
import { t, pick } from "@/lib/i18n";
import SitePreview from "@/components/landing/SitePreview";

// ─────────────────────────────────────────────────────────────────────────────
// La prueba de que esto existe.
//
// ⚠️ Antes esto tenía un bug silencioso: el estado inicial mapeaba
// `image_url: p.image`, pero el useEffect llamaba a `api.entities.Project` y
// pisaba el estado con los objetos crudos (que traen `image`, no `image_url`).
// Resultado: las capturas aparecían un instante y desaparecían.
//
// La llamada a la API leía este MISMO archivo estático (herencia de cuando
// había Supabase detrás), así que se eliminó: menos código, un render en vez
// de dos, y el bug deja de existir por construcción.
// ─────────────────────────────────────────────────────────────────────────────

const featured = allProjects.filter((p) => p.featured);

// Con 4 proyectos, una grilla de 3 columnas deja uno solo y huérfano abajo.
// En ese caso pasamos a 2x2: queda equilibrado y las vistas previas se ven
// más grandes, que es justo lo que esta sección tiene que lograr.
const gridCols = featured.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

export default function PortafolioPreview() {
  return (
    <section id="portafolio" className="relative scroll-mt-20 overflow-hidden border-t border-border/60 py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-100 w-200 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            {t("Trabajos", "Work")}
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {t("Esto ya está funcionando.", "This is already live.")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              "Proyectos en producción, con clientes reales usándolos. Puedes entrar y comprobarlo.",
              "Projects in production, with real clients using them. You can go in and check for yourself."
            )}
          </p>
        </div>

        <motion.div
          className={`grid gap-5 sm:grid-cols-2 lg:gap-6 ${gridCols}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {featured.map((p, i) => (
            <motion.article
              key={p.id}
              custom={i}
              variants={cardVariants}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <SitePreview
                src={p.image}
                url={p.url}
                title={p.title}
                stack={p.stack}
                className="rounded-none border-0 border-b border-border/60"
              />

              <div className="flex flex-1 flex-col p-5">
                {pick(p, "industry") && (
                  <span className="mb-2.5 w-fit rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                    {pick(p, "industry")}
                  </span>
                )}
                <h3 className="mb-1 text-base font-bold transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {pick(p, "tagline")}
                </p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(p.stack || []).slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-auto border-t border-border/40 pt-3">
                  <Link
                    to={`/portafolio/${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all hover:gap-2.5"
                  >
                    {t("Ver caso completo", "View full case")} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
