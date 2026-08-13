import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LangShell from "@/components/landing/LangShell";
import ParticleField from "@/components/landing/ParticleField";
import { EN, PT, RUTAS, SERVICIOS_DESTACADOS, desdeUSD } from "@/data/i18n";
import { useCurrency } from "@/lib/useCurrency";
import { useSeo } from "@/lib/useSeo";

// Portada en inglés y portugués. Una sola plantilla para los dos: la estructura
// es la misma y lo que cambia es el texto, así que duplicar el archivo sería
// duplicar también cada arreglo futuro.
const CONTENIDO = { en: EN, pt: PT };

export default function LangHome({ lang }) {
  const t = CONTENIDO[lang];
  const rutas = RUTAS[lang];
  // Suscribe al tipo de cambio: sin esto los precios quedan en el valor de
  // respaldo hasta que algo más provoque un render.
  useCurrency();

  useSeo({
    title: t.meta.title,
    description: t.meta.description,
    path: rutas[lang],
    lang: lang === "en" ? "en" : "pt-BR",
    alternates: { es: "/", en: "/en", pt: "/pt" },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Maudev",
      description: t.meta.description,
      url: `https://maudev.cl${rutas[lang]}`,
      areaServed: ["Chile", "Latin America"],
      email: "contacto@maudev.cl",
    },
  });

  return (
    <LangShell lang={lang} rutas={rutas} textos={t}>
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <ParticleField />
        <div className="site-container relative">
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1 className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {t.hero.titulo}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t.hero.intro}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={rutas.contacto} className="btn btn-primary h-14 px-7">
              {t.cierre.boton}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.hero.nota}
          </p>
        </div>
      </section>

      <section className="section-pad border-y border-border bg-secondary/40" aria-labelledby="precios-titulo">
        <div className="site-container">
          <span className="eyebrow">{t.serviciosEpigrafe}</span>
          <h2 id="precios-titulo" className="section-title mt-4">
            {t.serviciosTitulo}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{t.serviciosIntro}</p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_DESTACADOS.map((id) => {
              const servicio = t.servicios[id];
              const usd = desdeUSD(id);
              if (!servicio) return null;
              return (
                <li key={id} className="panel panel-hover flex flex-col p-6">
                  <span className="font-display text-lg font-bold tracking-[-0.02em]">{servicio.nombre}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {servicio.texto}
                  </span>
                  {usd && (
                    <span className="mt-5 font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {lang === "en" ? "From" : "A partir de"} USD {usd.toLocaleString("en-US")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="detalle-titulo">
        <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <span className="eyebrow">{lang === "en" ? "How we work" : "Como trabalhamos"}</span>
            <h2 id="detalle-titulo" className="section-title mt-4">
              {lang === "en" ? "What you can expect." : "O que você pode esperar."}
            </h2>
          </div>
          <div className="max-w-2xl">
            {t.secciones.map(({ titulo, parrafos }) => (
              <article key={titulo} className="border-t border-border py-8 first:border-t-0 first:pt-0">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{titulo}</h3>
                {parrafos.map((texto) => (
                  <p key={texto.slice(0, 40)} className="mt-4 leading-relaxed text-muted-foreground">
                    {texto}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="faq-titulo">
        <div className="site-container">
          <span className="eyebrow">{t.faqEpigrafe}</span>
          <h2 id="faq-titulo" className="section-title mt-4">
            {t.faqTitulo}
          </h2>
          <div className="mt-10 max-w-3xl">
            {t.faqs.map(({ q, a }) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p className="pb-6 leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <div className="final-cta particles-on-dark">
            <ParticleField />
            <div className="relative">
              <h2 className="max-w-[16ch] font-display text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                {t.cierre.titulo}
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-white/72">{t.cierre.texto}</p>
              <Link to={rutas.contacto} className="btn btn-primary mt-9 h-14 px-7">
                {t.cierre.boton}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LangShell>
  );
}
