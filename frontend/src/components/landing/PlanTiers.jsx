import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Crown, Rocket, Sprout, Wand2 } from "lucide-react";
import QuickQuote from "@/components/landing/QuickQuote";
import TierModal from "@/components/landing/TierModal";
import { IVA_NOTA } from "@/data/pricing";
import { subservicios } from "@/data/subservices";
import { formatFrom } from "@/data/currencies";
import { useCurrency } from "@/lib/useCurrency";
import { trackAction } from "@/lib/MetaPixelTracker";

// Los precios y el catálogo del modal conservan su fuente de datos compartida.
const niveles = [
  {
    id: "inicia",
    numero: "01",
    icono: Sprout,
    etiqueta: "Para partir",
    titulo: "Presencia",
    resumen: "Estar online, con una página que explique bien lo que haces y reciba consultas.",
    ejemploId: "landing",
    ejemplo: "Landing page profesional",
    incluye: ["Una página, una acción clara", "Formulario y WhatsApp conectados", "Base técnica de SEO"],
    para: "Emprendedores y negocios que hoy solo tienen redes sociales.",
    indice: 0,
  },
  {
    id: "escala",
    numero: "02",
    icono: Rocket,
    etiqueta: "Para crecer",
    titulo: "Operación",
    resumen: "El sitio completo: varias páginas de servicio, con la arquitectura que las ordena.",
    ejemploId: "sitio",
    ejemplo: "Sitio corporativo multipágina",
    incluye: ["Todo lo anterior", "Páginas por servicio y casos", "Reservas o cotización en línea"],
    para: "Negocios que ya venden y necesitan explicar más de una cosa.",
    indice: 1,
    destacado: true,
  },
  {
    id: "domina",
    numero: "03",
    icono: Crown,
    etiqueta: "Para vender",
    titulo: "Comercio",
    resumen: "Vender directo: catálogo, pagos, despacho e inventario funcionando juntos.",
    ejemploId: "ecommerce",
    ejemplo: "Tienda online completa",
    incluye: ["Todo lo anterior", "Pagos e inventario conectados", "Gestión de pedidos"],
    para: "Marcas que quieren dejar de vender por mensaje directo.",
    indice: 2,
  },
];

export default function PlanTiers() {
  const moneda = useCurrency();
  const [abierto, setAbierto] = useState(null);

  return (
    <section id="planes" className="section-pad scroll-mt-20 bg-secondary/45" aria-labelledby="planes-titulo">
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">Tres formas de partir</span>
          <h2 id="planes-titulo" className="section-title mt-4">
            Un punto de partida para cada negocio.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Compara las opciones y revisa qué incluye cada una. Definimos el alcance contigo antes de empezar.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {niveles.map((nivel) => {
            const { id, icono: Icono, etiqueta, titulo, resumen, ejemploId, ejemplo, incluye, para, destacado, indice } = nivel;
            const precioEjemplo = subservicios.find((s) => s.id === ejemploId).precios[indice];
            return (
            <article
              key={id}
              className={`panel relative flex flex-col p-7 lg:p-8 ${destacado ? "border-primary/45" : ""}`}
            >
              {destacado && (
                <span className="absolute right-6 top-6 rounded-md bg-primary px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                  Sitio completo
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-border text-primary">
                  <Icono className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
              </div>

              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{etiqueta}</p>
              <h3 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.03em]">{titulo}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{resumen}</p>

              <div className="mt-6 rounded-lg border border-border bg-secondary/50 px-4 py-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{ejemplo}</p>
                <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em]">
                  Desde {formatFrom(precioEjemplo, moneda)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {IVA_NOTA}
                </p>
              </div>

              <details className="plan-details mt-5">
                <summary>Qué incluye y para quién es</summary>
              <ul className="mt-4 space-y-2.5">
                {incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                {para}
              </p>
              </details>

              <button
                type="button"
                onClick={() => {
                  setAbierto(nivel);
                  trackAction("plan_subservicios", { plan: id });
                }}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                Explorar este plan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </article>
            );
          })}
        </div>

        <details id="cotizador" className="quote-disclosure mt-6 scroll-mt-28">
          <summary>
            <span><strong className="block">Calcula una referencia para tu web</strong><span className="mt-1 block text-sm font-normal text-muted-foreground">Elige el tipo y tamaño de tu proyecto.</span></span>
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </summary>
          <div className="mx-auto max-w-xl px-4 pb-6 sm:px-6"><QuickQuote /></div>
        </details>

        {abierto && <TierModal nivel={abierto} onClose={() => setAbierto(null)} />}

        {/* Cuarta salida: para quien no calza en ninguna de las tres. Sin esto,
            el que tiene un encargo raro asume que no es cliente y se va. */}
        <div className="panel mt-3 flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-primary">
              <Wand2 className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Sin encasillar</p>
              <h3 className="mt-1.5 font-display text-xl font-bold tracking-[-0.03em]">
                ¿Tu idea necesita algo diferente?
              </h3>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                Software a medida, apps, integraciones o algo que todavía no tiene nombre. Se define el alcance contigo y el precio queda por escrito antes de empezar.
              </p>
            </div>
          </div>

          {/* Justamente el caso que MENOS conviene mandar a WhatsApp: un
              proyecto que no calza en ningún plan hay que describirlo, y en el
              chat llega en tres mensajes sueltos y sin contexto. El formulario
              tiene el campo donde escribirlo, y deja el lead con su atribución
              en vez de una conversación suelta en el teléfono. */}
          <Link
            to="/contacto"
            onClick={() => trackAction("cta_principal_click", { ubicacion: "planes-sin-encasillar" })}
            className="btn btn-ghost h-12 shrink-0 px-6"
          >
            Cuéntanos tu caso
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Los montos son el piso de un alcance típico. El precio final se fija por escrito después del diagnóstico y no cambia durante el proyecto salvo que pidas agregar algo.
        </p>
      </div>
    </section>
  );
}
