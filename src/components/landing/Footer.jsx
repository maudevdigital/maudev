import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { CTA_MESSAGE } from "@/data/site";
import { trackAction } from "@/lib/MetaPixelTracker";

const serviceLinks = [
  ["Automatización", "/automatizacion"],
  ["Software a medida", "/software-a-medida"],
  ["Desarrollo web", "/desarrollo-web"],
  ["Ecommerce", "/ecommerce"],
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/55">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Maudev, inicio">
              <Logo size={30} className="text-primary" />
              <span className="text-lg font-extrabold tracking-[-0.04em]">mau<span className="text-primary">dev</span></span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Automatización y software para empresas que quieren operar con menos tareas manuales.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Chile · Atención remota</p>
          </div>

          <div>
            <h2 className="footer-title">Servicios</h2>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map(([label, href]) => (
                <li key={href}><Link to={href} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Maudev</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/casos" className="footer-link">Casos</Link></li>
              <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
              <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
              <li><Link to="/privacidad" className="footer-link">Privacidad</Link></li>
              <li><Link to="/terminos" className="footer-link">Términos</Link></li>
              <li><Link to="/eliminacion-datos" className="footer-link">Eliminación de datos</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Contacto</h2>
            <div className="mt-4 space-y-3">
              <a href="mailto:contacto@maudev.cl" className="footer-link inline-flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" /> contacto@maudev.cl
              </a>
              <a
                href={getWhatsAppUrl(CTA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("whatsapp_click", { ubicacion: "footer" })}
                className="footer-link inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("maudev:open-cookies"))}
                className="footer-link block text-left"
              >
                Preferencias de cookies
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maudev. Todos los derechos reservados.</p>
          <p>Automatización · Software · Desarrollo web</p>
        </div>
      </div>
    </footer>
  );
}
