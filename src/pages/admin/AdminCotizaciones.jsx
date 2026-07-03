import { useState, useEffect, useMemo } from "react";
import { FileText, Copy, Check, Loader2, ExternalLink, Plus, Trash2, Send, Eye, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const WORKER = "https://ig-autopost.maudevchile.workers.dev";

// Motor de precios — interno, el cliente nunca ve estos números base.
const RATE_DAY = 35000; // piso interno por día de trabajo
const TYPES = [
  { value: "web_dev", label: "Landing / sitio web", days: 6, publicMin: 390000, publicMax: 690000 },
  { value: "web_app", label: "Software a medida / app", days: 20, publicMin: 900000, publicMax: null },
  { value: "automation", label: "Automatización / integraciones", days: 8, publicMin: 290000, publicMax: 600000 },
  { value: "payments", label: "Pagos / APIs", days: 9, publicMin: 350000, publicMax: 700000 },
  { value: "ecommerce", label: "E-commerce", days: 15, publicMin: 700000, publicMax: null },
];
const EXTERNAL_PRESETS = [
  { name: "Dominio .cl", cost: "≈ $12.000 CLP/año" },
  { name: "Hosting web (Cloudflare)", cost: "$0 (plan gratuito)" },
  { name: "Base de datos (Supabase)", cost: "$0 – US$25/mes según uso" },
  { name: "Correo transaccional (Resend)", cost: "$0 – US$20/mes según volumen" },
  { name: "APIs de IA", cost: "según uso (se estima en el proyecto)" },
];

const fmtCLP = (n) => "$" + Number(n || 0).toLocaleString("es-CL");
const roundUp = (n, step = 10000) => Math.ceil(n / step) * step;
const addDays = (iso, d) => {
  const dt = new Date(iso + "T12:00:00");
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
};

// Genera el plan de sprints a partir de la duración y el alcance.
function buildSprints(days, scope) {
  const weeks = Math.max(1, Math.ceil(days / 5));
  const sprintWeeks = weeks <= 3 ? 1 : 2;
  const count = Math.max(1, Math.ceil(weeks / sprintWeeks));
  const devScope = scope.length ? scope : ["Desarrollo del sistema"];
  const sprints = [];
  for (let i = 0; i < count; i++) {
    const w0 = i * sprintWeeks + 1;
    const w1 = Math.min(weeks, (i + 1) * sprintWeeks);
    const weeksLabel = w0 === w1 ? `Semana ${w0}` : `Semanas ${w0}-${w1}`;
    let goal;
    if (count === 1) goal = "Descubrimiento, desarrollo, pruebas y despliegue";
    else if (i === 0) goal = "Descubrimiento, diseño y arquitectura";
    else if (i === count - 1) goal = "Pruebas (QA), ajustes finales y despliegue";
    else {
      const per = Math.ceil(devScope.length / Math.max(1, count - 2));
      const part = devScope.slice((i - 1) * per, i * per);
      goal = "Desarrollo: " + (part.length ? part.join(", ") : "iteración sobre el producto");
    }
    sprints.push({ name: `Sprint ${i + 1}`, weeks: weeksLabel, goal });
  }
  return { sprints, weeks };
}

const emptyForm = {
  clientName: "", clientCompany: "", clientEmail: "",
  title: "", type: "web_dev", description: "",
  scopeText: "", days: 6, price: "", startDate: new Date().toISOString().slice(0, 10),
  sendEmail: false,
};

export default function AdminCotizaciones() {
  const [form, setForm] = useState(emptyForm);
  const [external, setExternal] = useState([EXTERNAL_PRESETS[0], EXTERNAL_PRESETS[1]]);
  const [customExt, setCustomExt] = useState({ name: "", cost: "" });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null); // {url, emailed}
  const [list, setList] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => { document.title = "Cotizaciones · Maudev admin"; }, []);
  const loadList = () => fetch(`${WORKER}/proposals`).then((r) => r.json()).then((d) => setList(d.proposals || [])).catch(() => {});
  useEffect(() => { loadList(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const typeInfo = TYPES.find((t) => t.value === form.type) || TYPES[0];
  const scope = useMemo(() => form.scopeText.split("\n").map((s) => s.trim()).filter(Boolean), [form.scopeText]);
  const { sprints, weeks } = useMemo(() => buildSprints(Number(form.days) || 1, scope), [form.days, scope]);
  const deliveryDate = useMemo(
    () => addDays(form.startDate, Math.ceil(weeks * 7 * 1.15)), // 15% de colchón
    [form.startDate, weeks],
  );
  const floorPrice = roundUp((Number(form.days) || 0) * RATE_DAY);
  const finalPrice = Number(form.price) || 0;

  const pickType = (v) => {
    const t = TYPES.find((x) => x.value === v);
    setForm((f) => ({ ...f, type: v, days: t?.days ?? f.days, price: f.price || (t?.publicMin ?? "") }));
  };

  const toggleExternal = (preset) => {
    setExternal((ext) =>
      ext.some((e) => e.name === preset.name) ? ext.filter((e) => e.name !== preset.name) : [...ext, preset],
    );
  };

  const addCustomExt = () => {
    if (!customExt.name.trim()) return;
    setExternal((ext) => [...ext, { name: customExt.name.trim(), cost: customExt.cost.trim() || "según uso" }]);
    setCustomExt({ name: "", cost: "" });
  };

  const generate = async () => {
    if (!form.title.trim() || !form.clientName.trim() || !finalPrice) {
      toast.error("Faltan: título, cliente o precio final."); return;
    }
    if (form.sendEmail && !form.clientEmail.trim()) {
      toast.error("Marcaste enviar email pero falta el correo del cliente."); return;
    }
    setCreating(true); setCreated(null);
    try {
      const body = {
        client: { name: form.clientName.trim(), company: form.clientCompany.trim(), email: form.clientEmail.trim() },
        project: { title: form.title.trim(), type: form.type, description: form.description.trim() },
        scope, days: Number(form.days), price: finalPrice,
        external, sprints,
        startDate: form.startDate, deliveryDate, validityDays: 14,
        sendEmail: form.sendEmail,
      };
      const r = await fetch(`${WORKER}/proposal`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "error");
      setCreated(d);
      toast.success(d.emailed ? "Propuesta creada y enviada al cliente ✉️" : "Propuesta creada ✅");
      loadList();
    } catch (e) {
      toast.error("No se pudo crear: " + e.message);
    } finally {
      setCreating(false);
    }
  };

  const copy = async (id, text) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1500); } catch { /* noop */ }
  };

  // Propuesta aceptada → crea el registro de cobro (50/50) en /admin/cobros.
  const createBill = async (p) => {
    try {
      const r = await fetch(`${WORKER}/billing`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ op: "create", title: p.title, client: p.client, price: p.price, proposalId: p.id }),
      }).then((x) => x.json());
      if (!r.ok) throw new Error(r.error || "error");
      toast.success("Cobro creado — gestiónalo en Cobros 💰");
    } catch (e) {
      toast.error("No se pudo crear el cobro: " + e.message);
    }
  };

  const input = "w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/50";
  const label = "text-xs font-mono text-muted-foreground mb-1.5 block";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Cotizaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">Genera una propuesta profesional con link para el cliente.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-5">
        {/* Cliente */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className={label}>Cliente *</label><input className={input} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="Nombre" /></div>
          <div><label className={label}>Empresa</label><input className={input} value={form.clientCompany} onChange={(e) => set("clientCompany", e.target.value)} placeholder="Opcional" /></div>
          <div><label className={label}>Email del cliente</label><input className={input} value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} placeholder="Para enviarle el link" /></div>
        </div>

        {/* Proyecto */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Título del proyecto *</label><input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ej: Sistema de reservas online" /></div>
          <div>
            <label className={label}>Tipo</label>
            <select className={input} value={form.type} onChange={(e) => pickType(e.target.value)}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div><label className={label}>Descripción corta</label><input className={input} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Una línea que resuma el proyecto" /></div>
        <div>
          <label className={label}>Alcance (un ítem por línea) — se muestran como checklist</label>
          <textarea
            className="w-full min-h-24 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/50"
            value={form.scopeText}
            onChange={(e) => set("scopeText", e.target.value)}
            placeholder={"Módulo de reservas online\nPanel de administración\nNotificaciones por email"}
          />
        </div>

        {/* Motor de precios */}
        <div className="rounded-lg bg-secondary/40 border border-border/60 p-4 grid sm:grid-cols-4 gap-4">
          <div>
            <label className={label}>Días de trabajo</label>
            <input type="number" min="1" className={input} value={form.days} onChange={(e) => set("days", e.target.value)} />
          </div>
          <div>
            <label className={label}>Inicio</label>
            <input type="date" className={input} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Precio final (CLP) *</label>
            <input type="number" min="0" step="10000" className={input} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder={typeInfo.publicMin} />
          </div>
          <div className="sm:col-span-4 text-[11px] font-mono text-muted-foreground flex flex-wrap gap-x-5 gap-y-1">
            <span>Piso interno ({form.days}d × {fmtCLP(RATE_DAY)}): <strong className="text-foreground">{fmtCLP(floorPrice)}</strong></span>
            <span>Rango público del tipo: <strong className="text-foreground">{fmtCLP(typeInfo.publicMin)}{typeInfo.publicMax ? ` – ${fmtCLP(typeInfo.publicMax)}` : "+"}</strong></span>
            <span>{weeks} semana(s) · {sprints.length} sprint(s) · entrega ≈ <strong className="text-foreground">{deliveryDate}</strong></span>
            {finalPrice > 0 && finalPrice < floorPrice && <span className="text-destructive">⚠ El precio final está bajo tu piso interno.</span>}
          </div>
        </div>

        {/* Servicios externos */}
        <div>
          <label className={label}>Servicios de terceros (los paga el cliente al proveedor)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {EXTERNAL_PRESETS.map((p) => {
              const on = external.some((e) => e.name === p.name);
              return (
                <button key={p.name} onClick={() => toggleExternal(p)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${on ? "bg-primary/10 border-primary/30 text-primary" : "bg-background border-border text-muted-foreground hover:border-primary/30"}`}>
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input className={`${input} sm:w-56 w-full`} value={customExt.name} onChange={(e) => setCustomExt((c) => ({ ...c, name: e.target.value }))} placeholder="Otro servicio…" />
            <input className={`${input} sm:w-44 w-full`} value={customExt.cost} onChange={(e) => setCustomExt((c) => ({ ...c, cost: e.target.value }))} placeholder="Costo (ej: US$10/mes)" />
            <button onClick={addCustomExt} className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs inline-flex items-center gap-1.5 hover:bg-secondary/70"><Plus className="h-3.5 w-3.5" /> Agregar</button>
          </div>
          {external.length > 0 && (
            <div className="mt-3 space-y-1">
              {external.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-background border border-border/60 rounded px-3 py-1.5">
                  <span>{e.name} <span className="text-muted-foreground font-mono">· {e.cost}</span></span>
                  <button onClick={() => setExternal((ext) => ext.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3 text-destructive" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/40">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.sendEmail} onChange={(e) => set("sendEmail", e.target.checked)} className="accent-[#0e7d88]" />
            Enviar por email al cliente al generar
          </label>
          <button onClick={generate} disabled={creating}
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Generar propuesta
          </button>
        </div>

        {created && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-primary font-medium flex-1 min-w-0 truncate">{created.url}</p>
            <button onClick={() => copy("new", created.url)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary border border-border">
              {copied === "new" ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar link</>}
            </button>
            <a href={`${created.url}?preview=1`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary border border-border">
              <ExternalLink className="h-3.5 w-3.5" /> Ver
            </a>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mt-6">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><FileText className="h-4 w-4" /> Propuestas generadas ({list.length})</h2>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay propuestas.</p>
        ) : (
          <div className="space-y-1">
            {list.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-2 py-2.5 px-2 rounded-lg hover:bg-secondary/50 border-b border-border/40 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{p.title} <span className="text-muted-foreground">· {p.client}</span></p>
                  <p className="text-[11px] font-mono text-muted-foreground flex flex-wrap items-center gap-x-2">
                    <span>{fmtCLP(p.price)} · {p.createdAt?.slice(0, 10)}</span>
                    {p.views > 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary" title={`Última vista: ${p.lastViewedAt?.slice(0, 16).replace("T", " ")}`}>
                        <Eye className="h-3 w-3" /> {p.views} vista{p.views > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">· sin abrir aún</span>
                    )}
                  </p>
                </div>
                <button onClick={() => createBill(p)} title="Propuesta aceptada → crear cobro 50/50" className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary border border-border hover:border-primary/40">
                  <Wallet className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => copy(p.id, `https://maudev.cl/propuesta/${p.id}`)} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary border border-border">
                  {copied === p.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <a href={`https://maudev.cl/propuesta/${p.id}?preview=1`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md bg-secondary border border-border">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
