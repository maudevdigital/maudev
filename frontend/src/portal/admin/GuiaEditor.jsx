import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso, Esqueleto } from "@/portal/PortalShell";
import { api } from "@/portal/api";
import { markdownAHtml } from "@/lib/markdown";

// /portal/admin/guias/nueva y /portal/admin/guias/:id. La vista previa usa el
// mismo conversor que el build, así que lo que se ve acá es lo que se publica.
const CATEGORIAS = [["ley-21719", "Ley 21.719"], ["ia", "IA aplicada"], ["desarrollo", "Desarrollo"], ["soporte", "Soporte"], ["general", "General"]];
const VACIA = { slug: "", titulo: "", descripcion: "", categoria: "ley-21719", contenido: "" };

const aSlug = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export default function GuiaEditor() {
  const { id } = useParams();
  const nueva = !id;
  const navegar = useNavigate();
  const [f, setF] = useState(nueva ? VACIA : null);
  const [estado, setEstado] = useState("borrador");
  const [slugTocado, setSlugTocado] = useState(!nueva);
  const [vista, setVista] = useState("escribir");
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (nueva) return;
    api(`/admin/articulos/${id}`).then(({ articulo: a }) => {
      setF({ slug: a.slug, titulo: a.titulo, descripcion: a.descripcion, categoria: a.categoria, contenido: a.contenido });
      setEstado(a.estado);
    }).catch(setError);
  }, [id, nueva]);

  const html = useMemo(() => (f ? markdownAHtml(f.contenido) : ""), [f]);
  const campo = (k) => (e) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, [k]: v, ...(k === "titulo" && !slugTocado ? { slug: aSlug(v) } : {}) }));
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      if (nueva) {
        const { id: nuevoId } = await api("/admin/articulos", { metodo: "POST", cuerpo: f });
        toast.success("Guía creada como borrador");
        navegar(`/portal/admin/guias/${nuevoId}`, { replace: true });
      } else {
        await api(`/admin/articulos/${id}`, { metodo: "PUT", cuerpo: f });
        toast.success("Cambios guardados", { description: estado === "publicado" ? "Actualiza el sitio para que se vean." : undefined });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (nuevo) => {
    try {
      await api(`/admin/articulos/${id}/estado`, { metodo: "POST", cuerpo: { estado: nuevo } });
      setEstado(nuevo);
      toast.success(nuevo === "publicado" ? "Guía publicada" : "Guía despublicada", { description: "Actualiza el sitio desde el listado para que se refleje." });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const eliminar = async () => {
    if (!window.confirm("¿Eliminar esta guía? No se puede deshacer.")) return;
    try {
      await api(`/admin/articulos/${id}`, { metodo: "DELETE" });
      toast.success("Guía eliminada");
      navegar("/portal/admin/guias");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (error) return <AdminShell titulo="Guía"><Aviso tono="error">{error.message}</Aviso></AdminShell>;
  if (!f) return <AdminShell titulo="Guía"><Esqueleto filas={2} /></AdminShell>;

  return (
    <AdminShell titulo={f.titulo || "Nueva guía"}>
      <Link to="/portal/admin/guias" className="text-sm font-semibold text-primary hover:underline">← Guías</Link>
      <div className="mt-4">
        <Encabezado titulo={nueva ? "Nueva guía" : f.titulo} bajada={nueva ? "Nace como borrador." : estado === "publicado" ? "Publicada" : "Borrador"}>
          {!nueva && estado === "publicado" && (
            <a href={`/guias/${f.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 px-4 text-sm"><ExternalLink className="h-4 w-4" aria-hidden="true" /> Ver</a>
          )}
          {!nueva && (
            <button type="button" onClick={() => cambiarEstado(estado === "publicado" ? "borrador" : "publicado")} className="btn btn-ghost h-10 px-4 text-sm">
              {estado === "publicado" ? "Despublicar" : "Publicar"}
            </button>
          )}
          <button type="button" onClick={guardar} disabled={guardando} className="btn btn-primary h-10 px-5 text-sm">{nueva ? "Crear borrador" : "Guardar"}</button>
        </Encabezado>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">Título
          <Input value={f.titulo} onChange={campo("titulo")} maxLength={120} className="h-11 bg-background" />
        </label>
        <div className="grid grid-cols-[1fr_11rem] gap-3">
          <label className="grid gap-1.5 text-sm font-semibold">Dirección
            <div className="flex h-11 items-center rounded-md border border-input bg-background pl-3 text-sm">
              <span className="text-muted-foreground">/guias/</span>
              <input value={f.slug} onChange={(e) => { setSlugTocado(true); setF({ ...f, slug: e.target.value }); }} className="h-full min-w-0 flex-1 bg-transparent pr-3 outline-none" />
            </div>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">Categoría
            <select value={f.categoria} onChange={campo("categoria")} className="h-11 rounded-md border border-input bg-background px-3 text-sm">
              {CATEGORIAS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </label>
        </div>
        <label className="grid gap-1.5 text-sm font-semibold lg:col-span-2">
          <span className="flex justify-between">Descripción para Google
            <span className={`cifra font-mono text-xs ${f.descripcion.length > 170 || f.descripcion.length < 50 ? "text-destructive" : "text-muted-foreground"}`}>{f.descripcion.length}/50-170</span>
          </span>
          <Input value={f.descripcion} onChange={campo("descripcion")} maxLength={170} className="h-11 bg-background" />
        </label>
      </div>

      <div className="mt-6 flex gap-1 xl:hidden" role="tablist">
        {[["escribir", "Escribir"], ["vista", "Vista previa"]].map(([v, t]) => (
          <button key={v} type="button" role="tab" aria-selected={vista === v} onClick={() => setVista(v)}
            className={`h-9 rounded-md px-3 text-sm font-semibold ${vista === v ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-3 grid gap-4 xl:mt-6 xl:grid-cols-2">
        <div className={vista === "escribir" ? "" : "hidden xl:block"}>
          <Textarea value={f.contenido} onChange={campo("contenido")} rows={28} aria-label="Contenido en Markdown"
            className="min-h-[32rem] bg-background font-mono text-sm leading-relaxed" placeholder={"## Subtítulo\n\nTexto con **negrita** y [enlaces](/ley-21719).\n\n- Listas\n- de puntos"} />
          <p className="mt-2 text-xs text-muted-foreground">Markdown: ## subtítulo · **negrita** · [texto](/ruta) · - lista · | tabla |. El HTML directo se muestra como texto.</p>
        </div>
        <div className={`rounded-xl border border-border bg-card p-6 ${vista === "vista" ? "" : "hidden xl:block"}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Vista previa</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{f.titulo || "Título de la guía"}</h2>
          <div className="guia-contenido mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      {!nueva && (
        <button type="button" onClick={eliminar} className="mt-10 text-sm font-semibold text-destructive hover:underline">Eliminar guía</button>
      )}
    </AdminShell>
  );
}
