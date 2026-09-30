import { Hono } from "hono";
import type { Entorno } from "../tipos";

// Rutas públicas de solo lectura. La usa el build del sitio para descargar las
// guías publicadas y convertirlas en páginas estáticas.
export const publico = new Hono<Entorno>();

publico.get("/articulos", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT slug, titulo, descripcion, categoria, contenido, publicado_el, actualizado_el
     FROM articulos WHERE estado = 'publicado' ORDER BY publicado_el DESC, titulo`,
  ).all();
  return c.json({ articulos: results });
});
