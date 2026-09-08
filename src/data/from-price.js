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
