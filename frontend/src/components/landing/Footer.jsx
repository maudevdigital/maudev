import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { CTA_MESSAGE } from "@/data/site";
import { listaCapacidades } from "@shared/oferta";
import { trackAction } from "@/lib/MetaPixelTracker";

// Tres columnas cortas: los mismos cuatro servicios del menú, la empresa y lo
// legal. El catálogo de 19 servicios que vivía acá se retiró con la oferta vieja.
export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/55">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Maudev, inicio">
              <Logo size={30} className="text-primary" />
              <span className="text-lg font-extrabold tracking-[-0.04em]">mau<span className="text-primary">dev</span></span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Adecuación a la Ley 21.719, inteligencia artificial aplicada, desarrollo web y soporte para empresas en Chile.
            </p>

            <div className="mt-6 flex flex-col items-start gap-2.5">
              <a href="mailto:contacto@maudev.cl" className="footer-link inline-flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> contacto@maudev.cl
              </a>
              <a
                href={getWhatsAppUrl(CTA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("whatsapp_click", { ubicacion: "footer" })}
                className="footer-link inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> WhatsApp
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Chile · Trabajo remoto con toda Latinoamérica
            </p>
          </div>

          <div>
            <h2 className="footer-title">Servicios</h2>
            <ul className="mt-4 space-y-2.5">
              {listaCapacidades.map((c) => (
                <li key={c.path}><Link to={c.path} className="footer-link">{c.navLabel}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Empresa</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/casos" className="footer-link">Casos</Link></li>
              <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
              <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
              <li><Link to="/portal/ingresar" className="footer-link">Portal clientes</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Legal</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/privacidad" className="footer-link">Privacidad</Link></li>
              <li><Link to="/terminos" className="footer-link">Términos</Link></li>
              <li><Link to="/eliminacion-datos" className="footer-link">Tus derechos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Maudev · Diseñado y programado acá, sin subcontratar.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("maudev:open-cookies"))}
                className="footer-link"
              >
                Cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
