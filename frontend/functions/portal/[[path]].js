// Toda ruta bajo /portal/ es la misma aplicación: el portal decide en el
// navegador qué pantalla mostrar. Pages solo sirve archivos que existen, así
// que sin esta función /portal/ingresar o /portal/admin/clientes/:id darían 404.
//
// Se entrega dist/portal.html (el cascarón sin indexar que genera
// prerender-meta). Los _headers no se aplican a respuestas de Functions: los
// de seguridad se copian de ese asset y los del portal se ponen acá.
export async function onRequest({ request, env }) {
  const asset = await env.ASSETS.fetch(new URL("/portal", request.url));
  const headers = new Headers(asset.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.set("Cache-Control", "no-store");
  headers.set("Referrer-Policy", "no-referrer");
  return new Response(asset.body, { status: 200, headers });
}
