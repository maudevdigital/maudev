// Configuración central del sitio: identidad, disponibilidad y CTA.
// Un solo lugar para editar lo que se repite en navbar, hero, footer, etc.

import { t } from "@/lib/i18n";

// ─── Fundador ───────────────────────────────────────────────────────────────
// ⚠️ VERIFICAR: nombre derivado del email del repositorio. Ajusta si no es exacto.
// La foto va en /public/founder.jpg (cuadrada, mín. 400x400). Mientras no exista,
// se muestra un placeholder con iniciales.
export const founder = {
  name: "Lucas Maulén",
  firstName: "Lucas",
  role: t("Ingeniero Civil Informático · Fundador de maudev", "Computer Science Engineer · Founder of maudev"),
  // `photo` se quitó: apuntaba a /founder.jpg, que no existe y no se renderiza
  // en ningún <img>. Si algún día quieres mostrar tu foto, agrégala a
  // /public/founder.jpg y vuelve a declarar el campo acá.
  // Deja en null los que no quieras mostrar (se ocultan automáticamente).
  github: null, // ej: "https://github.com/maudev"
  linkedin: null, // ej: "https://www.linkedin.com/in/lucasmaulen"
};

// ─── Disponibilidad ─────────────────────────────────────────────────────────
// El período es DINÁMICO: siempre muestra el mes en curso (se actualiza solo
// al cambiar de mes). Solo toca `open` si dejas de aceptar proyectos.
// Nada de escasez inventada: lo que diga aquí debe ser verdad.
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const now = new Date();
const currentPeriod = (locale) =>
  cap(now.toLocaleDateString(locale, { month: "long", year: "numeric" }).replace(" de ", " ")); // "julio de 2026" → "Julio 2026"
export const availability = {
  open: true,
  label: t("Disponible para nuevos proyectos", "Available for new projects"),
  period: t(currentPeriod("es-CL"), currentPeriod("en-US")),
};

// ─── CTA principal ──────────────────────────────────────────────────────────
// UNA sola acción en todo el sitio: escribir por WhatsApp.
// Razón: el público es PYME chilena, que ya vive en WhatsApp. Cero fricción,
// cero formularios que abandonar, y el propio bot calificador atiende del otro
// lado (el producto vendiéndose a sí mismo).
// Si cambias el texto aquí, cambia en navbar, hero, secciones y footer.
export const CTA_LABEL = t("Hablemos por WhatsApp", "Message us on WhatsApp");

// Mensaje pre-llenado del CTA principal. Que el cliente no tenga que pensar
// qué escribir es parte de no hacerlo dudar.
export const CTA_MESSAGE = t(
  "Hola Lucas, vengo de maudev.cl y quiero automatizar algo en mi negocio.",
  "Hi Lucas, I came from maudev.cl and I want to automate something in my business."
);

// Etiqueta secundaria: solo para quien prefiere dejar sus datos en vez de
// escribir. Nunca compite visualmente con el CTA principal.
export const CTA_SECONDARY = t("Prefiero que me escriban", "I'd rather be contacted");

// ─── Claims verificables ────────────────────────────────────────────────────
// Solo afirmaciones que se pueden comprobar haciendo clic o leyendo el contrato.
export const proofPoints = [
  t("3 plataformas en producción", "3 platforms in production"),
  t("Precio fijo por escrito", "Fixed price in writing"),
  t("Código 100% tuyo", "Code 100% yours"),
];
