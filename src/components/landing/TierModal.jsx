import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lock, MessageCircle, X } from "lucide-react";
import { familias, subservicios } from "@/data/subservices";
import { formatFrom } from "@/data/currencies";
import { IVA_NOTA } from "@/data/pricing";
import { useCurrency } from "@/lib/useCurrency";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Detalle de un nivel: la carta completa de subservicios con su precio.
//
// Los servicios que el nivel no alcanza se muestran BLOQUEADOS y no ocultos.
// Ocultarlos haría parecer completo al nivel de entrada y dejaría sin
// argumento a los de arriba; verlos con candado convierte la carta en la razón
// para subir, sin que nadie tenga que decirlo.
//
// Va en un portal a <body>: el modal nace dentro de una tarjeta con overflow
// oculto, y desde ahí no puede cubrir la pantalla.
export default function TierModal({ nivel, onClose }) {
  const moneda = useCurrency();
  const [familia, setFamilia] = useState("todos");
  const cajaRef = useRef(null);
  const cerrarRef = useRef(null);

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();

    const alTeclear = (evento) => {
      if (evento.key === "Escape") onClose();
      // Trampa de foco: sin esto, tabular saca al usuario del diálogo hacia la
      // página de atrás, que está oculta a la vista pero sigue siendo tabulable.
      if (evento.key !== "Tab") return;
      const foco = cajaRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!foco?.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [onClose]);

  const visibles = subservicios.filter((s) => familia === "todos" || s.familia === familia);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-[hsl(var(--ink)/0.72)] p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(evento) => evento.target === evento.currentTarget && onClose()}
    >
      <div
        ref={cajaRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-nivel-titulo"
        className="panel panel-solid flex max-h-[92dvh] w-full max-w-5xl flex-col rounded-b-none sm:rounded-2xl"
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4 border-b border-border p-6 sm:p-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              Estás explorando · Nivel {nivel.numero}
            </p>
            <h2 id="modal-nivel-titulo" className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              {nivel.titulo}
            </h2>
            <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{nivel.resumen}</p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Filtros por familia */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-6 py-3 sm:px-7">
          {[{ id: "todos", label: "Todos" }, ...familias].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFamilia(id)}
              aria-pressed={familia === id}
              className={`shrink-0 rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                familia === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Carta */}
        <div className="grid gap-3 overflow-y-auto p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {visibles.map((servicio) => {
            const precio = servicio.precios[nivel.indice];
            const bloqueado = precio === null;
            return (
              <article
                key={servicio.id}
                className={`flex flex-col rounded-xl border p-5 ${
                  bloqueado ? "border-border/60 bg-secondary/40" : "border-border bg-card"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {familias.find((f) => f.id === servicio.familia)?.label}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold tracking-[-0.02em]">{servicio.nombre}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{servicio.resumen}</p>

                {bloqueado ? (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border px-3.5 py-3">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Disponible desde el nivel {nivel.indice === 0 ? "Operación" : "Comercio"}.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 font-display text-xl font-bold tracking-[-0.03em]">
                      {formatFrom(precio, moneda)}
                      <span className="ml-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {IVA_NOTA}
                      </span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {servicio.incluye.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            );
          })}
        </div>

        {/* Pie */}
        <div className="flex flex-col gap-4 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Los montos son el piso de un alcance típico y no incluyen IVA. El precio final se fija por escrito antes de empezar.
          </p>
          <a
            href={getWhatsAppUrl(`Hola, vengo de maudev.cl. Estuve viendo el nivel ${nivel.titulo} y quiero cotizar.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAction("whatsapp_click", { ubicacion: `modal-${nivel.id}` })}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
