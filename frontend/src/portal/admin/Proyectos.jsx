import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso, Barra } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/admin/proyectos: todos los proyectos, activos primero.
export default function Proyectos() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { api("/admin/proyectos").then((d) => setLista(d.proyectos)).catch(setError); }, []);

  return (
    <AdminShell titulo="Proyectos">
      <Encabezado titulo="Proyectos" bajada="Se crean desde la ficha de cada cliente, con las fases del plan contratado." />
      {error && <Aviso tono="error">{error.message}</Aviso>}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr><th className="p-4">Proyecto</th><th className="p-4">Cliente</th><th className="p-4">Fase actual</th><th className="w-48 p-4">Avance</th><th className="p-4">Alertas</th></tr>
          </thead>
          <tbody>
            {lista?.map((p) => (
              <tr key={p.id} className={`border-b border-border last:border-0 ${p.estado !== "activo" ? "opacity-50" : ""}`}>
                <td className="p-4 font-semibold">{p.nombre}</td>
                <td className="p-4"><Link to={`/portal/admin/clientes/${p.cliente_id}`} className="text-primary hover:underline">{p.cliente}</Link></td>
                <td className="p-4 text-muted-foreground">{p.fase_actual ?? "Terminado"}</td>
                <td className="p-4"><div className="flex items-center gap-3"><Barra valor={p.avance} /><span className="cifra w-10 text-right font-mono text-xs">{p.avance}%</span></div></td>
                <td className="p-4 text-xs">
                  {p.atrasadas > 0 && <span className="mr-2 rounded bg-destructive/10 px-2 py-0.5 font-semibold text-destructive">{p.atrasadas} atrasada{p.atrasadas > 1 ? "s" : ""}</span>}
                  {p.por_aprobar > 0 && <span className="rounded bg-secondary px-2 py-0.5 font-semibold">{p.por_aprobar} por aprobar</span>}
                </td>
              </tr>
            ))}
            {lista?.length === 0 && <tr><td colSpan={5} className="p-6 text-muted-foreground">Todavía no hay proyectos.</td></tr>}
            {!lista && !error && [0, 1, 2].map((i) => <tr key={i} aria-hidden="true"><td colSpan={5} className="p-4"><div className="esqueleto h-8" /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
