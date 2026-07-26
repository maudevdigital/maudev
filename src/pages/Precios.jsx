import { useSeo } from "@/lib/useSeo";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Calculator, Globe, Bot, Code2 } from "lucide-react";
import PageShell from "@/components/landing/PageShell";
import ComparisonSection from "@/components/landing/ComparisonSection";
import N8nProductsSection from "@/components/landing/N8nProductsSection";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

// Precios "desde", coherentes con la FAQ de la landing. Si cambias un precio
// aquí, actualiza también FaqSection y el cotizador.
const plans = [
  {
    icon: Globe,
    name: t("Landing + SEO", "Landing + SEO"),
    price: "$390.000",
    currency: "CLP",
    prefix: t("desde", "from"),
    time: t("5 a 10 días", "5 to 10 days"),
    desc: t(
      "Una página de alta conversión que aparece en Google y captura leads desde el primer día.",
      "A high-converting page that ranks on Google and captures leads from day one."
    ),
    includes: [
      t("Diseño profesional a medida (no plantilla)", "Custom professional design (no template)"),
      t("SEO técnico completo y carga rápida", "Full technical SEO and fast loading"),
      t("Formulario de captura conectado a tu base", "Capture form connected to your database"),
      t("Google Analytics 4 y Meta Pixel configurados", "Google Analytics 4 and Meta Pixel configured"),
      t("Dominio y hosting dejados funcionando", "Domain and hosting left running"),
    ],
    excludes: [
      t("Redacción de contenido extenso (se cotiza aparte)", "Long-form copywriting (quoted separately)"),
      t("Mantención mensual (plan opcional)", "Monthly maintenance (optional plan)"),
    ],
  },
  {
    icon: Bot,
    name: t("Automatización", "Automation"),
    price: "$290.000",
    currency: "CLP",
    prefix: t("desde", "from"),
    time: t("1 a 3 semanas", "1 to 3 weeks"),
    desc: t(
      "Workflows y bots que eliminan trabajo manual: seguimiento de leads, respuestas automáticas, integraciones.",
      "Workflows and bots that remove manual work: lead follow-up, automatic replies, integrations."
    ),
    includes: [
      t("Diagnóstico del proceso a automatizar", "Assessment of the process to automate"),
      t("Bot o workflow construido y conectado", "Bot or workflow built and connected"),
      t("Integración entre tus herramientas actuales", "Integration between your current tools"),
      t("Despliegue y puesta en marcha funcionando", "Deployment and launch, up and running"),
      t("Documentación de uso y traspaso", "Usage documentation and handover"),
    ],
    excludes: [
      t("Licencias de herramientas de terceros", "Third-party tool licenses"),
    ],
  },
  {
    icon: Code2,
    name: t("Software a medida", "Custom software"),
    price: t("Cotización", "Custom quote"),
    currency: "",
    prefix: "",
    time: t("2 a 6+ semanas", "2 to 6+ weeks"),
    desc: t(
      "Apps, dashboards, sistemas internos y plataformas SaaS. El alcance se define contigo en el roadmap inicial.",
      "Apps, dashboards, internal systems and SaaS platforms. The scope is defined with you in the initial roadmap."
    ),
    includes: [
      t("Roadmap técnico con hitos y precio fijo", "Technical roadmap with milestones and fixed price"),
      t("Desarrollo iterativo con entregas parciales", "Iterative development with partial deliveries"),
      t("Código fuente 100% a tu nombre", "Source code 100% in your name"),
      t("Dominio, servidor y despliegue en producción", "Domain, server and production deployment"),
      t("Soporte post-entrega incluido", "Post-delivery support included"),
    ],
    excludes: [
      t("Costos recurrentes de APIs o servicios de terceros (se transparentan en la propuesta)", "Recurring costs of third-party APIs or services (itemized in the proposal)"),
    ],
    featured: true,
  },
];

export default function Precios() {
  useSeo({
    title: t("Precios · Maudev", "Pricing · Maudev"),
    description: t(
      "Precios publicados de páginas web, software a medida y automatización. Precio fijo por escrito, sin cotizaciones misteriosas.",
      "Published pricing for websites, custom software and automation. Fixed price in writing, no mystery quotes."
    ),
    path: "/precios",
  });

  return (
    <PageShell>

      <section className="relative pt-32 pb-12 lg:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="kicker">{t("precios", "pricing")}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-5">
            {t("Precios transparentes,", "Transparent pricing,")} <span className="text-primary">{t("sin letra chica", "no fine print")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t(
              "Publicamos lo que casi nadie publica. Estos son valores \"desde\": el precio exacto y fijo lo recibes por escrito en el diagnóstico gratuito, antes de pagar un peso.",
              "We publish what almost nobody does. These are \"from\" prices: you get the exact fixed price in writing in the free assessment, before paying a cent."
            )}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  {t("Incluye", "Includes")}
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
                  {t("No incluye", "Doesn't include")}
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
              </motion.div>
            ))}
          </div>

          {/* Condiciones de pago — las mismas del proceso y la FAQ */}
          <div className="mt-10 bg-card border border-border rounded-2xl p-6 sm:p-8">
            <p className="text-sm text-center text-muted-foreground mb-6 pb-6 border-b border-border/40">
              {t(
                "Todos los proyectos se entregan funcionando: dominio, hosting o servidor, SSL y la configuración necesaria para operar están considerados en el precio.",
                "Every project is delivered up and running: domain, hosting or server, SSL and the configuration needed to operate are covered in the price."
              )}
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-bold mb-1">{t("50% / 50%", "50% / 50%")}</p>
                <p className="text-xs text-muted-foreground">{t("Anticipo al inicio, saldo contra entrega aprobada.", "Upfront at start, balance on approved delivery.")}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">CLP · USD · USDT</p>
                <p className="text-xs text-muted-foreground">{t("Transferencia en Chile; USD o USDT para el extranjero.", "Bank transfer in Chile; USD or USDT abroad.")}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">{t("Contrato por escrito", "Written contract")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("Precio y alcance fijados por escrito antes de empezar.", "Price and scope fixed in writing before we start.")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA a contacto */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t("¿Quieres un número más cercano a tu caso?", "Want a number closer to your case?")}
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              {t("Pedir diagnóstico gratis", "Get a free assessment")}
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
