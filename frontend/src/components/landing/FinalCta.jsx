import { Link } from "react-router-dom";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Cierre.
//
// Antes terminaba con una pregunta —"¿Tu sitio te está trayendo clientes?"—.
// Una pregunta al final da permiso para irse a pensarlo; lo que cierra es un
// compromiso, porque responde el miedo real del que va a escribir: cuánto voy a
// esperar, cuánto me va a costar y con quién voy a terminar hablando.
//
// Los tres compromisos de abajo son verificables y ya se cumplen. No se promete
// plazo de entrega ni resultado: eso depende de cada proyecto y no se puede
// firmar en una portada.
//
// Es una franja compacta: titular, los compromisos en una línea y dos salidas
// (WhatsApp o el formulario). La versión anterior ocupaba una pantalla entera
// para decir lo mismo.
const compromisos = ["Respuesta el mismo día", "Precio cerrado por escrito", "Trato directo, sin intermediarios"];

export default function FinalCta() {
  return (
    <section id="contacto" className="border-t border-border py-12 sm:py-16" aria-labelledby="cta-final-title">
      <div className="site-container">
        <div className="final-cta flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="cta-final-title" className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl">
              ¿Tienes un proyecto? Hablemos hoy.
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              {compromisos.map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={getWhatsAppUrl("Hola, vengo de maudev.cl y quiero conversar sobre un proyecto.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction("whatsapp_click", { ubicacion: "cta-final" })}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Escribir por WhatsApp
            </a>
            <Link
              to="/contacto"
              onClick={() => trackAction("cta_principal_click", { ubicacion: "cta-final" })}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white"
            >
              Cotizar proyecto <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
