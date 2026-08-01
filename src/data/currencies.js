// Monedas del selector.
//
// El precio se define y se cobra en pesos chilenos: CLP es la fuente de verdad
// y las demás son una CONVERSIÓN DE REFERENCIA para que alguien de fuera de
// Chile entienda el orden de magnitud sin abrir el conversor. Por eso las no
// chilenas se muestran con "≈" y redondeadas: dar un decimal exacto sugeriría
// un precio cerrado en esa moneda, que no lo es.
//
// Las tasas son fijas a propósito. Consultar una API en cada carga agrega una
// dependencia externa al render, un punto de falla y latencia, para un dato
// que solo orienta. Se revisan a mano; si se desactualizan, el "≈" sigue
// siendo honesto.
//
// Última revisión de tasas: 31-07-2026.
export const currencies = {
  CLP: { code: "CLP", country: "CL", symbol: "$", perCLP: 1, decimals: 0 },
  USD: { code: "USD", country: "US", symbol: "US$", perCLP: 0.00106, decimals: 0 },
  EUR: { code: "EUR", country: "EU", symbol: "€", perCLP: 0.00098, decimals: 0 },
  MXN: { code: "MXN", country: "MX", symbol: "MX$", perCLP: 0.0196, decimals: 0 },
  ARS: { code: "ARS", country: "AR", symbol: "AR$", perCLP: 1.52, decimals: 0 },
  PEN: { code: "PEN", country: "PE", symbol: "S/", perCLP: 0.0039, decimals: 0 },
  COP: { code: "COP", country: "CO", symbol: "COL$", perCLP: 4.15, decimals: 0 },
};

export const currencyList = Object.values(currencies);
export const BASE = "CLP";
const KEY = "maudev_moneda_v1";

export function getCurrency() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && currencies[saved]) return saved;
  } catch { /* almacenamiento bloqueado */ }
  return BASE;
}

export function setCurrency(code) {
  try { localStorage.setItem(KEY, code); } catch { /* ignorado */ }
}

// Redondeo "comercial": a la unidad significativa según el tamaño, para que la
// referencia no aparente una precisión que no tiene.
function redondear(valor) {
  if (valor >= 100000) return Math.round(valor / 1000) * 1000;
  if (valor >= 1000) return Math.round(valor / 10) * 10;
  if (valor >= 100) return Math.round(valor / 5) * 5;
  return Math.round(valor);
}

/** Formatea un monto en CLP hacia la moneda pedida. Devuelve string listo. */
export function formatFrom(clp, code = BASE) {
  const moneda = currencies[code] || currencies[BASE];
  if (moneda.code === BASE) {
    return `${moneda.symbol}${clp.toLocaleString("es-CL")}`;
  }
  const convertido = redondear(clp * moneda.perCLP);
  return `≈ ${moneda.symbol}${convertido.toLocaleString("es-CL")}`;
}
