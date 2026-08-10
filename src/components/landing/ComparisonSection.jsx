import { Check, X, Minus } from "lucide-react";

// Comparación honesta: cada celda es defendible. Evitar exageraciones —
// la gracia de esta tabla es que el lector la encuentre justa.
const rows = [
  {
    label: "Quién te atiende",
    agency: "Ejecutivo de cuentas",
    marketplace: "Depende de la suerte",
    maudev: "Quien escribe el código",
  },
  {
    label: "Precio",
    agency: "Alto + costos extra",
    marketplace: "Bajo, pero variable",
    maudev: "Fijo, por escrito",
  },
  {
    label: "Contrato formal",
    agency: "check",
    marketplace: "x",
    maudev: "check",
  },
  {
    label: "Código a tu nombre",
    agency: "No siempre",
    marketplace: "Rara vez",
    maudev: "check",
  },
  {
    label: "Soporte post-entrega",
    agency: "Con plan mensual",
    marketplace: "x",
    maudev: "check",
  },
  {
    label: "Entregas parciales visibles",
    agency: "minus",
    marketplace: "x",
    maudev: "check",
  },
];

function Cell({ value, highlight = false }) {
  if (value === "check") return <Check className={`h-4 w-4 mx-auto ${highlight ? "text-primary" : "text-foreground/70"}`} />;
  if (value === "x") return <X className="h-4 w-4 mx-auto text-muted-foreground/50" />;
  if (value === "minus") return <Minus className="h-4 w-4 mx-auto text-muted-foreground/50" />;
  return <span className={`text-xs ${highlight ? "text-foreground font-medium" : "text-muted-foreground"}`}>{value}</span>;
}

export default function ComparisonSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute right-0 top-1/3 w-125 h-125 bg-foreground/3 rounded-xl blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="kicker">{"comparación honesta"}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {"¿Agencia, marketplace"} <span className="text-primary">{"o maudev?"}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada opción tiene su lugar. Esta tabla resume las diferencias reales para que decidas con información, no con marketing.
          </p>
        </div>

        <div
          className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto"
        >
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium" />
                <th className="px-4 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium">
                  Agencia grande
                </th>
                <th className="px-4 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium">
                  Freelancer de marketplace
                </th>
                <th className="px-4 py-4 bg-primary/5 border-x border-primary/15">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider font-bold">maudev</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border/40 last:border-b-0">
                  <td className="px-5 py-3.5 font-medium text-foreground text-xs sm:text-sm">{r.label}</td>
                  <td className="px-4 py-3.5 text-center">
                    <Cell value={r.agency} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Cell value={r.marketplace} />
                  </td>
                  <td className="px-4 py-3.5 text-center bg-primary/5 border-x border-primary/15">
                    <Cell value={r.maudev} highlight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground font-mono">
          Si tu proyecto necesita un equipo de 20 personas, una agencia grande es mejor opción, y te lo diremos.
        </p>
      </div>
    </section>
  );
}
