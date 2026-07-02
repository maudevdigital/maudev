import { useState, useEffect, useRef } from "react";
import { api } from "@/api/maudev";
import { projects as staticProjects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ExternalLink, ImageIcon, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

const statusLabels = { published: "Publicado", draft: "Borrador" };

const defaultForm = {
  title: "",
  tagline: "",
  description: "",
  stack: [],
  industry: "",
  role: "",
  image_url: "",
  project_url: "",
  featured: false,
  status: "published",
  sort_order: 0,
};

const COLORS = [
  "from-foreground/10 to-foreground/5",
  "from-foreground/10 to-foreground/5",
  "from-foreground/10 to-foreground/5",
  "from-foreground/10 to-foreground/5",
  "from-foreground/10 to-foreground/5",
];

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [stackText, setStackText] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    const data = await api.entities.Project.list("sort_order", 100).catch(() => []);
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects(
        staticProjects.map((p) => ({
          ...p,
          image_url: p.image_url || p.image,
          project_url: p.project_url || p.url,
          _isStatic: true,
        }))
      );
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setStackText("");
    setOpen(true);
  };

  const openEdit = (p) => {
    if (p._isStatic) {
      toast.info("Este proyecto es estático (del archivo local). Crea uno nuevo para editarlo desde el panel.");
      return;
    }
    setEditing(p);
    setForm({
      title: p.title || "",
      tagline: p.tagline || "",
      description: p.description || "",
      stack: p.stack || [],
      industry: p.industry || "",
      role: p.role || "",
      image_url: p.image_url || "",
      project_url: p.project_url || "",
      featured: p.featured ?? false,
      status: p.status || "published",
      sort_order: p.sort_order || 0,
    });
    setStackText((p.stack || []).join(", "));
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return toast.error("El título es obligatorio.");
    setSaving(true);
    const data = {
      ...form,
      stack: stackText.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api.entities.Project.update(editing.id, data);
        toast.success("Proyecto actualizado.");
      } else {
        await api.entities.Project.create(data);
        toast.success("Proyecto creado.");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error("Error al guardar: " + (e?.message || "intenta nuevamente."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (project?._isStatic) {
      toast.info("Los proyectos estáticos no se pueden eliminar desde el panel. Edita el archivo projects.js.");
      return;
    }
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    await api.entities.Project.delete(id);
    toast.success("Proyecto eliminado.");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
      toast.success("Imagen subida correctamente.");
    } catch {
      toast.error("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Portafolio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center text-muted-foreground text-sm">
          No hay proyectos aún. Crea el primero.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors flex flex-col"
            >
              <div
                className={`h-32 bg-linear-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center relative`}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black tracking-tight text-foreground/20">
                    {p.title}
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {p._isStatic && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      Local
                    </span>
                  )}
                  {p.featured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary text-primary-foreground">
                      Destacado
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      p.status === "published"
                        ? "bg-foreground text-background border-transparent"
                        : "bg-secondary text-muted-foreground border-border"
                    }`}
                  >
                    {statusLabels[p.status] || p.status}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm leading-snug">{p.title}</h3>
                  {p.project_url && (
                    <a
                      href={p.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                {p.tagline && (
                  <p className="text-xs text-muted-foreground mb-2">{p.tagline}</p>
                )}
                {(p.stack || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                    {p.stack.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1 flex-1"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-auto max-w-2xl h-[95dvh] sm:h-auto sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Título *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="SystemePro"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Tagline</label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  placeholder="SaaS de captación de leads"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground uppercase">Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Descripción detallada del proyecto..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground uppercase">Stack (separado por comas)</label>
              <Input
                value={stackText}
                onChange={(e) => setStackText(e.target.value)}
                placeholder="React, Node.js, Supabase, Tailwind"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Industria</label>
                <Input
                  value={form.industry}
                  onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                  placeholder="SaaS / Marketing"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Rol</label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Desarrollo full stack"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground uppercase">URL del proyecto</label>
              <Input
                value={form.project_url}
                onChange={(e) => setForm((f) => ({ ...f, project_url: e.target.value }))}
                placeholder="https://ejemplo.com"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Imagen</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://... o sube una imagen"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 shrink-0"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <ImageIcon className="h-4 w-4" />
                  {uploading ? "Subiendo..." : "Subir"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Estado</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Orden</label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                  min={0}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Destacado</label>
                <Button
                  type="button"
                  variant={form.featured ? "default" : "outline"}
                  size="sm"
                  className="w-full h-10 gap-2"
                  onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                >
                  {form.featured ? (
                    <><Star className="h-4 w-4" /> Sí</>
                  ) : (
                    <><StarOff className="h-4 w-4" /> No</>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? "Guardando..." : editing ? "Actualizar" : "Crear proyecto"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
