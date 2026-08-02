// Precios en un solo lugar.
//
// Antes vivían repetidos en la FAQ de la portada, en la página de precios y en
// el cotizador: cambiar uno y olvidar los otros deja al sitio contradiciéndose
// justo en el dato que decide la compra. Todo lo que muestre un precio importa
// desde acá.
//
// Son montos "desde": el piso de un alcance típico, no una tarifa cerrada. El
// precio final se fija por escrito después del diagnóstico, y eso debe decirse
// en la misma pantalla donde aparece la cifra.
//
// Los montos INCLUYEN el IVA de 19%. Se publica el total y no el neto porque el
// visitante compara contra lo que va a pagar: mostrar el neto y sumar el
// impuesto al final es la sorpresa que hace abandonar una cotización.

import { BASE, formatFrom } from "@/data/currencies";

const CLP = (value) => `$${value.toLocaleString("es-CL")}`;

export const pricing = {
  landing: {
    id: "landing",
    label: "Landing page",
    from: 100000,
    unit: "proyecto",
    summary: "Una propuesta y una acción, para campañas o para validar una idea.",
  },
  sitio: {
    id: "sitio",
    label: "Sitio corporativo",
    from: 250000,
    unit: "proyecto",
    summary: "Varias páginas de servicio, con la arquitectura y el texto que las sostienen.",
  },
  ecommerce: {
    id: "ecommerce",
    label: "Tienda online",
    from: 1250000,
    unit: "proyecto",
    summary: "Catálogo, pagos, despacho e inventario funcionando de punta a punta.",
  },
  mantencion: {
    id: "mantencion",
    label: "Plan de mantención",
    from: 35000,
    unit: "mes",
    summary: "Respaldos, actualizaciones, monitoreo y cambios menores todos los meses.",
  },
};

/** "$390.000" — para mostrar junto a la palabra "desde". */
export const priceFrom = (key) => CLP(pricing[key].from);

/**
 * Precio en la moneda pedida, con el sufijo "/mes" si es recurrente.
 *
 * El monto base siempre es CLP: es la moneda en que se define y se cobra. Las
 * demás pasan por formatFrom, que antepone "≈" y redondea, porque son una
 * referencia y no un precio cerrado en esa moneda.
 */
export const priceIn = (key, code = BASE) => {
  const item = pricing[key];
  const monto = formatFrom(item.from, code);
  return item.unit === "mes" ? `${monto}/mes` : monto;
};

/** Atajo en pesos, para textos que no dependen del selector. */
export const priceLabel = (key) => priceIn(key, BASE);

export const IVA_RATE = 0.19;
export const IVA_NOTA = "IVA incluido";

/** Neto y IVA de un monto que ya viene con impuesto incluido. */
export const desglosarIva = (total) => {
  const neto = Math.round(total / (1 + IVA_RATE));
  return { neto, iva: total - neto };
};

export const webPlans = [pricing.landing, pricing.sitio, pricing.ecommerce];
