import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/api/maudev";
import { ArrowLeft, Clock, Tag, Calendar, User, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { getBlogPostById, blogCategories as categoryLabels } from "@/data/blogPosts";
import { t, pick } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";
import moment from "moment";

// CTA contextual según la categoría del post: cada lector llega con una
// intención distinta, así que el cierre del artículo apunta a la herramienta
// más relevante en vez de un CTA genérico.
const ctaByCategory = {
  marketing: {
    to: "/diagnostico-web",
    title: t("Mide tu web gratis, ahora mismo", "Measure your website for free, right now"),
    desc: t(
      "Ingresa tu URL y en un minuto sabes la nota real de tu sitio: velocidad, SEO y buenas prácticas.",
      "Enter your URL and in one minute you'll know your site's real score: speed, SEO and best practices."
    ),
    label: t("Analizar mi web gratis", "Analyze my site for free"),
  },
  automatizacion: {
    to: "/cotizador",
    title: t("¿Cuánto costaría automatizar esto en tu negocio?", "What would automating this cost your business?"),
    desc: t(
      "Responde tres preguntas y te mostramos un rango de inversión al instante, sin dejar tu email.",
      "Answer three questions and we'll show you an investment range instantly, no email required."
    ),
    label: t("Estimar en 1 minuto", "Estimate in 1 minute"),
  },
  desarrollo: {
    to: "/precios",
    title: t("¿Quieres saber cuánto cuesta de verdad?", "Want to know what it really costs?"),
    desc: t(
      "Publicamos nuestros precios, lo que incluyen y lo que no. Sin cotizaciones misteriosas.",
      "We publish our prices, what they include and what they don't. No mystery quotes."
    ),
    label: t("Ver precios publicados", "See published pricing"),
  },
  fintech: {
    to: "/contacto",
    title: t("¿Quieres cobrar online sin enredos?", "Want to charge online without the mess?"),
    desc: t(
      "Cuéntanos tu caso y te proponemos la integración de pagos que corresponde, con precio fijo.",
      "Tell us your case and we'll propose the right payment integration, at a fixed price."
    ),
    label: CTA_LABEL,
  },
  tutoriales: {
    to: "/contacto",
    title: t("¿Prefieres que lo hagamos por ti?", "Prefer we do it for you?"),
    desc: t(
      "Si no tienes tiempo de implementarlo, lo construimos nosotros: propuesta y precio fijo en 24h.",
      "If you don't have time to implement it, we'll build it: proposal and fixed price within 24h."
    ),
    label: CTA_LABEL,
  },
};

const defaultCta = {
  to: "/contacto",
  title: t("¿Quieres aplicarlo en tu negocio?", "Want to apply this to your business?"),
  desc: t(
    "En Maudev construimos webs, software y automatizaciones para emprendedores y PYMEs. Diagnóstico gratuito en menos de 24h.",
    "At Maudev we build websites, software and automations for founders and SMBs. Free assessment within 24h."
  ),
  label: CTA_LABEL,
};

export default function BlogPostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.entities.BlogPost.get(postId)
      .then((data) => { if (active) setPost(data || getBlogPostById(postId) || null); })
      .catch(() => { if (active) setPost(getBlogPostById(postId) || null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId]);

  // SEO completo por artículo: title, description, canonical, Open Graph y
  // Twitter card. Crea las etiquetas si no existen y las limpia al desmontar,
  // para que cada post tenga su propio snippet en Google y al compartir.
  useEffect(() => {
    if (!post) return;
    const ORIGIN = "https://maudev.cl";
    const url = `${ORIGIN}/blog/${post.id || postId}`;
    const title = `${pick(post, "title")} · Maudev`;
    const description = (pick(post, "excerpt") || "").slice(0, 160);
    const image = post.cover_image ? `${ORIGIN}${post.cover_image}` : `${ORIGIN}/og-image.png`;

    document.title = title;

    // Helpers que crean/actualizan etiquetas y recuerdan cuáles agregamos.
    const created = [];
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", content);
    };
    const setLink = (rel, href) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("name", "description", description);
    setLink("canonical", url);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:title", pick(post, "title"));
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("property", "article:published_time", post.created_date || "");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pick(post, "title"));
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Schema BlogPosting para rich results (fecha, autor, imagen y titular).
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: pick(post, "title"),
      description,
      image: image ? [image] : undefined,
      datePublished: post.created_date,
      dateModified: post.updated_date || post.created_date,
      author: { "@type": "Organization", name: post.author || "Maudev" },
      publisher: {
        "@type": "Organization",
        name: "Maudev",
        url: ORIGIN,
        logo: { "@type": "ImageObject", url: `${ORIGIN}/og-image.png` },
      },
      mainEntityOfPage: url,
    });
    document.head.appendChild(ld);
    created.push(ld);

    return () => created.forEach((el) => el.remove());
  }, [post, postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("Artículo no encontrado.", "Article not found.")}</p>
          <Link to="/blog" className="text-primary text-sm hover:underline">
            ← {t("Volver al blog", "Back to blog")}
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = categoryLabels[post.category] || post.category;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero del artículo */}
      <div className="relative pt-24 pb-12 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-40 bg-primary/4 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {t("Volver al blog", "Back to blog")}
          </Link>

          {/* Categoría + tiempo lectura */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              {categoryLabel}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.read_time || 5} {t("min de lectura", "min read")}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5">
            {pick(post, "title")}
          </h1>

          {/* Excerpt */}
          {pick(post, "excerpt") && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {pick(post, "excerpt")}
            </p>
          )}

          {/* Meta: autor + fecha */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground border-t border-border/40 pt-5">
            {post.author && (
              <span className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{post.author}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {moment(post.created_date).format("DD [de] MMMM, YYYY")}
            </span>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-md bg-secondary text-muted-foreground flex items-center gap-1 border border-border/60">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Imagen de portada (se oculta sola si el archivo aún no existe) */}
      {post.cover_image && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="rounded-2xl overflow-hidden border border-border">
            <img
              src={post.cover_image}
              alt={pick(post, "title")}
              className="w-full h-auto"
              onError={(e) => { e.currentTarget.parentElement.parentElement.style.display = "none"; }}
            />
          </div>
        </div>
      )}

      {/* Contenido del artículo */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="blog-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Las imágenes inline se ocultan solas si el archivo aún no existe,
              // así el artículo nunca muestra un ícono roto.
              img: ({ node: _node, ...props }) => (
                <img
                  {...props}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ),
              // Tabla con scroll horizontal en móvil para que no rompa el layout.
              table: ({ node: _node, ...props }) => (
                <div className="blog-table-wrap">
                  <table {...props} />
                </div>
              ),
            }}
          >
            {pick(post, "content")}
          </ReactMarkdown>
        </div>

        {/* CTA al final del artículo — contextual según la categoría */}
        {(() => {
          const cta = ctaByCategory[post.category] || defaultCta;
          return (
            <div className="mt-16 p-8 bg-card border border-border rounded-2xl text-center">
              <span className="kicker">{t("¿te resultó útil?", "was this helpful?")}</span>
              <h3 className="text-xl font-bold mt-3 mb-2">{cta.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">{cta.desc}</p>
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })()}
      </article>

      <Footer />
    </div>
  );
}
