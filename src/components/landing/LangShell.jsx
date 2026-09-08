import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { CAL_URL } from "@/data/catalog";
import { trackAction } from "@/lib/MetaPixelTracker";

// Marco de las páginas en inglés y portugués.
//
// No reusa el header del sitio a propósito. Ese menú tiene diecinueve servicios
// y todos apuntan a páginas en español: un visitante inglés que pinche cualquiera
// aterriza en un idioma que no lee, y para el buscador es una página en inglés
// enlazando a veintitantas en español, que es señal de traducción a medias.
//
// Mientras estas versiones sean una prueba de mercado, el marco se queda en lo
// mínimo: identidad, cambio de idioma y una sola acción, la misma arriba y
// abajo. Cuando se traduzcan los servicios, esto crece a un menú propio por
// idioma.
export default function LangShell({ lang, rutas, textos, children }) {
  const idiomas = [
    { code: "es", label: "ES", href: rutas.es },
    { code: "en", label: "EN", href: rutas.en },
    { code: "pt", label: "PT", href: rutas.pt },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="site-header">
        <div className="site-header-inner flex min-h-18 items-center justify-between gap-3">
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
            {/* Este botón abría WhatsApp mientras el del pie, con la MISMA
                etiqueta, llevaba al formulario. Ahora los dos van al mismo
                lugar, que además es lo que la etiqueta promete: "Get a quote"
                no es una invitación a chatear.
                El resto de los motivos son los del hero en español: es el
                punto más frío de la página, y un clic a WhatsApp no queda
                registrado como lead. WhatsApp sigue disponible en la página de
                contacto, a un clic. */}
            <Link
              to={rutas.contacto}
              onClick={() => trackAction("cta_principal_click", { ubicacion: `header-${lang}` })}
              aria-label={textos.ctaHeader}
              className="btn btn-primary h-10 px-4 text-sm"
            >
              {/* En móvil solo se ve el icono, así que el nombre accesible lo
                  pone aria-label: el <span> oculto no lo aporta. */}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{textos.ctaHeader}</span>
            </Link>
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
