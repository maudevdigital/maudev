// Metadatos de la portada.
//
// Viven fuera de Landing.jsx porque scripts/prerender-meta.mjs los escribe
// también en el HTML estático: sin eso, el rastreador leía en el archivo una
// descripción y en la página ejecutada otra distinta.
//
// El precio no se escribe a mano. La descripción anterior anunciaba $390.000
// mientras el catálogo cobraba $100.000, y esa cifra es la que Google muestra
// en el resultado de búsqueda: el visitante llegaba con un precio en la cabeza
// y encontraba otro.
import { desdeCLP } from "./from-price.js";

export const homeSeo = {
  title: "Diseño y desarrollo de páginas web en Chile · Maudev",
  description: `Diseño y desarrollo web para negocios en Chile. Landing desde ${desdeCLP("landing")} y sitio corporativo desde ${desdeCLP("sitio")}, más IVA. Alcance y precio por escrito.`,
};
