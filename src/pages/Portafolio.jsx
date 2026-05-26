import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/api/maudev";
import { projects as staticProjects } from "@/data/projects";
import { t, pick } from "@/lib/i18n";

const PLACEHOLDER_GRADIENT = "from-foreground/10 to-foreground/5";

export default function Portafolio() {
  const [projects, setProjects] = useState(
    staticProjects.map((p) => ({ ...p, image_url: p.image, project_url: p.url }))
  );

  useEffect(() => {
    document.title = t("Portafolio · Maudev", "Portfolio · Maudev");
    api.entities.Project.filter({ status: "published" }, "sort_order", 50)
      .then((data) => { if (data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("portafolio", "portfolio")}</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
              {t("Proyectos", "Real")} <span className="text-primary">{t("reales", "projects")}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Una selección de productos y plataformas que hemos diseñado y construido, desde MVPs hasta sistemas en producción.",
                "A selection of products and platforms we've designed and built, from MVPs to production systems."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Imagen sobre placeholder monocromo (fallback si la imagen falla) */}
              <div className={`group aspect-video rounded-2xl overflow-hidden border border-border bg-linear-to-br ${PLACEHOLDER_GRADIENT} flex items-center justify-center relative`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span className="text-5xl lg:text-6xl font-black tracking-tight text-foreground/15 select-none">
                    {p.title?.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center px-8">
                    {(p.stack || []).slice(0, 4).map((s) => (
                      <span key={s} className="text-xs font-mono px-2 py-1 rounded bg-background/40 border border-border/40 text-foreground/50">
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
                    className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {pick(p, "industry") && (
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                      {pick(p, "industry")}
                    </span>
                  )}
                  {pick(p, "role") && (
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">
                      {pick(p, "role")}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{p.title}</h2>
                <p className="text-base text-primary font-medium mb-4">{pick(p, "tagline")}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{pick(p, "description")}</p>

                {(p.stack || []).length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-mono text-muted-foreground uppercase mb-2">Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {(p.stack || []).map((s) => (
                        <span key={s} className="text-xs font-mono px-2.5 py-1 rounded bg-secondary text-foreground border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(p.project_url || p.url) && (
                  <a
                    href={p.project_url || p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    {t("Visitar sitio", "Visit site")} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}

          <div className="mt-12 bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">{t("¿Tienes un proyecto en mente?", "Have a project in mind?")}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t(
                "Conversemos. Te entregamos una propuesta concreta con alcance, plazos y presupuesto en menos de 48h.",
                "Let's talk. We'll deliver a concrete proposal with scope, timelines and budget within 48h."
              )}
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("Conversar sobre tu proyecto", "Talk about your project")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
