import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, BarChart2, Search, Globe, TrendingUp, FileText, Link2, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo-head";
import { AffiliateLink } from "@/components/affiliate-link";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";

const FEATURES = [
  {
    icon: Search,
    title: "Investigación de palabras clave",
    desc: "Descubre qué buscan tus clientes en Chile y Latinoamérica. Volumen, dificultad y variaciones long-tail en un solo lugar.",
  },
  {
    icon: BarChart2,
    title: "Análisis de competencia",
    desc: "Ve exactamente qué keywords, backlinks y estrategias usa tu competencia para posicionarse. Copia lo que funciona, evita lo que falla.",
  },
  {
    icon: Globe,
    title: "Auditoría técnica SEO",
    desc: "Detecta errores de rastreo, velocidad, metaetiquetas rotas y problemas de indexación que frenan tu posicionamiento en Google.",
  },
  {
    icon: Link2,
    title: "Análisis de backlinks",
    desc: "Revisa el perfil de enlaces de cualquier sitio. Identifica oportunidades de link building y dominios tóxicos que penalizan.",
  },
  {
    icon: FileText,
    title: "Optimización de contenido",
    desc: "El editor SEO de Semrush sugiere mejoras en tiempo real para que tu artículo posicione en la primera página de Google.",
  },
  {
    icon: TrendingUp,
    title: "Tracking de posiciones",
    desc: "Monitorea el ranking de tus keywords día a día. Detecta caídas antes de que impacten tu tráfico y tus ventas.",
  },
];

const PLANS = [
  {
    name: "Pro",
    price: "$139.95",
    period: "/mes",
    highlight: false,
    forWho: "Freelancers y pequeños negocios",
    features: [
      "5 proyectos activos",
      "500 palabras clave por reporte",
      "10,000 resultados por reporte",
      "Auditoría de sitio (100k páginas/mes)",
      "Semrush Keyword Magic Tool",
    ],
  },
  {
    name: "Guru",
    price: "$249.95",
    period: "/mes",
    highlight: true,
    forWho: "Agencias y marketers en crecimiento",
    features: [
      "15 proyectos activos",
      "1,500 palabras clave por reporte",
      "30,000 resultados por reporte",
      "Auditoría de sitio (300k páginas/mes)",
      "Historial de datos + Content Marketing Toolkit",
    ],
  },
  {
    name: "Business",
    price: "$499.95",
    period: "/mes",
    highlight: false,
    forWho: "Agencias grandes y e-commerce",
    features: [
      "40 proyectos activos",
      "5,000 palabras clave por reporte",
      "50,000 resultados por reporte",
      "Auditoría de sitio (1M páginas/mes)",
      "API + Google Data Studio + White label",
    ],
  },
];

