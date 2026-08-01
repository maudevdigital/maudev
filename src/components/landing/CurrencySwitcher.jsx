import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { BASE, currencyList, getCurrency, refreshRates, setCurrency } from "@/data/currencies";

const avisarCambio = (code) =>
  window.dispatchEvent(new CustomEvent("maudev:moneda", { detail: code }));

// Selector de moneda. Cambia solo cómo se MUESTRAN los precios: el cobro sigue
// siendo en pesos, y por eso las demás monedas se rotulan como referencia.
//
// Emite un evento propio en vez de usar contexto: los precios están repartidos
// en componentes que no comparten árbol (hero, tarjetas, páginas de servicio) y
// montar un provider global para un dato de presentación era más cañería de la
// que el problema pide.
export default function CurrencySwitcher({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("CLP");
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const botonRef = useRef(null);

  // El desplegable se monta en <body> con un portal, y no dentro del header.
  // Dos motivos, y hacen falta los dos:
  //   · la píldora usa overflow-hidden para que el mega-menú respete sus
  //     esquinas, y eso recortaba la lista a dos monedas;
  //   · el header lleva un `transform` para el auto-ocultado, y un ancestro
  //     transformado convierte `position: fixed` en relativo a ÉL, no al
  //     viewport, así que las coordenadas quedaban desplazadas.
  const ubicar = useCallback(() => {
    const r = botonRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
  }, []);

  useEffect(() => {
    const guardada = getCurrency();
    setCode(guardada);
    // Si el visitante ya venía en otra moneda, se refrescan las tasas al
    // cargar. En CLP no se pide nada: no hay conversión que hacer.
    if (guardada !== BASE) {
      refreshRates().then(() => avisarCambio(guardada));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    ubicar();
    window.addEventListener("resize", ubicar);
    window.addEventListener("scroll", ubicar, { passive: true });
    const fuera = (e) => {
      const dentro = ref.current?.contains(e.target) || botonRef.current?.contains(e.target);
      if (!dentro) setOpen(false);
    };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", fuera);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      window.removeEventListener("keydown", esc);
      window.removeEventListener("resize", ubicar);
      window.removeEventListener("scroll", ubicar);
    };
  }, [open, ubicar]);

  const elegir = (nuevo) => {
    setCode(nuevo);
    setCurrency(nuevo);
    setOpen(false);
    // Se avisa de inmediato con las tasas que haya (respaldo o caché) y otra
    // vez cuando llegan las frescas: el precio nunca queda en blanco esperando.
    avisarCambio(nuevo);
    if (nuevo !== BASE) refreshRates().then(() => avisarCambio(nuevo));
  };

  const actual = currencyList.find((c) => c.code === code) || currencyList[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={botonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Moneda: ${actual.code}. Cambiar moneda`}
        className="flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="font-mono text-[10px] text-primary">{actual.country}</span>
        {actual.code}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && pos && createPortal(
        <ul
          role="listbox"
          aria-label="Monedas disponibles"
          ref={ref}
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 60 }}
          className="panel panel-solid w-44 p-1.5"
        >
          {currencyList.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === code}
                onClick={() => elegir(c.code)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-secondary ${
                  c.code === code ? "text-primary" : "text-foreground"
                }`}
              >
                <span className="font-mono text-[10px] text-muted-foreground">{c.country}</span>
                {c.code}
                {c.code === code && <Check className="ml-auto h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )}
      <p className="sr-only">Los precios se definen y se cobran en pesos chilenos. Las demás monedas son una referencia aproximada.</p>
    </div>
  );
}
