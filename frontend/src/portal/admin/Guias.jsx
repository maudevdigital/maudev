import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/admin/guias: las guías del sitio. Publicar marca la guía como pública;
// "Actualizar sitio" reconstruye el sitio para que aparezca (2-3 minutos).
export default function Guias() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  useEffect(() => { api("/admin/articulos").then((d) => setLista(d.articulos)).catch(setError); }, []);

  const actualizarSitio = async () => {
    setActualizando(true);
    try {
      await api("/admin/publicar-sitio", { metodo: "POST", cuerpo: {} });
      toast.success("Sitio en actualización", { description: "Los cambios se ven en maudev.cl en 2 a 3 minutos." });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActualizando(false);
    }
  };

  return (
    <AdminShell titulo="Guías">
      <Encabezado titulo="Guías" bajada="Se escriben en Markdown. Después de publicar o editar, actualiza el sitio para que se vean.">
        <button type="button" onClick={actualizarSitio} disabled={actualizando} className="btn btn-ghost h-10 px-4 text-sm">
          <RefreshCw className={`h-4 w-4 ${actualizando ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" /> Actualizar sitio
        </button>
        <Link to="/portal/admin/guias/nueva" className="btn btn-primary h-10 px-4 text-sm"><Plus className="h-4 w-4" aria-hidden="true" /> Nueva guía</Link>
      </Encabezado>
      {error && <Aviso tono="error">{error.message}</Aviso>}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr><th className="p-4">Guía</th><th className="p-4">Estado</th><th className="p-4">Actualizada</th><th className="p-4">Largo</th></tr>
          </thead>
          <tbody>
            {lista?.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="p-4">
                  <Link to={`/portal/admin/guias/${a.id}`} className="font-semibold text-primary hover:underline">{a.titulo}</Link>
                  <p className="font-mono text-xs text-muted-foreground">/guias/{a.slug}</p>
                </td>
                <td className="p-4">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${a.estado === "publicado" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {a.estado === "publicado" ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="cifra p-4 text-muted-foreground">{a.actualizado_el}</td>
                <td className="cifra p-4 text-muted-foreground">{Math.round(a.largo / 6)} palabras</td>
              </tr>
            ))}
            {lista?.length === 0 && <tr><td colSpan={4} className="p-6 text-muted-foreground">Todavía no hay guías.</td></tr>}
            {!lista && !error && [0, 1].map((i) => <tr key={i} aria-hidden="true"><td colSpan={4} className="p-4"><div className="esqueleto h-8" /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
