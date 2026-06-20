import { useState, useEffect } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api/maudev";
import { projects as staticProjects, getProjectById } from "@/data/projects";
import { motion } from "framer-motion";
import { t, pick } from "@/lib/i18n";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const PLACEHOLDER_GRADIENT = "from-foreground/10 via-foreground/5 to-transparent";

export default function PortafolioPreview() {
  const [projects, setProjects] = useState(
    staticProjects.filter((p) => p.featured).map((p, i) => ({ ...p, image_url: p.image, sort_order: i }))
  );

  useEffect(() => {
    api.entities.Project.filter({ featured: true }, "sort_order", 6)
      .then((data) => {
        if (data.length > 0) setProjects(data);
        else {
          // fallback a datos estáticos si la tabla está vacía
          setProjects(staticProjects.filter((p) => p.featured).map((p, i) => ({ ...p, image_url: p.image, sort_order: i })));
        }
      })
      .catch(() => {
        setProjects(staticProjects.filter((p) => p.featured).map((p, i) => ({ ...p, image_url: p.image, sort_order: i })));
      });
  }, []);

  return (
    <section id="portafolio" className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("portafolio", "portfolio")}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
              {t("Proyectos", "Projects")} <span className="text-primary">{t("construidos", "we've built")}</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              {t(
                "Soluciones reales entregadas a emprendedores y equipos. Cada proyecto, una historia de crecimiento.",
                "Real solutions delivered to founders and teams. Every project, a growth story."
              )}
            </p>
          </div>
          <Link
            to="/portafolio"
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group"
          >
            {t("Ver todos", "View all")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              variants={cardVariants}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
            >
              {/* Imagen sobre placeholder monocromo (fallback si la imagen falla) */}
              <div className={`relative aspect-video overflow-hidden bg-linear-to-br ${PLACEHOLDER_GRADIENT}`}>
                {/* Placeholder de fondo: visible si no hay imagen o si falla la carga */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-3xl font-black tracking-tight text-foreground/20 select-none">
                    {p.title?.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex gap-1.5">
                    {(p.stack || []).slice(0, 3).map((s) => (
                      <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/40 text-foreground/50 border border-border/40">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                {/* Overlay con link */}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
                {p.project_url && (
                  <a
                    href={p.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-card/80 border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-foreground" />
                  </a>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  {pick(p, "industry") && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {pick(p, "industry")}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">
                  {pick(p, "tagline")}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(p.stack || []).slice(0, 4).map((s) => (
                    <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-border/40">
                  <Link
                    to={getProjectById(p.id) ? `/portafolio/${p.id}` : "/portafolio"}
                    className="text-xs text-primary font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  >
                    {t("Ver caso completo", "View full case")} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/portafolio" className="text-sm text-primary font-medium inline-flex items-center gap-2">
            {t("Ver portafolio completo", "View full portfolio")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

