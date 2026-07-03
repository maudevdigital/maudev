import { useState, useEffect } from "react";
import { Wallet, Plus, Trash2, Loader2, CheckCircle2, Circle, AlarmClock } from "lucide-react";
import { toast } from "sonner";

// Cobros de proyectos vendidos (modelo 50% inicio / 50% contra entrega).
// El cron del worker avisa por Telegram cuando llega la fecha de entrega y el
// saldo sigue pendiente.
const WORKER = "https://ig-autopost.maudevchile.workers.dev";
const fmtCLP = (n) => "$" + Number(n || 0).toLocaleString("es-CL");

const emptyForm = { title: "", client: "", price: "", deliveryDate: "" };

function PayToggle({ bill, field, label, onToggle }) {
  const paid = bill[field];
  const half = Math.round((bill.price || 0) / 2);
  return (
    <button
      onClick={() => onToggle(bill.id, field)}
      title={paid ? `Pagado el ${paid} — clic para desmarcar` : "Marcar como pagado"}
      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors ${
        paid
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/40"
      }`}
    >
      {paid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      <span className="font-mono">{label}: {fmtCLP(half)}</span>
      {paid && <span className="text-[10px] opacity-70">{paid}</span>}
    </button>
  );
}

export default function AdminCobros() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  useEffect(() => { document.title = "Cobros · Maudev admin"; }, []);

  const load = () =>
    fetch(`${WORKER}/billing`).then((r) => r.json())
      .then((d) => setBills(d.bills || []))
      .catch(() => toast.error("No se pudieron cargar los cobros."))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const post = (body) =>
    fetch(`${WORKER}/billing`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then((r) => r.json());

  const create = async () => {
    if (!form.title.trim() || !form.client.trim() || !Number(form.price)) {
      toast.error("Faltan: proyecto, cliente o precio."); return;
    }
    setCreating(true);
    try {
      const r = await post({ op: "create", title: form.title.trim(), client: form.client.trim(), price: Number(form.price), deliveryDate: form.deliveryDate || null });
      if (!r.ok) throw new Error(r.error || "error");
      setForm(emptyForm);
      toast.success("Cobro creado.");
      load();
    } catch (e) { toast.error(e.message); } finally { setCreating(false); }
  };

  const toggle = async (id, field) => {
    const r = await post({ op: "toggle", id, field });
    if (r.ok) { load(); } else toast.error(r.error || "error");
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este cobro?")) return;
    const r = await post({ op: "delete", id });
    if (r.ok) { toast.success("Eliminado."); load(); } else toast.error(r.error || "error");
  };

  const half = (b) => Math.round((b.price || 0) / 2);
  const pendiente = bills.reduce((a, b) => a + (b.upfrontPaid ? 0 : half(b)) + (b.balancePaid ? 0 : half(b)), 0);
  const cobrado = bills.reduce((a, b) => a + (b.upfrontPaid ? half(b) : 0) + (b.balancePaid ? half(b) : 0), 0);

  const input = "h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/50";
  const label = "text-xs font-mono text-muted-foreground mb-1.5 block";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" /> Cobros
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Proyectos vendidos con el modelo 50% inicio / 50% contra entrega. Telegram te recuerda el saldo el día de la entrega.
        </p>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <p className="text-xs text-muted-foreground mb-1">Pendiente de cobro</p>
          <p className="text-2xl font-bold font-mono text-primary">{fmtCLP(pendiente)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <p className="text-xs text-muted-foreground mb-1">Cobrado</p>
          <p className="text-2xl font-bold font-mono">{fmtCLP(cobrado)}</p>
        </div>
      </div>

      {/* Crear */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-40"><label className={label}>Proyecto</label><input className={`${input} w-full`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej: Web + cotizador" /></div>
          <div className="flex-1 min-w-36"><label className={label}>Cliente</label><input className={`${input} w-full`} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nombre" /></div>
          <div className="w-36"><label className={label}>Precio (CLP)</label><input type="number" className={`${input} w-full`} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="900000" /></div>
          <div className="w-40"><label className={label}>Entrega (opcional)</label><input type="date" className={`${input} w-full`} value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} /></div>
          <button onClick={create} disabled={creating} className="h-9 inline-flex items-center gap-2 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Crear
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-3">
          Tip: desde <strong>Cotizaciones</strong> puedes crear el cobro con 1 clic (ícono 💰) cuando el cliente acepte la propuesta.
        </p>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-muted-foreground py-6">Cargando…</p>
      ) : bills.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
          Sin cobros aún. Crea el primero cuando vendas un proyecto. 💪
        </p>
      ) : (
        <div className="space-y-3">
          {bills.map((b) => {
            const done = b.upfrontPaid && b.balancePaid;
            return (
              <div key={b.id} className={`bg-card border rounded-xl p-4 ${done ? "border-border/50 opacity-70" : "border-border"}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{b.title} <span className="text-muted-foreground font-normal">· {b.client}</span></p>
                    <p className="text-[11px] font-mono text-muted-foreground flex flex-wrap gap-x-3 mt-0.5">
                      <span>Total {fmtCLP(b.price)}</span>
                      {b.deliveryDate && (
                        <span className="inline-flex items-center gap-1"><AlarmClock className="h-3 w-3" /> entrega {b.deliveryDate}</span>
                      )}
                      {done && <span className="text-primary">✓ pagado completo</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PayToggle bill={b} field="upfrontPaid" label="Inicio" onToggle={toggle} />
                    <PayToggle bill={b} field="balancePaid" label="Saldo" onToggle={toggle} />
                    <button onClick={() => remove(b.id)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
