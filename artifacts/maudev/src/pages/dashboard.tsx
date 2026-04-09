import { Show, useUser, useAuth } from "@clerk/react";
import { Redirect, Link, useSearch } from "wouter";
import { Package, Download, Clock, CheckCircle, XCircle, ExternalLink, Bell, BellOff, Loader2, CreditCard, RefreshCw, Trash2, Mail, ArrowRight, ShieldCheck, AlertTriangle, RotateCcw, ChevronDown, ChevronUp, FileText, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListOrders } from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import SEOHead from "@/components/seo-head";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "PENDIENTE", color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10", icon: Clock },
  paid: { label: "PAGADO", color: "text-green-500 border-green-500/30 bg-green-500/10", icon: CheckCircle },
  failed: { label: "FALLIDO", color: "text-red-500 border-red-500/30 bg-red-500/10", icon: XCircle },
  refunded: { label: "REEMBOLSADO", color: "text-blue-500 border-blue-500/30 bg-blue-500/10", icon: CheckCircle },
};

function RetryPaymentButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleRetry = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/orders/${orderId}/retry`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      disabled={loading}
      size="sm"
      className="rounded-none font-mono text-xs gap-1.5 h-8"
    >
      {loading ? (
        <><Loader2 className="h-3 w-3 animate-spin" /> REDIRIGIENDO...</>
      ) : (
        <><CreditCard className="h-3 w-3" /> COMPLETAR PAGO</>
      )}
    </Button>
  );
}

function DeleteOrderButton({ orderId, onDeleted }: { orderId: number; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este pedido pendiente?")) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) onDeleted();
    } catch {}
    setLoading(false);
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      size="sm"
      variant="ghost"
      className="rounded-none font-mono text-xs gap-1.5 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <><Trash2 className="h-3 w-3" /> ELIMINAR</>
      )}
    </Button>
  );
}

function NewsletterSection({ userEmail }: { userEmail: string }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (res.ok) setSubscribed(true);
    } catch {}
    setLoading(false);
  };

  if (subscribed) {
    return (
      <div className="border border-green-500/30 bg-green-500/5 p-5 flex items-center gap-4">
        <Bell className="h-5 w-5 text-green-400 shrink-0" />
        <div>
          <p className="font-mono text-xs text-green-400 mb-0.5">NEWSLETTER ACTIVO</p>
          <p className="text-sm text-muted-foreground">Recibirás actualizaciones de nuevos indicadores y análisis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/40 bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1">
        <BellOff className="h-5 w-5 text-muted-foreground shrink-0" />
        <div>
          <p className="font-mono text-xs text-muted-foreground mb-0.5">NEWSLETTER</p>
          <p className="text-sm text-muted-foreground">Suscríbete para recibir actualizaciones y nuevas herramientas.</p>
        </div>
      </div>
      <Button
        onClick={subscribe}
        disabled={loading}
        variant="outline"
        className="rounded-none font-mono text-xs shrink-0 border-border/60 gap-2"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
        SUSCRIBIRME
      </Button>
    </div>
  );
}

function resolveFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

function AuthenticatedDownloadButton({
  url,
  label,
  icon: Icon,
}: {
  url: string;
  label: string;
  icon: typeof Download;
}) {
  const { getToken } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
      return;
    }
    setDownloading(true);
    try {
      const token = await getToken();
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Error al descargar");
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? decodeURIComponent(match[1]) : "archivo";
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("Error al descargar el archivo. Intenta de nuevo.");
    }
    setDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 font-mono text-xs text-primary border border-primary/30 bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors w-full justify-center disabled:opacity-50"
    >
      {downloading ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> DESCARGANDO...</>
      ) : (
        <><Icon className="h-4 w-4" /> {label}</>
      )}
    </button>
  );
}

function categoryLabel(cat: string | null): string {
  if (cat === "trading_scripts") return "Trading Script";
  return "Servicio Digital";
}

function PaidOrderCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const downloadHref = resolveFileUrl(order.downloadUrl);
  const manualHref = resolveFileUrl(order.manualUrl);
  const isScript = order.productCategory === "trading_scripts";

  return (
    <div className="border border-green-500/20 bg-green-500/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-green-500/10 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{order.productName}</h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Orden #{order.id} · {new Date(order.paidAt || order.createdAt).toLocaleDateString("es-CL")} · ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge className="font-mono text-xs rounded-none border border-green-500/30 bg-green-500/10 text-green-400">
            PAGADO
          </Badge>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-green-500/15 px-5 py-5 space-y-4">
          {isScript ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 border border-border/30 bg-background/50 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs text-primary">INDICADOR / HERRAMIENTA</span>
                </div>
                {downloadHref ? (
                  <AuthenticatedDownloadButton url={downloadHref} label="DESCARGAR ARCHIVO" icon={Download} />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono py-3 justify-center">
                    <Clock className="h-3.5 w-3.5" />
                    Archivo no disponible aún
                  </div>
                )}
              </div>
              <div className="p-4 border border-border/30 bg-background/50 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs text-primary">MANUAL DE USO</span>
                </div>
                {manualHref ? (
                  <AuthenticatedDownloadButton url={manualHref} label="VER MANUAL" icon={ExternalLink} />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono py-3 justify-center">
                    <Clock className="h-3.5 w-3.5" />
                    Manual no disponible aún
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 border border-primary/20 bg-primary/5 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-mono text-xs text-primary mb-1">SERVICIO CONTRATADO</p>
                  <p className="text-sm text-muted-foreground">
                    Tu compra ha sido registrada exitosamente. Nuestro equipo te contactará dentro de las próximas <span className="text-foreground font-medium">24 horas</span> para coordinar los detalles del proyecto.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2 p-3 border border-border/20 bg-background/30">
                  <Mail className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] text-primary mb-0.5">PASO 1</p>
                    <p className="text-xs text-muted-foreground">Recibirás un email de confirmación con los próximos pasos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border border-border/20 bg-background/30">
                  <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] text-primary mb-0.5">PASO 2</p>
                    <p className="text-xs text-muted-foreground">Coordinamos requerimientos y plazos de entrega contigo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border border-border/20 bg-background/30">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] text-primary mb-0.5">PASO 3</p>
                    <p className="text-xs text-muted-foreground">Desarrollo, revisiones y entrega final del proyecto.</p>
                  </div>
                </div>
              </div>
              {(downloadHref || manualHref) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/20">
                  {downloadHref && (
                    <AuthenticatedDownloadButton url={downloadHref} label="DESCARGAR ARCHIVO" icon={Download} />
                  )}
                  {manualHref && (
                    <AuthenticatedDownloadButton url={manualHref} label="VER DOCUMENTO" icon={ExternalLink} />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border/20 pt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-muted-foreground block mb-0.5">PRODUCTO</span>
                <span className="text-foreground">{order.productName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">CATEGORÍA</span>
                <span className="text-foreground">{categoryLabel(order.productCategory)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">MONTO</span>
                <span className="text-foreground">${Number(order.amount).toLocaleString("es-CL")} {order.currency}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">FECHA PAGO</span>
                <span className="text-foreground">{new Date(order.paidAt || order.createdAt).toLocaleDateString("es-CL")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { user } = useUser();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const payment = params.get("payment");
  const [showPaymentStatus, setShowPaymentStatus] = useState(!!payment);

  const { data: rawOrders, isLoading, refetch } = useListOrders();
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  useEffect(() => {
    if (payment) {
      const orderId = params.get("orderId");
      if (payment === "success" && orderId) {
        const verifyTimer = setTimeout(async () => {
          try {
            await fetch(`/api/orders/${orderId}/verify`);
            refetch();
          } catch {}
        }, 1500);
        return () => { clearTimeout(verifyTimer); };
      }
      const refetchTimer = setTimeout(() => refetch(), 2000);
      return () => { clearTimeout(refetchTimer); };
    }
    return undefined;
  }, [payment, refetch]);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const otherOrders = orders.filter((o) => o.status !== "paid" && o.status !== "pending");
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="py-16">
      <SEOHead title="Mi Panel" noindex={true} />
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        {showPaymentStatus && payment === "success" && (
          <div className="mb-8 border border-green-500/30 bg-green-500/5 overflow-hidden" data-testid="text-payment-success">
            <div className="border-b border-green-500/20 bg-green-500/10 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="font-mono text-xs text-green-400 tracking-wider">TRANSACCIÓN COMPLETADA</span>
              </div>
              <button onClick={() => setShowPaymentStatus(false)} className="text-green-400/60 hover:text-green-400 transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-300 mb-1">Pago confirmado exitosamente</h3>
                <p className="text-sm text-muted-foreground">
                  Tu compra ha sido procesada de forma segura a través de Flow.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 p-3 border border-green-500/10 bg-green-500/5">
                  <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-primary mb-0.5">PASO 1</p>
                    <p className="text-xs text-muted-foreground">Revisa tu email para la confirmación y próximos pasos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-green-500/10 bg-green-500/5">
                  <Download className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-primary mb-0.5">PASO 2</p>
                    <p className="text-xs text-muted-foreground">Revisa el detalle de tu compra en "Historial de Pedidos" abajo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-green-500/10 bg-green-500/5">
                  <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-primary mb-0.5">PASO 3</p>
                    <p className="text-xs text-muted-foreground">Accede a tu producto o coordina la entrega del servicio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaymentStatus && payment === "cancelled" && (
          <div className="mb-8 border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
            <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="font-mono text-xs text-yellow-400 tracking-wider">PAGO NO COMPLETADO</span>
              </div>
              <button onClick={() => setShowPaymentStatus(false)} className="text-yellow-400/60 hover:text-yellow-400 transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-1">El pago fue cancelado</h3>
                <p className="text-sm text-muted-foreground">
                  No se realizó ningún cargo. Tu pedido queda guardado para que puedas completarlo cuando quieras.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-yellow-400 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Puedes reintentar el pago desde la sección <span className="text-yellow-400 font-mono">"Pagos Pendientes"</span> más abajo, o eliminar el pedido si ya no lo necesitas.
                </p>
              </div>
            </div>
          </div>
        )}

        {showPaymentStatus && payment === "error" && (
          <div className="mb-8 border border-red-500/30 bg-red-500/5 overflow-hidden" data-testid="text-payment-error">
            <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="font-mono text-xs text-red-400 tracking-wider">ERROR EN LA TRANSACCIÓN</span>
              </div>
              <button onClick={() => setShowPaymentStatus(false)} className="text-red-400/60 hover:text-red-400 transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-1">Hubo un problema con tu pago</h3>
                <p className="text-sm text-muted-foreground">
                  La transacción no pudo procesarse. No se realizó ningún cargo a tu tarjeta.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 border border-red-500/10 bg-red-500/5">
                  <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Verifica tu medio de pago:</span> confirma que los datos de tu tarjeta son correctos y que tienes fondos disponibles.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 border border-red-500/10 bg-red-500/5">
                  <RotateCcw className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Reintenta el pago:</span> usa el botón "Completar Pago" en tu historial de pedidos para intentar nuevamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-primary mb-1">MI CUENTA</p>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Bienvenido, {user?.firstName || userEmail}
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-none font-mono text-xs border-border/60">
              VER CATÁLOGO
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Productos comprados", value: paidOrders.length, icon: Package },
            { label: "Con archivos disponibles", value: paidOrders.filter((o: any) => o.downloadUrl).length, icon: Download },
            { label: "Pagos pendientes", value: pendingOrders.length, icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="border border-border/40 bg-card p-6">
              <stat.icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-3xl font-mono font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="font-mono text-xs text-muted-foreground mb-3">NEWSLETTER</h2>
          <NewsletterSection userEmail={userEmail} />
        </div>

        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono text-xs text-muted-foreground mb-3">PAGOS PENDIENTES</h2>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="border border-yellow-500/20 bg-yellow-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-sm">{order.productName}</h3>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      ${Number(order.amount).toLocaleString("es-CL")} {order.currency} · Orden #{order.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(order as any).stripePaymentUrl ? (
                      <a
                        href={(order as any).stripePaymentUrl}
                        className="flex items-center gap-1.5 font-mono text-xs bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        PAGAR AHORA
                      </a>
                    ) : (
                      <RetryPaymentButton orderId={order.id} />
                    )}
                    <DeleteOrderButton orderId={order.id} onDeleted={() => refetch()} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-muted-foreground">HISTORIAL DE PEDIDOS</h2>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              ACTUALIZAR
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border/40 bg-card p-5">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : paidOrders.length === 0 && pendingOrders.length === 0 ? (
            <div className="border border-border/40 bg-card p-12 text-center" data-testid="text-no-orders">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-sm text-muted-foreground mb-4">NO TIENES PEDIDOS AÚN</p>
              <Link href="/products">
                <Button className="rounded-none font-mono text-xs">EXPLORAR PRODUCTOS</Button>
              </Link>
            </div>
          ) : paidOrders.length === 0 ? (
            <div className="border border-border/40 bg-card p-8 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-mono text-xs text-muted-foreground">
                No tienes compras completadas. Completa un pago pendiente para ver tus productos aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paidOrders.map((order) => (
                <PaidOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {otherOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="font-mono text-xs text-muted-foreground mb-4">OTROS PEDIDOS</h2>
            <div className="space-y-3">
              {otherOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={order.id}
                    className="border border-border/40 bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    data-testid={`row-order-${order.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-sm">{order.productName}</h3>
                        <Badge
                          className={`font-mono text-xs rounded-none border px-2 py-0.5 flex items-center gap-1 ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        #{order.id} — {new Date(order.createdAt).toLocaleDateString("es-CL")} — ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
                      </div>
                    </div>
                    {order.status === "failed" && (
                      <div className="flex items-center gap-2">
                        <RetryPaymentButton orderId={order.id} />
                        <DeleteOrderButton orderId={order.id} onDeleted={() => refetch()} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <Show when="signed-in">
        <DashboardContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
