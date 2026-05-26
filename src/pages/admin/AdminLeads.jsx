import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
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
  bot_automation: "Automatización",
  general: "General",
};

const sourceLabels = {
  hero_funnel: "Hero Funnel",
  newsletter: "Newsletter",
  contact_form: "Formulario",
  blog_cta: "Blog CTA",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = () => api.entities.Lead.list("-created_date", 100).then(setLeads);
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

  const filtered = leads.filter((l) => filter === "all" || l.status === filter);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">{leads.length} leads capturados</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
              filter === s
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {s === "all" ? "Todos" : s}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
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
                      <p className="text-xs text-muted-foreground">{l.email}</p>
                      {l.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">{l.message}</p>}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono">{interestLabels[l.interest] || l.interest || "—"}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono">{sourceLabels[l.source] || l.source || "—"}</span>
                    </td>
                    <td className="p-4">
                      <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v)}>
                        <SelectTrigger className={`h-7 w-28 text-[10px] font-mono border rounded ${statusColors[l.status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">new</SelectItem>
                          <SelectItem value="contacted">contacted</SelectItem>
                          <SelectItem value="qualified">qualified</SelectItem>
                          <SelectItem value="converted">converted</SelectItem>
                          <SelectItem value="lost">lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">
                      {moment(l.created_date).format("DD/MM/YY HH:mm")}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(l.id)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors ml-auto">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
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
