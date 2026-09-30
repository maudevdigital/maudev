// Metadatos de la portada.
//
// Viven fuera de Landing.jsx porque scripts/prerender-meta.mjs los escribe
// también en el HTML estático: sin eso, el rastreador leía en el archivo una
// descripción y en la página ejecutada otra distinta.
//
// Los precios se leen de la oferta, nunca se escriben a mano: esa cifra es la que
// Google muestra en el resultado de búsqueda.
import { capacidades, clp } from "../../../shared/oferta.js";

const ley = capacidades["ley-21719"].planes[0].precio;
const ia = capacidades.ia.planes[0].precio;

export const homeSeo = {
  title: "Ley 21.719, IA aplicada y desarrollo web en Chile · Maudev",
  description: `Adecuamos tu empresa a la Ley 21.719 desde ${clp(ley)}, probamos IA con tus datos desde ${clp(ia)} y desarrollamos sitios y sistemas a medida. Precios publicados, más IVA.`,
};
