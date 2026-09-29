// Destino de las URLs del blog eliminado.
//
// El blog se retiró del sitio. Mandar los 37 artículos a la portada con un 301
// masivo sería un soft 404 encubierto: Google lo trata como redirección
// irrelevante, pierde la señal de la URL antigua y ensucia la portada. Así que
// cada URL se resuelve una por una:
//
//   · 301 → solo cuando una página actual responde la MISMA intención de
//     búsqueda que tenía el artículo (precio de software a medida, qué es una
//     automatización, cuánto cuesta una web…).
//   · 410 Gone → contenido informativo o tutorial sin reemplazo. Es la
//     respuesta honesta: "esto existía y ya no". Google lo saca del índice más
//     rápido que un 404 y no vuelve a rastrearlo.
//
// `_redirects` de Cloudflare Pages no admite el código 410 (solo 200/301/302/
// 303/307/308/404), por eso esta ruta vive en una Function. Como la Function
// posee todo /blog/*, las reglas de /blog se quitaron de `_redirects` para que
// no haya dos dueños de la misma ruta.

const PERMANENT = {
  // Intención: qué es / para qué sirve automatizar → página de automatización.
  "que-es-una-automatizacion": "/automatizacion",
  "5-procesos-que-toda-pyme-puede-automatizar": "/automatizacion",
  "agentes-de-ia-y-automatizacion-para-pymes-2026": "/automatizacion",
  "automatizacion-ia-pymes-2026": "/automatizacion",
  "roi-automatizacion-procesos-empresa": "/automatizacion",
  "chatbot-ia-whatsapp-pymes-2026": "/automatizacion",
  "chatbots-de-whatsapp": "/automatizacion",

  // Intención: software a medida, su precio y sus alternativas.
  "cuanto-cuesta-software-a-medida-2026": "/software-a-medida",
  "como-se-calcula-precio-software-2026": "/software-a-medida",
  "software-a-medida-vs-saas-2026": "/software-a-medida",
  "software-a-medida-con-ia-en-2026-cuanto-cuesta-y-como-se-construye": "/software-a-medida",
  "integraciones-software-valor-2026": "/software-a-medida",
  "de-excel-a-un-dashboard": "/software-a-medida",
  "mvp-lanzar-producto-minimo-2026": "/software-a-medida",

  // Intención: página web, su costo y cuándo conviene.
  "cuanto-cuesta-una-pagina-web-en-chile-2026": "/desarrollo-web",
  "landing-page-vs-sitio-web": "/desarrollo-web",
  "por-que-tu-pyme-necesita-una-landing-page": "/desarrollo-web",
  "wix-vs-pagina-web-a-medida-2026": "/desarrollo-web",

  // Intención: vender online, carrito y pagos.
  "cuanto-cuesta-pagina-web-carrito-compras-2026": "/ecommerce",
  "integrar-pagos-en-tu-web": "/ecommerce",
};

const GONE_HTML = `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Contenido retirado · Maudev</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 2rem; background: #faf9f4; color: #10201c;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  main { max-width: 34rem; }
  h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); line-height: 1.1; letter-spacing: -0.04em; margin: 0 0 1rem; }
  p { line-height: 1.65; color: #46524f; margin: 0 0 1.75rem; }
  .links { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  a {
    display: inline-block; padding: 0.75rem 1.25rem; border-radius: 999px;
    text-decoration: none; font-weight: 600; font-size: 0.95rem;
    border: 1px solid #c3d2ce; color: #10201c;
  }
  a.primary { background: #0c7a5c; border-color: #0c7a5c; color: #fff; }
  @media (prefers-color-scheme: dark) {
    body { background: #0b1815; color: #f4f1e8; }
    p { color: #a3b0ac; }
    a { border-color: #2a3d38; color: #f4f1e8; }
    a.primary { background: #45cf9e; border-color: #45cf9e; color: #08211a; }
  }
</style>
</head>
<body>
  <main>
    <h1>Este artículo ya no existe</h1>
    <p>Retiramos el blog para concentrarnos en lo que hacemos: automatizar procesos y construir software para empresas. Esta dirección no tiene reemplazo.</p>
    <div class="links">
      <a class="primary" href="/automatizacion">Ver automatización</a>
      <a href="/">Ir al inicio</a>
    </div>
  </main>
</body>
</html>`;

export function onRequestGet({ params, request }) {
  // `params.path` llega como arreglo de segmentos ([] cuando piden /blog a secas).
  const segments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const slug = (segments[0] || "").toLowerCase();
  const target = PERMANENT[slug];

  if (target) {
    return Response.redirect(new URL(target, request.url).toString(), 301);
  }

  return new Response(GONE_HTML, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-robots-tag": "noindex",
    },
  });
}
