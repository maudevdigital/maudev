// Maudev tiene una propuesta comercial enfocada en Chile. Mantener un solo
// idioma evita mezclar copy, metadatos y monedas según la configuración del
// dispositivo. `t` se conserva como compatibilidad para las páginas antiguas,
// pero siempre entrega la versión en español.
export const lang = "es-CL";
export const t = (es) => es;

if (typeof document !== "undefined") document.documentElement.lang = lang;
