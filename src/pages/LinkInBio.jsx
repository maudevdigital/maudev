import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Code2, Tag, Briefcase, BookOpen, Calculator, MessageCircle, ArrowUpRight } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { getWhatsAppUrl, whatsappEnabled } from "@/components/landing/WhatsAppFloat";
import { availability, founder } from "@/data/site";
import { t } from "@/lib/i18n";

// Página "link in bio" para Instagram (maudev.cl/ig). Mobile-first, sin navbar/
// footer: un hub de enlaces que convierte el tráfico de IG en acciones del sitio.
const links = [
  { to: "/contacto", icon: Zap, label: t("Pedir diagnóstico gratis", "Get a free assessment"), desc: t("Respuesta en menos de 24h", "Reply within 24h"), primary: true },
  { to: "/servicios", icon: Code2, label: t("Servicios", "Services"), desc: t("Web, software y automatización", "Web, software & automation") },
  { to: "/precios", icon: Tag, label: t("Precios", "Pricing"), desc: t("Transparentes, sin letra chica", "Transparent, no fine print") },
  { to: "/portafolio", icon: Briefcase, label: t("Portafolio", "Portfolio"), desc: t("Proyectos reales en producción", "Real projects in production") },
  { to: "/blog", icon: BookOpen, label: t("Blog · guías", "Blog · guides"), desc: t("Tendencias y consejos para PYMEs", "Trends & tips for SMBs") },
  { to: "/cotizador", icon: Calculator, label: t("Cotizador", "Estimator"), desc: t("Estima tu proyecto en 1 minuto", "Estimate your project in 1 min") },
];

export default function LinkInBio() {
  useEffect(() => {
    document.title = "maudev · " + t("Enlaces", "Links");
    // No indexar este hub de enlaces (es para tráfico de redes, no SEO).
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex,follow";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-75 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md mx-auto px-5 py-12 sm:py-16">
        {/* Encabezado / identidad */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center text-primary mb-4">
            <Logo size={56} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            mau<span className="text-primary">dev</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-mono">
            {t("Desarrollo web · Software · Automatización", "Web dev · Software · Automation")}
          </p>
          <span className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            <span className={`h-1.5 w-1.5 rounded-full ${availability.open ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-[10px] font-mono text-primary tracking-wider uppercase">
              {availability.label} · {availability.period}
            </span>
          </span>
        </div>

        {/* Enlaces */}
        <div className="space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                l.primary
                  ? "border-primary/40 bg-primary/10 glow-cyan hover:bg-primary/15"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border ${l.primary ? "bg-primary/15 border-primary/30" : "bg-secondary/40 border-border"}`}>
                <l.icon className={`h-5 w-5 ${l.primary ? "text-primary" : "text-foreground/70"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${l.primary ? "text-foreground" : ""}`}>{l.label}</p>
                <p className="text-xs text-muted-foreground truncate">{l.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}

          {whatsappEnabled && (
            <a
              href={getWhatsAppUrl(t("Hola, los encontré en Instagram y quiero saber más.", "Hi, I found you on Instagram and want to know more."))}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-[#25D366]/50 transition-all"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center bg-[#25D366]/10 border border-[#25D366]/30">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">WhatsApp</p>
                <p className="text-xs text-muted-foreground truncate">{t("Escríbenos directo", "Message us directly")}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[#25D366] transition-colors shrink-0" />
            </a>
          )}
        </div>

        {/* Pie */}
        <div className="mt-10 text-center">
          <a href="https://maudev.cl" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
            maudev.cl ↗
          </a>
          <p className="text-[10px] text-muted-foreground/60 mt-2">{founder.name} · Chile</p>
        </div>
      </div>
    </div>
  );
}
