import { Show, useAuth } from "@clerk/react";
import { Redirect } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadField } from "@/components/FileUploadField";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@workspace/api-client-react";

type ProductForm = {
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  category: "trading_scripts" | "digital_service";
  subcategory: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  downloadUrl: string | null;
  manualUrl: string | null;
};

const DEFAULT_FORM: ProductForm = {
  name: "",
  description: "",
  price: 0,
  originalPrice: null,
  currency: "CLP",
  category: "trading_scripts",
  subcategory: "",
  imageUrl: "",
  featured: false,
  active: true,
  downloadUrl: null,
  manualUrl: null,
};

function AdminProductsContent() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setProducts(await res.json());
    } catch {}
    setIsLoading(false);
  }, [getToken]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(DEFAULT_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, originalPrice: form.originalPrice || null, downloadUrl: form.downloadUrl || null, manualUrl: form.manualUrl || null };
    if (editingId !== null) {
      updateProduct.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            fetchProducts();
            setShowForm(false);
            setEditingId(null);
            setForm(DEFAULT_FORM);
          },
        }
      );
    } else {
      createProduct.mutate(
        { data },
        {
          onSuccess: () => {
            fetchProducts();
            setShowForm(false);
            setForm(DEFAULT_FORM);
          },
        }
      );
    }
  };

  const handleEdit = (product: typeof products[0]) => {
    setForm({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      currency: product.currency,
      category: product.category as "trading_scripts" | "digital_service",
      subcategory: product.subcategory,
      imageUrl: product.imageUrl,
      featured: product.featured,
      active: product.active,
      downloadUrl: product.downloadUrl ?? null,
      manualUrl: product.manualUrl ?? null,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          fetchProducts();
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-primary mb-1">GESTIÓN</p>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} productos</p>
        </div>
        <Button
          className="rounded-none font-mono text-xs gap-2"
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(DEFAULT_FORM); }}
          data-testid="button-add-product"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "CANCELAR" : "NUEVO PRODUCTO"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-primary/30 bg-card p-6 mb-6">
          <h2 className="font-mono text-xs text-primary mb-4">{editingId ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Nombre", type: "text", required: true },
              { key: "price", label: "Precio actual (CLP)", type: "number", required: true },
              { key: "originalPrice", label: "Precio anterior (CLP) — tachado/descuento", type: "number", required: false },
              { key: "imageUrl", label: "URL Imagen", type: "url", required: true },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-mono text-muted-foreground block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={(form as any)[field.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: field.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value || null })}
                  required={field.required}
                  className="w-full border border-border/60 bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                  data-testid={`input-${field.key}`}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">TIPO DE PRODUCTO</label>
              <select
                value={form.subcategory}
                onChange={(e) => {
                  const sub = e.target.value;
                  const cat = (sub === "market_structure" || sub === "mt5_mql5") ? "trading_scripts" : "digital_service";
                  setForm({ ...form, subcategory: sub, category: cat as "trading_scripts" | "digital_service" });
                }}
                required
                className="w-full border border-border/60 bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                data-testid="select-subcategory"
              >
                <option value="" disabled>Seleccionar tipo…</option>
                <optgroup label="Trading Scripts">
                  <option value="market_structure">Indicador Pine Script v5 + Docs</option>
                  <option value="mt5_mql5">Indicador MT5 / MQL5 + Docs</option>
                </optgroup>
                <optgroup label="Servicios Digitales">
                  <option value="landing_page">Landing Page</option>
                  <option value="automation">Automatizaciones IA / n8n</option>
                  <option value="fullstack">Proyecto Full Stack</option>
                  <option value="mobile_app">App Móvil</option>
                </optgroup>
              </select>
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">Categoría: {form.category === "trading_scripts" ? "Trading Scripts" : "Servicio Digital"}</p>
            </div>
            {(form.subcategory === "market_structure" || form.subcategory === "mt5_mql5") && (
              <>
                <FileUploadField
                  label="ARCHIVO INDICADOR (.pine / .mq5 / .ex5)"
                  value={form.downloadUrl}
                  onChange={(p) => setForm({ ...form, downloadUrl: p })}
                  accept={form.subcategory === "market_structure" ? ".pine,.txt,.zip" : ".mq5,.ex5,.mq4,.ex4,.zip"}
                />
                <FileUploadField
                  label="MANUAL / DOCUMENTACIÓN POST-VENTA"
                  value={form.manualUrl}
                  onChange={(p) => setForm({ ...form, manualUrl: p })}
                  accept=".pdf,.doc,.docx,.zip"
                />
              </>
            )}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-mono text-muted-foreground block mb-1">DESCRIPCIÓN</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                required
                className="w-full border border-border/60 bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors resize-none"
                data-testid="input-description"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-primary"
                  data-testid="input-featured"
                />
                <span className="font-mono text-xs">DESTACADO</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-primary"
                  data-testid="input-active"
                />
                <span className="font-mono text-xs">ACTIVO</span>
              </label>
            </div>
            <div className="col-span-1 md:col-span-2">
              <Button
                type="submit"
                className="rounded-none font-mono text-xs gap-2"
                disabled={createProduct.isPending || updateProduct.isPending}
                data-testid="button-submit-product"
              >
                <Check className="h-4 w-4" />
                {editingId ? "ACTUALIZAR" : "CREAR PRODUCTO"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="border border-border/40 bg-card overflow-hidden">
        <div className="divide-y divide-border/40">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-muted-foreground">SIN PRODUCTOS</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between gap-4" data-testid={`card-product-${product.id}`}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img src={product.imageUrl} alt={product.name} className="h-12 w-16 object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      {product.featured && <Badge className="font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-1.5 py-0 shrink-0">DEST.</Badge>}
                      {!product.active && <Badge className="font-mono text-xs rounded-none border-0 bg-muted text-muted-foreground px-1.5 py-0 shrink-0">INACTIVO</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      {product.originalPrice ? (
                        <><span className="line-through opacity-60">${Number(product.originalPrice).toLocaleString("es-CL")}</span> → </>
                      ) : null}
                      ${Number(product.price).toLocaleString("es-CL")} CLP — {product.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(product)} data-testid={`button-edit-${product.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)} data-testid={`button-delete-${product.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <>
      <Show when="signed-in">
        <AdminProductsContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
