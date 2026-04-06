import { Show, useUser } from "@clerk/react";
import { Redirect, Link } from "wouter";
import { useSearch } from "wouter";
import { Package, Download, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
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

function DashboardContent() {
  const { user } = useUser();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const payment = params.get("payment");
  const [showPaymentStatus, setShowPaymentStatus] = useState(!!payment);

  const { data: orders = [], isLoading } = useListOrders();

  useEffect(() => {
    if (payment) {
      const timer = setTimeout(() => setShowPaymentStatus(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [payment]);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <div className="py-16">
      <div className="container max-w-screen-xl px-4 md:px-8">
        {/* Payment status banner */}
        {showPaymentStatus && payment === "success" && (
          <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-sm flex items-center gap-2" data-testid="text-payment-success">
            <CheckCircle className="h-4 w-4" />
            PAGO PROCESADO EXITOSAMENTE. TU PEDIDO HA SIDO CONFIRMADO.
          </div>
        )}
        {showPaymentStatus && payment === "error" && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm flex items-center gap-2" data-testid="text-payment-error">
            <XCircle className="h-4 w-4" />
            ERROR EN EL PAGO. POR FAVOR INTENTA NUEVAMENTE.
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-primary mb-1">MI CUENTA</p>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Bienvenido, {user?.firstName || user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-none font-mono text-xs border-border/60">
              VER CATÁLOGO
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Compras realizadas", value: orders.length, icon: Package },
            { label: "Productos activos", value: paidOrders.length, icon: CheckCircle },
            { label: "Pedidos pendientes", value: pendingOrders.length, icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="border border-border/40 bg-card p-6" data-testid={`stat-${stat.label}`}>
              <stat.icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-3xl font-mono font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-mono text-xs text-muted-foreground mb-4">MIS PEDIDOS</h2>
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
                  <div key={order.id} className="border border-border/40 bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`row-order-${order.id}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{order.productName}</h3>
                        <Badge className={`font-mono text-xs rounded-none border px-2 py-0.5 flex items-center gap-1 ${statusConfig.color}`} data-testid={`status-payment-${order.id}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        #{order.id} — {new Date(order.createdAt).toLocaleDateString("es-CL")} — ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status === "paid" && (
                        <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                          <Download className="h-3 w-3" />
                          ACCESO ACTIVO
                        </div>
                      )}
                      {order.status === "pending" && order.flowToken && (
                        <p className="text-xs text-muted-foreground font-mono">ESPERANDO PAGO</p>
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
