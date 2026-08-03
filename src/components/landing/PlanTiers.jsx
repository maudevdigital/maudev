import { useState } from "react";
import { ArrowRight, Crown, Rocket, Sprout, Wand2 } from "lucide-react";
import TierModal from "@/components/landing/TierModal";
import { pricing, IVA_NOTA } from "@/data/pricing";
import { formatFrom } from "@/data/currencies";
import { useCurrency } from "@/lib/useCurrency";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Tres niveles y una salida a medida.
//
// La escalera existe para que nadie se vaya por precio sin haber mirado: quien
// llega con poco presupuesto encuentra un piso real, y quien llega con harto ve
// que hay techo. El del medio se marca como el más pedido porque es una
// decisión difícil de tomar sin referencia, y ese sesgo es honesto siempre que
// el nivel marcado sea de verdad el que más se contrata.
//
// Los montos salen de pricing.js, la misma fuente que el cotizador del hero y
// las páginas de servicio. Son montos NETOS y llevan el "+ IVA 19%" al lado en
// cada lugar donde aparecen: mostrar el neto está bien mientras se diga, lo que
// no se puede es dejar que el impuesto aparezca recién en la cotización.
const niveles = [
  {
    id: "inicia",
    numero: "01",
    icono: Sprout,
    etiqueta: "Para partir",
    titulo: "Presencia",
    resumen: "Estar online, con una página que explique bien lo que haces y reciba consultas.",
    plan: "landing",
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
    plan: "sitio",
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
    plan: "ecommerce",
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
    <section id="planes" className="section-pad scroll-mt-20" aria-labelledby="planes-titulo">
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">Tres formas de partir</span>
          <h2 id="planes-titulo" className="section-title mt-4">
            Un piso claro, y hasta dónde puede llegar.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Cada nivel incluye el anterior. Empiezas donde alcanza hoy y creces cuando el negocio lo pida, sin rehacer lo construido.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {niveles.map((nivel) => {
            const { id, numero, icono: Icono, etiqueta, titulo, resumen, plan, ejemplo, incluye, para, destacado } = nivel;
            return (
            <article
              key={id}
              className={`panel relative flex flex-col p-7 lg:p-8 ${destacado ? "border-primary/45" : ""}`}
            >
              {destacado && (
                <span className="absolute right-6 top-6 rounded-md bg-primary px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                  Más elegido
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-border text-primary">
                  <Icono className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="font-display text-4xl font-bold leading-none text-border" aria-hidden="true">
                  {numero}
                </span>
              </div>

              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{etiqueta}</p>
              <h3 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.03em]">{titulo}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{resumen}</p>

              <div className="mt-6 rounded-lg border border-border bg-secondary/50 px-4 py-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{ejemplo}</p>
                <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em]">
                  Desde {formatFrom(pricing[plan].from, moneda)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {IVA_NOTA}
                </p>
              </div>

              <ul className="mt-6 space-y-2.5">
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

              <button
                type="button"
                onClick={() => {
                  setAbierto(nivel);
                  trackAction("plan_subservicios", { plan: id });
                }}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ver subservicios
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </article>
            );
          })}
        </div>

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
                ¿No calzas en ninguno de los tres?
              </h3>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                Software a medida, apps, integraciones o algo que todavía no tiene nombre. Se define el alcance contigo y el precio queda por escrito antes de empezar.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl("Hola, vengo de maudev.cl. Mi proyecto no calza en los planes y quiero contarte qué necesito.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAction("whatsapp_click", { ubicacion: "planes" })}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Cuéntanos tu caso
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Los montos son el piso de un alcance típico. El precio final se fija por escrito después del diagnóstico y no cambia durante el proyecto salvo que pidas agregar algo.
        </p>
      </div>
    </section>
  );
}
