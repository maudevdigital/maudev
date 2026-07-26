import { useState } from "react";
import { getRegion, setRegion, CL, INTL } from "@/lib/region";
import { t } from "@/lib/i18n";

// Interruptor de región. Discreto a propósito: la mayoría nunca lo va a tocar
// porque la detección acierta, pero tiene que estar visible para quien no.
//
// `onChange` permite que el componente padre reaccione (recalcular precios).

export default function RegionToggle({ onChange, className = "" }) {
  const [region, setLocal] = useState(getRegion);

  const pick = (r) => {
    setRegion(r);
    setLocal(r);
    onChange?.(r);
  };

  const opt = (value, label) => (
    <button
      type="button"
      onClick={() => pick(value)}
      aria-pressed={region === value}
      className={[
        "rounded-full px-3 py-1 font-mono text-[11px] transition-colors",
        region === value
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-secondary/40 p-0.5 ${className}`}
      role="group"
      aria-label={t("Región de pago", "Payment region")}
    >
      {opt(CL, t("Chile · CLP", "Chile · CLP"))}
      {opt(INTL, t("Otro país · USD", "Other · USD"))}
    </div>
  );
}
