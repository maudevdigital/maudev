import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api, fecha } from "@/portal/api";

// /portal/admin/clientes: alta y lista de clientes.
export default function Clientes() {
  const navegar = useNavigate();
  const [lista, setLista] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => api("/admin/clientes").then((d) => setLista(d.clientes)).catch(setError), []);
  useEffect(() => { cargar(); }, [cargar]);
  const visibles = lista?.filter((c) => `${c.nombre} ${c.email}`.toLowerCase().includes(filtro.trim().toLowerCase()));

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
      <Encabezado titulo="Clientes" bajada="Crea el cliente y, en su ficha, su proyecto y su enlace de acceso.">
        <input type="search" aria-label="Buscar cliente" placeholder="Buscar…" value={filtro} onChange={(e) => setFiltro(e.target.value)}
          className="h-10 w-56 rounded-md border border-input bg-background px-3 text-sm" />
      </Encabezado>

      {error && <div className="mt-6"><Aviso tono="error">{error.message}</Aviso></div>}

      <form onSubmit={crear} className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_auto]">
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
            {visibles?.map((c) => (
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
