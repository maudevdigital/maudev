import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/api/maudev";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import moment from "moment";

const categoryLabels = {
  trading: "Trading",
  desarrollo: "Desarrollo",
  automatizacion: "Automatización",
  fintech: "Fintech",
  tutoriales: "Tutoriales",
};

export default function BlogPostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.entities.BlogPost.get(postId)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

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
        <p className="text-muted-foreground">Artículo no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Volver al blog
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {categoryLabels[post.category] || post.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.read_time || 5} min de lectura
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
            )}

            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              {post.author && <span className="font-medium text-foreground">{post.author}</span>}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {moment(post.created_date).format("DD MMM YYYY")}
              </span>
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground flex items-center gap-1">
                    <Tag className="h-2.5 w-2.5" /> {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.cover_image && (
            <div className="rounded-xl overflow-hidden border border-border mb-10">
              <img src={post.cover_image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-card prose-pre:border prose-pre:border-border">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
