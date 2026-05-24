import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.entities.BlogPost.filter({ status: "published" }, "-created_date", 50).then(setPosts);
  }, []);

  const filtered = posts.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Volver al inicio
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {"Blog & Recursos"}
            </h1>
            <p className="text-muted-foreground mt-2">Tutoriales, insights y novedades sobre trading y desarrollo.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border h-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", ...Object.keys(categoryLabels)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
                    filter === cat
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {cat === "all" ? "Todos" : categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No se encontraron artículos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                >
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden bg-secondary">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.read_time || 5} min
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-4 font-mono">
                      {moment(post.created_date).format("DD MMM YYYY")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}