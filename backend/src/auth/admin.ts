import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Bindings, Entorno } from "../tipos";
import { origenValido } from "../util";

// Admin = quien pasó Cloudflare Access Y está en la lista ADMINS.
//
// Access va delante de /api/admin/* y bloquea antes de llegar acá. Igual se
// verifica su JWT en cada petición: si alguien llegara por otro camino (una
// ruta mal configurada, un subdominio nuevo), sin un JWT firmado por Access no
// entra. No hay sesión propia de admin que robar: la duración la fija Access.

const jwks = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
function llaves(equipo: string) {
  if (!jwks.has(equipo)) jwks.set(equipo, createRemoteJWKSet(new URL(`https://${equipo}/cdn-cgi/access/certs`)));
  return jwks.get(equipo)!;
}

const listaAdmins = (env: Bindings) =>
  env.ADMINS.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/**
 * Atajo SOLO para desarrollo: sin Access en local, ADMIN_LOCAL hace de admin.
 * Exige las dos cosas a la vez —ENTORNO=local y que la petición llegue a
 * localhost— para que una variable olvidada en producción no abra la puerta.
 */
function adminLocal(env: Bindings, url: string): string | null {
  if (env.ENTORNO !== "local" || !env.ADMIN_LOCAL) return null;
  const host = new URL(url).hostname;
  return host === "localhost" || host === "127.0.0.1" ? env.ADMIN_LOCAL.toLowerCase() : null;
}

export const requiereAdmin: MiddlewareHandler<Entorno> = async (c, next) => {
  let email = adminLocal(c.env, c.req.url);

  if (!email) {
    const jwt = c.req.header("Cf-Access-Jwt-Assertion") ?? getCookie(c, "CF_Authorization");
    if (!jwt || !c.env.ACCESS_EQUIPO || !c.env.ACCESS_AUD) return c.json({ error: "No autorizado" }, 401);
    try {
      const { payload } = await jwtVerify(jwt, llaves(c.env.ACCESS_EQUIPO), {
        issuer: `https://${c.env.ACCESS_EQUIPO}`,
        audience: c.env.ACCESS_AUD,
      });
      email = String(payload.email ?? "").toLowerCase();
    } catch {
      return c.json({ error: "No autorizado" }, 401);
    }
  }

  if (!listaAdmins(c.env).includes(email)) return c.json({ error: "No autorizado" }, 403);
  if (!origenValido(c)) return c.json({ error: "Origen no permitido" }, 403);
  c.set("admin", email);
  await next();
};
