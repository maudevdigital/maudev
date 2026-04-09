import { Link } from "wouter";
import { ArrowRight, TrendingUp, BarChart2, Activity, Globe, Code, Smartphone, ChevronRight, Shield, Zap, Users, Terminal, Lock, Cpu, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/react";
import { Redirect } from "wouter";
import { useGetFeaturedProducts, useSubscribeEmail } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/seo-head";

interface PriceTick {
  pair: string;
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  up: boolean;
}

interface PricesResponse {
  ticks: PriceTick[];
  cachedAt: number;
}

const TERMINAL_STATUSES = [
  "syncing with exchange feeds...",
  "running indicator analysis...",
  "computing momentum signals...",
  "fetching order book depth...",
  "updating volatility index...",
  "scanning market microstructure...",
  "calculating RSI divergence...",
  "monitoring support/resistance levels...",
];

function formatPrice(pair: string, price: number): string {
  if (pair === "XAG/USD") return price.toFixed(3);
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatChange(changePct: number, up: boolean): string {
  const sign = up ? "+" : "";
  return `${sign}${changePct.toFixed(2)}%`;
}

function nowTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

const DEMO_TICKS: PriceTick[] = [
  { pair: "BTC/USDT", symbol: "BTC", price: 68432.50, change: 1250.30, changePct: 1.86, up: true },
  { pair: "XAU/USD", symbol: "XAU", price: 2348.15, change: -12.40, changePct: -0.53, up: false },
  { pair: "XAG/USD", symbol: "XAG", price: 29.145, change: 0.38, changePct: 1.32, up: true },
  { pair: "WTI/USD", symbol: "WTI", price: 78.62, change: -0.94, changePct: -1.18, up: false },
];

function useRealtimePrices() {
  const [ticks, setTicks] = useState<PriceTick[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isLive, setIsLive] = useState(true);
  const failCountRef = useRef(0);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("not ok");
      const data: PricesResponse = await res.json();
      if (data.ticks.length > 0) {
        setTicks(data.ticks);
        setLastUpdate(nowTimestamp());
        setLoading(false);
        setIsLive(true);
        failCountRef.current = 0;
      }
    } catch {
      failCountRef.current++;
      if (failCountRef.current >= 1 && loading) {
        setTicks(DEMO_TICKS);
        setLastUpdate(nowTimestamp());
        setLoading(false);
        setIsLive(false);
      }
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15_000);
    return () => clearInterval(interval);
  }, []);

  return { ticks, loading, lastUpdate, isLive };
}

