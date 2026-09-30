import fs from "node:fs/promises";
import path from "node:path";
import { markdownAHtml, minutosDeLectura } from "../src/lib/markdown.js";

// Descarga las guías publicadas desde el backend y las deja listas para el
// build: src/data/guias.json (con el HTML, para la página de cada guía) y
// src/data/guias-indice.json (sin el cuerpo, para listados y el sitemap).
//
// Corre antes de `dev` y de `build`. Si la API no responde, se conservan los
// archivos de la vez anterior; si no existen, se crean vacíos. El sitio nunca
// deja de construir por esto.
//
// Origen: GUIAS_API (por defecto https://maudev.cl). En local, con el backend
// corriendo: GUIAS_API=http://127.0.0.1:8787 npm run dev

const root = path.resolve(import.meta.dirname, "..");
const destino = path.join(root, "src", "data", "guias.json");
const destinoIndice = path.join(root, "src", "data", "guias-indice.json");
const api = (process.env.GUIAS_API || "https://maudev.cl").replace(/\/$/, "");

const existe = (p) => fs.access(p).then(() => true, () => false);

try {
  const res = await fetch(`${api}/api/publico/articulos`, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { articulos } = await res.json();
  const guias = articulos.map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    descripcion: a.descripcion,
    categoria: a.categoria,
    publicado_el: a.publicado_el,
    actualizado_el: a.actualizado_el,
    minutos: minutosDeLectura(a.contenido),
    html: markdownAHtml(a.contenido),
  }));
  await fs.writeFile(destino, JSON.stringify(guias));
  await fs.writeFile(destinoIndice, JSON.stringify(guias.map(({ html: _, ...resto }) => resto)));
  console.log(`Guías: ${guias.length} descargadas de ${api}.`);
} catch (error) {
  if (await existe(destino) && await existe(destinoIndice)) {
    console.warn(`Guías: no se pudo descargar de ${api} (${error.message}); se usan las de la vez anterior.`);
  } else {
    await fs.writeFile(destino, "[]");
    await fs.writeFile(destinoIndice, "[]");
    console.warn(`Guías: no se pudo descargar de ${api} (${error.message}); el sitio se construye sin guías.`);
  }
}
