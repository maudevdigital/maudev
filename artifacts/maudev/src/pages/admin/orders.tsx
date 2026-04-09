import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useListAllOrders } from "@workspace/api-client-react";

const STATUS_STYLE: Record<string, string> = {
  pending: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  paid: "text-green-500 bg-green-500/10 border-green-500/30",
  failed: "text-red-500 bg-red-500/10 border-red-500/30",
  refunded: "text-blue-500 bg-blue-500/10 border-blue-500/30",
};

function AdminOrdersContent() {
  const { data: orders = [], isLoading } = useListAllOrders();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs text-primary mb-1">GESTIÓN</p>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} pedidos en total</p>
      </div>

      <div className="border border-border/40 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {["ID", "PRODUCTO", "CLIENTE", "MONTO", "ESTADO", "FECHA"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : orders.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center font-mono text-xs text-muted-foreground">
                      SIN PEDIDOS
                    </td>
                  </tr>
                )
                : orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-order-${order.id}`}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{order.id}</td>
                      <td className="px-4 py-3 font-medium">{order.productName}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{order.userEmail}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary" data-testid={`text-price-${order.id}`}>
                        ${Number(order.amount).toLocaleString("es-CL")} {order.currency}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs border px-2 py-0.5 ${STATUS_STYLE[order.status] || ""}`} data-testid={`status-payment-${order.id}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("es-CL")}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <>
      <Show when="signed-in">
        <AdminOrdersContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
