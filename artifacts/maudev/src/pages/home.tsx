import { Link } from "wouter";
import { ArrowRight, TrendingUp, BarChart2, Activity, Globe, Code, Smartphone, ChevronRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Show, useUser } from "@clerk/react";
import { Redirect } from "wouter";
import { useGetFeaturedProducts, useSubscribeEmail } from "@workspace/api-client-react";
import { useState } from "react";

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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="container max-w-screen-xl px-4 md:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1" data-testid="badge-hero">
              MAUDEV — SANTIAGO, CHILE
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6" data-testid="hero-headline">
              Herramientas para{" "}
              <span className="text-primary">traders serios</span>{" "}
              y startups ambiciosos.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed" data-testid="hero-subheadline">
              Extensiones Pine Script de precisión para TradingView y soluciones digitales full-stack. Construido por desarrolladores, para profesionales que no se conforman con lo genérico.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="rounded-none font-mono text-sm group gap-2" data-testid="button-explore-products">
                  VER PRODUCTOS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products?category=digital_service">
                <Button size="lg" variant="outline" className="rounded-none font-mono text-sm border-border/60" data-testid="button-services">
                  SERVICIOS DIGITALES
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-12 left-4 right-4 md:left-8 md:right-8">
          <div className="container max-w-screen-xl">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-lg">
              {[
                { label: "Indicadores Pine", value: "3+" },
                { label: "Activos cubiertos", value: "4" },
                { label: "Clientes activos", value: "50+" },
              ].map((stat) => (
                <div key={stat.label} className="border border-border/40 bg-card/50 backdrop-blur p-4" data-testid={`stat-${stat.label}`}>
                  <div className="text-2xl font-mono font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pine Script Section */}
      <section className="py-24 border-t border-border/40 bg-card/20">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-primary mb-2">PINE SCRIPT / TRADINGVIEW</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Extensiones para traders profesionales</h2>
            </div>
            <Link href="/products?category=pine_script" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="border border-border/40 bg-card h-64 animate-pulse" />
                ))
              : pineProducts.slice(0, 3).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="border border-border/40 bg-card hover:border-primary/40 transition-all duration-300 group cursor-pointer" data-testid={`card-product-${product.id}`}>
                      <div className="h-40 overflow-hidden bg-muted">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
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
              <p className="font-mono text-xs text-primary mb-2">POR QUÉ MAUDEV</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Precisión técnica sin compromiso
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cada extensión y cada proyecto es desarrollado con atención obsesiva al detalle. No vendemos plantillas genéricas ni copiamos código de repositorios públicos. Todo lo que ve aquí fue construido desde cero con un propósito específico.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Código propio y auditado", desc: "Sin dependencias externas no verificadas. Tu estrategia, tu código, tu ventaja." },
                  { icon: Zap, title: "Optimizado para tiempo real", desc: "Las extensiones Pine Script están optimizadas para correr sin lag en activos volátiles." },
                  { icon: Users, title: "Soporte directo del desarrollador", desc: "Hablas directamente con quien escribió el código, no con soporte de nivel 1." },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start p-4 border border-border/40 bg-card/50 hover:border-primary/30 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm mb-1">{feature.title}</div>
                      <div className="text-sm text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, title: "Bitcoin", desc: "BTC/USDT" },
                { icon: Activity, title: "Oro", desc: "XAUUSD" },
                { icon: BarChart2, title: "Plata", desc: "XAGUSD" },
                { icon: Activity, title: "Petróleo", desc: "WTIUSD" },
              ].map((asset) => (
                <div key={asset.title} className="border border-border/40 bg-card p-6 hover:border-primary/30 transition-colors" data-testid={`card-asset-${asset.title}`}>
                  <asset.icon className="h-8 w-8 text-primary mb-4" />
                  <div className="font-bold font-mono">{asset.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{asset.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Services */}
      <section className="py-24 border-t border-border/40 bg-card/20">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-primary mb-2">SOLUCIONES DIGITALES</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Construimos tu producto digital</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Landing Pages", desc: "Alta conversión, animaciones, SEO y formularios conectados. Entrega en 5-7 días.", href: "/products" },
              { icon: Code, title: "Full Stack Apps", desc: "React + Node.js + PostgreSQL. Desde MVP hasta producto escalable con panel admin.", href: "/products" },
              { icon: Smartphone, title: "Apps Móviles", desc: "iOS y Android con React Native / Expo. Diseño nativo, notificaciones, integraciones.", href: "/products" },
            ].map((service) => (
              <Link key={service.title} href={service.href}>
                <div className="border border-border/40 bg-card p-8 hover:border-primary/40 transition-all duration-300 group cursor-pointer h-full flex flex-col" data-testid={`card-service-${service.title}`}>
                  <service.icon className="h-8 w-8 text-primary mb-6" />
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
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-mono text-xs text-primary mb-2">NEWSLETTER</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Recibe actualizaciones y nuevas extensiones</h2>
            <p className="text-muted-foreground mb-8">Sin spam. Solo actualizaciones importantes, nuevas herramientas y análisis de mercado.</p>
            {subscribed ? (
              <div className="border border-primary/40 bg-primary/5 text-primary p-6 font-mono text-sm" data-testid="status-subscribed">
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
