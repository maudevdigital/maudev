import { useState, useEffect, useMemo } from "react";
import { api } from "@/api/maudev";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, MessageCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

const statusColors = {
  new: "bg-secondary text-foreground border-border",
  contacted: "bg-secondary text-muted-foreground border-foreground/30",
  qualified: "bg-foreground text-background border-transparent",
  converted: "bg-foreground text-background border-transparent",
  lost: "bg-muted text-muted-foreground border-border line-through",
};

const interestLabels = {
  marketing_funnel: "Embudo de ventas",
  seo_landing: "Landing SEO",
  trading_script: "Trading Script",
  web_app: "Web App",
  web_dev: "Web / Landing",
  automation: "Automatización",
  bot_automation: "Automatización",
  payments: "Pagos / APIs",
  guia: "Guía PDF",
  diagnostico: "Diagnóstico",
  general: "General",
};

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
};

// Cualquier valor no mapeado se muestra legible (sin guiones bajos).
const pretty = (map, v) => map[v] || (v ? v.replaceAll("_", " ") : "—");

// "+56 9 1234 5678" → link wa.me válido (solo dígitos).
const waLink = (raw) => {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
};

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

function StatusSelect({ lead, onChange, className = "" }) {
  return (
    <Select value={lead.status} onValueChange={(v) => onChange(lead.id, v)}>
      <SelectTrigger className={`h-7 w-28 text-[10px] font-mono border rounded ${statusColors[lead.status] || ""} ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function ContactActions({ lead }) {
  const wa = waLink(lead.whatsapp);
  return (
    <div className="flex items-center gap-1.5">
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          title={`WhatsApp ${lead.whatsapp}`}
          className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
        </a>
      )}
      {lead.email && (
        <a
          href={`mailto:${lead.email}`}
          title={lead.email}
          className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        </a>
      )}
    </div>
  );
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const load = () => api.entities.Lead.list("-created_date", 200).then(setLeads);
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.entities.Lead.update(id, { status });
    toast.success("Estado actualizado.");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este lead?")) return;
    await api.entities.Lead.delete(id);
    toast.success("Lead eliminado.");
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!q) return true;
      return [l.name, l.email, l.whatsapp, l.message, l.interest, l.source]
        .some((f) => (f || "").toLowerCase().includes(q));
    });
  }, [leads, filter, query]);

  const countBy = (s) => leads.filter((l) => l.status === s).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">{leads.length} capturados · {countBy("new")} nuevos</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nombre, email, mensaje…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
              filter === s
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {s === "all" ? `Todos (${leads.length})` : `${s} (${countBy(s)})`}
          </button>
        ))}
      </div>

      {/* Móvil: tarjetas */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground text-sm bg-card border border-border rounded-xl">No hay leads.</p>
        ) : (
          filtered.map((l) => (
            <div key={l.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.name || "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.email}</p>
                  {l.whatsapp && <p className="text-xs text-muted-foreground">{l.whatsapp}</p>}
                </div>
                <ContactActions lead={l} />
              </div>
              {l.message && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">{l.message}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-secondary border border-border/60">{pretty(interestLabels, l.interest)}</span>
                <span className="px-2 py-0.5 rounded bg-secondary border border-border/60">{pretty(sourceLabels, l.source)}</span>
                <span className="ml-auto">{moment(l.created_date).format("DD/MM/YY HH:mm")}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-3">
                <StatusSelect lead={l} onChange={updateStatus} />
                <button onClick={() => handleDelete(l.id)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Escritorio: tabla */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs font-mono text-muted-foreground uppercase">
                <th className="text-left p-4">Contacto</th>
                <th className="text-left p-4">Interés</th>
                <th className="text-left p-4">Fuente</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-right p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No hay leads.</td></tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium">{l.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{l.email}{l.whatsapp ? ` · ${l.whatsapp}` : ""}</p>
                      {l.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">{l.message}</p>}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono">{pretty(interestLabels, l.interest)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono">{pretty(sourceLabels, l.source)}</span>
                    </td>
                    <td className="p-4">
                      <StatusSelect lead={l} onChange={updateStatus} />
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">
                      {moment(l.created_date).format("DD/MM/YY HH:mm")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <ContactActions lead={l} />
                        <button onClick={() => handleDelete(l.id)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
