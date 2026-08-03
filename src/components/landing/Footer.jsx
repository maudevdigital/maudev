import { Link } from "react-router-dom";
import { CalendarClock, Mail, MapPin, MessageCircle } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { CTA_MESSAGE } from "@/data/site";
import { CAL_URL, catalog } from "@/data/catalog";
import { trackAction } from "@/lib/MetaPixelTracker";

// Las columnas de servicios salen del MISMO catálogo que el mega-menú del
// header. Escritas a mano se desincronizaban: el footer seguía ofreciendo
// cuatro servicios cuando el menú ya mostraba diecinueve, y no incluía
// mantención, que es la página más nueva.
//
// Un footer con el catálogo completo no es decoración: es donde Google
// encuentra las páginas profundas desde cualquier punto del sitio, y donde el
// visitante que llegó por un enlace suelto descubre qué más existe.
const columnas = catalog.map(({ id, label, items }) => ({
  id,
  label,
  enlaces: items.map(({ title, href }) => [title, href]),
}));

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/55">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Maudev, inicio">
              <Logo size={30} className="text-primary" />
              <span className="text-lg font-extrabold tracking-[-0.04em]">mau<span className="text-primary">dev</span></span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Diseño y desarrollo de sitios web para empresas, con mantención y automatización cuando el negocio lo pide.
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
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("agendar_click", { ubicacion: "footer" })}
                className="footer-link inline-flex items-center gap-2"
              >
                <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" /> Agendar 30 min
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Chile · Trabajo remoto con toda Latinoamérica
            </p>
          </div>

          {columnas.map(({ id, label, enlaces }) => (
            <div key={id}>
              <h2 className="footer-title">{label}</h2>
              <ul className="mt-4 space-y-2.5">
                {enlaces.map(([texto, href]) => (
                  <li key={texto}>
                    <Link to={href} className="footer-link">{texto}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="footer-title">Empresa</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/casos" className="footer-link">Portafolio</Link></li>
              <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
              <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Legal</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/privacidad" className="footer-link">Privacidad</Link></li>
              <li><Link to="/terminos" className="footer-link">Términos</Link></li>
              <li><Link to="/eliminacion-datos" className="footer-link">Eliminación de datos</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("maudev:open-cookies"))}
                  className="footer-link text-left"
                >
                  Preferencias de cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maudev. Todos los derechos reservados.</p>
          <p>Diseñado y programado acá, sin subcontratar.</p>
        </div>
      </div>
    </footer>
  );
}
