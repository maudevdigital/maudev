// Página /ahora — "build in public". Actualiza este archivo cada mes (o cuando
// cambie algo): es la prueba de que maudev está activo y con agenda real.
// ⚠️ Todo lo que aparezca aquí debe ser verdad. Mejor pocas entradas reales
// que muchas infladas.

import { t } from "@/lib/i18n";

// Última actualización (se muestra en la página).
export const lastUpdated = "2026-06-10";

// status: "building" | "shipped" | "writing" | "open"
export const nowItems = [
  {
    status: "building",
    title: t("Mejoras en SystemePro", "Improvements to SystemePro"),
    desc: t(
      "Nuevas automatizaciones de seguimiento de leads y métricas de conversión en el dashboard.",
      "New lead follow-up automations and conversion metrics in the dashboard."
    ),
  },
  {
    status: "shipped",
    title: t("Herramientas públicas en maudev.cl", "Public tools on maudev.cl"),
    desc: t(
      "Lanzamos el diagnóstico web automático y el cotizador interactivo, gratis para cualquier negocio.",
      "We launched the automatic website audit and the interactive estimator, free for any business."
    ),
  },
  {
    status: "writing",
    title: t("Contenido SEO del blog", "SEO blog content"),
    desc: t(
      "Publicando guías prácticas para PYMEs: costos reales, automatización y pagos online en Chile.",
      "Publishing practical guides for SMBs: real costs, automation and online payments in Chile."
    ),
  },
  {
    status: "open",
    title: t("Agenda de proyectos", "Project schedule"),
    desc: t(
      "Tomando proyectos nuevos este mes. Los cupos se asignan por orden de llegada del diagnóstico.",
      "Taking new projects this month. Slots are assigned in order of assessment requests."
    ),
  },
];
