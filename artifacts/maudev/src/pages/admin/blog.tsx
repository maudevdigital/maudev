import { useState, useRef } from "react";
import { useListAdminBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Search, Tag, Clock, DollarSign, ShoppingBag, Upload, ImagePlus, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  author: string;
  tags: string;
  adsenseSlotId: string;
  relatedProductIds: number[];
}

const emptyForm: BlogFormData = {
  title: "", content: "", excerpt: "", imageUrl: "", published: false,
  metaTitle: "", metaDescription: "", canonicalUrl: "", metaKeywords: "", author: "MauDev", tags: "",
  adsenseSlotId: "", relatedProductIds: [],
};

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
}

export default function AdminBlog() {
  const { data: posts, refetch } = useListAdminBlogPosts();
  const { data: products } = useListProducts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const { getToken } = useAuth();
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [preview, setPreview] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const mdInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImgRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads/file", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { filePath } = await res.json();
      return filePath;
    } catch {
      return null;
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadImage(file);
    if (url) setForm((prev) => ({ ...prev, imageUrl: url }));
    setUploadingCover(false);
    e.target.value = "";
  };

  const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    const url = await uploadImage(file);
    if (url) {
      const md = `![${file.name}](${url})`;
      const ta = contentRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = form.content.slice(0, start);
        const after = form.content.slice(end);
        const nl = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
        setForm((prev) => ({ ...prev, content: before + nl + md + "\n" + after }));
      } else {
        setForm((prev) => ({ ...prev, content: prev.content + "\n" + md + "\n" }));
      }
    }
    setUploadingInline(false);
    e.target.value = "";
  };

  const handleImportMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;

      // Try to parse structured fields from the MD file
      const contentSeparator = /={3,}\s*\n\s*CONTENIDO\s*\(MARKDOWN\)\s*\n\s*={3,}\n/i;
      const parts = text.split(contentSeparator);

      if (parts.length >= 2) {
        // Structured MD with field headers + content
        const header = parts[0];
        const content = parts.slice(1).join("").trim();

        const extract = (label: string): string => {
          const re = new RegExp(`${label}:\\s*\\n([\\s\\S]*?)(?=\\n[A-ZÁ-Ú ]+:\\s*\\n|\\n={3,}|$)`, "i");
          const m = header.match(re);
          return m ? m[1].trim() : "";
        };

        setForm((prev) => ({
          ...prev,
          title: extract("TITULO") || prev.title,
          excerpt: extract("EXTRACTO") || prev.excerpt,
          metaTitle: extract("META TITULO") || prev.metaTitle,
          metaDescription: extract("META DESCRIPCION") || prev.metaDescription,
          metaKeywords: extract("KEYWORDS") || prev.metaKeywords,
          tags: extract("TAGS") || prev.tags,
          author: extract("AUTOR") || prev.author,
          canonicalUrl: extract("URL CANONICA") || prev.canonicalUrl,
          content,
        }));
        setShowSeo(true);
      } else {
        // Plain markdown — dump into content only
        setForm((prev) => ({ ...prev, content: text }));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditing("new");
    setPreview(false);
    setShowSeo(false);
  };

  const startEdit = (post: any) => {
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl || "",
      published: post.published,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
      canonicalUrl: post.canonicalUrl || "",
      author: post.author || "MauDev",
      tags: post.tags || "",
      adsenseSlotId: post.adsenseSlotId || "",
      relatedProductIds: post.relatedProductIds || [],
    });
    setEditing(post.id);
    setPreview(false);
    setShowSeo(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.excerpt) return;
    try {
      const payload: any = { ...form };
      if (!payload.metaTitle) delete payload.metaTitle;
      if (!payload.metaDescription) delete payload.metaDescription;
      if (!payload.metaKeywords) delete payload.metaKeywords;
      if (!payload.canonicalUrl) delete payload.canonicalUrl;
      if (!payload.adsenseSlotId) delete payload.adsenseSlotId;
      if (!payload.relatedProductIds || payload.relatedProductIds.length === 0) delete payload.relatedProductIds;

      if (editing === "new") {
        await createPost.mutateAsync({ data: payload });
      } else if (typeof editing === "number") {
        await updatePost.mutateAsync({ id: editing, data: payload });
      }
      setEditing(null);
      setForm(emptyForm);
      refetch();
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar este post?")) return;
    try {
      await deletePost.mutateAsync({ id });
      refetch();
    } catch (e) {}
  };

  const metaDescLength = (form.metaDescription || form.excerpt).length;
  const metaTitleLength = (form.metaTitle || form.title).length;
  const wordCount = countWords(form.content);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (editing !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{editing === "new" ? "Nuevo Post" : "Editar Post"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-none font-mono text-xs gap-1" onClick={() => setShowSeo(!showSeo)}>
              <Search className="h-3 w-3" />
              {showSeo ? "CONTENIDO" : "SEO"}
            </Button>
            <Button variant="outline" size="sm" className="rounded-none font-mono text-xs gap-1" onClick={() => setPreview(!preview)}>
              {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {preview ? "EDITAR" : "PREVIEW"}
            </Button>
            <Button variant="outline" size="sm" className="rounded-none font-mono text-xs gap-1" onClick={() => { setEditing(null); setForm(emptyForm); }}>
              <X className="h-3 w-3" /> CANCELAR
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {readingTime} min lectura</span>
          <span>|</span>
          <span>{wordCount} palabras</span>
          <span>|</span>
          <span className={metaTitleLength > 60 ? "text-red-400" : metaTitleLength > 50 ? "text-yellow-400" : "text-green-400"}>
            Titulo SEO: {metaTitleLength}/60
          </span>
          <span>|</span>
          <span className={metaDescLength > 160 ? "text-red-400" : metaDescLength > 140 ? "text-yellow-400" : "text-green-400"}>
            Descripcion: {metaDescLength}/160
          </span>
        </div>

        {preview ? (
          <div className="border border-border/40 bg-card p-8">
            <div className="border border-border/20 bg-background/50 p-4 mb-6 space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground/60">PREVIEW DE GOOGLE</p>
              <p className="text-[#8ab4f8] text-lg truncate">{form.metaTitle || form.title || "Sin titulo"} — MauDev</p>
              <p className="text-[#bdc1c6] text-xs truncate">https://maudev.cl/blog/...</p>
              <p className="text-[#bdc1c6] text-sm line-clamp-2">{form.metaDescription || form.excerpt || "Sin descripcion"}</p>
            </div>

            {form.imageUrl && <img src={form.imageUrl} alt={form.title} className="w-full h-48 object-cover mb-6" />}
            <div className="flex items-center gap-3 mb-3 text-xs font-mono text-muted-foreground">
              <span className={form.published ? "text-green-400" : "text-yellow-400"}>{form.published ? "PUBLICADO" : "BORRADOR"}</span>
              <span>{readingTime} min lectura</span>
              <span>{form.author}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{form.title || "Sin titulo"}</h2>
            <p className="text-muted-foreground mb-4">{form.excerpt}</p>
            {form.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">
                    <Tag className="h-2.5 w-2.5" /> {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
            </div>
          </div>
        ) : showSeo ? (
          <div className="space-y-4">
            <div className="border border-primary/20 bg-primary/5 p-4 mb-4">
              <p className="font-mono text-xs text-primary mb-1">OPTIMIZACION SEO</p>
              <p className="text-xs text-muted-foreground">Estos campos controlan como aparece tu post en Google y redes sociales.</p>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                META TITULO <span className={`ml-2 ${metaTitleLength > 60 ? "text-red-400" : "text-green-400"}`}>({metaTitleLength}/60)</span>
              </label>
              <input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder={form.title || "Se usa el titulo del post si queda vacio..."}
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">Titulo que aparece en Google. Ideal: 50-60 caracteres con keyword principal.</p>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                META DESCRIPCION <span className={`ml-2 ${metaDescLength > 160 ? "text-red-400" : "text-green-400"}`}>({metaDescLength}/160)</span>
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                rows={3}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 resize-none"
                placeholder={form.excerpt || "Se usa el extracto si queda vacio..."}
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">Descripcion que aparece bajo el titulo en Google. Ideal: 140-160 caracteres.</p>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">KEYWORDS (SEPARADAS POR COMA)</label>
              <input
                value={form.metaKeywords}
                onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="trading, pine script, indicador, metatrader..."
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">Palabras clave principales para posicionamiento.</p>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">TAGS (SEPARADOS POR COMA)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="trading, pine script, analisis tecnico..."
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">Etiquetas visibles en el post. Mejoran la estructura semantica.</p>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">AUTOR</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="MauDev"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">URL CANONICA (OPCIONAL)</label>
              <input
                value={form.canonicalUrl}
                onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="https://maudev.cl/blog/mi-post (auto-generada si queda vacia)"
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">Solo usar si el contenido existe en otra URL y quieres evitar duplicados.</p>
            </div>

            <div className="border border-border/20 bg-background/50 p-4 space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground/60">PREVIEW DE GOOGLE</p>
              <p className="text-[#8ab4f8] text-lg truncate">{form.metaTitle || form.title || "Titulo del post"} — MauDev</p>
              <p className="text-[#bdc1c6] text-xs truncate">https://maudev.cl/blog/...</p>
              <p className="text-[#bdc1c6] text-sm line-clamp-2">{form.metaDescription || form.excerpt || "Descripcion del post..."}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">TITULO</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="Titulo del post..."
              />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">EXTRACTO</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 resize-none"
                placeholder="Breve descripcion del post..."
              />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">IMAGEN DE PORTADA</label>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              {form.imageUrl ? (
                <div className="relative border border-border/60 bg-background">
                  <img src={form.imageUrl} alt="Portada" className="w-full h-40 object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="p-1.5 bg-background/80 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={uploadingCover}
                    >
                      {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => setForm({ ...form, imageUrl: "" })}
                      className="p-1.5 bg-background/80 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full rounded-none font-mono text-xs gap-2 border-dashed border-border/60 h-24 justify-center"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                >
                  {uploadingCover ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> SUBIENDO...</>
                  ) : (
                    <><ImagePlus className="h-4 w-4" /> SUBIR IMAGEN DE PORTADA</>
                  )}
                </Button>
              )}
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-border/60 border-t-0 bg-background px-4 py-1.5 text-[10px] font-mono text-muted-foreground outline-none focus:border-primary/60"
                placeholder="...o pega una URL directamente"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-muted-foreground">CONTENIDO (MARKDOWN)</label>
                <div className="flex gap-1">
                  <input ref={inlineImgRef} type="file" accept="image/*" className="hidden" onChange={handleInlineImage} />
                  <Button
                    variant="outline" size="sm"
                    className="rounded-none font-mono text-[10px] gap-1 h-7"
                    onClick={() => inlineImgRef.current?.click()}
                    disabled={uploadingInline}
                  >
                    {uploadingInline ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />} IMAGEN
                  </Button>
                  <input ref={mdInputRef} type="file" accept=".md,.markdown,.txt" className="hidden" onChange={handleImportMd} />
                  <Button variant="outline" size="sm" className="rounded-none font-mono text-[10px] gap-1 h-7" onClick={() => mdInputRef.current?.click()}>
                    <Upload className="h-3 w-3" /> IMPORTAR .MD
                  </Button>
                </div>
              </div>
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={16}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 resize-y"
                placeholder="Escribe el contenido en Markdown..."
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">{wordCount} palabras · {readingTime} min lectura. Soporta Markdown con tablas, listas, encabezados y más.</p>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> ADSENSE SLOT ID (OPCIONAL)</span>
              </label>
              <input
                value={form.adsenseSlotId}
                onChange={(e) => setForm({ ...form, adsenseSlotId: e.target.value })}
                className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60"
                placeholder="1234567890"
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">ID del bloque de anuncios de Google AdSense. Se mostrara entre secciones del post.</p>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                <span className="inline-flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> PRODUCTOS RELACIONADOS (OPCIONAL)</span>
              </label>
              <div className="border border-border/60 bg-background p-3 space-y-2 max-h-48 overflow-y-auto">
                {products && products.length > 0 ? products.map((p: any) => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-1.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.relatedProductIds.includes(p.id)}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          relatedProductIds: e.target.checked
                            ? [...form.relatedProductIds, p.id]
                            : form.relatedProductIds.filter((id: number) => id !== p.id),
                        });
                      }}
                      className="rounded-none accent-primary"
                    />
                    <span className="text-sm font-mono truncate">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">${Number(p.price).toLocaleString("es-CL")}</span>
                  </label>
                )) : (
                  <p className="text-[10px] text-muted-foreground font-mono">No hay productos disponibles</p>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Se mostraran como tarjetas al final del post.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.published ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-muted-foreground">{form.published ? "Publicado" : "Borrador"}</span>
            </div>
          </div>
        )}

        <Button
          className="rounded-none font-mono text-sm gap-2"
          onClick={handleSave}
          disabled={createPost.isPending || updatePost.isPending}
        >
          {createPost.isPending || updatePost.isPending ? "GUARDANDO..." : "GUARDAR POST"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra las entradas del blog</p>
        </div>
        <Button className="rounded-none font-mono text-xs gap-2" onClick={startNew}>
          <Plus className="h-4 w-4" /> NUEVO POST
        </Button>
      </div>

      <div className="border border-border/40 bg-card">
        {!posts || posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground font-mono text-sm">No hay posts aun</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {posts.map((post) => {
              const hasSeo = !!(post as any).metaTitle || !!(post as any).metaDescription || !!(post as any).metaKeywords;
              return (
                <div key={post.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 border ${
                        post.published
                          ? "text-green-400 border-green-500/30 bg-green-500/10"
                          : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      }`}>
                        {post.published ? "PUBLICADO" : "BORRADOR"}
                      </span>
                      {hasSeo && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 border text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                          SEO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{post.excerpt}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-CL") : "Sin publicar"} &middot; /{post.slug}
                      {(post as any).readingTimeMin && ` \u00B7 ${(post as any).readingTimeMin} min`}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(post)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}