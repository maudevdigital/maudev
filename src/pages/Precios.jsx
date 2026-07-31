import { useSeo } from "@/lib/useSeo";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Calculator, Globe, Bot, Code2 } from "lucide-react";
import PageShell from "@/components/landing/PageShell";
import ComparisonSection from "@/components/landing/ComparisonSection";
import N8nProductsSection from "@/components/landing/N8nProductsSection";
import { Button } from "@/components/ui/button";
import { CTA_LABEL } from "@/data/site";

// Precios "desde", coherentes con la FAQ de la landing. Si cambias un precio
// aquí, actualiza también FaqSection y el cotizador.
const plans = [
  {
    icon: Globe,
    name: "Landing + SEO",
    price: "$390.000",
    currency: "CLP",
    prefix: "desde",
    time: "5 a 10 días",
    desc: "Una página de alta conversión que aparece en Google y captura leads desde el primer día.",
    includes: [
      "Diseño profesional a medida (no plantilla)",
      "SEO técnico completo y carga rápida",
      "Formulario de captura conectado a tu base",
      "Google Analytics 4 y Meta Pixel configurados",
      "Dominio y hosting dejados funcionando",
    ],
    excludes: [
      "Redacción de contenido extenso (se cotiza aparte)",
      "Mantención mensual (plan opcional)",
    ],
  },
  {
    icon: Bot,
    name: "Automatización",
    price: "$290.000",
    currency: "CLP",
    prefix: "desde",
    time: "1 a 3 semanas",
    desc: "Workflows y bots que eliminan trabajo manual: seguimiento de leads, respuestas automáticas, integraciones.",
    includes: [
      "Diagnóstico del proceso a automatizar",
      "Bot o workflow construido y conectado",
      "Integración entre tus herramientas actuales",
      "Despliegue y puesta en marcha funcionando",
      "Documentación de uso y traspaso",
    ],
    excludes: [
      "Licencias de herramientas de terceros",
    ],
  },
  {
    icon: Code2,
    name: "Software a medida",
    price: "Cotización",
    currency: "",
    prefix: "",
    time: "2 a 6+ semanas",
    desc: "Apps, dashboards, sistemas internos y plataformas SaaS. El alcance se define contigo en el roadmap inicial.",
    includes: [
      "Roadmap técnico con hitos y precio fijo",
      "Desarrollo iterativo con entregas parciales",
      "Código fuente 100% a tu nombre",
      "Dominio, servidor y despliegue en producción",
      "Soporte post-entrega incluido",
    ],
    excludes: [
      "Costos recurrentes de APIs o servicios de terceros (se transparentan en la propuesta)",
    ],
    featured: true,
  },
];

export default function Precios() {
  useSeo({
    title: "Precios · Maudev",
    description: "Precios publicados de páginas web, software a medida y automatización. Precio fijo por escrito, sin cotizaciones misteriosas.",
    path: "/precios",
    noindex: true,
  });

  return (
    <PageShell>

      <section className="relative pt-32 pb-12 lg:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="kicker">{"precios"}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-5">
            {"Precios transparentes,"} <span className="text-primary">{"sin letra chica"}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {"Publicamos lo que casi nadie publica. Estos son valores \"desde\": el precio exacto y fijo lo recibes por escrito en el diagnóstico gratuito, antes de pagar un peso."}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col bg-card border rounded-2xl p-7 ${
                  p.featured ? "border-primary/40 glow-cyan" : "border-border"
                }`}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold mb-1">{p.name}</h2>
                <div className="flex items-baseline gap-2 mb-1">
                  {p.prefix && <span className="text-xs font-mono text-muted-foreground">{p.prefix}</span>}
                  <span className="text-3xl font-black tracking-tight text-primary font-mono">{p.price}</span>
                  {p.currency && <span className="text-xs font-mono text-muted-foreground">{p.currency}</span>}
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-4">⏱ {p.time}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{p.desc}</p>

                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
                  Incluye
                </p>
                <ul className="space-y-2 mb-5">
                  {p.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
                  No incluye
                </p>
                <ul className="space-y-2 mb-7">
                  {p.excludes.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground/70">
                      <X className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link to="/contacto">
                    <Button
                      className={`w-full h-11 font-semibold ${
                        p.featured
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-foreground hover:bg-secondary/70 border border-border"
                      }`}
                    >
                      {CTA_LABEL}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Condiciones de pago — las mismas del proceso y la FAQ */}
          <div className="mt-10 bg-card border border-border rounded-2xl p-6 sm:p-8">
            <p className="text-sm text-center text-muted-foreground mb-6 pb-6 border-b border-border/40">
              Todos los proyectos se entregan funcionando: dominio, hosting o servidor, SSL y la configuración necesaria para operar están considerados en el precio.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-bold mb-1">{"50% / 50%"}</p>
                <p className="text-xs text-muted-foreground">{"Anticipo al inicio, saldo contra entrega aprobada."}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">CLP · USD · USDT</p>
                <p className="text-xs text-muted-foreground">{"Transferencia en Chile; USD o USDT para el extranjero."}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">{"Contrato por escrito"}</p>
                <p className="text-xs text-muted-foreground">
                  Precio y alcance fijados por escrito antes de empezar.
                </p>
              </div>
            </div>
          </div>

          {/* CTA a contacto */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Quieres un número más cercano a tu caso?
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Pedir diagnóstico gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Productos de Automatización n8n paquetizados con compra directa */}
      <N8nProductsSection />

      {/* Comparación honesta: vive aquí (contexto de decisión de compra), no en el home */}
      <ComparisonSection />

    </PageShell>
  );
}
