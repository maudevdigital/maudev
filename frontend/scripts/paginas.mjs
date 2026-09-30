import { capacidades } from "../../shared/oferta.js";
import { readFileSync } from "node:fs";
import { projects } from "../src/data/projects.js";

// Fuente unica de las rutas del sitio.
//
// Por que existe este archivo: la lista vivia copiada en tres lugares
// —`public/sitemap.xml` a mano, el array de `validate-site.mjs` y este de
// `prerender-meta.mjs`— y se desincronizaron. El caso de estudio de Rifa Clara
// se publico el 15 de septiembre: existe en `src/data/projects.js`, se
// prerenderizo y responde 200, pero quedo fuera del sitemap y fuera de las
// validaciones, porque esas dos listas habia que acordarse de editarlas a mano.
// Una pagina que no esta en el sitemap y que nada enlaza desde el HTML estatico
// es, para un rastreador, una pagina que no existe.
//
// Todo lo que agregue una ruta —un servicio, un caso, una automatizacion— tiene
// que entrar por aca y nada mas.

// Las guías se publican desde el panel admin; scripts/descargar-guias.mjs deja
// su índice antes del build. Sin archivo, no hay guías (y el build sigue).
let guias = [];
try {
  guias = JSON.parse(readFileSync(new URL("../src/data/guias-indice.json", import.meta.url), "utf8"));
} catch { /* sin guías descargadas */ }

export const paginas = [
  ...Object.values(capacidades).map((c) => ({
    route: c.path,
    title: c.seo.title,
    description: c.seo.description,
  })),
  {
    route: "/casos",
    title: "Portafolio · Sitios web y sistemas que hicimos en Chile · Maudev",
    description: "Sitios web y sistemas que construimos, explicados por el problema que resolvían y lo que cambió después.",
  },
  {
    route: "/nosotros",
    title: "Sobre Maudev · Desarrollo web en Chile con trato directo · Maudev",
    description: "Cómo trabaja Maudev: desarrollo web con comunicación directa, precio cerrado por escrito y los accesos siempre a tu nombre.",
  },
  {
    route: "/contacto",
    title: "Contacto · Cotiza tu sitio web · Maudev",
    description: "Cuéntanos qué vendes y a quién. Te decimos qué tipo de sitio necesitas, cuánto costaría y en cuánto tiempo estaría publicado.",
  },
  {
    route: "/terminos",
    title: "Términos y condiciones · Maudev",
    description: "Cómo se cotiza, cómo se paga, qué pasa si te arrepientes y de quién queda el código.",
  },
  {
    route: "/privacidad",
    title: "Política de privacidad · Maudev",
    description: "Qué datos pedimos, para qué los usamos, con quién se comparten y cómo pedir que los eliminemos.",
  },
  {
    route: "/eliminacion-datos",
    title: "Eliminación de datos · Maudev",
    description: "Cómo solicitar la eliminación de tus datos personales.",
  },
  {
    route: "/ley-21719/revisor-cookies",
    title: "Revisor de cookies gratis para la Ley 21.719 · Maudev",
    description: "Revisa gratis qué cookies, píxeles y terceros carga tu sitio antes del consentimiento, y qué corregir para la Ley 21.719. Sin registro.",
  },
  {
    route: "/guias",
    title: "Guías sobre la Ley 21.719 y tecnología para empresas · Maudev",
    description: "Guías prácticas sobre la Ley 21.719 de datos personales: prórroga, cookies, formularios y derechos ARCOP, escritas desde la implementación técnica.",
  },
  ...guias.map((g) => ({
    route: `/guias/${g.slug}`,
    title: `${g.titulo} · Maudev`,
    description: g.descripcion,
    lastmod: g.actualizado_el,
  })),
  ...projects.map((project) => ({
    route: `/casos/${project.id}`,
    title: `${project.title} · Caso de estudio · Maudev`,
    description: project.tagline,
    image: project.image,
  })),
];

/** Solo los paths, incluida la portada, que no pasa por el bucle de prerender. */
export const rutas = ["/", ...paginas.map((pagina) => pagina.route)];

/** Las que se le declaran a Google. Ver `sitemap: false` mas arriba. */
export const rutasIndexables = ["/", ...paginas.filter((pagina) => pagina.sitemap !== false).map((pagina) => pagina.route)];
