import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, Clock, Hourglass } from "lucide-react";
import PortalShell, { Aviso, Barra, Esqueleto } from "@/portal/PortalShell";
import { ESTADOS_FASE, api } from "@/portal/api";

const ICONOS = { completada: Check, en_curso: Clock, por_aprobar: Hourglass, pendiente: Circle };

const fechaCorta = (iso) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short" }) : null;

function Metrica({ etiqueta, valor, alerta }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{etiqueta}</p>
      <p className={`cifra mt-2 text-3xl font-extrabold tracking-tight ${alerta ? "text-destructive" : ""}`}>{valor}</p>
    </div>
  );
}

function Proyecto({ p }) {
  const hoy = new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en la hora local
  return (
    <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight">{p.nombre}</h2>
        <span className="font-mono text-sm font-semibold text-primary">{p.avance}%</span>
      </div>
      <div className="mt-4"><Barra valor={p.avance} /></div>
      {p.fase_actual && <p className="mt-3 text-sm text-muted-foreground">Ahora: <strong className="text-foreground">{p.fase_actual}</strong></p>}

      <ol className="mt-6 grid gap-3">
        {p.fases.map((f) => {
          const Icono = ICONOS[f.estado];
          const atrasada = f.estado !== "completada" && f.estimada_el && f.estimada_el < hoy;
          return (
            <li key={f.id} className="flex items-start gap-3 border-t border-border pt-3 text-sm">
              <Icono className={`mt-0.5 h-4 w-4 shrink-0 ${f.estado === "completada" ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">{f.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {ESTADOS_FASE[f.estado]}
                  {f.completada_el && ` · terminada el ${fechaCorta(f.completada_el)}`}
                  {!f.completada_el && f.estimada_el && ` · estimada para el ${fechaCorta(f.estimada_el)}`}
                  {atrasada && <span className="text-destructive"> · con atraso</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

export default function Resumen() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  const navegar = useNavigate();
  useEffect(() => {
    api("/cliente/resumen")
      .then(setDatos)
      .catch((e) => (e.status === 401 ? navegar("/portal/ingresar", { replace: true }) : setError(e)));
  }, [navegar]);

  const salir = async () => {
    await api("/auth/salir", { metodo: "POST" }).catch(() => {});
    window.location.assign("/");
  };

  return (
    <PortalShell
      titulo="Tu proyecto"
      acciones={datos && <button type="button" onClick={salir} className="btn btn-ghost h-10 px-4 text-sm">Salir</button>}
    >
      {error && (
        <Aviso tono="error">
          <p className="font-semibold">{error.message}</p>
          <p className="mt-2 text-muted-foreground">Si necesitas un enlace nuevo, escríbenos a contacto@maudev.cl.</p>
        </Aviso>
      )}
      {!error && !datos && <Esqueleto filas={2} />}
      {datos && (
        <>
          <span className="eyebrow">Portal de clientes</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Hola, {datos.cliente.nombre}.</h1>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Metrica etiqueta="Proyectos activos" valor={datos.metricas.proyectos_activos} />
            <Metrica etiqueta="Avance promedio" valor={`${datos.metricas.avance_promedio}%`} />
            <Metrica etiqueta="Por aprobar" valor={datos.metricas.fases_por_aprobar} />
            <Metrica etiqueta="Con atraso" valor={datos.metricas.fases_atrasadas} alerta={datos.metricas.fases_atrasadas > 0} />
          </div>
          <div className="mt-10 grid gap-6">
            {datos.proyectos.length === 0 && <Aviso>Todavía no hay proyectos cargados. Te avisaremos cuando empiece el primero.</Aviso>}
            {datos.proyectos.map((p) => <Proyecto key={p.id} p={p} />)}
          </div>
        </>
      )}
    </PortalShell>
  );
}
