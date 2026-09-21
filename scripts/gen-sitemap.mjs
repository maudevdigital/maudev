import fs from "node:fs/promises";
import path from "node:path";
import { rutasIndexables as rutas } from "./paginas.mjs";

// Genera `dist/sitemap.xml` desde la misma fuente que el prerender.
//
// Antes era `public/sitemap.xml`, escrito a mano. Se quedo en 50 URLs con fecha
// del 13 de agosto y sin el caso de Rifa Clara, que ya estaba publicado y
// respondiendo 200: un archivo que hay que acordarse de editar termina mintiendo.
//
// No se escriben <priority> ni <changefreq>: Google los ignora desde hace anos.
// Tampoco <lastmod> con la fecha del build, que cambiaria en las 53 URLs cada
// vez que se despliega cualquier cosa; una fecha que siempre miente hace que
// Google deje de creerle al archivo completo.
const origin = "https://maudev.cl";
const dist = path.resolve(import.meta.dirname, "..", "dist");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...rutas.map((ruta) => `  <url><loc>${origin}${ruta === "/" ? "/" : ruta}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

await fs.writeFile(path.join(dist, "sitemap.xml"), xml);
console.log(`Sitemap generado con ${rutas.length} URLs.`);
