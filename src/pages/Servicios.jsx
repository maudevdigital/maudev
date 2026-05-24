import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, Zap, BarChart3, Wrench, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "Sitios y landings web",
    price: "Desde $390.000 CLP",
    description: "Sitios corporativos, landings de conversión, blogs y portfolios. Diseño responsive, SEO técnico básico y formulario de captura.",
    features: [
      "Diseño responsive y rápido",
      "SEO técnico básico (meta, sitemap, schema)",
      "Formulario conectado a tu correo o CRM",
      "Dominio + hosting Cloudflare incluido el primer año",
      "Capacitación para administrar contenido",
    ],
  },
  {
    icon: Zap,
    title: "Software a medida",
    price: "Cotización por proyecto",
    description: "Sistemas internos, portales de clientes, plataformas SaaS, integraciones con APIs y dashboards de gestión.",
    features: [
      "Levantamiento de requerimientos",
      "Diseño técnico + maquetas",
      "Desarrollo full stack (React + Node/Firebase)",
      "Despliegue en Cloudflare/Vercel/Firebase",
      "Soporte post-entrega",
    ],
  },
  {
    icon: Wrench,
    title: "Automatización de procesos",
    price: "Desde $290.000 CLP",
    description: "Conectamos tus herramientas (correo, planillas, CRM, WhatsApp) y eliminamos trabajo manual repetitivo.",
    features: [
      "Diagnóstico de procesos automatizables",
      "Integración con n8n / Zapier / Make",
      "Chatbots y respuestas automáticas",
      "Notificaciones internas y a clientes",
      "Documentación de cada flujo",
    ],
  },
  {
    icon: BarChart3,
    title: "Mantención y soporte",
    price: "Desde $49.000 CLP / mes",
    description: "Plan mensual para mantener tu sitio o sistema actualizado, seguro y con mejoras continuas.",
    features: [
      "Actualizaciones de seguridad",
      "Backups y monitoreo",
      "Hasta 2 horas de cambios al mes",
      "Reporte mensual",
      "Tiempo de respuesta < 24h hábiles",
    ],
  },
];

export default function Servicios() {
  useEffect(() => {
    document.title = "Servicios · Maudev";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// servicios</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
              Lo que <span className="text-primary">construimos</span> para ti
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trabajamos con emprendedores y PYMEs que necesitan presencia digital sólida, sistemas a medida o automatizar procesos que hoy hacen a mano.
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
                <Link to="/contacto">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Solicitar cotización
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">¿No estás seguro de qué necesitas?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Agenda un diagnóstico gratuito de 20 minutos. Te ayudamos a definir el alcance y darte una estimación realista.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Agendar diagnóstico gratis
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
