import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import AdminShell from "@/portal/admin/AdminShell";
import { Aviso, Barra, Esqueleto } from "@/portal/PortalShell";
import { ESTADOS_FASE, api, fecha } from "@/portal/api";
import { planes } from "@shared/oferta";

function Seccion({ titulo, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// El enlace se muestra una sola vez: el backend guarda solo su hash, así que si
// se cierra sin copiarlo hay que generar otro.
function EnlaceNuevo({ enlace, alCerrar }) {
  const copiar = async () => {
    await navigator.clipboard.writeText(enlace);
    toast.success("Enlace copiado");
  };
  return (
    <div className="rounded-xl border border-primary bg-background p-4" role="status">
      <p className="text-sm font-semibold">Enlace de acceso. Cópialo ahora: no se vuelve a mostrar.</p>
      <code className="mt-2 block break-all rounded-lg bg-secondary p-3 font-mono text-xs">{enlace}</code>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={copiar} className="btn btn-primary h-10 px-4 text-sm">Copiar</button>
        <button type="button" onClick={alCerrar} className="btn btn-ghost h-10 px-4 text-sm">Listo</button>
      </div>
    </div>
  );
}

export default function Cliente() {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [enlace, setEnlace] = useState(null);
  const [token, setToken] = useState({ etiqueta: "", dias: "" });
  const [planId, setPlanId] = useState(planes[0]?.id ?? "");

  const cargar = useCallback(() => api(`/admin/clientes/${id}`).then(setDatos).catch(setError), [id]);
  useEffect(() => { cargar(); }, [cargar]);

  // Toda acción recarga la ficha: lo que se ve es siempre lo que quedó en la base.
  const hacer = async (ruta, opciones, exito) => {
    try {
      const r = await api(ruta, opciones);
      if (exito) toast.success(exito);
      await cargar();
      return r;
    } catch (e) {
      toast.error(e.message);
      return null;
    }
  };

  const generarToken = async (e) => {
    e.preventDefault();
    const cuerpo = { etiqueta: token.etiqueta || undefined, dias: token.dias ? Number(token.dias) : undefined };
    const r = await hacer(`/admin/clientes/${id}/tokens`, { metodo: "POST", cuerpo });
    if (r) { setEnlace(r.enlace); setToken({ etiqueta: "", dias: "" }); }
  };

  if (error) return <AdminShell titulo="Cliente"><Aviso tono="error">{error.message}</Aviso></AdminShell>;
  if (!datos) return <AdminShell titulo="Cliente"><Esqueleto filas={2} /></AdminShell>;
  const { cliente, tokens, proyectos } = datos;
  const archivado = Boolean(cliente.archivado_en);

  return (
    <AdminShell titulo={cliente.nombre}>
      <Link to="/portal/admin" className="text-sm font-semibold text-primary hover:underline">← Clientes</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">{cliente.nombre}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{cliente.email}{archivado && " · archivado"}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/portal/admin/auditoria?cliente=${id}`} className="btn btn-ghost h-10 px-4 text-sm">Auditoría</Link>
          {!archivado && (
            <button type="button" className="btn btn-ghost h-10 px-4 text-sm"
              onClick={() => window.confirm("¿Archivar? Se corta su acceso al portal.") && hacer(`/admin/clientes/${id}/archivar`, { metodo: "POST", cuerpo: {} }, "Cliente archivado")}>
              Archivar
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Seccion titulo="Accesos al portal">
          {enlace && <div className="mb-4"><EnlaceNuevo enlace={enlace} alCerrar={() => setEnlace(null)} /></div>}
          {!archivado && (
            <form onSubmit={generarToken} className="grid gap-2 sm:grid-cols-[1fr_7rem_auto]">
              <Input aria-label="Etiqueta" placeholder="Para quién (ej. Gerencia)" value={token.etiqueta} onChange={(e) => setToken({ ...token, etiqueta: e.target.value })} className="h-10 bg-background" />
              <Input aria-label="Días de vigencia" type="number" min={1} max={730} placeholder="Días" value={token.dias} onChange={(e) => setToken({ ...token, dias: e.target.value })} className="h-10 bg-background" />
              <button type="submit" className="btn btn-primary h-10 px-4 text-sm">Generar</button>
            </form>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Sin días, el acceso no vence. Se puede revocar cuando quieras.</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {tokens.map((t) => (
              <li key={t.id} className={`flex items-center justify-between gap-3 border-t border-border pt-2 ${t.revocado_en ? "opacity-50" : ""}`}>
                <span>
                  <strong>{t.etiqueta || "Sin etiqueta"}</strong>
                  <span className="block text-xs text-muted-foreground">
                    {t.usos} {t.usos === 1 ? "uso" : "usos"} · último {fecha(t.ultimo_uso_en)}
                    {t.vence_en && ` · vence ${fecha(t.vence_en)}`}{t.revocado_en && " · revocado"}
                  </span>
                </span>
                {!t.revocado_en && (
                  <button type="button" className="text-xs font-semibold text-destructive hover:underline"
                    onClick={() => window.confirm("¿Revocar este acceso? La sesión abierta se corta al instante.") && hacer(`/admin/tokens/${t.id}/revocar`, { metodo: "POST", cuerpo: {} }, "Acceso revocado")}>
                    Revocar
                  </button>
                )}
              </li>
            ))}
            {tokens.length === 0 && <li className="text-muted-foreground">Sin accesos generados.</li>}
          </ul>
        </Seccion>

        <Seccion titulo="Proyectos">
          {!archivado && (
            <div className="flex gap-2">
              <select aria-label="Plan contratado" value={planId} onChange={(e) => setPlanId(e.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm">
                {planes.map((p) => <option key={p.id} value={p.id}>{p.capacidad} · {p.nombre}</option>)}
              </select>
              <button type="button" className="btn btn-primary h-10 px-4 text-sm"
                onClick={() => hacer(`/admin/clientes/${id}/proyectos`, { metodo: "POST", cuerpo: { plan_id: planId } }, "Proyecto creado")}>
                Crear proyecto
              </button>
            </div>
          )}
          <div className="mt-4 grid gap-5">
            {proyectos.map((p) => (
              <div key={p.id} className="border-t border-border pt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold">{p.nombre}</p>
                  <span className="font-mono text-sm text-primary">{p.avance}%</span>
                </div>
                <div className="mt-2"><Barra valor={p.avance} /></div>
                <ul className="mt-3 grid gap-2">
                  {p.fases.map((f) => (
                    <li key={f.id} className="grid items-center gap-2 text-sm sm:grid-cols-[1fr_9rem_9.5rem]">
                      <span>{f.orden}. {f.nombre}</span>
                      <select aria-label={`Estado de ${f.nombre}`} value={f.estado}
                        onChange={(e) => hacer(`/admin/fases/${f.id}`, { metodo: "PATCH", cuerpo: { estado: e.target.value } })}
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                        {Object.entries(ESTADOS_FASE).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                      </select>
                      <input type="date" aria-label={`Fecha estimada de ${f.nombre}`} value={f.estimada_el ?? ""}
                        onChange={(e) => hacer(`/admin/fases/${f.id}`, { metodo: "PATCH", cuerpo: { estimada_el: e.target.value || null } })}
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {proyectos.length === 0 && <p className="text-sm text-muted-foreground">Sin proyectos.</p>}
          </div>
        </Seccion>
      </div>
    </AdminShell>
  );
}
