import { services } from "../src/data/services.js";
import { projects } from "../src/data/projects.js";
import { subservicios } from "../src/data/subservices.js";
import { AUTOMATIONS } from "../src/data/automations.js";
import { EN, PT } from "../src/data/i18n.js";

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

export const paginas = [
  ...Object.values(services).map((service) => ({
    route: service.path,
    title: service.metaTitle,
    description: service.metaDescription,
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
    alternates: { "es-CL": "/contacto", en: "/en/contact", "pt-BR": "/pt/contato" },
    title: "Contacto · Cotiza tu sitio web · Maudev",
    description: "Cuéntanos qué vendes y a quién. Te decimos qué tipo de sitio necesitas, cuánto costaría y en cuánto tiempo estaría publicado.",
  },
  {
    route: "/precios",
    title: "Precios de páginas web, software y diseño en Chile · Maudev",
    description: "Los precios de los diecinueve servicios, publicados. Página web desde $290.000, tienda online, apps, sistemas y marca, cada uno en tres alcances.",
  },
  // El título y la descripción propios de cada servicio mandan sobre el genérico:
  // se escribieron uno por uno para su búsqueda, y sin esto el HTML estático
  // —que es lo que ve un rastreador antes de ejecutar JavaScript y lo único que
  // leen las vistas previas de WhatsApp o LinkedIn— seguía mostrando la fórmula.
  ...subservicios.map((servicio) => ({
    route: servicio.path,
    title: servicio.metaTitle || `${servicio.nombre} en Chile · Precio y qué incluye · Maudev`,
    description:
      servicio.metaDescription ||
      `${servicio.resumen} Precio por escrito antes de empezar y accesos a tu nombre.`,
  })),
  // Estas vivían solo del lado del cliente y en producción devolvían 404: sin
  // archivo generado, Cloudflare Pages no tiene qué servir, y no hay regla de
  // respaldo hacia index.html a propósito —esa regla convierte cualquier URL
  // inventada en un 200 con la aplicación vacía, que es un soft 404—. El pie de
  // página enlaza términos y privacidad, así que estaban rotas a la vista.
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
  // Las dos direcciones sirven la MISMA pagina de enlaces (la de la bio de
  // Instagram). Se prerenderizan porque tienen que responder 200, pero quedan
  // fuera del sitemap: pedirle a Google que indexe dos URLs identicas es
  // ofrecerle contenido duplicado, y ninguna de las dos existe para posicionar.
  { route: "/ig", title: "Maudev · Enlaces", description: "Todo lo de Maudev en un solo lugar.", sitemap: false },
  { route: "/links", title: "Maudev · Enlaces", description: "Todo lo de Maudev en un solo lugar.", sitemap: false },
  ...AUTOMATIONS.map((auto) => ({
    route: `/automatizaciones/${auto.slug}`,
    title: `${auto.title || auto.name} · Automatización · Maudev`,
    description: auto.summary || auto.tagline || "Automatización lista para implementar en tu negocio.",
  })),
  // Las versiones en otro idioma necesitan su <html lang> y su hreflang en el
  // HTML estático: es lo que lee el rastreador antes de ejecutar JavaScript, y
  // el motivo por el que el bilingüe anterior terminó mal indexado.
  //
  // Los títulos y descripciones se leen de data/i18n.js, que es de donde
  // también los toma la app. Estaban copiados a mano acá y ya se habían
  // desincronizado: el archivo estático prometía una cosa y React montaba otra
  // —la de i18n incluía un "From USD 120" que además no coincidía con el
  // catálogo—. Es el mismo motivo por el que existe data/seo.js.
  {
    route: "/en",
    alternates: { "es-CL": "/", "en": "/en", "pt-BR": "/pt" },
    lang: "en",
    ...EN.meta,
  },
  {
    route: "/en/contact",
    alternates: { "es-CL": "/contacto", "en": "/en/contact", "pt-BR": "/pt/contato" },
    lang: "en",
    ...EN.metaContacto,
  },
  {
    route: "/pt",
    alternates: { "es-CL": "/", "en": "/en", "pt-BR": "/pt" },
    lang: "pt-BR",
    ...PT.meta,
  },
  {
    route: "/pt/contato",
    alternates: { "es-CL": "/contacto", "en": "/en/contact", "pt-BR": "/pt/contato" },
    lang: "pt-BR",
    ...PT.metaContacto,
  },
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
