import fs from "node:fs/promises";
import path from "node:path";
import { services } from "../src/data/services.js";
import { projects } from "../src/data/projects.js";
import { subservicios } from "../src/data/subservices.js";
import { AUTOMATIONS } from "../src/data/automations.js";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const origin = "https://maudev.cl";

const pages = [
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
  { route: "/ig", title: "Maudev · Enlaces", description: "Todo lo de Maudev en un solo lugar." },
  { route: "/links", title: "Maudev · Enlaces", description: "Todo lo de Maudev en un solo lugar." },
  ...AUTOMATIONS.map((auto) => ({
    route: `/automatizaciones/${auto.slug}`,
    title: `${auto.title || auto.name} · Automatización · Maudev`,
    description: auto.summary || auto.tagline || "Automatización lista para implementar en tu negocio.",
  })),
  // Las versiones en otro idioma necesitan su <html lang> y su hreflang en el
  // HTML estático: es lo que lee el rastreador antes de ejecutar JavaScript, y
  // el motivo por el que el bilingüe anterior terminó mal indexado.
  {
    route: "/en",
    alternates: { "es-CL": "/", "en": "/en", "pt-BR": "/pt" },
    lang: "en",
    title: "Web development for companies in Latin America · Maudev",
    description: "Websites, online stores and custom software, built in Chile for companies across the Americas. Fixed price agreed in writing before we start.",
  },
  {
    route: "/en/contact",
    alternates: { "es-CL": "/contacto", "en": "/en/contact", "pt-BR": "/pt/contato" },
    lang: "en",
    title: "Contact · Get a quote for your web project · Maudev",
    description: "Tell us what you sell and to whom. We reply the same business day with what you need, what it would cost and how long it would take.",
  },
  {
    route: "/pt",
    alternates: { "es-CL": "/", "en": "/en", "pt-BR": "/pt" },
    lang: "pt-BR",
    title: "Desenvolvimento web para empresas na América Latina · Maudev",
    description: "Sites, lojas online e software sob medida, feitos no Chile para empresas de toda a América. Preço fechado por escrito antes de começar.",
  },
  {
    route: "/pt/contato",
    alternates: { "es-CL": "/contacto", "en": "/en/contact", "pt-BR": "/pt/contato" },
    lang: "pt-BR",
    title: "Contato · Orçamento para o seu projeto web · Maudev",
    description: "Conte o que você vende e para quem. Respondemos no mesmo dia útil com o que precisa, quanto custaria e em quanto tempo estaria no ar.",
  },
  ...projects.map((project) => ({
    route: `/casos/${project.id}`,
    title: `${project.title} · Caso de estudio · Maudev`,
    description: project.tagline,
    image: project.image,
  })),
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const replaceMeta = (html, attribute, key, value) => {
  const expression = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`, "i");
  return html.replace(expression, `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`);
};

for (const page of pages) {
  const canonical = `${origin}${page.route}`;
  const image = page.image ? `${origin}${page.image}` : `${origin}/og-image.png`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceMeta(html, "name", "description", page.description);
  html = replaceMeta(html, "property", "og:title", page.title);
  html = replaceMeta(html, "property", "og:description", page.description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "name", "twitter:title", page.title);
  html = replaceMeta(html, "name", "twitter:description", page.description);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);

  // Idioma e hreflang en el HTML estático. `useSeo` los pone también al montar,
  // pero eso ocurre DESPUÉS de ejecutar JavaScript: un rastreador que mire la
  // primera respuesta vería una página en inglés declarada como es-CL. Es el
  // mismo error que dejó mal indexada la versión bilingüe anterior.
  if (page.lang) {
    html = html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${page.lang}"`);
  }
  if (page.alternates) {
    const enlaces = [
      ...Object.entries(page.alternates).map(([hreflang, ruta]) => `<link rel="alternate" hreflang="${hreflang}" href="${origin}${ruta}" />`),
      `<link rel="alternate" hreflang="x-default" href="${origin}${page.alternates["es-CL"]}" />`,
    ].join("\n    ");
    html = html.replace("</head>", `  ${enlaces}\n  </head>`);
  }

  // Se escribe `ruta.html` y NO `ruta/index.html`. Con la forma de directorio,
  // Cloudflare Pages sirve la URL con barra final y responde 308 a la versión
  // sin barra — que es justo la que declaran el sitemap y el canonical. Eso
  // dejaba cada página de servicio como "URL con redirección" en Search
  // Console. Con el archivo plano, /automatizacion responde 200 y la barra
  // final es la que redirige.
  const file = path.join(dist, `${page.route.replace(/^\//, "")}.html`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

// La portada en español no pasa por el bucle —es la plantilla— y también tiene
// que declarar sus alternativas. Un grupo de hreflang en el que una página no
// devuelve el apunte queda descartado entero por Google, así que sin esto las
// versiones en inglés y portugués no servirían de nada.
const portadaAlternates = [
  `<link rel="alternate" hreflang="es-CL" href="${origin}/" />`,
  `<link rel="alternate" hreflang="en" href="${origin}/en" />`,
  `<link rel="alternate" hreflang="pt-BR" href="${origin}/pt" />`,
  `<link rel="alternate" hreflang="x-default" href="${origin}/" />`,
].join("\n    ");
const indexPath = path.join(dist, "index.html");
const indexHtml = await fs.readFile(indexPath, "utf8");
await fs.writeFile(indexPath, indexHtml.replace("</head>", `  ${portadaAlternates}\n  </head>`));

console.log(`Metadatos estáticos generados para ${pages.length} rutas.`);
