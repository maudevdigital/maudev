/**
 * Utilidades para Google Analytics 4 y Google Ads.
 * Centraliza todos los eventos de tracking para fácil auditoría.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ── Consent Mode v2 ──────────────────────────────────────────────────────────

export type ConsentLevel = "all" | "analytics_only" | "none";

export function updateConsent(level: ConsentLevel) {
  const analytics = level !== "none";
  const ads = level === "all";
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: ads ? "granted" : "denied",
    ad_personalization: ads ? "granted" : "denied",
  });
}

export function getStoredConsent(): ConsentLevel | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("consent_level") as ConsentLevel) ?? null;
}

export function saveConsent(level: ConsentLevel) {
  if (typeof window === "undefined") return;
  localStorage.setItem("consent_level", level);
  updateConsent(level);
}

// ── GA4 Events ────────────────────────────────────────────────────────────────

export function trackPageView(path: string) {
  gtag("event", "page_view", { page_path: path });
}

export function trackAffiliateClick(
  program: string,
  programName: string,
  placement: string,
) {
  gtag("event", "affiliate_click", {
    event_category: "monetization",
    affiliate_program: program,
    affiliate_name: programName,
    placement,
  });
}

export function trackToolPageView(toolName: string) {
  gtag("event", "tool_page_view", {
    event_category: "engagement",
    tool_name: toolName,
  });
}

export function trackNewsletterSignup() {
  gtag("event", "newsletter_signup", { event_category: "leads" });
}

// ── Google Ads Conversions ────────────────────────────────────────────────────
// Reemplaza AW-XXXXXXXXXX con tu Conversion ID de Google Ads.
// Lo encontrás en Google Ads → Herramientas → Conversiones.
//
// PASOS:
// 1. Crear cuenta en ads.google.com
// 2. Ir a Herramientas → Conversiones → Nueva conversión
// 3. Tipo: "Sitio web" → acción: "Clic en enlace"
// 4. Copiar "Conversion ID" (AW-XXXXXXXXXX) y "Conversion label"
// 5. Reemplazar los placeholders de abajo

export const GOOGLE_ADS_ID = "AW-XXXXXXXXXX"; // TODO: reemplazar con tu ID real

export const CONVERSION_LABELS = {
  affiliate_click: "XXXXXXXXXXXXXXXXXX", // TODO: label para clic afiliado
  lead_form: "XXXXXXXXXXXXXXXXXX", // TODO: label para formulario/newsletter
} as const;

export function trackGoogleAdsConversion(
  label: string,
  value?: number,
  currency = "USD",
) {
  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    value: value ?? 0,
    currency,
  });
}
