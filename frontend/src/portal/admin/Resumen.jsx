import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { api } from "@/portal/api";

// /portal/admin: lo que hay que atender hoy, antes que cualquier lista.
function Kpi({ etiqueta, valor, to, alerta }) {
  return (
    <Link to={to} className="panel-hover rounded-xl border border-border bg-card p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{etiqueta}</p>
      <p className={`cifra mt-1 text-2xl font-extrabold ${alerta ? "text-destructive" : ""}`}>{valor ?? "–"}</p>
    </Link>
  );
}

const cuando = (texto) => {
  const d = new Date(`${String(texto).replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
};

export default function Resumen() {
  const [t, setT] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    api("/admin/resumen").then(setT).catch(() => {});
    api("/admin/contactos").then((d) => setContactos(d.contactos.slice(0, 5))).catch(() => {});
    api("/admin/auditoria").then((d) => setEventos(d.eventos.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <AdminShell titulo="Resumen">
      <Encabezado titulo="Resumen" bajada="Lo que conviene mirar primero." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi etiqueta="Contactos (7 días)" valor={t?.contactos_7_dias} to="/portal/admin/contactos" />
        <Kpi etiqueta="Derechos pendientes" valor={t?.derechos_pendientes} to="/portal/admin/derechos" alerta={t?.derechos_por_vencer > 0} />
        <Kpi etiqueta="Proyectos activos" valor={t?.proyectos_activos} to="/portal/admin/proyectos" />
        <Kpi etiqueta="Fases atrasadas" valor={t?.fases_atrasadas} to="/portal/admin/proyectos" alerta={t?.fases_atrasadas > 0} />
        <Kpi etiqueta="Clientes" valor={t?.clientes} to="/portal/admin/clientes" />
        <Kpi etiqueta="Por aprobar" valor={t?.por_aprobar} to="/portal/admin/proyectos" />
        <Kpi etiqueta="Accesos al portal (7 días)" valor={t?.accesos_7_dias} to="/portal/admin/clientes" />
        <Kpi etiqueta="Derechos por vencer" valor={t?.derechos_por_vencer} to="/portal/admin/derechos" alerta={t?.derechos_por_vencer > 0} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Últimos contactos</h2>
            <Link to="/portal/admin/contactos" className="text-xs font-semibold text-primary hover:underline">Ver todos</Link>
          </div>
          <ul className="mt-3 divide-y divide-border text-sm">
            {contactos.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{c.name || c.email || c.whatsapp}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.interest || c.message || "Sin detalle"}</span>
                </span>
                <span className="cifra shrink-0 text-xs text-muted-foreground">{cuando(c.created_at)}</span>
              </li>
            ))}
            {contactos.length === 0 && <li className="py-2.5 text-muted-foreground">Sin contactos todavía.</li>}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Actividad reciente</h2>
            <Link to="/portal/admin/auditoria" className="text-xs font-semibold text-primary hover:underline">Ver auditoría</Link>
          </div>
          <ul className="mt-3 divide-y divide-border text-sm">
            {eventos.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 truncate"><span className="font-mono text-xs text-primary">{e.accion}</span> <span className="text-muted-foreground">· {e.actor}</span></span>
                <span className="cifra shrink-0 text-xs text-muted-foreground">{new Date(e.creado_en * 1000).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}</span>
              </li>
            ))}
            {eventos.length === 0 && <li className="py-2.5 text-muted-foreground">Sin actividad todavía.</li>}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
