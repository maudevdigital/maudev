import { applyAnalyticsConsent } from "./analytics";
import { registrarConsentimiento } from "./leads";

const KEY = "maudev_consent_v2";
const LEGACY_KEY = "maudev_consent_v1";
const ID_KEY = "maudev_consent_id";
// Sube cuando cambie el texto del aviso: el registro dice qué versión se aceptó.
const VERSION_AVISO = "2026-09-29";

// Identificador aleatorio del navegador para el registro de consentimiento.
// No se cruza con nada: solo agrupa las elecciones de un mismo navegador.
function idNavegador() {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
export const CONSENT_EVENT = "maudev:consent-changed";
export const GRANTED = "granted";
export const DENIED = "denied";
let memory;
let listening = false;

export function getConsent() {
  if (memory !== undefined) return memory;
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (value?.version === 2 && typeof value.analytics === "boolean" && typeof value.marketing === "boolean") return value;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if ([GRANTED, DENIED].includes(legacy)) return { version: 2, analytics: legacy === GRANTED, marketing: legacy === GRANTED };
  } catch { /* La elección puede mantenerse en memoria si el navegador bloquea almacenamiento. */ }
  return null;
}

export const hasConsent = purpose => getConsent()?.[purpose] === true;

export function setConsent(value) {
  memory = {
    version: 2,
    analytics: value === GRANTED || value?.analytics === true,
    marketing: value === GRANTED || value?.marketing === true,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
    localStorage.removeItem(LEGACY_KEY);
  } catch { /* memory conserva la decisión durante esta carga. */ }
  applyAnalyticsConsent(memory);
  registrarConsentimiento({ id: idNavegador(), analytics: memory.analytics, marketing: memory.marketing, version: VERSION_AVISO });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: memory }));
  return memory;
}

export function initConsent() {
  applyAnalyticsConsent(getConsent() || {});
  if (listening) return;
  listening = true;
  window.addEventListener("storage", event => {
    if (event.key && ![KEY, LEGACY_KEY].includes(event.key)) return;
    memory = undefined;
    const value = getConsent();
    applyAnalyticsConsent(value || {});
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  });
}
