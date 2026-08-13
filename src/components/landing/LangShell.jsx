import { Link } from "react-router-dom";
import { CalendarClock, MessageCircle } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { CAL_URL } from "@/data/catalog";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Marco de las páginas en inglés y portugués.
//
// No reusa el header del sitio a propósito. Ese menú tiene diecinueve servicios
// y todos apuntan a páginas en español: un visitante inglés que pinche cualquiera
// aterriza en un idioma que no lee, y para el buscador es una página en inglés
// enlazando a veintitantas en español, que es señal de traducción a medias.
//
// Mientras estas versiones sean una prueba de mercado, el marco se queda en lo
// mínimo: identidad, cambio de idioma y las dos acciones. Cuando se traduzcan
// los servicios, esto crece a un menú propio por idioma.
export default function LangShell({ lang, rutas, textos, children }) {
  const idiomas = [
    { code: "es", label: "ES", href: rutas.es },
    { code: "en", label: "EN", href: rutas.en },
    { code: "pt", label: "PT", href: rutas.pt },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-5 sm:top-5">
        <div className="mx-auto flex w-full max-w-300 items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/92 px-4 py-3 backdrop-blur-xl sm:px-5">
          <Link to={rutas[lang]} className="flex shrink-0 items-center gap-2.5" aria-label="Maudev">
            <Logo size={28} className="text-primary" />
            <span className="text-[1.05rem] font-extrabold tracking-[-0.04em]">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label={textos.idioma} className="flex items-center rounded-lg border border-border p-0.5">
              {idiomas.map((idioma) => (
                <Link
                  key={idioma.code}
                  to={idioma.href}
                  hrefLang={idioma.code}
                  aria-current={idioma.code === lang ? "true" : undefined}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                    idioma.code === lang
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {idioma.label}
                </Link>
              ))}
            </nav>
            <a
              href={getWhatsAppUrl(textos.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("whatsapp_click", { ubicacion: `header-${lang}` })}
              className="btn btn-primary h-10 px-4 text-sm"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{textos.ctaHeader}</span>
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-secondary/55">
        <div className="site-container py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <Logo size={28} className="text-primary" />
                <span className="text-lg font-extrabold tracking-[-0.04em]">
                  mau<span className="text-primary">dev</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{textos.pieDescripcion}</p>
              <a
                href="mailto:contacto@maudev.cl"
                className="mt-4 inline-block text-sm font-semibold hover:text-primary"
              >
                contacto@maudev.cl
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("agendar_click", { ubicacion: `footer-${lang}` })}
                className="btn btn-ghost h-11 px-5 text-sm"
              >
                <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
                {textos.agendar}
              </a>
              <Link to={rutas.contacto} className="btn btn-primary h-11 px-6 text-sm">
                {textos.ctaHeader}
              </Link>
            </div>
          </div>

          <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Maudev · {textos.pieLegal}
          </p>
        </div>
      </footer>
    </div>
  );
}
