import type { Context } from "hono";
import type { Entorno } from "./tipos";

export const ahora = () => Math.floor(Date.now() / 1000);

/** Texto aleatorio en base64url. 32 bytes para secretos, 12 para ids. */
export function aleatorio(bytes = 32): string {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const nuevoId = () => aleatorio(12);

export async function sha256(texto: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * Las peticiones que cambian datos con una cookie de sesión tienen que venir
 * del propio sitio. SameSite=Lax ya lo cubre; esto es la segunda capa contra CSRF.
 * Sin Origin (curl, servidores) se deja pasar: esos no llevan la cookie de nadie.
 */
export function origenValido(c: Context<Entorno>): boolean {
  if (c.req.method === "GET" || c.req.method === "HEAD") return true;
  const origen = c.req.header("origin");
  if (!origen) return true;
  if (origen === new URL(c.env.SITIO).origin) return true;
  return c.env.ENTORNO === "local" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen);
}

export async function auditar(
  c: Context<Entorno>,
  accion: string,
  datos: { entidad?: string; entidadId?: string; clienteId?: string; detalle?: unknown } = {},
) {
  const actor = c.get("admin") ?? (c.get("cliente") ? `cliente:${c.get("cliente")!.clienteId}` : "anonimo");
  await c.env.DB.prepare(
    "INSERT INTO auditoria (actor, accion, entidad, entidad_id, cliente_id, detalle) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(actor, accion, datos.entidad ?? null, datos.entidadId ?? null, datos.clienteId ?? null,
      datos.detalle === undefined ? null : JSON.stringify(datos.detalle))
    .run();
}
