import { Link } from "react-router-dom";
import { FileSignature, Code2, Milestone, BadgeDollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

const pillars = [
  {
    icon: BadgeDollarSign,
    title: t("Precio fijo por escrito", "Fixed price in writing"),
    desc: t(
      "El precio que firmas es el precio que pagas. Si el alcance no cambia, la factura tampoco.",
      "The price you sign is the price you pay. If the scope doesn't change, neither does the invoice."
    ),
  },
  {
    icon: Milestone,
    title: t("Hitos con entregas parciales", "Milestones with partial deliveries"),
    desc: t(
      "Ves avances funcionando en cada etapa. El saldo final se paga solo cuando apruebas la entrega.",
      "You see working progress at every stage. The final balance is paid only when you approve the delivery."
    ),
  },
  {
    icon: Code2,
    title: t("El código queda a tu nombre", "The code ends up in your name"),
    desc: t(
      "Repositorio, dominio, hosting y credenciales se traspasan a ti. Sin licencias ni lock-in.",
      "Repository, domain, hosting and credentials are handed over to you. No licenses, no lock-in."
    ),
  },
  {
    icon: FileSignature,
    title: t("Contrato, opción notarial", "Contract, notary option"),
    desc: t(
      "Todo lo anterior va en un contrato que puedes revisar antes de pagar un peso. Si quieres, lo firmamos ante notario.",
      "All of the above goes into a contract you can review before paying a cent. If you want, we sign it before a notary."
    ),
  },
];

export default function GuaranteeSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-150 h-75 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("garantía maudev", "the maudev guarantee")}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
            {t("El riesgo lo tomamos", "We take the risk,")} <span className="text-primary">{t("nosotros, no tú", "not you")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Cuatro compromisos concretos, todos verificables en el contrato que firmas antes de empezar. Puedes leer el modelo completo ahora mismo.",
              "Four concrete commitments, all verifiable in the contract you sign before we start. You can read the full template right now."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/contrato"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
          >
            <FileSignature className="h-4 w-4" />
            {t("Leer el modelo de contrato", "Read the contract template")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
