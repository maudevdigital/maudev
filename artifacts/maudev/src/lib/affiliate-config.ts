/**
 * Configuración central de programas de afiliado.
 *
 * Cuando un programa apruebe la aplicación, reemplaza el valor `null` en
 * `trackingId` con el código real entregado por la plataforma. El componente
 * <AffiliateLink /> oculta o degrada el link mientras el programa esté
 * `pending`, evitando publicar links rotos en producción.
 *
 * Convenciones:
 * - `category: "ad-friendly"` → safe para promocionar vía Google Ads / Meta Ads.
 * - `category: "organic-only"` → solo blog/SEO. NO usar en campañas pagadas
 *   (políticas Google Ads sobre forex/trading/derivados).
 */

export type AffiliateProgram =
  | "hostinger"
  | "semrush"
  | "unbounce"
  | "getresponse"
  | "jotform"
  | "systemeio"
  | "tradingview"
  | "ftmo"
  | "pineconnector";

export type AffiliateCategory = "ad-friendly" | "organic-only";

export interface AffiliateConfig {
  /** Nombre legible del programa */
  name: string;
  /** Categoría de riesgo respecto a políticas de ads */
  category: AffiliateCategory;
  /**
   * Código/ID de tracking entregado por el programa.
   * `null` = aún no aprobado o pendiente de configurar → el componente
   * renderiza un link no-afiliado al sitio público o se oculta.
   */
  trackingId: string | null;
  /** Builder que arma la URL final dado el placement (UTM campaign) */
  buildUrl: (trackingId: string, placement: string) => string;
  /** URL pública de fallback cuando trackingId aún es null */
  publicUrl: string;
  /** Comisión típica para mostrar en UI interna/dashboards (no en frontend público) */
  commissionLabel: string;
}

export const AFFILIATE_PROGRAMS: Record<AffiliateProgram, AffiliateConfig> = {
  // ── Tier 1: paid-ads-friendly ─────────────────────────────────────────────
  hostinger: {
    name: "Hostinger",
    category: "ad-friendly",
    trackingId: null, // TODO: reemplazar al ser aprobado (5 días hábiles)
    publicUrl: "https://www.hostinger.com",
    commissionLabel: "40-60% por venta",
    buildUrl: (id, placement) =>
      `https://hostinger.com/?REFERRALCODE=${id}&utm_source=maudev&utm_medium=affiliate&utm_campaign=${placement}`,
  },
  semrush: {
    name: "Semrush",
    category: "ad-friendly",
    trackingId: null, // TODO: pegar tracking link de Impact.com cuando termine onboarding
    publicUrl: "https://www.semrush.com",
    commissionLabel: "$200/sale + $10/trial",
    // Impact.com entrega URLs completas tipo https://semrush.sjv.io/XXXX
    // Para Semrush usamos directamente el link completo en trackingId,
    // y aquí solo agregamos UTMs.
    buildUrl: (id, placement) => {
      const sep = id.includes("?") ? "&" : "?";
      return `${id}${sep}utm_source=maudev&utm_medium=affiliate&utm_campaign=${placement}`;
    },
  },
  unbounce: {
    name: "Unbounce",
    category: "ad-friendly",
    trackingId: null,
    publicUrl: "https://unbounce.com",
    commissionLabel: "20% recurring lifetime",
    buildUrl: (id, placement) =>
      `https://unbounce.com/?aff=${id}&utm_source=maudev&utm_medium=affiliate&utm_campaign=${placement}`,
  },
  getresponse: {
    name: "GetResponse",
    category: "ad-friendly",
    trackingId: null,
    publicUrl: "https://www.getresponse.com",
    commissionLabel: "33% recurring o $100 flat",
    buildUrl: (id, placement) =>
      `https://www.getresponse.com/?ab=${id}&utm_source=maudev&utm_medium=affiliate&utm_campaign=${placement}`,
  },
  jotform: {
    name: "Jotform",
    category: "ad-friendly",
    trackingId: null,
    publicUrl: "https://www.jotform.com",
    commissionLabel: "30% recurring",
    buildUrl: (id, placement) =>
      `https://www.jotform.com/?utm_source=affiliate&utm_id=${id}&utm_campaign=${placement}`,
  },
  systemeio: {
    name: "Systeme.io",
    category: "ad-friendly",
    trackingId: null,
    publicUrl: "https://systeme.io",
    commissionLabel: "60% recurring lifetime",
    buildUrl: (id, placement) =>
      `https://systeme.io/?sa=${id}&utm_source=maudev&utm_campaign=${placement}`,
  },

  // ── Tier 2: organic-only (NO encender ads) ────────────────────────────────
  tradingview: {
    name: "TradingView",
    category: "organic-only",
    trackingId: null,
    publicUrl: "https://www.tradingview.com",
    commissionLabel: "30% primera compra",
    buildUrl: (id, placement) =>
      `https://www.tradingview.com/?aff_id=${id}&aff_sub=${placement}`,
  },
  ftmo: {
    name: "FTMO",
    category: "organic-only",
    trackingId: null,
    publicUrl: "https://ftmo.com",
    commissionLabel: "5-15% por challenge",
    buildUrl: (id, placement) =>
      `https://ftmo.com/?affiliates=${id}&utm_campaign=${placement}`,
  },
  pineconnector: {
    name: "PineConnector",
    category: "organic-only",
    trackingId: null,
    publicUrl: "https://www.pineconnector.com",
    commissionLabel: "20-30% recurring",
    buildUrl: (id, placement) =>
      `https://www.pineconnector.com/?ref=${id}&utm_campaign=${placement}`,
  },
};

/**
 * Resuelve la URL final para un programa + placement.
 * Si el programa aún no tiene trackingId, devuelve la URL pública (no afiliada).
 */
export function resolveAffiliateUrl(
  program: AffiliateProgram,
  placement: string,
): { url: string; isTracked: boolean } {
  const cfg = AFFILIATE_PROGRAMS[program];
  if (!cfg.trackingId) {
    return { url: cfg.publicUrl, isTracked: false };
  }
  return {
    url: cfg.buildUrl(cfg.trackingId, sanitizePlacement(placement)),
    isTracked: true,
  };
}

/** Normaliza placement para usar como UTM campaign (sin espacios ni caracteres raros) */
function sanitizePlacement(placement: string): string {
  return placement
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
