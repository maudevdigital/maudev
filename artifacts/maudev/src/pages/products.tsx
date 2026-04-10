import { Link, useSearch } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListProducts } from "@workspace/api-client-react";
import { useState } from "react";
import SEOHead from "@/components/seo-head";

const CATEGORIES = [
  { value: "", label: "Todos" },
  { value: "trading_scripts", label: "Trading Scripts" },
  { value: "digital_service", label: "Servicios Digitales" },
];

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category") || "";

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rawProducts, isLoading } = useListProducts(
    category ? { category } : {},
    { query: { queryKey: ["products", category] } }
  );
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-16">
      <SEOHead
        tabPrefix="📦"
        title="Productos y Servicios"
        description="Trading scripts profesionales para TradingView y MetaTrader 5, más soluciones de desarrollo digital a medida. Indicadores Pine Script v5, Expert Advisors MQL5 y más."
        keywords="pine script, tradingview, metatrader 5, indicadores trading, desarrollo web, servicios digitales, Chile"
        canonical="https://maudev.cl/products"
        ogImage="https://maudev.cl/opengraph.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Productos y Servicios MauDev",
          "description": "Catálogo de trading scripts y servicios digitales",
          "numberOfItems": filtered.length,
          "itemListElement": filtered.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://maudev.cl/products/${p.id}`,
            "name": p.name
          }))
        }}
      />
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-xs text-primary mb-2">CATALOGO</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Productos y Servicios</h1>
          <p className="text-muted-foreground max-w-2xl">
            Trading scripts para TradingView y MetaTrader 5, más soluciones digitales a medida. Todos los productos incluyen soporte directo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 text-xs font-mono border transition-colors rounded-none ${
                  category === cat.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                data-testid={`button-filter-${cat.value || "all"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border/60 bg-card pl-9 pr-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
              data-testid="input-search-products"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border/40 bg-card">
                <Skeleton className="h-48" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="text-no-products">
            <p className="font-mono text-sm">NO SE ENCONTRARON PRODUCTOS</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div
                  className="border border-border/40 bg-card hover:border-primary/40 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="h-48 overflow-hidden bg-muted relative">
                    {(product.imageUrl || (product as any).mediaUrls?.[0]?.url) ? (
                      <img
                        src={product.imageUrl || (product as any).mediaUrls[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Search className="h-8 w-8" />
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="font-mono text-xs rounded-none border-0 bg-primary text-primary-foreground px-2">
                          DESTACADO
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-2 py-0.5">
                        {product.subcategory === "mt5_mql5" ? "MT5 / MQL5" : product.subcategory === "market_structure" ? "PINE SCRIPT" : product.category === "trading_scripts" ? "TRADING SCRIPT" : "SERVICIO DIGITAL"}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base mb-2 flex-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div data-testid={`text-price-${product.id}`}>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="font-mono text-sm text-muted-foreground line-through mr-2">
                            ${Number(product.originalPrice).toLocaleString("es-CL")}
                          </span>
                        )}
                        <span className="font-mono font-bold text-primary text-lg">
                          ${Number(product.price).toLocaleString("es-CL")}
                          <span className="text-xs font-normal text-muted-foreground ml-1">CLP</span>
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 font-mono text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-1.5 py-0.5">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="rounded-none font-mono text-xs gap-1 border-border/60 group-hover:border-primary/60 group-hover:text-primary transition-colors">
                        VER MÁS <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
