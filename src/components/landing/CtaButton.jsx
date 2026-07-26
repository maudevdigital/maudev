import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/components/landing/WhatsAppFloat";
import { CTA_LABEL, CTA_MESSAGE } from "@/data/site";

// ─────────────────────────────────────────────────────────────────────────────
// EL botón. Uno solo, en todo el sitio.
//
// Regla de diseño: si un visitante tiene que elegir entre dos acciones, duda;
// si duda, se va. Por eso todas las secciones terminan en este mismo botón,
// con el mismo texto y el mismo destino. La única variación permitida es el
// `context`, que precarga el mensaje de WhatsApp según desde dónde se hizo
// clic (así Lucas sabe qué estaba mirando el cliente sin preguntarle).
// ─────────────────────────────────────────────────────────────────────────────

const sizes = {
  lg: "h-14 px-8 text-base",
  md: "h-12 px-6 text-sm",
};

export default function CtaButton({
  context = null,
  size = "md",
  className = "",
  label = CTA_LABEL,
  full = false,
}) {
  const message = context ? `${CTA_MESSAGE} (${context})` : CTA_MESSAGE;

  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cta={context || "generic"}
      className={[
        "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold",
        "bg-[#25D366] text-white hover:bg-[#1eb955]",
        "shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/25",
        "transition-all duration-200 hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizes[size],
        full ? "w-full" : "",
        className,
      ].join(" ")}
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      {label}
    </a>
  );
}
