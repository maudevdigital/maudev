import { Hono, type MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { Entorno } from "../tipos";
import { ahora, aleatorio, auditar, origenValido, sha256 } from "../util";

// Acceso del cliente con su token único.
//
// El admin genera el token y lo entrega como enlace maudev.cl/portal/entrar#<token>.
// El frontend lo canjea acá por una cookie de sesión y lo borra de la barra de
// direcciones: el token no queda en el navegador, y la cookie es HttpOnly, así
// que un script inyectado tampoco puede leerla.

const COOKIE = "__Host-md_cliente";
const DURACION_SESION = 30 * 86400;

// __Host- exige Secure y Path=/; en local (http) el navegador lo acepta en localhost.
const COOKIE_OPCIONES = { httpOnly: true, secure: true, sameSite: "Lax" as const, path: "/" };

/** Carga la sesión del cliente si hay cookie válida. No la exige. */
export const conCliente: MiddlewareHandler<Entorno> = async (c, next) => {
  c.set("cliente", null);
  const id = getCookie(c, COOKIE);
  if (id) {
    // El join con el token hace que revocarlo, o que venza, corte la sesión en el acto.
    const fila = await c.env.DB.prepare(
      `SELECT s.cliente_id, s.token_id, t.alcance FROM sesiones_cliente s
       JOIN tokens_acceso t ON t.id = s.token_id
       JOIN clientes cl ON cl.id = s.cliente_id
       WHERE s.id_hash = ? AND s.vence_en > ? AND t.revocado_en IS NULL
         AND (t.vence_en IS NULL OR t.vence_en > ?) AND cl.archivado_en IS NULL`,
    ).bind(await sha256(id), ahora(), ahora()).first<{ cliente_id: string; token_id: string; alcance: string }>();
    if (fila) c.set("cliente", { clienteId: fila.cliente_id, tokenId: fila.token_id, alcance: fila.alcance });
  }
  await next();
};

export const requiereCliente: MiddlewareHandler<Entorno> = async (c, next) => {
  if (!c.get("cliente")) return c.json({ error: "Tu acceso venció o fue revocado. Pide un enlace nuevo." }, 401);
  if (!origenValido(c)) return c.json({ error: "Origen no permitido" }, 403);
  await next();
};

const esquemaToken = z.object({ token: z.string().min(20).max(100) });

export const authCliente = new Hono<Entorno>();

authCliente.post("/token", async (c) => {
  if (!origenValido(c)) return c.json({ error: "Origen no permitido" }, 403);
  const ip = c.req.header("CF-Connecting-IP") ?? "local";
  if (c.env.LIMITE_TOKEN && !(await c.env.LIMITE_TOKEN.limit({ key: ip })).success) {
    return c.json({ error: "Demasiados intentos. Espera un minuto." }, 429);
  }

  const cuerpo = esquemaToken.safeParse(await c.req.json().catch(() => null));
  // Un solo mensaje para token inexistente, vencido o revocado: no se confirma cuál.
  const invalido = () => c.json({ error: "El enlace no es válido o ya no está vigente." }, 401);
  if (!cuerpo.success) return invalido();

  const token = await c.env.DB.prepare(
    `SELECT t.id, t.cliente_id FROM tokens_acceso t JOIN clientes cl ON cl.id = t.cliente_id
     WHERE t.hash = ? AND t.revocado_en IS NULL AND (t.vence_en IS NULL OR t.vence_en > ?)
       AND cl.archivado_en IS NULL`,
  ).bind(await sha256(cuerpo.data.token), ahora()).first<{ id: string; cliente_id: string }>();
  if (!token) return invalido();

  const sesion = aleatorio();
  await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO sesiones_cliente (id_hash, cliente_id, token_id, vence_en) VALUES (?, ?, ?, ?)",
    ).bind(await sha256(sesion), token.cliente_id, token.id, ahora() + DURACION_SESION),
    c.env.DB.prepare("UPDATE tokens_acceso SET usos = usos + 1, ultimo_uso_en = ? WHERE id = ?").bind(ahora(), token.id),
  ]);
  setCookie(c, COOKIE, sesion, { ...COOKIE_OPCIONES, maxAge: DURACION_SESION });
  c.set("cliente", { clienteId: token.cliente_id, tokenId: token.id, alcance: "ver" });
  await auditar(c, "cliente.ingreso", { entidad: "token", entidadId: token.id, clienteId: token.cliente_id });
  return c.json({ ok: true });
});

authCliente.post("/salir", async (c) => {
  const id = getCookie(c, COOKIE);
  if (id) await c.env.DB.prepare("DELETE FROM sesiones_cliente WHERE id_hash = ?").bind(await sha256(id)).run();
  deleteCookie(c, COOKIE, COOKIE_OPCIONES);
  return c.json({ ok: true });
});
