import { Link } from "wouter";
import {
  ArrowRight,
  Star,
  Check,
  ChevronRight,
  Globe,
  TrendingUp,
  Mail,
  BarChart2,
  Zap,
  ShieldCheck,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/react";
import { Redirect } from "wouter";
import { useSubscribeEmail } from "@workspace/api-client-react";
import { useState } from "react";
import SEOHead from "@/components/seo-head";
import AffiliateLink from "@/components/affiliate-link";
import AffiliateDisclosure from "@/components/affiliate-disclosure";

// ── Tool cards data ───────────────────────────────────────────────────────────

const TOP_TOOLS = [
  {
    program: "hostinger" as const,
    name: "Hostinger",
    category: "Hosting Web",
    tagline: "El hosting más barato y confiable para LATAM",
    description:
      "Planes desde $2.99/mes con dominio gratis, SSL, backups automáticos y soporte 24/7 en español. El favorito de emprendedores en toda América Latina.",
    highlights: [
      "Planes desde $2.99/mes",
      "Dominio gratis incluido",
      "SSL gratuito + backups",
      "Soporte 24/7 en español",
    ],
    badge: "MÁS POPULAR",
    badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
    rating: 4.8,
    reviews: "50K+",
    icon: Globe,
    ctaText: "Ver oferta →",
    placement: "home-hero",
  },
  {
    program: "semrush" as const,
    name: "SEMrush",
    category: "SEO & Marketing",
    tagline: "La herramienta de SEO más completa del mercado",
    description:
      "Investigación de keywords, análisis de competencia, auditorías técnicas y más. Usada por más de 10 millones de profesionales en todo el mundo.",
    highlights: [
      "Análisis de keywords ilimitado",
      "Auditoría técnica SEO",
      "Spy a tu competencia",
      "Prueba gratis 7 días",
    ],
    badge: "RECOMENDADO",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    rating: 4.7,
    reviews: "10M+",
    icon: BarChart2,
    ctaText: "Prueba gratis →",
    placement: "home-hero",
  },
  {
    program: "systemeio" as const,
    name: "Systeme.io",
    category: "Marketing All-in-One",
    tagline: "Todo lo que necesitas para vender online",
    description:
      "Funnels, email marketing, cursos online, membresías y tienda virtual en una sola plataforma. Plan gratuito para siempre disponible.",
    highlights: [
      "Plan gratuito para siempre",
      "Funnels + email marketing",
      "Cursos y membresías",
      "Sin comisiones por venta",
    ],
    badge: "PLAN GRATIS",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    rating: 4.6,
    reviews: "300K+",
    icon: TrendingUp,
    ctaText: "Empezar gratis →",
    placement: "home-hero",
  },
] as const;

const WHY_TRUST = [
  {
    icon: ShieldCheck,
    title: "Probamos cada herramienta",
    desc: "Antes de recomendar algo, lo usamos nosotros mismos. Nada de reseñas genéricas copiadas.",
  },
  {
    icon: Users,
    title: "Enfocados en LATAM",
    desc: "Verificamos precios en pesos, soporte en español y disponibilidad real para Chile y Argentina.",
  },
  {
    icon: Award,
    title: "Siempre actualizados",
    desc: "Revisamos precios, planes y calidad cada trimestre. Lo que ves es lo que existe hoy.",
  },
];

const LATEST_COMPARATIVAS = [
  {
    href: "/comparativas/mejor-hosting",
    category: "HOSTING",
    title: "Mejor Hosting Web en Chile 2025",
    desc: "Comparamos los 5 mejores proveedores por precio, velocidad y soporte en español.",
    badge: "Hostinger, SiteGround, GoDaddy",
    minutes: "8 min lectura",
  },
];

// ── Star rating component ─────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
        />
      ))}
    </span>
  );
}

// ── Main home content ─────────────────────────────────────────────────────────

