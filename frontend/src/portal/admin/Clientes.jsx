import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import AdminShell from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api, fecha } from "@/portal/api";

// /portal/admin — Cloudflare Access pide el login antes de cargar esta página.
export default function Clientes() {
  const navegar = useNavigate();
  const [lista, setLista] = useState(null);
  const [tablero, setTablero] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => api("/admin/clientes").then((d) => setLista(d.clientes)).catch(setError), []);
  useEffect(() => { cargar(); api("/admin/resumen").then(setTablero).catch(() => {}); }, [cargar]);

  const crear = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const { id } = await api("/admin/clientes", { metodo: "POST", cuerpo: form });
      navegar(`/portal/admin/clientes/${id}`);
    } catch (err) {
      setError(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminShell titulo="Clientes">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em]">Clientes</h1>
        </div>
        <Link to="/portal/admin/auditoria" className="btn btn-ghost h-10 px-4 text-sm">Auditoría</Link>
      </div>

      {tablero && (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            ["Clientes", tablero.clientes],
            ["Proyectos activos", tablero.proyectos_activos],
            ["Por aprobar", tablero.por_aprobar],
            ["Fases atrasadas", tablero.fases_atrasadas, tablero.fases_atrasadas > 0],
            ["Accesos (7 días)", tablero.accesos_7_dias],
          ].map(([etiqueta, valor, alerta]) => (
            <div key={etiqueta} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{etiqueta}</p>
              <p className={`cifra mt-1 text-2xl font-extrabold ${alerta ? "text-destructive" : ""}`}>{valor}</p>
            </div>
          ))}
        </div>
      )}

      {error && <div className="mt-6"><Aviso tono="error">{error.message}</Aviso></div>}

      <form onSubmit={crear} className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_auto]">
        <Input aria-label="Nombre del cliente" placeholder="Nombre o empresa" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="h-11 bg-background" />
        <Input aria-label="Correo del titular" type="email" placeholder="Correo del titular" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-11 bg-background" />
        <button type="submit" disabled={guardando} className="btn btn-primary h-11 px-5 text-sm">Crear cliente</button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr><th className="p-4">Cliente</th><th className="p-4">Proyectos activos</th><th className="p-4">Último acceso</th><th className="p-4">Alta</th></tr>
          </thead>
          <tbody>
            {lista?.map((c) => (
              <tr key={c.id} className={`border-b border-border last:border-0 ${c.archivado_en ? "opacity-50" : ""}`}>
                <td className="p-4">
                  <Link to={`/portal/admin/clientes/${c.id}`} className="font-semibold text-primary hover:underline">{c.nombre}</Link>
                  <p className="text-xs text-muted-foreground">{c.email}{c.archivado_en ? " · archivado" : ""}</p>
                </td>
                <td className="p-4">{c.proyectos_activos}</td>
                <td className="p-4">{fecha(c.ultimo_acceso)}</td>
                <td className="p-4">{fecha(c.creado_en)}</td>
              </tr>
            ))}
            {lista?.length === 0 && <tr><td colSpan={4} className="p-6 text-muted-foreground">Todavía no hay clientes.</td></tr>}
            {!lista && !error && [0, 1, 2].map((i) => <tr key={i} aria-hidden="true"><td colSpan={4} className="p-4"><div className="esqueleto h-8" /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
