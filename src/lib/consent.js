// ─────────────────────────────────────────────────────────────────────────────
// CONSENTIMIENTO DE COOKIES
//
// Fuente única de verdad sobre si el visitante aceptó analítica y publicidad.
//
// Por qué existe: la Ley 21.719 (vigente 1-dic-2026) exige consentimiento
// PREVIO, específico e inequívoco. El consentimiento tácito ya no vale. Antes
// este sitio cargaba GA4 y el Meta Pixel a los 4 segundos sin preguntar nada,
// mientras la política de privacidad afirmaba lo contrario.
//
// Decisión de diseño: si el visitante rechaza, los scripts NO se descargan
// nunca. Nada de "cargar igual pero sin cookies" — es más defendible y más
// honesto. El sitio funciona idéntico sin ellos.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "maudev_consent_v1";

export const GRANTED = "granted";
export const DENIED = "denied";

const listeners = new Set();

/** Devuelve "granted", "denied" o null si todavía no decide. */
export function getConsent() {
  try {
    const v = localStorage.getItem(KEY);
    return v === GRANTED || v === DENIED ? v : null;
  } catch {
    // Almacenamiento bloqueado (modo incógnito estricto, cookies de terceros
    // deshabilitadas). Sin decisión persistible tratamos como "no aceptó".
    return null;
  }
}

export const hasDecided = () => getConsent() !== null;
export const isGranted = () => getConsent() === GRANTED;

/** Guarda la decisión, avisa a Consent Mode y carga (o no) los scripts. */
export function setConsent(value) {
  const v = value === GRANTED ? GRANTED : DENIED;
  try {
    localStorage.setItem(KEY, v);
  } catch { /* si no se puede persistir, al menos vale para esta sesión */ }

  // Google Consent Mode v2: informar el cambio aunque GA no esté cargado todavía.
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: v,
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
    });
  }

  if (v === GRANTED && typeof window.__maudevLoadAnalytics === "function") {
    window.__maudevLoadAnalytics();
  }

  listeners.forEach((fn) => fn(v));
  return v;
}

/** Se suscribe a cambios de consentimiento. Devuelve la función para desuscribirse. */
export function onConsentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Al arrancar: si ya había aceptado en una visita anterior, carga los scripts.
 * Si rechazó o no ha decidido, no se descarga nada.
 */
export function initConsent() {
  if (isGranted()) setConsent(GRANTED);
}