function HomeContent() {
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
      },
    );
  };

  return (
    <div className="flex flex-col">
      <SEOHead
        tabPrefix="🚀"
        title="MauDev | Herramientas Digitales para Emprendedores en LATAM — Comparativas y Reseñas"
        description="Comparativas honestas de hosting, SEO y marketing digital para emprendedores en Chile y LATAM. Hostinger, SEMrush, Systeme.io y más — probados y recomendados."
        keywords="mejor hosting chile, hostinger review, semrush review, herramientas digitales, emprendimiento online latam, systeme io, herramientas seo, marketing digital chile"
        canonical="https://maudev.cl/"
        ogImage="https://maudev.cl/opengraph.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MauDev",
          url: "https://maudev.cl",
          description:
            "Comparativas y reseñas de herramientas digitales para emprendedores en LATAM",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://maudev.cl/blog?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[140px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1">
              HERRAMIENTAS PARA EMPRENDEDORES — CHILE & LATAM
            </Badge>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-none mb-6">
              Las mejores herramientas para{" "}
              <span className="text-gradient-primary">
                hacer crecer tu negocio
              </span>{" "}
              digital
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Comparativas honestas de hosting, SEO y marketing digital.
              Probadas y recomendadas por desarrolladores para emprendedores en
              Chile, Argentina y toda LATAM.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-14">
              <Link href="/herramientas">
                <Button
                  size="lg"
                  className="rounded-none font-mono text-sm group gap-2 glow-primary"
                >
                  VER TODAS LAS HERRAMIENTAS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/comparativas/mejor-hosting">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-none font-mono text-sm border-border/50 hover:border-primary/40"
                >
                  COMPARATIVA DE HOSTING
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-muted-foreground/70">
              {[
                "✓ Reseñas verificadas",
                "✓ Actualizadas en 2025",
                "✓ Soporte en español",
                "✓ Precios en CLP/ARS",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Herramientas destacadas ── */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-2">
                HERRAMIENTAS RECOMENDADAS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Las que realmente funcionan
              </h2>
            </div>
            <Link
              href="/herramientas"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              VER TODAS <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_TOOLS.map((tool) => (
              <div
                key={tool.program}
                className="border border-border/40 bg-card hover-glow transition-all duration-300 flex flex-col"
              >
                {/* Card header */}
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-primary/10 border border-primary/20">
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span
                      className={`font-mono text-[10px] border px-2 py-0.5 ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mb-1">
                    {tool.category}
                  </p>
                  <h3 className="font-bold text-xl mb-1">{tool.name}</h3>
                  <p className="text-sm text-primary/80 font-medium mb-3">
                    {tool.tagline}
                  </p>
                  <div className="flex items-center gap-2">
                    <Stars rating={tool.rating} />
                    <span className="text-xs font-mono text-muted-foreground">
                      {tool.rating} ({tool.reviews} usuarios)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {tool.description}
                  </p>
                  <ul className="space-y-2">
                    {tool.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
                      >
                        <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <AffiliateLink
                    program={tool.program}
                    placement={tool.placement}
                    className="w-full"
                  >
                    <Button className="w-full rounded-none font-mono text-sm gap-2 glow-primary">
                      {tool.ctaText}
                    </Button>
                  </AffiliateLink>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/herramientas">
              <Button
                variant="outline"
                className="rounded-none font-mono text-sm border-border/50 hover:border-primary/40 gap-2"
              >
                Ver todas las herramientas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Por qué confiar ── */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-14">
            <p className="font-mono text-xs text-gradient-primary mb-3">
              POR QUÉ CONFIAR EN NOSOTROS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Reseñas honestas, sin filtro
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm">
              No recomendamos algo solo porque paga más comisión. Si una
              herramienta no cumple, lo decimos. Así de simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/30">
            {WHY_TRUST.map((item) => (
              <div
                key={item.title}
                className="bg-background p-8 group hover:bg-card/60 transition-colors duration-300 flex flex-col gap-4"
              >
                <div className="p-2.5 bg-primary/10 border border-primary/20 w-fit">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparativas recientes ── */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-2">
                COMPARATIVAS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Comparativas detalladas
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              VER BLOG <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LATEST_COMPARATIVAS.map((post) => (
              <Link key={post.href} href={post.href}>
                <div className="border border-border/40 bg-card p-8 hover-glow transition-all duration-300 group cursor-pointer h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] border border-primary/30 bg-primary/5 text-primary px-2 py-0.5">
                      {post.category}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {post.minutes}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {post.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs font-mono text-muted-foreground/60">
                      {post.badge}
                    </span>
                    <span className="font-mono text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      LEER <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming soon placeholder */}
            <div className="border border-dashed border-border/30 bg-card/30 p-8 flex flex-col gap-4 items-center justify-center text-center">
              <Zap className="h-8 w-8 text-primary/30" />
              <div>
                <p className="font-mono text-xs text-primary/50 mb-2">
                  PRÓXIMAMENTE
                </p>
                <h3 className="font-bold text-lg text-muted-foreground/60">
                  SEMrush vs Ahrefs 2025
                </h3>
                <p className="text-sm text-muted-foreground/40 mt-2">
                  ¿Cuál conviene más para LATAM?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Email marketing CTA ── */}
      <section className="py-16 border-t border-border/40">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="border border-primary/20 bg-primary/5 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="font-mono text-xs text-primary mb-3">
                  HERRAMIENTA DESTACADA
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  ¿Necesitas hacer email marketing?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  GetResponse ofrece email marketing, landing pages y
                  automatizaciones en un solo lugar. Prueba gratuita de 30 días,
                  sin tarjeta de crédito.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Email marketing con autoresponders",
                    "Constructeur de landing pages",
                    "Webinars integrados",
                    "Prueba 30 días gratis",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
                    >
                      <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <AffiliateLink
                  program="getresponse"
                  placement="home-email-cta"
                >
                  <Button className="rounded-none font-mono text-sm gap-2">
                    <Mail className="h-4 w-4" />
                    Probar GetResponse gratis →
                  </Button>
                </AffiliateLink>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="border border-primary/20 bg-background/60 p-8 font-mono text-xs space-y-3 w-full max-w-xs">
                  <div className="text-primary/60 text-[10px] mb-4">
                    $ email-stats --account my-business
                  </div>
                  {[
                    { label: "Suscriptores", value: "2,847" },
                    { label: "Tasa apertura", value: "34.2%" },
                    { label: "Clics", value: "8.1%" },
                    { label: "Conversiones", value: "2.4%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex justify-between text-muted-foreground"
                    >
                      <span className="opacity-60">{stat.label}</span>
                      <span className="text-green-400">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-24 border-t border-border/40">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="absolute -inset-8 bg-primary/5 blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="font-mono text-xs text-gradient-primary mb-2">
                NEWSLETTER
              </p>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Reseñas y ofertas antes que nadie
              </h2>
              <p className="text-muted-foreground mb-8 text-sm">
                Recibe comparativas nuevas, ofertas exclusivas de herramientas y
                guías prácticas. Sin spam, solo contenido útil.
              </p>
              {subscribed ? (
                <div className="border border-primary/40 bg-primary/5 text-primary p-6 font-mono text-sm glow-primary">
                  SUSCRIPCIÓN EXITOSA. ¡GRACIAS!
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-border/60 bg-card px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border border-border/60 bg-card px-4 py-2 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
                  />
                  <Button
                    type="submit"
                    className="rounded-none font-mono text-xs shrink-0"
                    disabled={subscribeEmail.isPending}
                  >
                    {subscribeEmail.isPending ? "..." : "SUSCRIBIR"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Affiliate disclosure ── */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <AffiliateDisclosure variant="compact" />
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect to="/dashboard" />;
  return <HomeContent />;
}
