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

const CLP = (value) => `$${value.toLocaleString("es-CL")}`;

export const pricing = {
  landing: {
    id: "landing",
    label: "Landing page",
    from: 390000,
    unit: "proyecto",
    summary: "Una propuesta y una acción, para campañas o para validar una idea.",
  },
  sitio: {
    id: "sitio",
    label: "Sitio corporativo",
    from: 550000,
    unit: "proyecto",
    summary: "Varias páginas de servicio, con la arquitectura y el texto que las sostienen.",
  },
  ecommerce: {
    id: "ecommerce",
    label: "Tienda online",
    from: 990000,
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

/** "$35.000/mes" o "$390.000" según sea recurrente. */
export const priceLabel = (key) => {
  const item = pricing[key];
  return item.unit === "mes" ? `${CLP(item.from)}/mes` : CLP(item.from);
};

export const webPlans = [pricing.landing, pricing.sitio, pricing.ecommerce];
