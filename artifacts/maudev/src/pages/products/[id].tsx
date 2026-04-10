import { useParams, useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, Download, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Show } from "@clerk/react";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";
import { MediaCarousel } from "@/components/MediaCarousel";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const productId = Number(id);

  const { data: product, isLoading, error } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) },
  });

  if (isLoading) {
    return (
      <div className="py-16 container max-w-7xl mx-auto px-4 md:px-8">
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
      <div className="py-16 container max-w-7xl mx-auto px-4 md:px-8 text-center">
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

  const defaultFeatures = product.subcategory === "mt5_mql5"
    ? [
        "Compatible con MetaTrader 5 (archivo .ex5)",
        "Estructura de mercado: BOS y CHoCH automáticos",
        "Imbalances (FVG) y Order Blocks",
        "EMAs de 10 y 50 períodos integradas",
        "Perfil de volumen en tiempo real",
        "Alertas push y por email configurables",
        "Actualizaciones gratuitas incluidas",
      ]
    : product.subcategory === "market_structure"
    ? [
        "Compatible con TradingView Pine Script v5",
        "Estructura de mercado: BOS y CHoCH automáticos",
        "Imbalances (FVG) y Order Blocks",
        "EMAs de 10 y 50 períodos integradas",
        "Perfil de volumen overlay",
        "Alertas automáticas configurables",
        "Actualizaciones gratuitas incluidas",
      ]
    : product.subcategory === "automation"
    ? [
        "Flujos de automatización personalizados con n8n",
        "Conexión con CRMs, email, redes sociales y más",
        "Triggers automáticos y manejo de errores",
        "Documentación completa de cada workflow",
        "15 días de soporte post-entrega",
      ]
    : [
        "Diseño personalizado a tu marca",
        "Código limpio y documentado",
        "Entrega con plazo acordado",
        "Revisiones incluidas",
        "Soporte post-entrega",
      ];

  const features = ((product as any).features?.length > 0) ? (product as any).features : defaultFeatures;

  const seoTitle = (product as any).seoTitle || product.name;
  const seoDescription = (product as any).seoDescription || product.description;
  const seoKeywords = (product as any).seoKeywords || `${product.name}, ${product.subcategory === "mt5_mql5" ? "MetaTrader 5, MQL5" : product.subcategory === "market_structure" ? "Pine Script, TradingView" : "desarrollo web"}, MauDev, Chile`;
  const firstImage = product.imageUrl || ((product as any).mediaUrls?.[0]?.url) || null;

  return (
    <div className="py-16">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`https://maudev.cl/products/${product.id}`}
        ogImage={firstImage ?? undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": seoDescription,
          "image": firstImage,
          "brand": { "@type": "Brand", "name": "MauDev" },
          "offers": {
            "@type": "Offer",
            "price": Number(product.price),
            "priceCurrency": product.currency || "CLP",
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "MauDev" },
            "url": `https://maudev.cl/products/${product.id}`
          }
        }}
      />
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        {/* Back */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono">
          <ArrowLeft className="h-4 w-4" />
          CATÁLOGO
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Media Carousel */}
          <div>
            <MediaCarousel
              imageUrl={product.imageUrl}
              mediaUrls={(product as any).mediaUrls}
              productName={product.name}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-2 py-0.5">
                {product.subcategory === "mt5_mql5" ? "MT5 / MQL5" : product.subcategory === "market_structure" ? "PINE SCRIPT" : product.category === "trading_scripts" ? "TRADING SCRIPT" : "SERVICIO DIGITAL"}
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
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-mono text-muted-foreground line-through">
                    ${Number(product.originalPrice).toLocaleString("es-CL")}
                  </span>
                  <span className="font-mono text-sm bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}% DCTO
                  </span>
                </div>
              )}
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
