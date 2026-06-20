import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Lightbulb, Shield, Users, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/landing/SocialIcons";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { founder, CTA_LABEL } from "@/data/site";

const values = [
  {
    icon: Code2,
    title: t("Construimos lo que prometemos", "We build what we promise"),
    text: t("Stack moderno (React, Supabase, Cloudflare). Código mantenible, no soluciones desechables.", "Modern stack (React, Supabase, Cloudflare). Maintainable code, not throwaway solutions."),
  },
  {
    icon: Lightbulb,
    title: t("Pensamos como dueños", "We think like owners"),
    text: t("No vendemos horas: vendemos resultados. Te decimos lo que sí necesitas y lo que no.", "We don't sell hours: we sell results. We tell you what you do and don't need."),
  },
  {
    icon: Shield,
    title: t("Transparencia total", "Full transparency"),
    text: t("Precios publicados, contrato a la vista, plazos realistas y comunicación directa. Sin sorpresas en la factura.", "Published pricing, contract in plain sight, realistic timelines and direct communication. No surprises on the invoice."),
  },
  {
    icon: Users,
    title: t("Cercanía PYME", "Close to SMBs"),
    text: t("Trabajamos con emprendedores. Hablamos tu idioma y nos adaptamos a tu ritmo.", "We work with founders. We speak your language and adapt to your pace."),
  },
];

export default function SobreNosotros() {
  useEffect(() => {
    document.title = t("Sobre nosotros · Maudev", "About us · Maudev");
  }, []);

  const initials = founder.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("sobre nosotros", "about us")}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
            {t("Un estudio de desarrollo con", "A development studio with")} <span className="text-primary">{t("nombre y apellido", "a real name behind it")}</span>
          </h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              {t(
                "Maudev nace en Chile con una idea simple: que cualquier emprendedor o PYME pueda acceder a desarrollo web, software a medida y automatización sin pagar tarifas de agencia grande ni quedarse con productos a medias.",
                "Maudev was born in Chile with a simple idea: that any founder or SMB can access web development, custom software and automation without paying big-agency rates or ending up with half-finished products."
              )}
            </p>
            <p>
              {t(
                "No somos una agencia con cien personas, y eso es a propósito. Maudev es un estudio pequeño y enfocado: cuando nos escribes, te responde la misma persona que va a diseñar, escribir el código y dejar tu sistema funcionando. Sin ejecutivos de cuenta, sin teléfono descompuesto.",
                "We're not a hundred-person agency, and that's on purpose. Maudev is a small, focused studio: when you write to us, you get a reply from the same person who will design, write the code and leave your system running. No account executives, no broken telephone."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Quién está detrás */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Foto del fundador con fallback de iniciales (/public/founder.jpg) */}
            <div className="relative h-28 w-28 rounded-2xl overflow-hidden border border-border bg-primary/10 shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-primary/60 select-none">{initials}</span>
              </div>
              <img
                src={founder.photo}
                alt={founder.name}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("quién está detrás", "who's behind it")}</span>
              <h2 className="text-2xl font-black tracking-tight mt-2 mb-1">{founder.name}</h2>
              <p className="text-sm text-primary font-medium mb-3">{founder.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
                {t(
                  "Formación en ingeniería civil informática y experiencia real construyendo plataformas en producción: e-commerce, SaaS de marketing y sistemas de automatización. Cada proyecto de cliente se beneficia de lo aprendido construyendo productos propios.",
                  "Computer engineering training and real experience building production platforms: e-commerce, marketing SaaS and automation systems. Every client project benefits from what we've learned building our own products."
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href="mailto:contacto@maudev.cl"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> contacto@maudev.cl
                </a>
                {founder.github && (
                  <a
                    href={founder.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-1.5"
                  >
                    <GithubIcon className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-1.5"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">{t("¿Hablemos?", "Shall we talk?")}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t(
                "Cuéntanos qué necesitas. Si podemos ayudar, te lo decimos. Si no, te recomendamos quién sí.",
                "Tell us what you need. If we can help, we'll say so. If not, we'll point you to someone who can."
              )}
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {CTA_LABEL}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
