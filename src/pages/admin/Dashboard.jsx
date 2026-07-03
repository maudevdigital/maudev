import { useState, useEffect, useMemo } from "react";
import { api } from "@/api/maudev";
import { FileText, Users, TrendingUp, Briefcase, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import moment from "moment";

const sourceLabels = {
  hero_funnel: "Hero Funnel",
  newsletter: "Newsletter",
  contact_form: "Formulario",
  contact_page: "Página contacto",
  blog_cta: "Blog CTA",
  lead_magnet_guia: "Guía PDF",
  cotizador: "Cotizador",
  diagnostico_web: "Diagnóstico web",
  lp_diagnostico: "LP Diagnóstico",
  prospeccion: "Prospección",
};
const pretty = (v) => sourceLabels[v] || (v ? v.replaceAll("_", " ") : "otro");

const FUNNEL = [
  { key: "new", label: "Nuevos" },
  { key: "contacted", label: "Contactados" },
  { key: "qualified", label: "Calificados" },
  { key: "converted", label: "Convertidos" },
];

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    Promise.all([
      api.entities.BlogPost.list("-created_date", 100).catch(() => []),
      api.entities.Lead.list("-created_date", 200).catch(() => []),
    ]).then(([p, l]) => { setPosts(p); setLeads(l); });
  }, []);

  const stats = useMemo(() => {
    const startToday = moment().startOf("day");
    const start7 = moment().subtract(7, "days");
    const prev7 = moment().subtract(14, "days");
    const today = leads.filter((l) => moment(l.created_date).isAfter(startToday)).length;
    const week = leads.filter((l) => moment(l.created_date).isAfter(start7)).length;
    const prevWeek = leads.filter((l) => {
      const d = moment(l.created_date);
      return d.isAfter(prev7) && d.isBefore(start7);
    }).length;
    const byStatus = Object.fromEntries(FUNNEL.map(({ key }) => [key, leads.filter((l) => l.status === key).length]));
    const bySource = {};
    for (const l of leads) bySource[l.source || "otro"] = (bySource[l.source || "otro"] || 0) + 1;
    const topSources = Object.entries(bySource).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { today, week, prevWeek, byStatus, topSources };
  }, [leads]);

  const weekDelta = stats.week - stats.prevWeek;
  const maxStatus = Math.max(1, ...FUNNEL.map(({ key }) => stats.byStatus[key] || 0));
  const maxSource = Math.max(1, ...stats.topSources.map(([, n]) => n));

  const cards = [
    { label: "Leads hoy", value: stats.today, icon: Zap, link: "/admin/leads" },
    {
      label: "Leads últimos 7 días", value: stats.week, icon: Users, link: "/admin/leads",
      sub: `${weekDelta >= 0 ? "+" : ""}${weekDelta} vs semana anterior`,
    },
    { label: "Blog Posts", value: posts.length, icon: FileText, link: "/admin/blog" },
    { label: "Proyectos", value: projects.length, icon: Briefcase, link: "/admin/portafolio" },
  ];

  const statusColors = {
    new: "bg-secondary text-foreground border-border",
    contacted: "bg-secondary text-muted-foreground border-foreground/30",
    qualified: "bg-foreground text-background border-transparent",
    converted: "bg-foreground text-background border-transparent",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Lo importante de hoy, de un vistazo.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link || "#"}
            className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <c.icon className="h-5 w-5 text-foreground" />
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold font-mono">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            {c.sub && <p className={`text-[11px] mt-0.5 ${c.sub.startsWith("+") ? "text-primary" : "text-muted-foreground/70"}`}>{c.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Embudo por estado */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Embudo de leads</h3>
          <div className="space-y-3">
            {FUNNEL.map(({ key, label }) => {
              const n = stats.byStatus[key] || 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">{label}</span>
                  <div className="flex-1 h-5 rounded bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded bg-primary/70" style={{ width: `${(n / maxStatus) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono w-6 text-right">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top fuentes */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-sm mb-4">De dónde llegan los leads</h3>
          {stats.topSources.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Sin datos aún.</p>
          ) : (
            <div className="space-y-3">
              {stats.topSources.map(([src, n]) => (
                <div key={src} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-32 shrink-0 truncate">{pretty(src)}</span>
                  <div className="flex-1 h-5 rounded bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded bg-foreground/50" style={{ width: `${(n / maxSource) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono w-6 text-right">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Últimos leads */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Últimos leads</h3>
          <Link to="/admin/leads" className="text-xs text-primary hover:underline">Ver todos →</Link>
        </div>
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No hay leads aún.</p>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 8).map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.name || l.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.email} {l.whatsapp ? `· ${l.whatsapp}` : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{pretty(l.source)}</p>
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