function HeroTerminal() {
  const { ticks, loading, lastUpdate, isLive } = useRealtimePrices();
  const [statusIdx, setStatusIdx] = useState(0);
  const [blink, setBlink] = useState(true);
  const [flashPairs, setFlashPairs] = useState<Set<string>>(new Set());
  const prevTicksRef = useRef<PriceTick[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setStatusIdx((i) => (i + 1) % TERMINAL_STATUSES.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ticks.length === 0) return;
    const changed = new Set<string>();
    ticks.forEach((tick) => {
      const prev = prevTicksRef.current.find((p) => p.pair === tick.pair);
      if (prev && prev.price !== tick.price) changed.add(tick.pair);
    });
    if (changed.size > 0) {
      setFlashPairs(changed);
      const timer = setTimeout(() => setFlashPairs(new Set()), 800);
      prevTicksRef.current = ticks;
      return () => clearTimeout(timer);
    }
    prevTicksRef.current = ticks;
  }, [ticks]);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">
      <div className="absolute -inset-1 bg-primary/10 blur-xl rounded-sm" />
      <div className="relative border border-primary/20 bg-card/60 backdrop-blur overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-background/40">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_terminal — live</span>
          <span className={`ml-auto text-xs font-mono flex items-center gap-1.5 ${isLive ? "text-green-400/70" : "text-yellow-400/70"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isLive ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
            {isLive ? "LIVE" : "DEMO"}
          </span>
        </div>

        {/* Command line */}
        <div className="px-5 pt-4 pb-2 font-mono text-xs">
          <span className="text-primary/60">$ </span>
          <span className="text-primary/80">live-feed --assets BTC XAU XAG WTI --interval 15s</span>
        </div>

        {/* Price rows */}
        <div className="px-5 pb-2 space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/50 px-3 pb-1 border-b border-border/20">
            <span className="w-24">PAIR</span>
            <span className="flex-1 text-right">PRICE</span>
            <span className="w-20 text-right">CHG%</span>
            <span className="w-20 text-right">TIME</span>
          </div>

          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between font-mono text-sm border border-border/20 bg-background/30 px-3 py-2.5 animate-pulse">
                  <span className="w-24 h-3 bg-muted rounded" />
                  <span className="flex-1 h-3 bg-muted rounded mx-4" />
                  <span className="w-16 h-3 bg-muted rounded" />
                </div>
              ))
            : ticks.map((tick) => (
                <div
                  key={tick.pair}
                  className={`flex items-center justify-between font-mono text-sm border px-3 py-2.5 transition-all duration-300 ${
                    flashPairs.has(tick.pair)
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/20 bg-background/30"
                  }`}
                >
                  <span className="w-24 text-muted-foreground text-xs">{tick.pair}</span>
                  <span className="flex-1 text-right text-foreground font-bold tabular-nums">
                    {formatPrice(tick.pair, tick.price)}
                  </span>
                  <span className={`w-20 text-right text-xs tabular-nums ${tick.up ? "text-green-400" : "text-red-400"}`}>
                    {tick.up ? "▲" : "▼"} {formatChange(tick.changePct, tick.up)}
                  </span>
                  <span className="w-20 text-right text-muted-foreground/50 text-[10px]">{lastUpdate}</span>
                </div>
              ))}
        </div>

        {/* Status line */}
        <div className="mx-5 mb-4 mt-2 border border-primary/20 bg-primary/5 px-4 py-2.5 font-mono text-xs text-primary/80">
          <span className="opacity-60">→ </span>
          <span>{TERMINAL_STATUSES[statusIdx]}</span>
          <span className={`ml-0.5 ${blink ? "opacity-100" : "opacity-0"}`}>█</span>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const { data: rawFeaturedProducts, isLoading } = useGetFeaturedProducts();
  const featuredProducts = Array.isArray(rawFeaturedProducts) ? rawFeaturedProducts : [];
  const subscribeEmail = useSubscribeEmail();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeEmail.mutate(
      { data: { email, name } },
      {
        onSuccess: () => {
          setSubscribed(true);
          setEmail("");
          setName("");
        },
      }
    );
  };

  const pineProducts = featuredProducts.filter((p) => p.category === "trading_scripts");

  return (
    <div className="flex flex-col">
      <SEOHead
        title="Indicadores Pine Script & MetaTrader 5 | Trading Tools & Desarrollo Digital"
        description="Indicadores profesionales para TradingView Pine Script v5 y MetaTrader 5. Scripts de trading para BTC, XAU, XAG, WTI + servicios de desarrollo digital a medida. Santiago, Chile."
        keywords="pine script, tradingview, metatrader 5, mql5, indicadores trading, BTC, XAU, XAG, Chile, desarrollo web, landing page"
        canonical="https://maudev.cl/"
        ogImage="https://maudev.cl/opengraph.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MauDev",
          "url": "https://maudev.cl",
          "description": "Indicadores profesionales de trading y servicios de desarrollo digital",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://maudev.cl/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1" data-testid="badge-hero">
                MAUDEV — SANTIAGO, CHILE
              </Badge>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-none mb-6" data-testid="hero-headline">
                Herramientas para{" "}
                <span className="text-gradient-primary">traders serios</span>{" "}
                y startups ambiciosos.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed" data-testid="hero-subheadline">
                Indicadores profesionales para <span className="text-foreground font-medium">TradingView</span> y <span className="text-foreground font-medium">MetaTrader 5</span>, más soluciones digitales full-stack. Construido por desarrolladores, para profesionales que no se conforman con lo genérico.
              </p>

              {/* Platform badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                {[
                  { label: "TradingView / Pine Script" },
                  { label: "MetaTrader 5 / MQL5" },
                  { label: "React · Node.js · PostgreSQL" },
                ].map((p) => (
                  <span key={p.label} className="font-mono text-[11px] border border-border/50 bg-card/60 text-muted-foreground px-2.5 py-1">
                    {p.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/products">
                  <Button size="lg" className="rounded-none font-mono text-sm group gap-2 glow-primary" data-testid="button-explore-products">
                    VER PRODUCTOS
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products?category=digital_service">
                  <Button size="lg" variant="outline" className="rounded-none font-mono text-sm border-border/50 hover:border-primary/40 transition-colors" data-testid="button-services">
                    SERVICIOS DIGITALES
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg mx-auto lg:mx-0">
                {[
                  { label: "Indicadores Pine", value: "3+" },
                  { label: "Activos cubiertos", value: "4" },
                  { label: "Clientes activos", value: "50+" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-border/40 bg-card/50 backdrop-blur p-4 hover-glow transition-all duration-300" data-testid={`stat-${stat.label}`}>
                    <div className="text-2xl font-mono font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* Pine Script Section */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-2">PINE SCRIPT / TRADINGVIEW · MT5 / MQL5</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Extensiones para traders profesionales</h2>
            </div>
            <Link href="/products?category=trading_scripts" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              VER TODOS <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="border border-border/40 bg-card h-64 animate-pulse" />
                ))
              : pineProducts.slice(0, 3).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="border border-border/40 bg-card hover-glow transition-all duration-300 group cursor-pointer" data-testid={`card-product-${product.id}`}>
                      <div className="h-40 overflow-hidden bg-muted relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-card/60 to-transparent" />
                      </div>
                      <div className="p-5">
                        <Badge className="mb-3 font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-2 py-0.5">
                          {product.subcategory.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                        <h3 className="font-bold text-base mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div data-testid={`text-price-${product.id}`}>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="font-mono text-xs text-muted-foreground line-through mr-1">
                                ${Number(product.originalPrice).toLocaleString("es-CL")}
                              </span>
                            )}
                            <span className="font-mono font-bold text-primary">
                              ${Number(product.price).toLocaleString("es-CL")} CLP
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="ml-1.5 font-mono text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-1 py-0">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Features / Why MauDev — redesigned */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-gradient-primary mb-3">POR QUÉ MAUDEV</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Precisión técnica sin compromiso</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Cada extensión y cada proyecto es desarrollado con atención obsesiva al detalle. Sin plantillas genéricas, sin código copiado. Todo construido desde cero con un propósito específico.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border/30">
            {[
              {
                icon: Shield,
                tag: "SEGURIDAD",
                title: "Código propio y auditado",
                desc: "Sin dependencias externas no verificadas. Tu estrategia, tu código, tu ventaja competitiva.",
                detail: "Revisión de seguridad en cada release.",
              },
              {
                icon: Zap,
                tag: "RENDIMIENTO",
                title: "Optimizado para tiempo real",
                desc: "Indicadores para TradingView y MT5 optimizados para correr sin lag en activos altamente volátiles.",
                detail: "BTC · XAU · XAG · WTI",
              },
              {
                icon: Users,
                tag: "SOPORTE",
                title: "Directo del desarrollador",
                desc: "Hablas directamente con quien escribió el código. No hay soporte de nivel 1 ni bots de respuesta automática.",
                detail: "Respuesta < 24h garantizada.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-background p-8 group hover:bg-card/60 transition-colors duration-300 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-primary/10 border border-primary/20">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] text-primary/50 border border-primary/20 px-2 py-0.5">{feature.tag}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-border/30 font-mono text-[10px] text-muted-foreground/60">
                  {feature.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Platform compatibility strip */}
          <div className="mt-px bg-border/30">
            <div className="bg-card/30 grid grid-cols-2 md:grid-cols-4 gap-px">
              {[
                { icon: Terminal, label: "TradingView", sub: "Pine Script v5" },
                { icon: Cpu, label: "MetaTrader 5", sub: "MQL5 / EAs" },
                { icon: Database, label: "PostgreSQL", sub: "Full-stack apps" },
                { icon: Lock, label: "Privacidad total", sub: "Código no compartido" },
              ].map((item) => (
                <div key={item.label} className="bg-background flex items-center gap-3 px-6 py-4 group hover:bg-card/60 transition-colors">
                  <item.icon className="h-4 w-4 text-primary/60 shrink-0" />
                  <div>
                    <div className="font-mono text-xs font-semibold text-foreground">{item.label}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/60">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Services — redesigned */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-3">SOLUCIONES DIGITALES</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Construimos tu producto digital</h2>
              <p className="text-muted-foreground leading-relaxed">
                Desde el diseño hasta el deploy. React, Node.js, PostgreSQL, React Native. Entregas rápidas, código limpio y arquitectura que escala.
              </p>
            </div>
            <div className="flex items-center justify-end">
              <Link href="/products?category=digital_service">
                <Button variant="outline" className="rounded-none font-mono text-sm border-border/50 hover:border-primary/40 gap-2">
                  VER TODOS LOS SERVICIOS <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Landing Pages",
                tag: "5–7 días",
                desc: "Alta conversión, animaciones, SEO técnico y formularios conectados a tu CRM.",
                stack: ["React", "Vite", "Tailwind", "Vercel"],
                href: "/products",
              },
              {
                icon: Code,
                title: "Full Stack Apps",
                tag: "MVP → Producción",
                desc: "Desde cero hasta producto escalable con panel admin, auth, pagos y base de datos.",
                stack: ["React", "Node.js", "PostgreSQL", "Stripe"],
                href: "/products",
              },
              {
                icon: Smartphone,
                title: "Apps Móviles",
                tag: "iOS + Android",
                desc: "Diseño nativo con React Native / Expo. Notificaciones push, cámara, geolocalización.",
                stack: ["Expo", "React Native", "TypeScript", "RevenueCat"],
                href: "/products",
              },
            ].map((service) => (
              <Link key={service.title} href={service.href}>
                <div
                  className="border border-border/40 bg-card p-8 hover-glow transition-all duration-300 group cursor-pointer h-full flex flex-col"
                  data-testid={`card-service-${service.title}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-primary/10 border border-primary/20">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-mono text-[10px] text-primary/60 border border-primary/20 bg-primary/5 px-2 py-1">{service.tag}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed mb-6">{service.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.stack.map((s) => (
                      <span key={s} className="font-mono text-[10px] border border-border/40 bg-background/60 text-muted-foreground px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-primary border-t border-border/30 pt-4">
                    VER MÁS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t border-border/40">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="absolute -inset-8 bg-primary/5 blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="font-mono text-xs text-gradient-primary mb-2">NEWSLETTER</p>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Recibe actualizaciones y nuevas extensiones</h2>
              <p className="text-muted-foreground mb-8">Sin spam. Solo actualizaciones importantes, nuevas herramientas y análisis de mercado.</p>
              {subscribed ? (
                <div className="border border-primary/40 bg-primary/5 text-primary p-6 font-mono text-sm glow-primary" data-testid="status-subscribed">
                  SUSCRIPCION EXITOSA. GRACIAS POR UNIRTE.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-border/60 bg-card px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                    data-testid="input-name-subscribe"
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border border-border/60 bg-card px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                    data-testid="input-email-subscribe"
                  />
                  <Button type="submit" className="rounded-none font-mono text-xs shrink-0" disabled={subscribeEmail.isPending} data-testid="button-subscribe">
                    {subscribeEmail.isPending ? "..." : "SUSCRIBIR"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  // Only redirect when truly signed in (not in dev/mock mode)
  if (isSignedIn && isLoaded) return <Redirect to="/dashboard" />;

  return <HomeContent />;
}
