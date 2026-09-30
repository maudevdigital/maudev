import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/admin/derechos: solicitudes ARCOP con su plazo legal de 30 días. La
// respuesta se envía por correo; acá se deja constancia de que se respondió.
const TIPOS = { acceso: "Acceso", rectificacion: "Rectificación", supresion: "Supresión", oposicion: "Oposición", portabilidad: "Portabilidad", bloqueo: "Bloqueo" };

function estado(s, hoy) {
  if (s.respondida_el) return ["Respondida", "bg-secondary text-muted-foreground"];
  if (s.vence_el < hoy) return ["Vencida", "bg-destructive/10 text-destructive"];
  const dias = Math.round((new Date(s.vence_el) - new Date(hoy)) / 86400000);
  return dias <= 5 ? [`Vence en ${dias} d`, "bg-destructive/10 text-destructive"] : [`Vence en ${dias} d`, "bg-secondary"];
}

export default function Derechos() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const cargar = useCallback(() => api("/admin/derechos").then(setDatos).catch(setError), []);
  useEffect(() => { cargar(); }, [cargar]);

  const responder = async (folio) => {
    if (!window.confirm(`¿Marcar la solicitud ${folio} como respondida? Hazlo después de enviar la respuesta por correo.`)) return;
    try {
      await api(`/admin/derechos/${folio}/responder`, { metodo: "POST", cuerpo: {} });
      toast.success("Solicitud marcada como respondida");
      cargar();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AdminShell titulo="Derechos ARCOP">
      <Encabezado titulo="Derechos ARCOP" bajada="Plazo legal: 30 días corridos. Verifica la identidad antes de entregar o modificar datos." />
      {error && <Aviso tono="error">{error.message}</Aviso>}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr><th className="p-4">Folio</th><th className="p-4">Derecho</th><th className="p-4">Persona</th><th className="p-4">Estado</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {datos?.solicitudes.map((s) => {
              const [texto, clase] = estado(s, datos.hoy);
              return (
                <tr key={s.folio} className="border-b border-border align-top last:border-0">
                  <td className="cifra p-4 font-mono text-xs">{s.folio}</td>
                  <td className="p-4 font-semibold">{TIPOS[s.tipo] ?? s.tipo}</td>
                  <td className="p-4">
                    <a href={`mailto:${s.email}?subject=${encodeURIComponent(`Tu solicitud ${s.folio}`)}`} className="text-primary hover:underline">{s.nombre || s.email}</a>
                    {s.detalle && <p className="mt-1 max-w-md text-xs text-muted-foreground">{s.detalle}</p>}
                  </td>
                  <td className="p-4"><span className={`rounded px-2 py-0.5 text-xs font-semibold ${clase}`}>{texto}</span></td>
                  <td className="p-4 text-right">
                    {!s.respondida_el && <button type="button" onClick={() => responder(s.folio)} className="btn btn-ghost h-9 px-3 text-xs">Marcar respondida</button>}
                  </td>
                </tr>
              );
            })}
            {datos?.solicitudes.length === 0 && <tr><td colSpan={5} className="p-6 text-muted-foreground">No hay solicitudes.</td></tr>}
            {!datos && !error && [0, 1].map((i) => <tr key={i} aria-hidden="true"><td colSpan={5} className="p-4"><div className="esqueleto h-8" /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
