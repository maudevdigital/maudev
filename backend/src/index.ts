import { Hono } from "hono";
import { authCliente, conCliente } from "./auth/cliente";
import { admin } from "./rutas/admin";
import { cliente } from "./rutas/cliente";
import { publico } from "./rutas/publico";
import type { Entorno } from "./tipos";

// API de maudev.cl. Cloudflare enruta maudev.cl/api/* a este Worker; el resto
// del dominio lo sirve Pages (frontend/).
export const app = new Hono<Entorno>().basePath("/api");

app.use("*", async (c, next) => {
  c.set("admin", null);
  await next();
  // Respuestas con datos de clientes: que ningún intermediario las guarde.
  c.header("Cache-Control", "no-store");
  c.header("X-Content-Type-Options", "nosniff");
});
app.use("*", conCliente);

app.get("/salud", (c) => c.json({ ok: true, servicio: "maudev-api" }));

app.route("/auth", authCliente);
app.route("/cliente", cliente);
app.route("/admin", admin);
app.route("/publico", publico);

app.notFound((c) => c.json({ error: "No encontrado" }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Error interno" }, 500);
});

// www.maudev.cl → maudev.cl (301). Sin esto, www servía el sitio completo
// duplicado para Google y el panel admin sin Cloudflare Access, que protege
// solo maudev.cl.
export default {
  fetch(request: Request, env: Entorno["Bindings"], ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.hostname === "www.maudev.cl") {
      url.hostname = "maudev.cl";
      return Response.redirect(url.toString(), 301);
    }
    return app.fetch(request, env, ctx);
  },
};
