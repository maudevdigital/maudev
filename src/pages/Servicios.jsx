import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, Zap, BarChart3, Wrench, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

const services = [
  {
    icon: Globe,
    slug: "web_dev",
    title: t("Sitios y landings web", "Websites & landing pages"),
    price: t("Desde $390.000 CLP", "From CLP $390,000"),
    description: t(
      "Sitios corporativos, landings de conversión, blogs y portfolios. Diseño responsive, SEO técnico básico y formulario de captura.",
      "Corporate sites, conversion landings, blogs and portfolios. Responsive design, basic technical SEO and a capture form."
    ),
    features: [
      t("Diseño responsive y rápido", "Fast, responsive design"),
      t("SEO técnico básico (meta, sitemap, schema)", "Basic technical SEO (meta, sitemap, schema)"),
      t("Formulario conectado a tu correo o CRM", "Form connected to your email or CRM"),
      t("Dominio + hosting Cloudflare incluido el primer año", "Domain + Cloudflare hosting included the first year"),
      t("Capacitación para administrar contenido", "Training to manage your content"),
    ],
  },
  {
    icon: Zap,
    slug: "web_app",
    title: t("Software a medida", "Custom software"),
    price: t("Cotización por proyecto", "Quoted per project"),
    description: t(
      "Sistemas internos, portales de clientes, plataformas SaaS, integraciones con APIs y dashboards de gestión.",
      "Internal systems, client portals, SaaS platforms, API integrations and management dashboards."
    ),
    features: [
      t("Levantamiento de requerimientos", "Requirements gathering"),
      t("Diseño técnico + maquetas", "Technical design + mockups"),
      t("Desarrollo full stack (React + Node/Supabase)", "Full-stack development (React + Node/Supabase)"),
      t("Despliegue en Cloudflare/Vercel", "Deployment on Cloudflare/Vercel"),
      t("Soporte post-entrega", "Post-delivery support"),
    ],
  },
  {
    icon: Wrench,
    slug: "automation",
    title: t("Automatización de procesos", "Process automation"),
    price: t("Desde $290.000 CLP", "From CLP $290,000"),
    description: t(
      "Conectamos tus herramientas (correo, planillas, CRM, WhatsApp) y eliminamos trabajo manual repetitivo.",
      "We connect your tools (email, spreadsheets, CRM, WhatsApp) and remove repetitive manual work."
    ),
    features: [
      t("Diagnóstico de procesos automatizables", "Assessment of automatable processes"),
      t("Integración con n8n / Zapier / Make", "Integration with n8n / Zapier / Make"),
      t("Chatbots y respuestas automáticas", "Chatbots and automatic replies"),
      t("Notificaciones internas y a clientes", "Internal and customer notifications"),
      t("Documentación de cada flujo", "Documentation of every workflow"),
    ],
  },
  {
    icon: BarChart3,
    slug: "support",
    title: t("Mantención y soporte", "Maintenance & support"),
    price: t("Desde $49.000 CLP / mes", "From CLP $49,000 / mo"),
    description: t(
      "Plan mensual para mantener tu sitio o sistema actualizado, seguro y con mejoras continuas.",
      "Monthly plan to keep your site or system updated, secure and continuously improving."
    ),
    features: [
      t("Actualizaciones de seguridad", "Security updates"),
      t("Backups y monitoreo", "Backups and monitoring"),
      t("Hasta 2 horas de cambios al mes", "Up to 2 hours of changes per month"),
      t("Reporte mensual", "Monthly report"),
      t("Tiempo de respuesta < 24h hábiles", "Response time < 24 business hours"),
    ],
  },
];

export default function Servicios() {
  useEffect(() => {
    document.title = t("Servicios: páginas web, e-commerce, software a medida y automatización con IA · Maudev", "Services: websites, e-commerce, custom software and AI automation · Maudev");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="kicker">{t("servicios", "services")}</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
              {t("Lo que", "What we")} <span className="text-primary">{t("construimos", "build")}</span> {t("para ti", "for you")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Trabajamos con emprendedores y PYMEs que necesitan presencia digital sólida, sistemas a medida o automatizar procesos que hoy hacen a mano.",
                "We work with founders and SMBs that need a solid digital presence, custom systems or to automate processes they do by hand today."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20">
                    {s.price}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.description}</p>
                <ul className="space-y-2 mb-6">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/contacto?servicio=${s.slug}`}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("Solicitar cotización", "Request a quote")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">{t("¿No estás seguro de qué necesitas?", "Not sure what you need?")}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t(
                "Agenda un diagnóstico gratuito de 20 minutos. Te ayudamos a definir el alcance y darte una estimación realista.",
                "Book a free 20-minute consult. We'll help you define the scope and give you a realistic estimate."
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
