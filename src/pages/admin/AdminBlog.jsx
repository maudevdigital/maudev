import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import ReactQuill from "react-quill";

const categoryLabels = {
  trading: "Trading",
  desarrollo: "Desarrollo",
  automatizacion: "Automatización",
  fintech: "Fintech",
  tutoriales: "Tutoriales",
};

const defaultForm = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "",
  category: "trading", status: "draft", author: "", tags: [],
  meta_title: "", meta_description: "", read_time: 5,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.entities.BlogPost.list("-created_date", 100).then(setPosts);

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setTagsText("");
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "", slug: p.slug || "", excerpt: p.excerpt || "",
      content: p.content || "", cover_image: p.cover_image || "",
      category: p.category || "trading", status: p.status || "draft",
      author: p.author || "", tags: p.tags || [],
      meta_title: p.meta_title || "", meta_description: p.meta_description || "",
      read_time: p.read_time || 5,
    });
    setTagsText((p.tags || []).join(", "));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    if (editing) {
      await api.entities.BlogPost.update(editing.id, data);
      toast.success("Artículo actualizado.");
    } else {
      await api.entities.BlogPost.create(data);
      toast.success("Artículo creado.");
    }
    setSaving(false);
    setOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este artículo?")) return;
    await api.entities.BlogPost.delete(id);
    toast.success("Artículo eliminado.");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await api.integrations.Core.UploadFile({ file });
    setForm({ ...form, cover_image: file_url });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} artículos</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Artículo
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs font-mono text-muted-foreground uppercase">
                <th className="text-left p-4">Artículo</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.excerpt}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono">{categoryLabels[p.category] || p.category}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      p.status === "published" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground font-mono">
                    {moment(p.created_date).format("DD/MM/YY")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Título</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-background border-border" />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Slug URL</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generado" className="bg-background border-border" />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Extracto</label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="bg-background border-border" rows={2} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Contenido</label>
              <ReactQuill value={form.content} onChange={(v) => setForm({ ...form, content: v })} theme="snow" className="bg-background rounded-md [&_.ql-toolbar]:border-border [&_.ql-container]:border-border [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-foreground" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Categoría</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Estado</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Tiempo lectura (min)</label>
                <Input type="number" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: parseInt(e.target.value) || 5 })} className="bg-background border-border" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Autor</label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-background border-border" />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Tags (separados por coma)</label>
                <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="bg-background border-border" />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Imagen de portada</label>
              {form.cover_image && <img src={form.cover_image} alt="" className="h-20 rounded-md mb-2 object-cover" />}
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-background border-border" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Meta Title (SEO)</label>
                <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="bg-background border-border" />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Meta Description (SEO)</label>
                <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="bg-background border-border" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Guardando..." : editing ? "Actualizar" : "Crear Artículo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}