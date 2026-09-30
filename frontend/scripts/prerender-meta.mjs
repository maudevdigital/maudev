import fs from "node:fs/promises";
import path from "node:path";
import { homeSeo } from "../src/data/seo.js";
import { paginas as pages } from "./paginas.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const origin = "https://maudev.cl";

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

// Cascarón del portal de clientes: la plantilla sin prerender y sin indexar.
// Pages sirve /portal con este archivo y functions/portal/[[path]].js lo
// entrega para cualquier /portal/... (sin archivo propio, Pages daría 404).
let portalHtml = template.replace(/<title>[^<]*<\/title>/i, "<title>Portal de clientes · Maudev</title>");
portalHtml = replaceMeta(portalHtml, "name", "robots", "noindex,nofollow");
portalHtml = portalHtml.replace(/<link\s+rel="canonical"[^>]*>\s*/i, "");
await fs.writeFile(path.join(dist, "portal.html"), portalHtml);

const indexPath = path.join(dist, "index.html");
const indexHtml = await fs.readFile(indexPath, "utf8");
let homeHtml = indexHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(homeSeo.title)}</title>`);
homeHtml = replaceMeta(homeHtml, "name", "description", homeSeo.description);
homeHtml = replaceMeta(homeHtml, "property", "og:description", homeSeo.description);
homeHtml = replaceMeta(homeHtml, "name", "twitter:description", homeSeo.description);
await fs.writeFile(indexPath, homeHtml);

console.log(`Metadatos estáticos generados para ${pages.length} rutas.`);
