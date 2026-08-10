import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isGranted } from "@/lib/consent";

const CAPI_WORKER = "https://maudev-meta-capi.maudevchile.workers.dev";

// Nota sobre consentimiento:
// Las llamadas a fbq() y gtag() son inofensivas sin consentimiento: los stubs
// de index.html solo encolan en memoria, y los scripts reales no se descargan
// hasta que el visitante acepta. No hay red ni cookies.
//
// La API de Conversiones SÍ es distinta: manda correo y teléfono a Meta desde
// el servidor, saltándose el navegador. Eso es tratamiento con fines
// publicitarios y necesita consentimiento explícito, así que va gateada.

// Ya no hay rutas privadas (el panel /admin se eliminó). Se deja el helper
// por si mañana vuelve alguna ruta que no deba trackearse.
const isPrivate = () => false;

// Dispara PageView de Google Analytics 4 + Meta Pixel en cada cambio de ruta
// (SPA), incluida la carga inicial.
export default function MetaPixelTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPrivate(pathname)) return; // el admin no se trackea

    const page_path = pathname + search;
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
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

  // 1b. Google Analytics 4: evento de lead. Márcalo como "evento clave"
  //     (conversión) en GA4 → Administrar → Eventos clave.
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", { ...params, event_id: eventId });
  }

  // 2. CAPI servidor — solo con consentimiento publicitario.
  //    Sin él no se envía nada: el lead igual te llega por el webhook de n8n,
  //    lo único que se pierde es la atribución del anuncio en Meta.
  if (!isGranted()) return eventId;

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

  // El aviso interno del lead lo maneja el flujo de n8n (ver lib/leads.js).
  return eventId;
}

// Eventos de interacción no sensibles. Los stubs de index.html los mantienen
// en memoria y los scripts solo se cargan cuando existe consentimiento.
export function trackAction(name, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") window.gtag("event", name, params);
  if (typeof window.fbq === "function") window.fbq("trackCustom", name, params);
}
