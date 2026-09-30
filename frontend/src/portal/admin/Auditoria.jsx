import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

export default function Auditoria() {
  const [params] = useSearchParams();
  const cliente = params.get("cliente");
  const [eventos, setEventos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/admin/auditoria${cliente ? `?cliente=${encodeURIComponent(cliente)}` : ""}`)
      .then((d) => setEventos(d.eventos))
      .catch(setError);
  }, [cliente]);

  return (
    <AdminShell titulo="Auditoría">
      {cliente && <Link to={`/portal/admin/clientes/${cliente}`} className="text-sm font-semibold text-primary hover:underline">← Volver al cliente</Link>}
      <Encabezado titulo="Auditoría" bajada={`Últimos 200 cambios${cliente ? " de este cliente" : ""}.`} />
      {error && <div className="mt-6"><Aviso tono="error">{error.message}</Aviso></div>}
      <ol className="grid gap-2 font-mono text-xs">
        {eventos?.map((e) => (
          <li key={e.id} className="grid gap-1 rounded-lg border border-border bg-card p-3 sm:grid-cols-[11rem_12rem_1fr]">
            <span className="text-muted-foreground">{new Date(e.creado_en * 1000).toLocaleString("es-CL")}</span>
            <span className="font-semibold text-primary">{e.accion}</span>
            <span className="break-all">{e.actor}{e.detalle ? ` · ${e.detalle}` : ""}</span>
          </li>
        ))}
        {eventos?.length === 0 && <li className="text-muted-foreground">Sin eventos.</li>}
      </ol>
    </AdminShell>
  );
}
