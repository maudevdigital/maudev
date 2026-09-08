// Carga independiente por finalidad. No se crean colas de eventos antes de aceptar.
export const GA_ID = "G-98P5BBFLQM";
export const PIXEL_ID = "3002561230082800";
let googleInitialized = false;
let metaInitialized = false;

function inject(id, src) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  script.onerror = () => script.remove();
  document.head.appendChild(script);
}

function clearCookies(pattern) {
  const host = location.hostname.split(".");
  const domains = ["", ...host.map((_, i) => host.slice(i).join(".")).filter(domain => domain.includes("."))];
  const segments = location.pathname.split("/");
  const paths = new Set(["/", ...segments.map((_, i) => segments.slice(0, i + 1).join("/")).filter(Boolean)]);
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    if (!pattern.test(name)) return;
    for (const domain of domains) for (const cookiePath of paths) {
      document.cookie = `${name}=; Max-Age=0; path=${cookiePath}${domain ? `; domain=${domain}` : ""}`;
    }
  });
}

export function applyAnalyticsConsent({ analytics = false, marketing = false } = {}) {
  window[`ga-disable-${GA_ID}`] = !analytics;
  if (analytics && !googleInitialized) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    googleInitialized = true;
  }
  if (googleInitialized) {
    if (!analytics) {
      // Evita que una descarga todavía pendiente reproduzca eventos tras revocar.
      for (let i = window.dataLayer.length - 1; i >= 0; i--) {
        if (window.dataLayer[i]?.[0] === "event") window.dataLayer.splice(i, 1);
      }
    }
    window.gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      // No hay integración con Google Ads; publicidad corresponde a Meta.
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    });
    if (analytics && !document.getElementById("maudev-ga")) {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
      inject("maudev-ga", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    }
  }
  if (!analytics) clearCookies(/^_ga(?:_|$)|^_gid$|^_gat/);

  if (marketing && !metaInitialized) {
    const fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = window._fbq = fbq;
    fbq("consent", "revoke");
    fbq("init", PIXEL_ID);
    metaInitialized = true;
  }
  if (metaInitialized) {
    if (!marketing && window.fbq.queue) {
      window.fbq.queue = window.fbq.queue.filter(args => !["track", "trackCustom", "trackSingle", "trackSingleCustom"].includes(args[0]));
    }
    window.fbq("consent", marketing ? "grant" : "revoke");
    if (marketing) inject("maudev-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  }
  if (!marketing) clearCookies(/^_fb[cp]$/);
}
