import { useSearch, useLocation } from "wouter";
import { Shield, ArrowLeft, CreditCard, XCircle, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Show } from "@clerk/react";
import { useUser } from "@clerk/react";
import { useGetProduct, useCreateOrder, getGetProductQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useState } from "react";
import SEOHead from "@/components/seo-head";

export default function Checkout() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const productId = Number(params.get("productId"));
  const [, setLocation] = useLocation();
  const { user } = useUser();

  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"flow" | "coingate">("flow");

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) },
  });

  const createOrder = useCreateOrder();

  const handleCheckout = async () => {
    if (!product || !email) return;
    setIsRedirecting(true);
    createOrder.mutate(
      { data: { productId: product.id, userEmail: email, paymentMethod } },
      {
        onSuccess: (response) => {
          window.location.href = response.paymentUrl;
        },
        onError: () => {
          setIsRedirecting(false);
        },
      }
    );
  };

  if (!productId) {
    return (
      <div className="py-16 container max-w-7xl mx-auto px-4 md:px-8 text-center">
        <p className="font-mono text-muted-foreground">NINGÚN PRODUCTO SELECCIONADO</p>
        <Link href="/products">
          <Button className="mt-4 rounded-none font-mono text-xs">VER CATÁLOGO</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16">
      <SEOHead tabPrefix="💳" title="Checkout" noindex={true} />
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <Link href={`/products/${productId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono">
          <ArrowLeft className="h-4 w-4" />
          VOLVER AL PRODUCTO
        </Link>

        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs text-primary mb-2">PROCESO DE PAGO</p>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

          <div className="grid grid-cols-1 gap-8">
            {/* Order Summary */}
            <div className="border border-border/40 bg-card p-6">
              <h2 className="font-mono text-xs text-muted-foreground mb-4">RESUMEN DEL PEDIDO</h2>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : product ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold" data-testid="text-checkout-product">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category === "trading_scripts" ? "Trading Script" : "Servicio Digital"}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-primary text-xl" data-testid="text-checkout-price">
                    ${Number(product.price).toLocaleString("es-CL")} {product.currency}
                  </span>
                </div>
              ) : null}

              <div className="border-t border-border/40 mt-4 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono font-bold text-lg">
                    {product ? `$${Number(product.price).toLocaleString("es-CL")} ${product.currency}` : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border border-border/40 bg-card p-6">
              <h2 className="font-mono text-xs text-muted-foreground mb-4">DATOS DE CONTACTO</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground block mb-2">EMAIL DE CONFIRMACIÓN</label>
                  <Show when="signed-in">
                    <p className="border border-border/40 bg-muted/30 px-4 py-2 text-sm font-mono text-muted-foreground" data-testid="text-user-email">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </Show>
                  <Show when="signed-out">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full border border-border/60 bg-background px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                      required
                      data-testid="input-checkout-email"
                    />
                  </Show>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-border/40 bg-card p-6">
              <h2 className="font-mono text-xs text-muted-foreground mb-4">MÉTODO DE PAGO</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("flow")}
                  className={`flex items-center gap-3 p-4 border transition-colors ${
                    paymentMethod === "flow"
                      ? "border-primary bg-primary/10"
                      : "border-border/40 hover:border-border/60"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Flow.cl</p>
                    <p className="text-xs text-muted-foreground">Tarjeta, transferencia</p>
                  </div>
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-3 p-4 border border-border/40 opacity-50 cursor-not-allowed relative"
                >
                  <Bitcoin className="h-5 w-5 text-orange-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Crypto</p>
                    <p className="text-xs text-muted-foreground">Próximamente</p>
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-6 p-3 border border-primary/20 bg-primary/5">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  {paymentMethod === "flow"
                    ? <>Serás redirigido a <span className="text-foreground font-semibold">Flow</span> para completar tu pago de forma segura. Flow es un procesador de pagos certificado PCI DSS para Chile.</>
                    : <>Serás redirigido a <span className="text-foreground font-semibold">CoinGate</span> para pagar con criptomonedas. Acepta Bitcoin, Ethereum, USDT y más.</>}
                </p>
              </div>

              <Show when="signed-in">
                <Button
                  size="lg"
                  className="w-full rounded-none font-mono text-sm gap-2"
                  onClick={handleCheckout}
                  disabled={createOrder.isPending || isRedirecting || !product}
                  data-testid="button-confirm-payment"
                >
                  <CreditCard className="h-4 w-4" />
                  {createOrder.isPending || isRedirecting
                    ? (paymentMethod === "coingate" ? "REDIRIGIENDO A COINGATE..." : "REDIRIGIENDO A FLOW...")
                    : "CONFIRMAR Y PAGAR"}
                </Button>
              </Show>
              <Show when="signed-out">
                <Link href="/sign-in">
                  <Button size="lg" className="w-full rounded-none font-mono text-sm">
                    INICIA SESIÓN PARA PAGAR
                  </Button>
                </Link>
              </Show>

              {createOrder.isError && (
                <div className="mt-4 border border-red-500/30 bg-red-500/5 p-4 space-y-2" data-testid="text-checkout-error">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-xs font-mono text-red-400">NO SE PUDO INICIAR EL PAGO</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    Hubo un problema al conectar con el procesador de pagos. Verifica tu conexión e intenta nuevamente. Si el problema persiste, contáctanos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
