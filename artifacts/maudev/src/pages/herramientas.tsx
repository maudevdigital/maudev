import {
  Globe,
  BarChart2,
  TrendingUp,
  Mail,
  Layout,
  FileText,
  Check,
  ExternalLink,
  Star,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo-head";
import AffiliateLink from "@/components/affiliate-link";
import AffiliateDisclosure from "@/components/affiliate-disclosure";
import { type AffiliateProgram } from "@/lib/affiliate-config";

type Category = "todas" | "hosting" | "seo" | "marketing" | "email";

interface Tool {
  program: AffiliateProgram;
  name: string;
  category: Category;
  categoryLabel: string;
  tagline: string;
  description: string;
  highlights: string[];
  commission: string;
  rating: number;
  price: string;
  badge?: string;
  icon: React.ElementType;
  ctaText: string;
  placement: string;
}

const TOOLS: Tool[] = [
  {
    program: "hostinger",
    name: "Hostinger",
    category: "hosting",
    categoryLabel: "HOSTING",
    tagline: "El hosting más barato y confiable para LATAM",
    description:
      "Planes desde $2.99/mes con dominio gratis, SSL incluido, backups diarios y soporte 24/7 en español. La opción más popular entre emprendedores de Chile y Argentina.",
    highlights: [
      "Dominio gratis el primer año",
      "SSL gratis en todos los planes",
      "Velocidad LiteSpeed (3x más rápido)",
      "Soporte 24/7 en español",
      "Panel de control hPanel fácil de usar",
      "Migración de sitio gratis",
    ],
    commission: "40–60% por venta",
    rating: 4.8,
    price: "Desde $2.99/mes",
    badge: "MÁS POPULAR",
    icon: Globe,
    ctaText: "Ver planes y precios",
    placement: "herramientas-page",
  },
  {
    program: "semrush",
    name: "SEMrush",
    category: "seo",
    categoryLabel: "SEO",
    tagline: "La suite de SEO y marketing más completa",
    description:
      "Más de 55 herramientas en una sola plataforma: investigación de keywords, análisis de backlinks, auditorías técnicas, spy de competencia y más. Usada por más de 10 millones de profesionales.",
    highlights: [
      "Base de datos de 25B+ keywords",
      "Auditoría técnica SEO completa",
      "Análisis de backlinks de la competencia",
      "Herramienta de contenido SEO",
      "Monitoreo de posiciones diario",
      "Prueba gratuita 7 días",
    ],
    commission: "$200 por venta + $10 por trial",
    rating: 4.7,
    price: "Desde $139.95/mes",
    badge: "RECOMENDADO",
    icon: BarChart2,
    ctaText: "Iniciar prueba gratis",
    placement: "herramientas-page",
  },
  {
    program: "systemeio",
    name: "Systeme.io",
    category: "marketing",
    categoryLabel: "MARKETING",
    tagline: "Todo lo que necesitas para vender online",
    description:
      "Funnels de venta, email marketing, cursos online, membresías, tienda virtual y automatizaciones, todo en una sola plataforma. Tiene plan gratuito para siempre.",
    highlights: [
      "Plan gratuito para siempre (hasta 2K suscriptores)",
      "Constructor de funnels drag & drop",
      "Plataforma de cursos online",
      "Email marketing con automatizaciones",
      "Blog integrado",
      "Sin comisiones sobre tus ventas",
    ],
    commission: "60% comisión recurrente de por vida",
    rating: 4.6,
    price: "Gratis (plan pago desde $27/mes)",
    badge: "PLAN GRATIS",
    icon: TrendingUp,
    ctaText: "Empezar gratis",
    placement: "herramientas-page",
  },
  {
    program: "getresponse",
    name: "GetResponse",
    category: "email",
    categoryLabel: "EMAIL MARKETING",
    tagline: "Email marketing + landing pages + webinars",
    description:
      "Plataforma de email marketing con autoresponders avanzados, constructor de landing pages, webinars integrados y herramientas de conversión. 30 días de prueba gratis.",
    highlights: [
      "Autoresponders y automatizaciones",
      "Constructor de landing pages incluido",
      "Webinars para hasta 1,000 asistentes",
      "Segmentación avanzada de contactos",
      "A/B testing integrado",
      "30 días de prueba gratis",
    ],
    commission: "33% recurrente o $100 flat",
    rating: 4.5,
    price: "Desde $15.58/mes",
    icon: Mail,
    ctaText: "Probar 30 días gratis",
    placement: "herramientas-page",
  },
  {
    program: "unbounce",
    name: "Unbounce",
    category: "marketing",
    categoryLabel: "LANDING PAGES",
    tagline: "Construye landing pages que convierten",
    description:
      "Constructor de landing pages con IA integrada que te ayuda a optimizar textos y diseños para maximizar conversiones. Perfecto para agencias y freelancers.",
    highlights: [
      "Constructor drag & drop sin código",
      "IA para optimización de copy",
      "Smart Traffic (IA que envía a la mejor variante)",
      "Más de 100 templates optimizados",
      "Integración con Google Ads",
      "Prueba gratis 14 días",
    ],
    commission: "20% recurrente de por vida",
    rating: 4.5,
    price: "Desde $74/mes",
    icon: Layout,
    ctaText: "Probar gratis 14 días",
    placement: "herramientas-page",
  },
  {
    program: "jotform",
    name: "Jotform",
    category: "marketing",
    categoryLabel: "FORMULARIOS",
    tagline: "Formularios profesionales para capturar leads",
    description:
      "Crea formularios de contacto, encuestas, pagos y registros con arrastrar y soltar. Más de 10,000 templates disponibles e integración con más de 150 apps.",
    highlights: [
      "Constructor drag & drop intuitivo",
      "Más de 10,000 templates",
      "Formularios de pago integrados",
      "Firmas electrónicas",
      "Integración con 150+ aplicaciones",
      "Plan gratuito disponible",
    ],
    commission: "30% recurrente",
    rating: 4.6,
    price: "Gratis (plan pago desde $34/mes)",
    icon: FileText,
    ctaText: "Empezar gratis",
    placement: "herramientas-page",
  },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "hosting", label: "Hosting" },
  { value: "seo", label: "SEO" },
  { value: "marketing", label: "Marketing" },
  { value: "email", label: "Email" },
];

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

