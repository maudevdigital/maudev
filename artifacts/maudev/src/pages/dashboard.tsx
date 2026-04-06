import { Show, useUser } from "@clerk/react";
import { Redirect, Link, useSearch } from "wouter";
import { Package, Download, Clock, CheckCircle, XCircle, ExternalLink, Bell, BellOff, Loader2, CreditCard, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListOrders } from "@workspace/api-client-react";
import { useEffect, useState } from "react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "PENDIENTE", color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10", icon: Clock },
  paid: { label: "PAGADO", color: "text-green-500 border-green-500/30 bg-green-500/10", icon: CheckCircle },
  failed: { label: "FALLIDO", color: "text-red-500 border-red-500/30 bg-red-500/10", icon: XCircle },
  refunded: { label: "REEMBOLSADO", color: "text-blue-500 border-blue-500/30 bg-blue-500/10", icon: CheckCircle },
};

function RetryPaymentButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/retry`, { method: "POST" });
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

function DashboardContent() {
  const { user } = useUser();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const payment = params.get("payment");
  const [showPaymentStatus, setShowPaymentStatus] = useState(!!payment);

  const { data: orders = [], isLoading, refetch } = useListOrders();

  useEffect(() => {
    if (payment) {
      const timer = setTimeout(() => setShowPaymentStatus(false), 6000);
      // After returning from Stripe, verify payment status via API
      const orderId = params.get("orderId");
      if (payment === "success" && orderId) {
        const verifyTimer = setTimeout(async () => {
          try {
            await fetch(`/api/orders/${orderId}/verify`);
            refetch();
          } catch {}
        }, 1500);
        return () => { clearTimeout(timer); clearTimeout(verifyTimer); };
      }
      // Also refetch in case webhook already updated it
      const refetchTimer = setTimeout(() => refetch(), 2000);
      return () => { clearTimeout(timer); clearTimeout(refetchTimer); };
    }
    return undefined;
  }, [payment, refetch]);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="py-16">
      <div className="container max-w-screen-xl px-4 md:px-8">
        {/* Payment status banners */}
        {showPaymentStatus && payment === "success" && (
          <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-sm flex items-center gap-2" data-testid="text-payment-success">
            <CheckCircle className="h-4 w-4 shrink-0" />
            PAGO PROCESADO EXITOSAMENTE. TU PEDIDO HA SIDO CONFIRMADO.
            <button onClick={() => setShowPaymentStatus(false)} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
        {showPaymentStatus && payment === "cancelled" && (
          <div className="mb-6 p-4 border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            PAGO CANCELADO. PUEDES REINTENTAR DESDE TU HISTORIAL DE PEDIDOS.
            <button onClick={() => setShowPaymentStatus(false)} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
        {showPaymentStatus && payment === "error" && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm flex items-center gap-2" data-testid="text-payment-error">
            <XCircle className="h-4 w-4 shrink-0" />
            ERROR EN EL PAGO. POR FAVOR INTENTA NUEVAMENTE.
            <button onClick={() => setShowPaymentStatus(false)} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Compras realizadas", value: orders.length, icon: Package },
            { label: "Productos activos", value: paidOrders.length, icon: CheckCircle },
            { label: "Pagos pendientes", value: pendingOrders.length, icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="border border-border/40 bg-card p-6">
              <stat.icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-3xl font-mono font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mb-8">
          <h2 className="font-mono text-xs text-muted-foreground mb-3">NEWSLETTER</h2>
          <NewsletterSection userEmail={userEmail} />
        </div>

        {/* Active products / downloads */}
        {paidOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono text-xs text-muted-foreground mb-3">MIS PRODUCTOS ACTIVOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paidOrders.map((order) => (
                <div key={order.id} className="border border-green-500/20 bg-green-500/5 p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{order.productName}</h3>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("es-CL")} · ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
                      </p>
                    </div>
                    <Badge className="font-mono text-xs rounded-none border border-green-500/30 bg-green-500/10 text-green-400 shrink-0">
                      ACTIVO
                    </Badge>
                  </div>
                  {(order as any).downloadUrl ? (
                    <a
                      href={(order as any).downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-xs text-primary border border-primary/30 bg-primary/5 px-4 py-2.5 hover:bg-primary/10 transition-colors w-fit"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DESCARGAR
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Acceso vía TradingView / MT5 — revisa tu email para instrucciones
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending payments CTA */}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Orders history */}
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
          ) : orders.length === 0 ? (
            <div className="border border-border/40 bg-card p-12 text-center" data-testid="text-no-orders">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-sm text-muted-foreground mb-4">NO TIENES PEDIDOS AÚN</p>
              <Link href="/products">
                <Button className="rounded-none font-mono text-xs">EXPLORAR PRODUCTOS</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
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
                        <h3 className="font-semibold">{order.productName}</h3>
                        <Badge
                          className={`font-mono text-xs rounded-none border px-2 py-0.5 flex items-center gap-1 ${statusConfig.color}`}
                          data-testid={`status-payment-${order.id}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        #{order.id} — {new Date(order.createdAt).toLocaleDateString("es-CL")} — ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status === "paid" && (order as any).downloadUrl && (
                        <a
                          href={(order as any).downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                        >
                          <Download className="h-3 w-3" />
                          DESCARGAR
                        </a>
                      )}
                      {order.status === "pending" && (
                        <RetryPaymentButton orderId={order.id} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
