import { Hono } from "hono";
import { analizar, urlRevisable } from "../revisor";
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

// Revisor de cookies. No guarda la dirección revisada ni el resultado.
const LIMITE_HTML = 1_500_000;
publico.post("/revisar", async (c) => {
  const ip = c.req.header("CF-Connecting-IP") ?? "local";
  if (c.env.LIMITE_REVISOR && !(await c.env.LIMITE_REVISOR.limit({ key: ip })).success) {
    return c.json({ error: "Demasiadas revisiones seguidas. Espera un minuto." }, 429);
  }
  const cuerpo = (await c.req.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof cuerpo?.url === "string" ? urlRevisable(cuerpo.url) : null;
  if (!url) return c.json({ error: "Escribe la dirección de un sitio, por ejemplo tuempresa.cl" }, 400);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "MaudevRevisor/1.0 (+https://maudev.cl/ley-21719/revisor-cookies)", Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return c.json({ error: "No pudimos abrir ese sitio. Revisa la dirección o intenta de nuevo." }, 502);
  }
  // Tras las redirecciones, el destino final tiene que seguir siendo público.
  if (!urlRevisable(res.url || url.toString())) return c.json({ error: "Ese sitio redirige a una dirección que no se puede revisar." }, 400);
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) {
    return c.json({ error: "Esa dirección no devuelve una página web." }, 400);
  }
  const html = (await res.text()).slice(0, LIMITE_HTML);
  const cookies = res.headers.getSetCookie().map((v) => v.split("=")[0].trim()).filter(Boolean);
  return c.json(analizar(html, cookies, res.url || url.toString()));
});

