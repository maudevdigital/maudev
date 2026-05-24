import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { FileText, Users, TrendingUp, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, leads: 0 });
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    Promise.all([
      api.entities.BlogPost.list("-created_date", 100),
      api.entities.Lead.list("-created_date", 100),
    ]).then(([posts, leads]) => {
      setStats({ posts: posts.length, leads: leads.length });
      setRecentLeads(leads.slice(0, 8));
    });
  }, []);

  const cards = [
    { label: "Proyectos", value: projects.length, icon: Briefcase, color: "text-primary", link: "/admin/portafolio" },
    { label: "Blog Posts", value: stats.posts, icon: FileText, color: "text-blue-400", link: "/admin/blog" },
    { label: "Leads", value: stats.leads, icon: Users, color: "text-green-400", link: "/admin/leads" },
  ];

  const statusColors = {
    new: "bg-primary/10 text-primary border-primary/20",
    contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    qualified: "bg-green-500/10 text-green-400 border-green-500/20",
    converted: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Vista general de leads y contenido.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link || "#"}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold font-mono">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4">Últimos leads</h3>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No hay leads aún.</p>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{l.name || l.email}</p>
                  <p className="text-xs text-muted-foreground">{l.email} {l.whatsapp ? `· ${l.whatsapp}` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground capitalize">{l.interest || "general"}</p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColors[l.status] || "bg-secondary text-muted-foreground"}`}>
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
