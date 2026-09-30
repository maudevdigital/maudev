import { CalendarClock, MessageCircle } from "lucide-react";
import { CAL_URL } from "@/data/site";
import ParticleField from "@/components/landing/ParticleField";
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
const compromisos = [
  { titulo: "Respuesta el mismo día", detalle: "Escribes hoy y hoy sabes si podemos ayudarte." },
  { titulo: "Precio por escrito", detalle: "Antes de empezar, y no cambia durante el proyecto." },
  { titulo: "Hablas conmigo", detalle: "Sin ejecutivo de cuentas y sin derivar el proyecto a terceros." },
];

export default function FinalCta() {
  return (
    <section id="contacto" className="section-pad border-t border-border" aria-labelledby="cta-final-title">
      <div className="site-container">
        <div className="final-cta relative overflow-hidden">
          <ParticleField className="closing-particles" />

          <div className="relative">
            <span className="eyebrow text-white/80!">Conversemos</span>
            <h2
              id="cta-final-title"
              className="mt-5 max-w-4xl font-display text-3xl font-semibold leading-[1.15] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
            >
              Tu próxima etapa empieza con una conversación.
            </h2>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={getWhatsAppUrl("Hola, vengo de maudev.cl y quiero conversar sobre un proyecto.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("whatsapp_click", { ubicacion: "cta-final" })}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-white px-7 font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                Hablar por WhatsApp
              </a>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("agendar_click", { ubicacion: "cta-final" })}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/25 px-6 font-semibold text-white transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white"
              >
                <CalendarClock className="h-5 w-5 shrink-0" aria-hidden="true" />
                Agendar 30 min
              </a>
            </div>

            <dl className="mt-12 grid gap-6 border-t border-white/12 pt-8 sm:grid-cols-3">
              {compromisos.map(({ titulo, detalle }) => (
                <div key={titulo}>
                  <dt className="flex items-center gap-2 text-sm font-bold text-white">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
                    {titulo}
                  </dt>
                  <dd className="mt-1.5 pl-3 text-sm leading-relaxed text-white/75">{detalle}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
