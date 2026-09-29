const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const SESSION_KEY = "maudev_attribution";

// Al cargar la página, si hay UTMs en la URL los persiste en sessionStorage.
// Así no se pierden cuando el usuario navega por la SPA antes de convertir.
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    const hasUtms = UTM_KEYS.some((k) => params.get(k));
    if (hasUtms) {
      const data = UTM_KEYS.reduce(
        (acc, key) => {
          const value = params.get(key);
          if (value) acc[key] = value.slice(0, 120);
          return acc;
        },
        { page_path: window.location.pathname }
      );
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }
  } catch {
    // sessionStorage no disponible (modo privado extremo, etc.)
  }
}

export const getLeadAttribution = () => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback a URL
  }
  const params = new URLSearchParams(window.location.search);
  return UTM_KEYS.reduce(
    (acc, key) => {
      const value = params.get(key);
      if (value) acc[key] = value.slice(0, 120);
      return acc;
    },
    { page_path: window.location.pathname }
  );
};
