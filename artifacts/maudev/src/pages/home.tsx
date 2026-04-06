import { Link } from "wouter";
import { ArrowRight, TrendingUp, BarChart2, Activity, Globe, Code, Smartphone, ChevronRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Show, useUser } from "@clerk/react";
import { Redirect } from "wouter";
import { useGetFeaturedProducts, useSubscribeEmail } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";

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
  if (pair === "BTC/USDT") return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

function useRealtimePrices() {
  const [ticks, setTicks] = useState<PriceTick[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const prevTicksRef = useRef<PriceTick[]>([]);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) return;
      const data: PricesResponse = await res.json();
      if (data.ticks.length > 0) {
        prevTicksRef.current = ticks;
        setTicks(data.ticks);
        setLastUpdate(nowTimestamp());
        setLoading(false);
      }
    } catch {
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15_000);
    return () => clearInterval(interval);
  }, []);

  return { ticks, loading, lastUpdate, prevTicks: prevTicksRef.current };
}

function HeroTerminal() {
  const { ticks, loading, lastUpdate } = useRealtimePrices();
  const [statusIdx, setStatusIdx] = useState(0);
  const [blink, setBlink] = useState(true);
  const [flashPairs, setFlashPairs] = useState<Set<string>>(new Set());
  const prevTicksRef = useRef<PriceTick[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => (i + 1) % TERMINAL_STATUSES.length);
    }, 3000);
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
    <div className="relative hidden lg:block">
      <div className="absolute -inset-1 bg-primary/10 blur-xl rounded-sm" />
      <div className="relative border border-primary/20 bg-card/60 backdrop-blur overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-background/40">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_terminal — live</span>
          <span className="ml-auto text-xs font-mono text-green-400/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            LIVE
          </span>
        </div>

        {/* Command line */}
        <div className="px-5 pt-4 pb-2 font-mono text-xs">
          <span className="text-primary/60">$ </span>
          <span className="text-primary/80">live-feed --assets BTC XAU XAG WTI --interval 15s</span>
        </div>

        {/* Price rows */}
        <div className="px-5 pb-2 space-y-2">
          {/* Header */}
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
                  <span className="w-20 text-right text-muted-foreground/50 text-[10px]">
                    {lastUpdate}
                  </span>
                </div>
              ))}
        </div>

        {/* Status line */}
        <div className="mx-5 mb-4 mt-2 border border-primary/20 bg-primary/5 px-4 py-2.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-muted-foreground/60 mb-1 text-[10px]">
            <span>PID 1337</span>
            <span>·</span>
            <span>feed v2.4.1</span>
            {lastUpdate && (
              <>
                <span>·</span>
                <span>last sync {lastUpdate}</span>
              </>
            )}
          </div>
          <div className="text-primary/80">
            <span className="opacity-60">→ </span>
            <span>{TERMINAL_STATUSES[statusIdx]}</span>
            <span className={`ml-0.5 ${blink ? "opacity-100" : "opacity-0"}`}>█</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const { data: featuredProducts = [], isLoading } = useGetFeaturedProducts();
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

  const pineProducts = featuredProducts.filter((p) => p.category === "pine_script");
  const serviceProducts = featuredProducts.filter((p) => p.category === "digital_service");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="container max-w-screen-xl px-4 md:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1" data-testid="badge-hero">
                MAUDEV — SANTIAGO, CHILE
              </Badge>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-none mb-6" data-testid="hero-headline">
                Herramientas para{" "}
                <span className="text-gradient-primary">traders serios</span>{" "}
                y startups ambiciosos.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed" data-testid="hero-subheadline">
                Extensiones Pine Script de precisión para TradingView y soluciones digitales full-stack. Construido por desarrolladores, para profesionales que no se conforman con lo genérico.
              </p>
              <div className="flex flex-wrap gap-4">
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
              <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg">
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
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-2">PINE SCRIPT / TRADINGVIEW</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Extensiones para traders profesionales</h2>
            </div>
            <Link href="/products?category=pine_script" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                      </div>
                      <div className="p-5">
                        <Badge className="mb-3 font-mono text-xs rounded-none border-0 bg-primary/10 text-primary px-2 py-0.5">
                          {product.subcategory.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                        <h3 className="font-bold text-base mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-primary" data-testid={`text-price-${product.id}`}>
                            ${Number(product.price).toLocaleString("es-CL")} CLP
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Features / Why MauDev */}
      <section className="py-24 border-t border-border/40">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-2">POR QUÉ MAUDEV</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Precisión técnica sin compromiso
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cada extensión y cada proyecto es desarrollado con atención obsesiva al detalle. No vendemos plantillas genéricas ni copiamos código de repositorios públicos. Todo lo que ve aquí fue construido desde cero con un propósito específico.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Shield, title: "Código propio y auditado", desc: "Sin dependencias externas no verificadas. Tu estrategia, tu código, tu ventaja." },
                  { icon: Zap, title: "Optimizado para tiempo real", desc: "Las extensiones Pine Script están optimizadas para correr sin lag en activos volátiles." },
                  { icon: Users, title: "Soporte directo del desarrollador", desc: "Hablas directamente con quien escribió el código, no con soporte de nivel 1." },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start p-4 border border-border/40 bg-card/50 hover-glow transition-all duration-300 group">
                    <div className="p-2 bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1">{feature.title}</div>
                      <div className="text-sm text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: TrendingUp, title: "Bitcoin", desc: "BTC/USDT" },
                { icon: Activity, title: "Oro", desc: "XAU/USD" },
                { icon: BarChart2, title: "Plata", desc: "XAG/USD" },
                { icon: Activity, title: "Petróleo", desc: "WTI/USD" },
              ].map((asset) => (
                <div key={asset.title} className="border border-border/40 bg-card p-6 hover-glow transition-all duration-300 group" data-testid={`card-asset-${asset.title}`}>
                  <div className="p-2 bg-primary/10 border border-primary/20 inline-block mb-4">
                    <asset.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-bold font-mono text-sm">{asset.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{asset.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Services */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-gradient-primary mb-2">SOLUCIONES DIGITALES</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Construimos tu producto digital</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Landing Pages", desc: "Alta conversión, animaciones, SEO y formularios conectados. Entrega en 5-7 días.", href: "/products" },
              { icon: Code, title: "Full Stack Apps", desc: "React + Node.js + PostgreSQL. Desde MVP hasta producto escalable con panel admin.", href: "/products" },
              { icon: Smartphone, title: "Apps Móviles", desc: "iOS y Android con React Native / Expo. Diseño nativo, notificaciones, integraciones.", href: "/products" },
            ].map((service) => (
              <Link key={service.title} href={service.href}>
                <div className="border border-border/40 bg-card p-8 hover-glow transition-all duration-300 group cursor-pointer h-full flex flex-col" data-testid={`card-service-${service.title}`}>
                  <div className="p-3 bg-primary/10 border border-primary/20 inline-block mb-6">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{service.desc}</p>
                  <div className="flex items-center gap-2 mt-6 text-sm font-mono text-primary">
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
        <div className="container max-w-screen-xl px-4 md:px-8">
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
  if (isSignedIn) return <Redirect to="/dashboard" />;

  return <HomeContent />;
}
