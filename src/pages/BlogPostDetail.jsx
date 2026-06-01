import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/api/maudev";
import { ArrowLeft, Clock, Tag, Calendar, User, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { getBlogPostById, blogCategories as categoryLabels } from "@/data/blogPosts";
import { t, pick } from "@/lib/i18n";
import moment from "moment";

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

  useEffect(() => {
    if (post) {
      document.title = `${pick(post, "title")} · Maudev`;
    }
  }, [post]);

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

      {/* Imagen de portada */}
      {post.cover_image && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="rounded-2xl overflow-hidden border border-border">
            <img src={post.cover_image} alt={pick(post, "title")} className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* Contenido del artículo */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="blog-prose">
          <ReactMarkdown>{pick(post, "content")}</ReactMarkdown>
        </div>

        {/* CTA al final del artículo */}
        <div className="mt-16 p-8 bg-card border border-border rounded-2xl text-center">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("¿te resultó útil?", "was this helpful?")}</span>
          <h3 className="text-xl font-bold mt-3 mb-2">
            {t("¿Quieres aplicarlo en tu negocio?", "Want to apply this to your business?")}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
            {t(
              "En Maudev construimos webs, software y automatizaciones para emprendedores y PYMEs. Diagnóstico gratuito en menos de 24h.",
              "At Maudev we build websites, software and automations for founders and SMBs. Free consult within 24h."
            )}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("Solicitar diagnóstico gratis", "Get a free consult")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
