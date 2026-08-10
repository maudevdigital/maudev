// Monedas del selector.
//
// El precio se define y se cobra en pesos chilenos: CLP es la fuente de verdad
// y las demás son una CONVERSIÓN DE REFERENCIA para que alguien de fuera de
// Chile entienda el orden de magnitud sin abrir el conversor. Por eso las no
// chilenas se muestran con "≈" y redondeadas: dar un decimal exacto sugeriría
// un precio cerrado en esa moneda, que no lo es.
//
// Las tasas se traen de open.er-api.com (gratuita, sin API key, actualizada a
// diario) y se guardan en localStorage por 12 horas. Los valores de abajo son
// el respaldo: se usan mientras llega la respuesta y si la petición falla, para
// que el precio nunca aparezca en blanco ni bloquee el render.
//
// La petición sale después del primer pintado y solo cuando el visitante elige
// una moneda distinta de CLP; quien navega en pesos —la mayoría— no paga esa
// red. Respaldo revisado el 31-07-2026.
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
const KEY_TASAS = "maudev_tasas_v1";
const VIGENCIA_MS = 12 * 60 * 60 * 1000;
const ENDPOINT = "https://open.er-api.com/v6/latest/CLP";

// Tasas vivas en memoria. Parten en las de respaldo y se reemplazan cuando
// llega la respuesta de la API.
let tasas = Object.fromEntries(currencyList.map((c) => [c.code, c.perCLP]));
let cargando = null;

export function getRate(code) {
  return tasas[code] ?? currencies[code]?.perCLP ?? 1;
}

function guardar(datos) {
  try {
    localStorage.setItem(KEY_TASAS, JSON.stringify({ t: Date.now(), datos }));
  } catch { /* almacenamiento bloqueado */ }
}

function leerCache() {
  try {
    const crudo = localStorage.getItem(KEY_TASAS);
    if (!crudo) return null;
    const guardado = JSON.parse(crudo);
    if (Date.now() - guardado.t > VIGENCIA_MS) return null;
    return guardado.datos;
  } catch {
    return null;
  }
}

/**
 * Actualiza las tasas desde la API. Resuelve cuando hay tasas utilizables
 * —de caché, de red o de respaldo—, así que quien la espera nunca queda
 * colgado si la API está caída.
 */
export function refreshRates() {
  if (cargando) return cargando;

  const cache = leerCache();
  if (cache) {
    tasas = { ...tasas, ...cache };
    return Promise.resolve(tasas);
  }

  cargando = fetch(ENDPOINT)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json) => {
      if (json?.result !== "success" || !json.rates) throw new Error("respuesta inesperada");
      const nuevas = {};
      for (const c of currencyList) {
        const valor = c.code === BASE ? 1 : json.rates[c.code];
        if (typeof valor === "number" && valor > 0) nuevas[c.code] = valor;
      }
      tasas = { ...tasas, ...nuevas };
      guardar(nuevas);
      return tasas;
    })
    .catch(() => tasas) // se sigue con el respaldo: mejor aproximado que vacío
    .finally(() => { cargando = null; });

  return cargando;
}

/** Fecha de la última actualización guardada, o null si solo hay respaldo. */
export function ratesUpdatedAt() {
  try {
    const crudo = localStorage.getItem(KEY_TASAS);
    return crudo ? new Date(JSON.parse(crudo).t) : null;
  } catch {
    return null;
  }
}

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
  const convertido = redondear(clp * getRate(moneda.code));
  return `≈ ${moneda.symbol}${convertido.toLocaleString("es-CL")}`;
}
