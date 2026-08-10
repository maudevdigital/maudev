import { Link } from "react-router-dom";
import { CTA_LABEL } from "@/data/site";
import { trackAction } from "@/lib/MetaPixelTracker";

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
  return (
    <Link
      to="/contacto"
      data-cta={context || "generic"}
      onClick={() => trackAction("cta_principal_click", { ubicacion: context || "generico" })}
      className={[
        "group btn btn-primary",
        sizes[size],
        full ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