const FAQS = [
  {
    q: "¿Semrush vale la pena para un negocio pequeño en Chile?",
    a: "Sí, especialmente si tienes competencia online. El plan Pro cubre la mayoría de las necesidades de una PyME: investigación de keywords, auditoría del sitio y seguimiento de posiciones. El costo se recupera con una sola página bien posicionada que genere clientes orgánicos constantes.",
  },
  {
    q: "¿Semrush tiene datos de búsqueda para Chile?",
    a: "Sí. Semrush tiene base de datos específica para Chile (google.cl) y toda Latinoamérica. Puedes ver volúmenes de búsqueda locales, CPC en pesos chilenos y competencia de keywords en el mercado chileno.",
  },
  {
    q: "¿Puedo probar Semrush gratis antes de pagar?",
    a: "Semrush ofrece una prueba gratuita de 7 días con acceso completo al plan Pro. No necesitas tarjeta para comenzar el trial. Si no cancelas antes del vencimiento, se cobra automáticamente.",
  },
  {
    q: "¿Cuál es la diferencia entre Semrush y otras herramientas SEO como Ahrefs?",
    a: "Semrush es más completo para marketing digital en general: incluye herramientas de PPC, social media y content marketing. Ahrefs es más fuerte en análisis de backlinks. Para la mayoría de negocios en Chile, Semrush es la opción más versátil.",
  },
  {
    q: "¿Semrush sirve también para Google Ads?",
    a: "Sí. Semrush tiene módulo específico para análisis de competencia en paid search: puedes ver qué keywords y qué anuncios usa la competencia en Google Ads, lo que es útil para armar campañas más eficientes.",
  },
  {
    q: "¿Cada cuánto se actualiza la base de datos de Semrush?",
    a: "La base de datos de Semrush se actualiza mensualmente para la mayoría de métricas. El tracking de posiciones (Position Tracking) se actualiza diariamente.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border/40 bg-card/50 cursor-pointer select-none"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <span className="font-medium text-sm leading-snug">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </div>
      {open && (
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HerramientasSEO() {
  return (
    <div className="flex flex-col">
      <SEOHead
        tabPrefix="🔍"
        title="Semrush en Chile: La Mejor Herramienta SEO para Posicionar tu Negocio | MauDev"
        description="Descubre cómo Semrush puede posicionar tu negocio en Google Chile. Análisis de keywords, auditoría SEO, backlinks y seguimiento de posiciones. Prueba gratis 7 días."
        keywords="semrush chile, herramientas seo chile, posicionamiento web chile, semrush español, analisis competencia seo, auditoria seo, keyword research chile, semrush precio"
        canonical="https://maudev.cl/herramientas-seo"
        ogImage="https://maudev.cl/opengraph.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Semrush: La mejor herramienta SEO para negocios en Chile",
          "description": "Guía completa de Semrush para el mercado chileno. Características, precios y cómo usarlo para posicionar tu negocio en Google.",
          "author": { "@type": "Organization", "name": "MauDev" },
          "publisher": { "@type": "Organization", "name": "MauDev", "url": "https://maudev.cl" },
          "url": "https://maudev.cl/herramientas-seo",
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />

        <div className="container max-w-5xl mx-auto px-4 md:px-8 py-24 relative z-10 text-center">
          <Badge className="mb-6 font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary px-3 py-1">
            HERRAMIENTAS SEO · GUÍA PARA CHILE
          </Badge>

          <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-none mb-6">
            Posiciona tu negocio en{" "}
            <span className="text-gradient-primary">Google Chile</span>{" "}
            con datos reales
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Semrush es la plataforma de marketing digital más usada a nivel mundial. Con datos específicos para{" "}
            <strong className="text-foreground">google.cl</strong>, puedes descubrir qué buscan tus clientes, superar a tu competencia y crecer con tráfico orgánico constante.
          </p>

          <AffiliateDisclosure variant="compact" className="max-w-xl mx-auto mb-10" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AffiliateLink program="semrush" placement="hero-cta-primary">
              <Button size="lg" className="rounded-none font-mono text-sm group gap-2 glow-primary w-full sm:w-auto">
                PROBAR SEMRUSH GRATIS 7 DÍAS
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </AffiliateLink>
            <a href="#planes">
              <Button size="lg" variant="outline" className="rounded-none font-mono text-sm border-border/50 hover:border-primary/40 w-full sm:w-auto">
                VER PLANES Y PRECIOS
              </Button>
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-14 text-xs font-mono text-muted-foreground/60">
            {[
              "10M+ profesionales lo usan",
              "Datos para google.cl",
              "Prueba gratis sin tarjeta",
              "Cancela cuando quieras",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary/50" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Qué es Semrush */}
      <section className="py-20 border-t border-border/40 bg-card/10">
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-gradient-primary mb-3">QUÉ ES SEMRUSH</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Todo lo que necesitas para dominar el SEO
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Semrush es una plataforma todo-en-uno para SEO, SEM y marketing de contenidos. Más de 55 herramientas integradas para que nunca tengas que adivinar: los datos te dicen exactamente qué hacer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/30">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="bg-background p-7 hover:bg-card/60 transition-colors duration-300 flex gap-5">
                <div className="p-2.5 bg-primary/10 border border-primary/20 h-fit shrink-0">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <AffiliateLink program="semrush" placement="features-cta">
              <Button className="rounded-none font-mono text-sm gap-2 group">
                EXPLORAR TODAS LAS HERRAMIENTAS
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </AffiliateLink>
          </div>
        </div>
      </section>

      {/* Por qué Chile */}
      <section className="py-20 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-xs text-gradient-primary mb-3">MERCADO CHILENO</p>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Datos reales de búsqueda en Chile
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Semrush tiene base de datos específica para <strong className="text-foreground">google.cl</strong>. Puedes ver volúmenes de búsqueda locales, el CPC real en el mercado chileno y la dificultad de posicionamiento para cada keyword en nuestro país.
              </p>
              <ul className="space-y-3">
                {[
                  "Volúmenes de búsqueda en google.cl",
                  "CPC en USD para Google Ads Chile",
                  "Competencia real por industria local",
                  "Tendencias de búsqueda estacionales",
                  "Análisis de competidores chilenos",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border/40 bg-card p-8 space-y-6">
              <p className="font-mono text-xs text-muted-foreground/60">EJEMPLO REAL · GOOGLE.CL</p>
              {[
                { kw: "diseño web chile", vol: "2,400/mes", dif: "Media", cpc: "$1.20" },
                { kw: "hosting barato chile", vol: "1,900/mes", dif: "Baja", cpc: "$0.85" },
                { kw: "agencia seo santiago", vol: "880/mes", dif: "Media", cpc: "$2.40" },
                { kw: "posicionamiento web", vol: "3,600/mes", dif: "Alta", cpc: "$1.80" },
              ].map((row) => (
                <div key={row.kw} className="flex items-center justify-between font-mono text-xs border-b border-border/20 pb-3 last:border-0 last:pb-0">
                  <span className="text-foreground font-medium w-40 truncate">{row.kw}</span>
                  <span className="text-muted-foreground">{row.vol}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] border ${
                    row.dif === "Baja" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                    row.dif === "Media" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                    "border-red-500/30 text-red-400 bg-red-500/10"
                  }`}>{row.dif}</span>
                  <span className="text-primary">{row.cpc}</span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground/40 font-mono">* Datos ilustrativos. Los valores reales varían.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="py-20 border-t border-border/40 bg-card/10">
        <div className="container max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-gradient-primary mb-3">PRECIOS</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Planes de Semrush</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Todos los planes incluyen prueba gratuita de 7 días. Cancela antes y no se te cobra nada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/30">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col p-8 ${
                  plan.highlight
                    ? "bg-primary/5 border border-primary/30"
                    : "bg-background hover:bg-card/60 transition-colors"
                }`}
              >
                {plan.highlight && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span className="font-mono text-[10px] text-primary">MÁS POPULAR</span>
                  </div>
                )}
                <p className="font-mono text-xs text-muted-foreground mb-2">{plan.forWho}</p>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-mono font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground font-mono mb-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <AffiliateLink program="semrush" placement={`plans-${plan.name.toLowerCase()}`}>
                  <Button
                    className={`w-full rounded-none font-mono text-xs ${
                      plan.highlight ? "glow-primary" : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    PROBAR {plan.name.toUpperCase()} GRATIS
                  </Button>
                </AffiliateLink>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground/50 font-mono mt-6">
            Precios en USD. Facturación mensual. Descuento disponible en planes anuales.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border/40">
        <div className="container max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-gradient-primary mb-3">PREGUNTAS FRECUENTES</p>
            <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitas saber</h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 border-t border-border/40 bg-card/10">
        <div className="container max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-primary/5 blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="font-mono text-xs text-gradient-primary mb-3">EMPIEZA HOY</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                7 días gratis. Sin tarjeta de crédito.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto">
                Crea tu cuenta, conecta tu dominio y en minutos tendrás un diagnóstico completo de tu SEO y el de tu competencia.
              </p>
              <AffiliateLink program="semrush" placement="footer-cta">
                <Button size="lg" className="rounded-none font-mono text-sm gap-2 group glow-primary">
                  COMENZAR PRUEBA GRATUITA
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AffiliateLink>
              <div className="mt-8">
                <AffiliateDisclosure variant="full" className="max-w-xl mx-auto text-left" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