export default function Herramientas() {
  const [activeCategory, setActiveCategory] = useState<Category>("todas");

  const filtered =
    activeCategory === "todas"
      ? TOOLS
      : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Herramientas Digitales Recomendadas para Emprendedores en LATAM | MauDev"
        description="Las mejores herramientas de hosting, SEO y marketing digital para emprendedores en Chile y LATAM. Hostinger, SEMrush, Systeme.io y más — comparadas y reseñadas."
        keywords="herramientas digitales latam, mejor hosting chile, semrush precio, systeme io review, getresponse, unbounce, jotform, herramientas seo"
        canonical="https://maudev.cl/herramientas"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Herramientas digitales para emprendedores",
          description:
            "Las mejores herramientas de hosting, SEO y marketing para LATAM",
          numberOfItems: TOOLS.length,
          itemListElement: TOOLS.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            description: t.tagline,
          })),
        }}
      />

      {/* Header */}
      <section className="relative py-20 border-b border-border/40 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1">
            HERRAMIENTAS VERIFICADAS PARA LATAM
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Herramientas para tu negocio digital
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed text-base">
            Seleccionamos y probamos cada herramienta antes de recomendarla.
            Precios verificados para Chile, Argentina y LATAM. Actualizadas en
            2025.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border/30 bg-card/30 sticky top-16 z-40 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                  activeCategory === cat.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
            <span className="ml-auto font-mono text-xs text-muted-foreground/50">
              {filtered.length} herramienta{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-12 flex-1">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((tool) => (
              <div
                key={tool.program}
                className="border border-border/40 bg-card hover-glow transition-all duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 border border-primary/20">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {tool.categoryLabel}
                        </span>
                        <h2 className="font-bold text-lg leading-none mt-0.5">
                          {tool.name}
                        </h2>
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="font-mono text-[10px] border border-primary/30 bg-primary/5 text-primary px-2 py-0.5">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-primary/80 mb-2">
                    {tool.tagline}
                  </p>

                  <div className="flex items-center gap-3">
                    <Stars rating={tool.rating} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {tool.rating}/5
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/50">
                      · {tool.price}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {tool.description}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {tool.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-start gap-1.5 text-xs font-mono text-muted-foreground"
                      >
                        <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex items-center gap-3">
                  <AffiliateLink
                    program={tool.program}
                    placement={tool.placement}
                    className="flex-1"
                  >
                    <Button className="w-full rounded-none font-mono text-sm gap-2 glow-primary">
                      {tool.ctaText}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </AffiliateLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <AffiliateDisclosure variant="full" />
      </div>
    </div>
  );
}
