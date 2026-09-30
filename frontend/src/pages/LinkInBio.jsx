import { Link } from "react-router-dom";
import { Zap, Code2, Tag, Briefcase, Sparkles, MessageCircle, ArrowUpRight } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { getWhatsAppUrl, whatsappEnabled } from "@/lib/whatsapp";
import { availability, founder } from "@/data/site";
import { useSeo } from "@/lib/useSeo";

// Página "link in bio" universal para TODAS las redes (maudev.cl/links, con
// alias /ig). Mobile-first, sin navbar/footer: un hub de enlaces que convierte
// el tráfico de RRSS en acciones del sitio.
const links = [
  { to: "/contacto", icon: Zap, label: "Pedir diagnóstico gratis", desc: "Respuesta en menos de 24h", primary: true },
  { to: "/automatizaciones", icon: Sparkles, label: "Automatizaciones", desc: "Agenda, boletas, cobros y más — con n8n" },
  { to: "/servicios", icon: Code2, label: "Servicios", desc: "Web, software y automatización" },
  { to: "/ley-21719", icon: Tag, label: "Ley 21.719", desc: "Adecua tu sitio a la nueva ley de datos" },
  { to: "/portafolio", icon: Briefcase, label: "Portafolio", desc: "Proyectos reales en producción" },
];

export default function LinkInBio() {
  // Hub de enlaces para tráfico de redes: no indexar.
  useSeo({ title: "maudev · " + "Enlaces", noindex: true });

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
            Desarrollo web · Software · Automatización
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
              href={getWhatsAppUrl("Hola, los encontré en sus redes y quiero saber más.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-[#25D366]/50 transition-all"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center bg-[#25D366]/10 border border-[#25D366]/30">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">WhatsApp</p>
                <p className="text-xs text-muted-foreground truncate">{"Escríbenos directo"}</p>
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
