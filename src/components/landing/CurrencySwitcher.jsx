import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { currencyList, getCurrency, setCurrency } from "@/data/currencies";

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
  const ref = useRef(null);

  useEffect(() => setCode(getCurrency()), []);

  useEffect(() => {
    if (!open) return;
    const fuera = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", fuera);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const elegir = (nuevo) => {
    setCode(nuevo);
    setCurrency(nuevo);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("maudev:moneda", { detail: nuevo }));
  };

  const actual = currencyList.find((c) => c.code === code) || currencyList[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
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

      {open && (
        <ul
          role="listbox"
          aria-label="Monedas disponibles"
          className="panel absolute right-0 z-50 mt-2 w-44 p-1.5"
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
        </ul>
      )}
      <p className="sr-only">Los precios se definen y se cobran en pesos chilenos. Las demás monedas son una referencia aproximada.</p>
    </div>
  );
}
