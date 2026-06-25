import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts as staticPosts, blogCategories as categoryLabels } from "@/data/blogPosts";
import { t, pick } from "@/lib/i18n";

// Fecha "25 jun 2026" sin moment (evita ~70 KB en el bundle inicial).
const fmtDate = (d) =>
  new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(d))
    .replace(".", "");

const latestStatic = [...staticPosts]
  .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
  .slice(0, 3);

export default function BlogPreview({ blogImage }) {
  const [posts, setPosts] = useState(latestStatic);

  useEffect(() => {
    api.entities.BlogPost.filter({ status: "published" }, "-created_date", 3)
      .then((data) => setPosts(data && data.length > 0 ? data : latestStatic))
      .catch(() => setPosts(latestStatic));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// blog</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
              {t("Insights & Recursos", "Insights & Resources")}
            </h2>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            {t("Ver blog", "View blog")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
            >
              {post.cover_image ? (
                <div className="aspect-video overflow-hidden bg-secondary">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : blogImage ? (
                <div className="aspect-video overflow-hidden bg-secondary">
                  <img src={blogImage} alt={post.title} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : null}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                    {categoryLabels[post.category] || post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.read_time || 5} min
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{pick(post, "title")}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{pick(post, "excerpt")}</p>
                <p className="text-[10px] text-muted-foreground mt-3 font-mono">
                  {fmtDate(post.created_date)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/blog" className="text-sm text-primary font-medium inline-flex items-center gap-2">
            {t("Ver blog completo", "View full blog")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}