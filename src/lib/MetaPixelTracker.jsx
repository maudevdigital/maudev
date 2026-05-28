import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CAPI_WORKER = "https://maudev-meta-capi.maudevchile.workers.dev";

// Dispara PageView de Meta Pixel en cada cambio de ruta (SPA).
export default function MetaPixelTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    if (!window.__fbqInitialPageView) {
      window.__fbqInitialPageView = true;
      return;
    }
    window.fbq("track", "PageView");
  }, [pathname, search]);

  return null;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : undefined;
}

// Dispara evento en el Pixel cliente + API de Conversiones servidor (deduplicado).
// Devuelve el event_id generado.
export async function trackLeadEvent({ email, phone, params = {} } = {}) {
  const eventId = crypto.randomUUID();
  const sourceUrl = window.location.href;
  const fbc = getCookie("_fbc");
  const fbp = getCookie("_fbp");

  // 1. Pixel cliente (con event_id para deduplicación)
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", params, { eventID: eventId });
  }

  // 2. CAPI servidor
  try {
    await fetch(CAPI_WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Lead",
        event_id: eventId,
        email,
        phone,
        source_url: sourceUrl,
        fbc,
        fbp,
      }),
    });
  } catch {
    // No bloquear el flujo si el worker falla
  }

  return eventId;
}

// Alias simple para eventos que no necesitan CAPI (PageView, etc.)
export function trackEvent(name, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", name, params);
  else window.fbq("track", name);
}
