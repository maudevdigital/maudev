import fs from "node:fs/promises";
import path from "node:path";
import { services } from "../src/data/services.js";
import { projects } from "../src/data/projects.js";

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
    title: "Casos de automatización, software y desarrollo web · Maudev",
    description: "Proyectos reales de Maudev explicados por su problema, la solución construida y el beneficio operativo.",
  },
  {
    route: "/nosotros",
    title: "Nosotros · Maudev",
    description: "Conoce cómo trabaja Maudev: automatización y software con comunicación directa, alcance definido y propiedad para el cliente.",
  },
  {
    route: "/contacto",
    title: "Contacto · Cuéntanos qué quieres automatizar · Maudev",
    description: "Describe el proceso que quieres automatizar. Te diremos si es viable, qué necesitaríamos y cómo podría implementarse.",
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

  const directory = path.join(dist, page.route.replace(/^\//, ""));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "index.html"), html);
}

console.log(`Metadatos estáticos generados para ${pages.length} rutas.`);
