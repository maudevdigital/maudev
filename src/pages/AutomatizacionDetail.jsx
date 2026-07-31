import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check, AlertTriangle, Plug, ShoppingCart } from "lucide-react";
import PageShell from "../components/landing/PageShell";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageNotFound from "../lib/PageNotFound";
import CheckoutModal from "../components/landing/CheckoutModal";
import RiskReversal from "@/components/landing/RiskReversal";
import { Button } from "@/components/ui/button";
import { priceFor } from "@/lib/region";
import { getAutomationBySlug } from "@/data/automations";
import { useSeo } from "@/lib/useSeo";

// Landing de conversión de una automatización. Estructura pensada para que un
// visitante que cae desde un reel/anuncio entienda el dolor, el resultado y
// convierta: problema → resultado → cómo funciona → integraciones → prueba →
// FAQ → CTA único. SEO por página + JSON-LD de Servicio para rich results.
export default function AutomatizacionDetail() {
  const { slug } = useParams();
  const auto = getAutomationBySlug(slug);

  const description = auto ? (auto.metaDescription || auto.tagline || "").slice(0, 160) : "";
  useSeo(
    auto
      ? {
          title: `${auto.name} · Maudev`,
          description,
          path: `/automatizaciones/${auto.slug}`,
          image: "/og-image.png",
          type: "website",
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: auto.name,
                description,
                areaServed: "CL",
                provider: { "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
                serviceType: "Automatización de procesos",
                url: `https://maudev.cl/automatizaciones/${auto.slug}`,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
                  { "@type": "ListItem", position: 2, name: "Automatización", item: "https://maudev.cl/automatizacion" },
                  { "@type": "ListItem", position: 3, name: auto.name, item: `https://maudev.cl/automatizaciones/${auto.slug}` },
                ],
              },
            ],
          },
        }
      : {}
  );

  const [isOpen, setIsOpen] = useState(false);

  if (!auto) return <PageNotFound />;

  const Icon = auto.icon;
  const product = { ...auto, badge: auto.badges?.[0] };

  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-32 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Breadcrumbs items={[{ label: "Automatización", href: "/automatizacion" }, { label: auto.name }]} />

            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary">
              <Icon className="h-6 w-6" />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {auto.badges.map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-bold"
                >
                  {b}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{auto.name}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              {auto.tagline}
            </p>

            {/* Precio + compra */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black tracking-tight text-primary font-mono">{priceFor(auto).main}</span>
              {priceFor(auto).secondary && <span className="text-sm font-mono text-muted-foreground">({priceFor(auto).secondary})</span>}
              <span className="text-xs font-mono text-muted-foreground">· {auto.period}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button size="lg" className="font-bold" onClick={() => setIsOpen(true)}>
                <ShoppingCart className="h-4 w-4" />
                Solicitar implementación
              </Button>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Dudas? Diagnóstico gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {auto.stats?.length > 0 && (
              <div className="flex items-center gap-6">
                {auto.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-black text-primary font-mono leading-none">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* La objeción "¿y si no funciona?" nace al leer el precio, así que
                se contesta acá y no tres pantallas más abajo. */}
            <RiskReversal className="mt-6 max-w-md" />
          </div>

          {/* Reel como demo visual */}
          {auto.video && (
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] rounded-3xl overflow-hidden border border-border shadow-xl bg-card aspect-[9/16]">
                <video
                  src={auto.video}
                  poster={auto.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Problema ── */}
      {auto.problem && (
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-card/40 border-y border-border/40">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex h-11 w-11 rounded-xl bg-destructive/10 border border-destructive/20 items-center justify-center text-destructive mb-5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-snug mb-4">{auto.problem.pain}</p>
            <p className="text-base text-muted-foreground leading-relaxed">{auto.problem.cost}</p>
          </div>
        </section>
      )}

      {/* ── Resultados ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-12">
            Lo que cambia en tu día a día
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {auto.outcomes.map((o) => (
              <div
                key={o.title}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="inline-flex h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center text-primary mb-4">
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold mb-1.5">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/40 border-y border-border/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-12">
            Cómo funciona
          </h2>
          <div className="space-y-5">
            {auto.howItWorks.map((step, idx) => (
              <div key={step.title} className="flex gap-5 items-start">
                <div className="shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground font-black font-mono flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integraciones ── */}
      {auto.integrations?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">
              <Plug className="h-3.5 w-3.5" />
              Se conecta con
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {auto.integrations.map((int) => (
                <span
                  key={int}
                  className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-mono text-foreground"
                >
                  {int}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {auto.faqs?.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/40 border-y border-border/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-10">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {auto.faqs.map((f) => (
                <div key={f.q} className="bg-background border border-border rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            ¿Lo activamos en tu negocio?
          </h2>
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-3xl font-black tracking-tight text-primary font-mono">{priceFor(auto).main}</span>
            <span className="text-xs font-mono text-muted-foreground">· {auto.period}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="font-bold" onClick={() => setIsOpen(true)}>
              <ShoppingCart className="h-4 w-4" />
              Solicitar implementación
            </Button>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Hablar con nosotros primero
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CheckoutModal product={product} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </PageShell>
  );
}
