import { useParams, useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, Download, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Show } from "@clerk/react";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const productId = Number(id);

  const { data: product, isLoading, error } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) },
  });

  if (isLoading) {
    return (
      <div className="py-16 container max-w-screen-xl px-4 md:px-8">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-80" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 container max-w-screen-xl px-4 md:px-8 text-center">
        <p className="font-mono text-muted-foreground" data-testid="text-product-not-found">PRODUCTO NO ENCONTRADO</p>
        <Link href="/products">
          <Button className="mt-4 rounded-none font-mono text-xs">VER CATÁLOGO</Button>
        </Link>
      </div>
    );
  }

  const handleBuy = () => {
    setLocation(`/checkout?productId=${product.id}`);
  };

  const features = product.category === "pine_script"
    ? [
        "Compatible con TradingView Pine Script v5",
        "Alertas automáticas configurables",
        "Soporte para múltiples marcos temporales",
        "Actualizaciones gratuitas incluidas",
        "Soporte directo vía email",
      ]
    : [
        "Diseño personalizado a tu marca",
        "Código limpio y documentado",
        "Entrega con plazo acordado",
        "Revisiones incluidas",
        "Soporte post-entrega",
      ];

  return (
    <div className="py-16">
      <div className="container max-w-screen-xl px-4 md:px-8">
        {/* Back */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono">
          <ArrowLeft className="h-4 w-4" />
          CATÁLOGO
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="border border-border/40 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover"
                data-testid="img-product"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-2 py-0.5">
                {product.category === "pine_script" ? "PINE SCRIPT" : "SERVICIO DIGITAL"}
              </Badge>
              {product.featured && (
                <Badge className="font-mono text-xs rounded-none border-0 bg-primary text-primary-foreground px-2 py-0.5">
                  DESTACADO
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-4" data-testid="text-product-name">{product.name}</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Features */}
            <div className="space-y-2 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="border border-border/40 bg-card p-6">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-mono font-bold text-primary" data-testid="text-price">
                  ${Number(product.price).toLocaleString("es-CL")}
                </span>
                <span className="text-muted-foreground mb-1">{product.currency}</span>
              </div>

              <Show when="signed-in">
                <Button
                  size="lg"
                  className="w-full rounded-none font-mono text-sm gap-2"
                  onClick={handleBuy}
                  data-testid="button-buy"
                >
                  <ShoppingCart className="h-4 w-4" />
                  COMPRAR AHORA
                </Button>
              </Show>
              <Show when="signed-out">
                <div className="space-y-3">
                  <Link href="/sign-in">
                    <Button size="lg" className="w-full rounded-none font-mono text-sm gap-2" data-testid="button-login-to-buy">
                      <ShoppingCart className="h-4 w-4" />
                      INICIA SESIÓN PARA COMPRAR
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline">
                      Regístrate gratis
                    </Link>
                  </p>
                </div>
              </Show>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Pago seguro procesado por Flow
              </div>

              {product.downloadUrl && (
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    Descarga inmediata tras el pago
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
