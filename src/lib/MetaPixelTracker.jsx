import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CONSENT_EVENT, hasConsent } from "@/lib/consent";

const CAPI_WORKER = "https://maudev-meta-capi.maudevchile.workers.dev";
const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term", "gclid", "fbclid"];

// Evita enviar parámetros libres como nombre, correo o el mensaje del formulario.
function measurementUrl(value = window.location.href) {
  const url = new URL(value);
  for (const key of [...url.searchParams.keys()]) if (!CAMPAIGN_KEYS.includes(key)) url.searchParams.delete(key);
  url.hash = "";
  return url.href;
}

export default function MetaPixelTracker() {
  const { pathname, search } = useLocation();
  const last = useRef({ analytics: null, marketing: null });
  const referrer = useRef(document.referrer);

  useEffect(() => {
    let frame;
    const track = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const page = measurementUrl();
        const path = new URL(page);
        if (!hasConsent("analytics")) last.current.analytics = null;
        else if (last.current.analytics !== page && window.gtag) {
          window.gtag("event", "page_view", {
            page_path: path.pathname + path.search,
            page_location: page,
            page_title: document.title,
            page_referrer: referrer.current ? measurementUrl(referrer.current) : "",
          });
          last.current.analytics = page;
          referrer.current = page;
        }
        if (!hasConsent("marketing")) last.current.marketing = null;
        else if (last.current.marketing !== page && window.fbq) {
          window.fbq("track", "PageView");
          last.current.marketing = page;
        }
      });
    };
    track();
    window.addEventListener(CONSENT_EVENT, track);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(CONSENT_EVENT, track);
    };
  }, [pathname, search]);
  return null;
}

function getCookie(name) {
  return document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

export async function trackLeadEvent({ email, phone, params = {} } = {}) {
  const eventId = crypto.randomUUID();
  // Solo viajan etiquetas fijas escritas en el codigo: los datos libres que
  // escribe el visitante (rubro, mensaje) no se usan como dimensiones.
  const eventParams = { content_name: params.content_name || "Consulta de proyecto", source: params.source || "website" };
  if (hasConsent("analytics")) window.gtag?.("event", "generate_lead", { ...eventParams, event_id: eventId });
  if (!hasConsent("marketing")) return eventId;
  window.fbq?.("track", "Lead", eventParams, { eventID: eventId });
  try {
    await fetch(CAPI_WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ event_name: "Lead", event_id: eventId, email, phone, source_url: measurementUrl(), fbc: getCookie("_fbc"), fbp: getCookie("_fbp") }),
    });
  } catch { /* La atribución publicitaria no bloquea el envío de la consulta. */ }
  return eventId;
}

export function trackAction(name, params = {}) {
  if (typeof window === "undefined") return;
  if (hasConsent("analytics")) window.gtag?.("event", name, params);
  if (hasConsent("marketing")) window.fbq?.("trackCustom", name, params);
}
