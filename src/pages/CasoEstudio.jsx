import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, AlertCircle, Wrench, Trophy } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { getProjectById, projects } from "@/data/projects";
import { t, pick } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

const sections = [
  { key: "problem", icon: AlertCircle, label: t("El problema", "The problem"), num: "01" },
  { key: "solution", icon: Wrench, label: t("La solución", "The solution"), num: "02" },
  { key: "outcome", icon: Trophy, label: t("El resultado", "The outcome"), num: "03" },
];

export default function CasoEstudio() {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  useEffect(() => {
    if (project) document.title = `${project.title} · ${t("Caso de estudio", "Case study")} · Maudev`;
  }, [project]);

  if (!project) return <Navigate to="/portafolio" replace />;

  const others = projects.filter((p) => p.id !== project.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero del caso */}
      <section className="relative pt-32 pb-12 lg:pt-40 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/portafolio"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {t("Volver al portafolio", "Back to portfolio")}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
              {pick(project, "industry")}
            </span>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">
              {pick(project, "role")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">{project.title}</h1>
          <p className="text-lg text-primary font-medium mb-6">{pick(project, "tagline")}</p>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {t("Ver el sitio en vivo", "View the live site")} <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>

      {/* Screenshot */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="group aspect-video rounded-2xl overflow-hidden border border-border bg-linear-to-br from-foreground/10 to-foreground/5 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="text-6xl font-black tracking-tight text-foreground/15 select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex flex-wrap gap-2 justify-center px-8">
              {project.stack.map((s) => (
                <span key={s} className="text-xs font-mono px-2 py-1 rounded bg-background/40 border border-border/40 text-foreground/50">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <img
            src={project.image}
            alt={`Screenshot de ${project.title}`}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Problema → Solución → Resultado */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold tracking-widest">{s.num}</span>
                  <h2 className="text-lg font-bold leading-tight">{s.label}</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{pick(project, s.key)}</p>
            </motion.div>
          ))}
        </div>

        {/* Stack */}
        <div className="mt-10 pt-8 border-t border-border/40">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
            {t("Tecnologías del proyecto", "Project technologies")}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="text-xs font-mono px-3 py-1.5 rounded-md bg-secondary border border-border/60 text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Otros casos */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          {t("Otros casos", "Other cases")}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {others.map((p) => (
            <Link
              key={p.id}
              to={`/portafolio/${p.id}`}
              className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-bold group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{pick(p, "tagline")}</p>
              <span className="text-xs text-primary font-semibold inline-flex items-center gap-1.5">
                {t("Ver caso", "View case")} <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-bold mb-3">
            {t("¿Tu negocio tiene un problema parecido?", "Does your business have a similar problem?")}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t(
              "Cuéntanos tu caso y en menos de 24h recibes una propuesta con alcance, plazos y precio fijo.",
              "Tell us your case and within 24h you'll get a proposal with scope, timelines and a fixed price."
            )}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {CTA_LABEL}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
