// i18n ligero sin dependencias. Detecta el idioma del dispositivo UNA vez
// (navigator.language). Si el dispositivo está en inglés → "en"; si no → "es".
// No hay selector manual: el idioma se fija según el sistema del usuario.

function detectLang() {
  try {
    const nav = typeof navigator !== "undefined" ? navigator : null;
    const raw = (nav && (nav.language || (nav.languages && nav.languages[0]))) || "es";
    return String(raw).toLowerCase().startsWith("en") ? "en" : "es";
  } catch {
    return "es";
  }
}

export const lang = detectLang();
export const isEN = lang === "en";

// Helper: t("texto en español", "text in english"). Si falta el inglés, usa el español.
export const t = (es, en) => (lang === "en" ? (en ?? es) : es);

// Selecciona el campo correcto de un objeto de datos: pick(obj, "title") usa
// obj.title_en cuando el idioma es inglés y existe; si no, obj.title.
export const pick = (obj, key) => {
  if (!obj) return undefined;
  if (lang === "en" && obj[`${key}_en`] != null) return obj[`${key}_en`];
  return obj[key];
};

if (typeof document !== "undefined") {
  document.documentElement.lang = lang;
}
