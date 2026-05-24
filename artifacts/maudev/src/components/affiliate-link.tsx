import { type ReactNode, type AnchorHTMLAttributes } from "react";
import {
  AFFILIATE_PROGRAMS,
  resolveAffiliateUrl,
  type AffiliateProgram,
} from "@/lib/affiliate-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface AffiliateLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Programa de afiliado a referir */
  program: AffiliateProgram;
  /**
   * Identificador del lugar donde aparece el link, ej: "blog-hostinger-review",
   * "home-hero", "footer-recommended". Se usa como UTM campaign + event param
   * para que sepas qué placement convierte mejor en GA4.
   */
  placement: string;
  children: ReactNode;
  /**
   * Si true, oculta el link cuando el programa aún no tiene trackingId
   * (mejor que mostrar un link no-afiliado al sitio público).
   * Default: false → muestra el link público sin tracking.
   */
  hideUntilApproved?: boolean;
}

/**
 * Link de afiliado con tracking automático en GA4.
 *
 * - Dispara evento `affiliate_click` en GA4 con program + placement.
 * - Usa rel="sponsored noopener noreferrer" (best practice + Google guidelines).
 * - target="_blank" para no perder tu pestaña.
 * - Si el programa no está aprobado todavía, degrada a link público o se oculta.
 *
 * Uso:
 *   <AffiliateLink program="hostinger" placement="blog-landing-page-guide">
 *     Empezar con Hostinger
 *   </AffiliateLink>
 */
export function AffiliateLink({
  program,
  placement,
  children,
  hideUntilApproved = false,
  onClick,
  ...rest
}: AffiliateLinkProps) {
  const { url, isTracked } = resolveAffiliateUrl(program, placement);
  const cfg = AFFILIATE_PROGRAMS[program];

  if (!isTracked && hideUntilApproved) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        program,
        program_name: cfg.name,
        placement,
        is_tracked: isTracked,
        category: cfg.category,
      });
    }
    onClick?.(e);
  };

  return (
    <a
      {...rest}
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-affiliate-program={program}
      data-affiliate-placement={placement}
    >
      {children}
    </a>
  );
}
