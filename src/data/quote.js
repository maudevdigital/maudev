// Las opciones del cotizador.
//
// Viven acá y no dentro de QuickQuote porque /contacto necesita leer la misma
// lista: el cotizador manda la elección en la URL y el formulario la traduce
// de vuelta a texto. Duplicar las etiquetas dejaría al formulario diciendo
// "sitio" donde el panel decía "Sitio web".
//
// Los montos NO se copian acá: salen de pricing.js, que a su vez los lee del
// catálogo. Una segunda tabla de precios es una tabla que se desincroniza.

export const quoteTypes = [
  { id: "landing", label: "Landing", plan: "landing", semanas: "1 a 2", necesidad: "una landing page" },
  { id: "sitio", label: "Sitio web", plan: "sitio", semanas: "3 a 5", necesidad: "un sitio web" },
  { id: "tienda", label: "Tienda online", plan: "ecommerce", semanas: "5 a 8", necesidad: "una tienda online" },
];

// Multiplicadores por tamaño. Son tramos gruesos a propósito: un estimado con
// dos decimales aparentaría una precisión que no existe antes del diagnóstico.
export const quoteSizes = [
  { id: "chico", label: "1 a 3", factor: 1, secciones: "entre 1 y 3 secciones" },
  { id: "medio", label: "4 a 7", factor: 1.35, secciones: "entre 4 y 7 secciones" },
  { id: "grande", label: "8 o más", factor: 1.8, secciones: "8 secciones o más" },
];

/**
 * Traduce los parámetros que deja el cotizador en la URL.
 *
 * Devuelve null si no vienen o si no corresponden a una opción real: la URL la
 * escribe cualquiera, así que nada de lo que llega por ahí se muestra tal cual
 * ni se guarda en el lead. Solo se aceptan los ids del catálogo.
 */
export function readQuoteIntent(params) {
  const tipo = quoteTypes.find((item) => item.id === params.get("tipo"));
  const tamano = quoteSizes.find((item) => item.id === params.get("tamano"));
  if (!tipo && !tamano) return null;
  return { tipo: tipo || null, tamano: tamano || null };
}

/** Frase de arranque para el formulario, con lo que el visitante ya eligió. */
export function describeQuoteIntent(intent) {
  if (!intent?.tipo) return "";
  const partes = [`Necesito ${intent.tipo.necesidad}`];
  if (intent.tamano) partes.push(`de ${intent.tamano.secciones}`);
  return `${partes.join(" ")}. `;
}
