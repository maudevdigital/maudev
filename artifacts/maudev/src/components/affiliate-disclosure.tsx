/**
 * Disclosure legal de afiliados.
 *
 * Cumple con buenas prácticas FTC, GDPR-style transparency y la Ley 19.628 (CL)
 * sobre publicidad engañosa. Mostrar en posts del blog o landings que contengan
 * <AffiliateLink>.
 *
 * Variantes:
 *  - "compact": una línea, va al final del artículo o en el footer del post.
 *  - "full":    bloque destacado para landing pages tipo "best of" o reviews.
 */

interface AffiliateDisclosureProps {
  variant?: "compact" | "full";
  className?: string;
}

export function AffiliateDisclosure({
  variant = "compact",
  className = "",
}: AffiliateDisclosureProps) {
  if (variant === "full") {
    return (
      <aside
        className={`my-6 rounded-md border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-100/80 ${className}`}
        role="note"
      >
        <p className="font-medium text-cyan-300">
          Transparencia: enlaces de afiliado
        </p>
        <p className="mt-1 leading-relaxed">
          Algunos enlaces en este artículo son de afiliado. Si compras a través
          de ellos, MauDev puede recibir una comisión sin costo adicional para
          ti. Solo recomendamos productos que probamos o usamos directamente, y
          la opinión vertida es independiente de cualquier acuerdo comercial.
        </p>
      </aside>
    );
  }

  return (
    <p
      className={`text-xs text-zinc-500 leading-relaxed ${className}`}
      role="note"
    >
      Transparencia: este artículo puede contener enlaces de afiliado. Si
      compras a través de ellos, MauDev recibe una comisión sin costo adicional
      para ti. Las recomendaciones son independientes y reflejan nuestra opinión
      genuina.
    </p>
  );
}
