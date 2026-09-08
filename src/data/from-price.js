// El precio "desde" de un servicio, derivado del catálogo.
//
// Lo leen pricing.js (todo lo que muestra un precio en pantalla) y seo.js (los
// metadatos, que además se generan desde Node en scripts/prerender-meta.mjs).
// Vivía duplicado en ambos, que es justo lo que pricing.js existe para evitar:
// el sitio anunciando en Google una cifra que su propia página ya no cobra.
//
// Por eso este archivo NO usa el alias "@/": el prerender lo importa por ruta
// relativa y Node no resuelve alias. Sus dependencias tampoco pueden usarlo.
//
// Se toma el primer precio REAL y no `precios[0]`: los servicios sin nivel de
// entrada tienen null en esa posición y anuncian el siguiente. Leerla a secas
// devolvía null y habría publicado "$null" el día que uno de ellos entrara a
// la tabla de precios.
import { subservicios } from "./subservices.js";

export function desdePrecio(id) {
  const servicio = subservicios.find((item) => item.id === id);
  if (!servicio) throw new Error(`No existe el servicio "${id}" en el catálogo.`);
  const precio = servicio.precios?.find((valor) => typeof valor === "number");
  if (precio === undefined) throw new Error(`El servicio "${id}" no tiene ningún precio numérico.`);
  return precio;
}

export const formatCLP = (valor) => `$${valor.toLocaleString("es-CL")}`;

/** "$100.000" — el piso publicable de un servicio, para ir junto a "desde". */
export const desdeCLP = (id) => formatCLP(desdePrecio(id));

/**
 * Desde cuánto un servicio necesita un caso publicado para mostrar su precio.
 *
 * Bajo este monto la cifra no pide prueba: nadie necesita ver un caso para
 * creer que se puede hacer un logo de $90.000, y ahí el precio funciona al
 * revés —atrae al que busca "cuánto cuesta" y ya viene decidido—.
 */
export const UMBRAL_PRECIO_CON_PRUEBA = 390000;

/**
 * Si un servicio publica su precio en la vitrina.
 *
 * La regla es "sin caso, sin precio" pero solo desde cierto ticket. Un "desde
 * $1.490.000" para una app nativa sin una sola app que mostrar no convence a
 * quien evalúa esa cifra, y sí atrae consultas que se caen en la primera
 * respuesta. A $90.000 ese problema no existe.
 *
 * Se DERIVA del caso y del catálogo, y no es una bandera aparte a propósito: el
 * día que un servicio publique el suyo, su precio reaparece solo, y nadie puede
 * saltarse la regla por olvido. La política entera es esta función, así que
 * moverla —cambiar el umbral, o exigir caso a todos— es un cambio de una línea.
 */
export function publicaPrecio(id) {
  const servicio = subservicios.find((item) => item.id === id);
  if (!servicio) return false;
  if (servicio.caso) return true;
  return desdePrecio(id) < UMBRAL_PRECIO_CON_PRUEBA;
}

/** Lo que va donde iría la cifra cuando el servicio no publica precio. */
export const PRECIO_A_CONVENIR = "A convenir";
