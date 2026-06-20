import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

// Comparación honesta: cada celda es defendible. Evitar exageraciones —
// la gracia de esta tabla es que el lector la encuentre justa.
const rows = [
  {
    label: t("Quién te atiende", "Who you deal with"),
    agency: t("Ejecutivo de cuentas", "Account executive"),
    marketplace: t("Depende de la suerte", "Luck of the draw"),
    maudev: t("Quien escribe el código", "The person writing the code"),
  },
  {
    label: t("Precio", "Price"),
    agency: t("Alto + costos extra", "High + extras"),
    marketplace: t("Bajo, pero variable", "Low, but variable"),
    maudev: t("Fijo, por escrito", "Fixed, in writing"),
  },
  {
    label: t("Contrato formal", "Formal contract"),
    agency: "check",
    marketplace: "x",
    maudev: "check",
  },
  {
    label: t("Código a tu nombre", "Code in your name"),
    agency: t("No siempre", "Not always"),
    marketplace: t("Rara vez", "Rarely"),
    maudev: "check",
  },
  {
    label: t("Soporte post-entrega", "Post-delivery support"),
    agency: t("Con plan mensual", "With monthly plan"),
    marketplace: "x",
    maudev: "check",
  },
  {
    label: t("Entregas parciales visibles", "Visible partial deliveries"),
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
      <div className="absolute right-0 top-1/3 w-125 h-125 bg-foreground/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("comparación honesta", "honest comparison")}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {t("¿Agencia, marketplace", "Agency, marketplace")} <span className="text-primary">{t("o maudev?", "or maudev?")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Cada opción tiene su lugar. Esta tabla resume las diferencias reales para que decidas con información, no con marketing.",
              "Each option has its place. This table sums up the real differences so you decide with information, not marketing."
            )}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto"
        >
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium" />
                <th className="px-4 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium">
                  {t("Agencia grande", "Big agency")}
                </th>
                <th className="px-4 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider font-medium">
                  {t("Freelancer de marketplace", "Marketplace freelancer")}
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
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground font-mono">
          {t(
            "Si tu proyecto necesita un equipo de 20 personas, una agencia grande es mejor opción — y te lo diremos.",
            "If your project needs a 20-person team, a big agency is the better option — and we'll tell you so."
          )}
        </p>
      </div>
    </section>
  );
}
