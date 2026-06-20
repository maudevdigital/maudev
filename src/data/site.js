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
  photo: "/founder.jpg",
  // Deja en null los que no quieras mostrar (se ocultan automáticamente).
  github: null, // ej: "https://github.com/maudev"
  linkedin: null, // ej: "https://www.linkedin.com/in/lucasmaulen"
};

// ─── Disponibilidad ─────────────────────────────────────────────────────────
// Actualiza esto cada mes. Si open=false, el badge y el widget cambian a
// "Agenda abierta para <nextMonth>". Nada de escasez inventada: lo que diga
// aquí debe ser verdad.
export const availability = {
  open: true,
  label: t("Disponible para nuevos proyectos", "Available for new projects"),
  period: t("Junio 2026", "June 2026"),
};

// ─── CTA principal ──────────────────────────────────────────────────────────
// Un solo verbo en todo el sitio. Si lo cambias aquí, cambia en todas partes.
export const CTA_LABEL = t("Pedir diagnóstico gratis", "Get a free assessment");

// ─── Claims verificables ────────────────────────────────────────────────────
// Solo afirmaciones que se pueden comprobar haciendo clic o leyendo el contrato.
export const proofPoints = [
  t("3 plataformas en producción", "3 platforms in production"),
  t("Precio fijo por escrito", "Fixed price in writing"),
  t("Código 100% tuyo", "Code 100% yours"),
];
