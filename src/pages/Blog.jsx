import { useState, useEffect, useMemo } from "react";
import { api } from "@/api/maudev";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { blogPosts as staticPosts, blogCategories } from "@/data/blogPosts";
import { t, pick } from "@/lib/i18n";
import moment from "moment";

export default function Blog() {
  const [posts, setPosts] = useState(staticPosts);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;

  useEffect(() => {
    document.title = "Blog · Maudev";
    api.entities.BlogPost.filter({ status: "published" }, "-created_date", 50)
      .then((data) => {
        // Si la tabla de Supabase tiene posts, los usamos; si no, el blog estático.
        if (data && data.length > 0) setPosts(data);
        else setPosts(staticPosts);
      })
      .catch(() => setPosts(staticPosts));
  }, []);

  const now = Date.now();
  const filtered = posts.filter((p) => {
    // Publicación PROGRAMADA: un post con fecha futura no aparece hasta su día.
    const scheduled = !p.created_date || new Date(p.created_date).getTime() <= now;
    const matchCat = filter === "all" || p.category === filter;
    const title = (pick(p, "title") || "").toLowerCase();
    const excerpt = (pick(p, "excerpt") || "").toLowerCase();
    const matchSearch = !search || title.includes(search.toLowerCase()) || excerpt.includes(search.toLowerCase());
    return scheduled && matchCat && matchSearch;
  });

  // Más recientes primero (orden descendente por fecha).
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Al cambiar de filtro o búsqueda, volvemos a la página 1.
  useEffect(() => { setPage(1); }, [filter, search]);

  const goToPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> {t("Volver al inicio", "Back to home")}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t("Blog & Recursos", "Blog & Resources")}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {t(
                "Guías prácticas sobre desarrollo web, automatización, pagos y marketing para PYMEs y emprendedores.",
                "Practical guides on web development, automation, payments and marketing for SMBs and founders."
              )}
            </p>
          </div>

          {/* Buscador + filtro desplegable */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Buscar artículos...", "Search articles...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border h-11"
              />
            </div>
            <div className="sm:w-56">
              <label htmlFor="blog-cat" className="sr-only">{t("Filtrar por categoría", "Filter by category")}</label>
              <select
                id="blog-cat"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              >
                <option value="all">{t("Todas las categorías", "All categories")}</option>
                {Object.entries(blogCategories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t("No se encontraron artículos.", "No articles found.")}</p>
            </div>
          ) : (
            <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagePosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/30 transition-all duration-300 flex flex-col"
                >
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden bg-secondary">
                      <img src={post.cover_image} alt={post.title} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                        {blogCategories[post.category] || post.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.read_time || 5} min
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{pick(post, "title")}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{pick(post, "excerpt")}</p>
                    <p className="text-xs text-muted-foreground mt-4 font-mono">
                      {moment(post.created_date).format("DD MMM YYYY")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label={t("Paginación", "Pagination")}>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label={t("Anterior", "Previous")}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => goToPage(n)}
                    aria-current={n === currentPage ? "page" : undefined}
                    className={`h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                      n === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label={t("Siguiente", "Next")}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
