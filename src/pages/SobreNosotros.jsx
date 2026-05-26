import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Lightbulb, Shield, Users } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

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
    text: t("Plazos realistas, presupuestos claros y comunicación directa. Sin sorpresas en la factura.", "Realistic timelines, clear budgets and direct communication. No surprises on the invoice."),
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("sobre nosotros", "about us")}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
            {t("Somos un equipo que construye", "We're a team that builds")} <span className="text-primary">{t("software útil", "useful software")}</span>
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
                "Combinamos formación en ingeniería civil informática con experiencia real construyendo plataformas en producción, desde e-commerce hasta SaaS de marketing, y aplicamos lo aprendido a cada proyecto que tomamos.",
                "We combine computer engineering training with real experience building production platforms, from e-commerce to marketing SaaS, and apply what we've learned to every project we take on."
              )}
            </p>
            <p>
              {t(
                "No somos una agencia con cien personas. Somos un equipo pequeño y enfocado: tú hablas directo con quien diseña, escribe el código y deja tu sistema funcionando.",
                "We're not a hundred-person agency. We're a small, focused team: you talk directly with whoever designs, writes the code and leaves your system running."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {values.map((