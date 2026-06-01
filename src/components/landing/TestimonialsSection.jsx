import { Star, MessageSquarePlus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { t } from "@/lib/i18n";

const placeholders = [
  {
    initials: "?",
    name: t("Tu nombre aquí", "Your name here"),
    role: t("Primer cliente en opinar", "First client to review"),
    location: "Chile",
    text: t(
      "¿Trabajamos juntos? Me encantaría escuchar tu experiencia y publicar tu reseña aquí.",
      "Did we work together? I'd love to hear your experience and publish your review here."
    ),
  },
  {
    initials: "?",
    name: t("Tu nombre aquí", "Your name here"),
    role: t("Primer cliente en opinar", "First client to review"),
    location: "LatAm",
    text: t(
      "Los primeros proyectos ya están en marcha. Pronto este espacio tendrá reseñas reales de clientes reales.",
      "The first projects are already underway. This space will soon have real reviews from real clients."
    ),
  },
  {
    initials: "?",
    name: t("Tu nombre aquí", "Your name here"),
    role: t("Primer cliente en opinar", "First client to review"),
    location: "EEUU / México",
    text: t(
      "Si tienes un proyecto en mente, podemos construirlo juntos — y tu experiencia podría ser la primera historia de éxito aquí.",
      "If you have a project in mind, we can build it together — and your experience could be the first success story here."
    ),
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-150 h-75 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("próximamente", "coming soon")}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {t("Primeras reseñas", "First reviews")}{" "}
            <span className="text-primary">{t("en camino", "on the way")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Somos un equipo joven con proyectos reales en producción. Nuestros primeros clientes están trabajando con nosotros ahora — sus reseñas estarán aquí pronto.",
              "We're a young team with real projects in production. Our first clients are working with us now — their reviews will be here soon."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {placeholders.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-card border border-dashed border-border rounded-2xl p-6 flex flex-col opacity-50"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-border fill-border" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground/60 leading-relaxed flex-1 mb-6 italic">
                "{item.text}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-secondary border border-dashed border-border/60 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-muted-foreground/40">{item.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground/60 leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground/40">{item.role} · {item.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/15">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {t("¿Ya trabajaste con nosotros?", "Did you work with us?")}
            </span>
          </div>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t("Déjanos tu reseña", "Leave us your review")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
