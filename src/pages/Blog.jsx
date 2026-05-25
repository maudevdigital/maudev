import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { blogPosts as staticPosts, blogCategories } from "@/data/blogPosts";
import moment from "moment";

export default function Blog() {
  const [posts, setPosts] = useState(staticPosts);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const filtered = posts.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Volver al inicio
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Blog &amp; Recursos</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Guías prácticas sobre desarrollo web, automatización, pagos y marketing para PYMEs y emprendedores.
            </p>
          </div>

          {/* Buscador + filtro desplegable */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border h-11"
              />
            </div>
            <div className="sm:w-56">
              <label htmlFor="blog-cat" className="sr-only">Filtrar por categoría</label>
              <select
                id="blog-cat"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              >
                <option value="all">Todas las categorías</option>
                {Object.entries(blogCategories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No se encontraron artículos.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
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
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground li