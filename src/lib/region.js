// ─────────────────────────────────────────────────────────────────────────────
// DETECCIÓN DE REGIÓN — para mostrar el precio y el medio de pago correctos.
//
// ── Por qué NO usamos geolocalización por IP ──
//
// Un servicio tipo ipapi.co obliga a mandar la IP del visitante a un tercero
// ANTES de que acepte cookies. Eso es tratamiento de dato personal sin base de
// licitud (Ley 21.719), habría que declararlo en la política de privacidad y
// firmar un acuerdo de tratamiento. Todo eso para adivinar un país.
//
// La zona horaria del navegador da el mismo resultado sin salir del dispositivo:
// cero red, cero latencia, cero dato personal enviado a nadie. Y es MÁS confiable
// que la IP, porque no la altera una VPN.
//
// ── Regla de diseño ──
// La detección elige el DEFAULT, nunca encierra al usuario. Siempre se puede
// cambiar a mano: un chileno de viaje, alguien pagando con tarjeta extranjera o
// una empresa que factura afuera tienen que poder elegir. Adivinar mal y además
// bloquear = venta perdida.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "maudev_region_v1";

const CL = "CL";
const INTL = "INTL";

const CHILE_TIMEZONES = ["America/Santiago", "Pacific/Easter", "America/Punta_Arenas"];

function detect() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (CHILE_TIMEZONES.includes(tz)) return CL;

    // Respaldo: idioma del dispositivo declarado como Chile (es-CL).
    const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    if (langs.some((l) => String(l).toLowerCase().endsWith("-cl"))) return CL;

    return INTL;
  } catch {
    // Si algo falla, asumimos Chile: es el mercado principal y el que peor lo
    // pasa pagando en dólares. Equivocarse hacia el lado local cuesta menos.
    return CL;
  }
}

/** Región efectiva: preferencia guardada del usuario, o la detectada. */
export function getRegion() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === CL || saved === INTL) return saved;
  } catch { /* almacenamiento bloqueado */ }
  return detect();
}

/**
 * Precio a mostrar según la región, con el otro entre paréntesis como referencia.
 * Devuelve { main, secondary, currency }.
 */
export function priceFor(product, region = getRegion()) {
  const cl = product?.priceCLP;
  const usd = product?.priceUSD;
  if (region === CL) {
    return { main: cl || usd, secondary: cl && usd ? usd : null, currency: "CLP" };
  }
  return { main: usd || cl, secondary: usd && cl ? cl : null, currency: "USD" };
}

/**
 * Medio de pago por defecto según región.
 *
 * Chile → transferencia. Un cliente chileno pagando por Lemon Squeezy recibe un
 * cargo internacional en dólares: su banco le suma comisión, aparece como
 * "LEMSQZY*" en la cartola y muchas tarjetas de débito lo bloquean por defecto.
 * Cuando exista integración con Flow, cambiar este valor a "flow".
 *
 * Fuera de Chile → Lemon Squeezy, que resuelve moneda e impuestos de cada país.
 */
export function defaultPaymentMethod(region = getRegion()) {
  return region === CL ? "transferencia" : "stripe";
}
