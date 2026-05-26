import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Dispara PageView de Meta Pixel en cada cambio de ruta (SPA).
// El primer PageView lo dispara el snippet en index.html, así que omitimos el inicial.
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

export function trackEvent(name, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", name, params);
  else window.fbq("track", name);
}
