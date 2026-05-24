import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { useUser } from "@clerk/react";
import { TrendingUp, ShoppingCart, Users, Package, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminStats } from "@workspace/api-client-react";

const STATUS_CONFIG: Record<string, string> = {
  pending: "text-yellow-500",
  paid: "text-green-500",
  failed: "text-red-500",
  refunded: "text-blue-500",
};

function AdminDashboardContent() {
  const { data: stats, isLoading } = useGetAdminStats();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs text-primary mb-1">PANEL DE CONTROL</p>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-border/40 bg-card p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))
        ) : stats ? (
          [
            { icon: TrendingUp, label: "Ingresos Totales", value: `$${Number(stats.totalRevenue).toLocaleString("es-CL")}`, unit: "CLP" },
            { icon: ShoppingCart, label: "Pedidos Totales", value: stats.totalOrders.toString() },
            { icon: ShoppingCart, label: "Pedidos Pagados", value: stats.paidOrders.toString() },
            { icon: ShoppingCart, label: "Pedidos Pendientes", value: stats.pendingOrders.toString() },
            { icon: Users, label: "Suscriptores", value: stats.totalSubscribers.toString() },
            { icon: Package, label: "Productos Activos", value: stats.totalProducts.toString() },
          ].map((stat) => (
            <div key={stat.label} className="border border-border/40 bg-card p-5" data-testid={`stat-${stat.label}`}>
              <stat.icon className="h-4 w-4 text-primary mb-3" />
              <div className="text-2xl font-mono font-bold">
                {stat.value}
                {stat.unit && <span className="text-xs text-muted-foreground ml-1">{stat.unit}</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))
        ) : null}
      </div>

      {/* Revenue by Category */}
      {stats && stats.revenueByCategory.length > 0 && (
        <div className="border border-border/40 bg-card p-6 mb-6">
          <h2 className="font-mono text-xs text-muted-foreground mb-4">INGRESOS POR CATEGORÍA</h2>
          <div className="space-y-3">
            {stats.revenueByCategory.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{cat.category.replace(/_/g, " ")}</span>
                <span className="font-mono text-sm text-primary">${Number(cat.revenue).toLocaleString("es-CL")} CLP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="border border-border/40 bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="font-mono text-xs text-muted-foreground">PEDIDOS RECIENTES</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border/40">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : stats?.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground font-mono">SIN PEDIDOS AÚN</div>
          ) : (
            stats?.recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between" data-testid={`row-order-${order.id}`}>
                <div>
                  <p className="text-sm font-medium">{order.productName}</p>
                  <p className="text-xs text-muted-foreground">{order.userEmail} · {new Date(order.createdAt).toLocaleDateString("es-CL")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">${Number(order.amount).toLocaleString("es-CL")}</span>
                  <span className={`font-mono text-xs ${STATUS_CONFIG[order.status] || ""}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useUser();
  return (
    <>
      <Show when="signed-in">
        <AdminDashboardContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
