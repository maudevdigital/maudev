import {
  Check,
  X,
  Star,
  ArrowRight,
  Shield,
  Zap,
  HeadphonesIcon,
  Globe,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo-head";
import AffiliateLink from "@/components/affiliate-link";
import AffiliateDisclosure from "@/components/affiliate-disclosure";

// ── Comparison data ───────────────────────────────────────────────────────────

const HOSTINGS = [
  {
    name: "Hostinger",
    price: "$2.99",
    speed: "⚡⚡⚡",
    support: "24/7 ES",
    uptime: "99.9%",
    rating: 4.8,
    free_domain: true,
    free_ssl: true,
    winner: true,
    badge: "NUESTRA ELECCIÓN",
  },
  {
    name: "SiteGround",
    price: "$6.99",
    speed: "⚡⚡⚡",
    support: "24/7 EN",
    uptime: "99.99%",
    rating: 4.6,
    free_domain: false,
    free_ssl: true,
    winner: false,
    badge: null,
  },
  {
    name: "GoDaddy",
    price: "$5.99",
    speed: "⚡⚡",
    support: "24/7 EN",
    uptime: "99.9%",
    rating: 3.8,
    free_domain: true,
    free_ssl: false,
    winner: false,
    badge: null,
  },
  {
    name: "Bluehost",
    price: "$2.95",
    speed: "⚡⚡",
    support: "24/7 EN",
    uptime: "99.9%",
    rating: 4.0,
    free_domain: true,
    free_ssl: true,
    winner: false,
    badge: null,
  },
];

const HOSTINGER_PROS = [
  "Precio más bajo del mercado con planes anuales",
  "Soporte técnico 24/7 en español (chat y tickets)",
  "Panel hPanel intuitivo y fácil para principiantes",
  "Velocidad LiteSpeed hasta 3x más rápida que Apache",
  "Dominio gratis el primer año en planes Business+",
  "SSL gratuito con renovación automática",
  "Backups semanales o diarios según el plan",
  "Migración de sitio web gratis",
  "99.9% uptime garantizado por SLA",
];

const HOSTINGER_CONS = [
  "Renovación más cara que el precio inicial",
  "Soporte telefónico no disponible",
  "Funciones avanzadas solo en planes superiores",
];

const PLANS = [
  {
    name: "Premium",
    price: "$2.99",
    period: "/mes (plan anual)",
    features: [
      "100 sitios web",
      "100 GB SSD",
      "SSL gratis",
      "Emails ilimitados",
      "Dominio gratis",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "$3.99",
    period: "/mes (plan anual)",
    features: [
      "100 sitios web",
      "200 GB SSD NVMe",
      "SSL gratis",
      "Emails ilimitados",
      "Dominio gratis",
      "Backups diarios",
      "CDN incluido",
    ],
    highlighted: true,
    badge: "MÁS VENDIDO",
  },
  {
    name: "Cloud Startup",
    price: "$9.99",
    period: "/mes (plan anual)",
    features: [
      "300 sitios web",
      "200 GB NVMe",
      "SSL gratis",
      "Dominio gratis",
      "3 CPU dedicados",
      "6 GB RAM",
      "Servidor dedicado virtual",
    ],
    highlighted: false,
  },
];

const FAQS = [
  {
    q: "¿Hostinger funciona bien en Chile y LATAM?",
    a: "Sí. Hostinger tiene datacenters en América (Estados Unidos y Brasil) que ofrecen buena latencia para Chile y el resto de LATAM. Además, su soporte está disponible en español 24/7, lo cual es una ventaja enorme.",
  },
  {
    q: "¿Cuánto cuesta Hostinger en pesos chilenos?",
    a: "El plan Premium cuesta aproximadamente $2.99 USD/mes en plan anual, lo que equivale a unos $2,800–3,200 CLP al mes (varía con el tipo de cambio). El pago es anual, entonces se cobra un monto único al inicio.",
  },
  {
    q: "¿Puedo migrar mi sitio actual a Hostinger gratis?",
    a: "Sí. Hostinger ofrece migración de sitio web gratuita con todos sus planes de hosting compartido. El equipo técnico se encarga del proceso, incluyendo archivos, base de datos y correos.",
  },
  {
    q: "¿Hostinger sirve para WordPress?",
    a: "Absolutamente. Hostinger es uno de los hosts más recomendados para WordPress. Tiene instalación en 1 clic, plugin LiteSpeed Cache preinstalado y entornos optimizados para WP.",
  },
  {
    q: "¿Qué diferencia hay entre Hostinger y SiteGround?",
    a: "SiteGround tiene mejor uptime garantizado (99.99%) y tecnología de infraestructura más avanzada, pero cuesta 2-3x más y su soporte no es en español. Para emprendedores que buscan la mejor relación precio-calidad en LATAM, Hostinger gana claramente.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export default function MejorHosting() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Mejor Hosting Web en Chile 2025: Comparativa Completa para LATAM | MauDev"
        description="¿Cuál es el mejor hosting web para Chile en 2025? Comparamos Hostinger, SiteGround, GoDaddy y más. Precios reales en CLP, velocidad y soporte en español."
        keywords="mejor hosting chile 2025, hostinger review, hosting barato chile, hosting wordpress chile, comparativa hosting latam, siteground vs hostinger"
        canonical="https://maudev.cl/comparativas/mejor-hosting"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "Mejor Hosting Web en Chile 2025: Comparativa Completa para LATAM",
          description:
            "Comparativa detallada de los mejores hostings para Chile y LATAM en 2025",
          author: { "@type": "Organization", name: "MauDev" },
          publisher: {
            "@type": "Organization",
            name: "MauDev",
            url: "https://maudev.cl",
          },
          datePublished: "2025-01-01",
          dateModified: "2025-04-01",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://maudev.cl/comparativas/mejor-hosting",
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border/30 bg-card/20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60">
            <a href="/" className="hover:text-primary transition-colors">
              Inicio
            </a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground/40">Comparativas</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Mejor Hosting Chile</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 border-b border-border/40 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1">
              COMPARATIVA · HOSTING
            </Badge>
            <span className="font-mono text-xs text-muted-foreground/60">
              Actualizado: Abril 2025
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Mejor Hosting Web en Chile 2025
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Probamos y comparamos los 4 hostings más populares para
            emprendedores en Chile y LATAM. Velocidad real, soporte en español y
            precios verificados.
          </p>

          {/* Verdict box */}
          <div className="border border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-start gap-4">
              <Award className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs text-green-400 mb-1">
                  VEREDICTO RÁPIDO
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>Hostinger</strong> es el mejor hosting para Chile y
                  LATAM en 2025. Mejor relación precio-calidad, soporte en
                  español 24/7 y velocidad LiteSpeed. Desde{" "}
                  <strong>$2.99/mes</strong> con dominio gratis incluido.
                </p>
                <div className="mt-4">
                  <AffiliateLink
                    program="hostinger"
                    placement="comparativa-mejor-hosting-verdict"
                  >
                    <Button className="rounded-none font-mono text-sm gap-2 glow-primary">
                      Ver oferta Hostinger →
                    </Button>
                  </AffiliateLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Comparison table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Comparativa rápida
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Datos verificados en Abril 2025. Precios del plan básico anual.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-3 text-muted-foreground text-xs font-normal">
                    HOSTING
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    PRECIO/MES
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    VELOCIDAD
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    SOPORTE
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    DOMINIO
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    SSL
                  </th>
                  <th className="text-center p-3 text-muted-foreground text-xs font-normal">
                    RATING
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOSTINGS.map((h) => (
                  <tr
                    key={h.name}
                    className={`border-b border-border/30 ${h.winner ? "bg-primary/5" : "hover:bg-card/40"} transition-colors`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {h.name}
                        </span>
                        {h.badge && (
                          <span className="text-[10px] border border-primary/30 bg-primary/10 text-primary px-1.5 py-0.5">
                            {h.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={
                          h.winner
                            ? "text-green-400 font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {h.price}
                      </span>
                    </td>
                    <td className="p-3 text-center text-base">{h.speed}</td>
                    <td className="p-3 text-center text-xs text-muted-foreground">
                      {h.support}
                    </td>
                    <td className="p-3 text-center">
                      {h.free_domain ? (
                        <Check className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {h.free_ssl ? (
                        <Check className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Stars rating={h.rating} />
                        <span className="text-xs text-muted-foreground">
                          {h.rating}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hostinger review */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 border border-primary/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hostinger — Reseña detallada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pros */}
            <div className="border border-green-500/20 bg-green-500/5 p-6">
              <h3 className="font-bold font-mono text-sm text-green-400 mb-4 flex items-center gap-2">
                <Check className="h-4 w-4" /> VENTAJAS
              </h3>
              <ul className="space-y-2">
                {HOSTINGER_PROS.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="font-bold font-mono text-sm text-red-400 mb-4 flex items-center gap-2">
                <X className="h-4 w-4" /> DESVENTAJAS
              </h3>
              <ul className="space-y-2">
                {HOSTINGER_CONS.map((con) => (
                  <li
                    key={con}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Zap,
                title: "Velocidad LiteSpeed",
                desc: "Servidor web hasta 3x más rápido que Apache. Crítico para SEO y conversiones.",
              },
              {
                icon: HeadphonesIcon,
                title: "Soporte en Español",
                desc: "Chat en vivo y tickets en español, disponible las 24 horas del día.",
              },
              {
                icon: Shield,
                title: "SSL + Backups",
                desc: "Certificado SSL gratuito y renovación automática. Backups incluidos.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="border border-border/40 bg-card/50 p-5"
              >
                <f.icon className="h-5 w-5 text-primary mb-3" />
                <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Planes y precios de Hostinger
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Precios en USD con facturación anual. Verificados en Abril 2025.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`border p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/40 bg-card/30"
                }`}
              >
                {plan.highlighted && plan.badge && (
                  <span className="font-mono text-[10px] border border-primary/30 bg-primary/10 text-primary px-2 py-0.5 mb-4 w-fit">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-mono font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
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
                  program="hostinger"
                  placement={`comparativa-plan-${plan.name.toLowerCase()}`}
                >
                  <Button
                    className={`w-full rounded-none font-mono text-xs ${plan.highlighted ? "glow-primary" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Elegir {plan.name}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </AffiliateLink>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="mb-16 border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="font-mono text-xs text-primary mb-3">
            OFERTA LIMITADA
          </p>
          <h2 className="text-2xl font-bold mb-4">
            Empieza hoy con Hostinger
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Usa nuestro link para obtener hasta un{" "}
            <strong>75% de descuento</strong> en tu primer plan. Dominio gratis
            incluido en planes anuales.
          </p>
          <AffiliateLink
            program="hostinger"
            placement="comparativa-mejor-hosting-bottom-cta"
          >
            <Button size="lg" className="rounded-none font-mono text-sm gap-2 glow-primary">
              Ver oferta exclusiva en Hostinger
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AffiliateLink>
          <p className="text-xs text-muted-foreground/50 font-mono mt-4">
            * Garantía de devolución de 30 días
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-0 divide-y divide-border/30">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="font-bold text-base mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclosure */}
        <AffiliateDisclosure variant="full" />
      </div>
    </div>
  );
}
