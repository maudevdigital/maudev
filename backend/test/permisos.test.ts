import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPlatformProxy } from "wrangler";
import { app } from "../src/index";
import type { Bindings } from "../src/tipos";

// Matriz de permisos contra una D1 local real. Es la prueba que evita el error
// más caro de un portal: que un cliente vea datos de otro, o que alguien sin
// permiso llegue al admin. Si se agrega una ruta, se agrega su fila acá.

const PERSIST = join(import.meta.dirname, ".estado-prueba");
let proxy: Awaited<ReturnType<typeof getPlatformProxy<Bindings>>>;
let env: Bindings;

const LOCAL = "http://localhost";
const PROD = "https://maudev.cl";
const ADMIN = "contacto@maudev.cl";

function pedir(ruta: string, opciones: { metodo?: string; cuerpo?: unknown; cookie?: string; base?: string; origen?: string } = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opciones.cookie) headers.Cookie = opciones.cookie;
  if (opciones.origen) headers.Origin = opciones.origen;
  return app.request(`${opciones.base ?? LOCAL}/api${ruta}`, {
    method: opciones.metodo ?? "GET",
    headers,
    body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
  }, env);
}
const comoAdmin = (ruta: string, cuerpo?: unknown, metodo = cuerpo === undefined ? "GET" : "POST") =>
  pedir(ruta, { metodo, cuerpo });

async function canjear(token: string) {
  const r = await pedir("/auth/token", { metodo: "POST", cuerpo: { token } });
  return { status: r.status, cookie: r.headers.get("set-cookie")?.split(";")[0] ?? "" };
}

async function clienteConToken(nombre: string) {
  const { id } = await (await comoAdmin("/admin/clientes", { nombre, email: `${nombre.toLowerCase()}@ejemplo.cl` })).json() as { id: string };
  const t = await (await comoAdmin(`/admin/clientes/${id}/tokens`, { etiqueta: "prueba" })).json() as { id: string; token: string; enlace: string };
  return { id, tokenId: t.id, token: t.token, enlace: t.enlace };
}

beforeAll(async () => {
  rmSync(PERSIST, { recursive: true, force: true });
  proxy = await getPlatformProxy<Bindings>({ configPath: join(import.meta.dirname, "../wrangler.jsonc"), persist: { path: PERSIST } });
  // En la prueba el admin entra por el atajo local; la verificación de Access se
  // prueba aparte (ver "admin en producción").
  env = { ...proxy.env, ENTORNO: "local", ADMIN_LOCAL: ADMIN, LIMITE_TOKEN: undefined };
  const dir = join(import.meta.dirname, "../migrations");
  for (const archivo of readdirSync(dir).sort()) {
    const sentencias = readFileSync(join(dir, archivo), "utf8")
      .replace(/--.*$/gm, "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    await env.DB.batch(sentencias.map((s) => env.DB.prepare(s)));
  }
});

afterAll(async () => {
  await proxy?.dispose();
  rmSync(PERSIST, { recursive: true, force: true });
});

describe("público", () => {
  it("salud responde sin sesión", async () => {
    expect((await pedir("/salud")).status).toBe(200);
  });
});

describe("admin", () => {
  it("en producción, sin JWT de Access no entra", async () => {
    const r = await app.request(`${PROD}/api/admin/clientes`, {}, { ...env, ENTORNO: "produccion" });
    expect(r.status).toBe(401);
  });

  it("en producción, un JWT falso no entra", async () => {
    const r = await app.request(`${PROD}/api/admin/clientes`, { headers: { "Cf-Access-Jwt-Assertion": "a.b.c" } },
      { ...env, ENTORNO: "produccion", ACCESS_EQUIPO: "ejemplo.cloudflareaccess.com", ACCESS_AUD: "x" });
    expect(r.status).toBe(401);
  });

  it("el atajo local no sirve si la petición no llega a localhost", async () => {
    expect((await pedir("/admin/clientes", { base: PROD })).status).toBe(401);
  });

  it("un correo fuera de ADMINS no entra aunque sea local", async () => {
    const r = await app.request(`${LOCAL}/api/admin/clientes`, {}, { ...env, ADMIN_LOCAL: "intruso@ejemplo.cl" });
    expect(r.status).toBe(403);
  });

  it("rechaza escrituras desde otro origen", async () => {
    const r = await pedir("/admin/clientes", { metodo: "POST", cuerpo: { nombre: "X", email: "x@x.cl" }, origen: "https://malicioso.cl" });
    expect(r.status).toBe(403);
  });
});

describe("token de acceso del cliente", () => {
  it("se entrega una sola vez como enlace con #, y en la base solo queda su hash", async () => {
    const { tokenId, token, enlace } = await clienteConToken("Alfa");
    expect(enlace).toBe(`https://maudev.cl/portal/entrar#${token}`);
    const fila = await env.DB.prepare("SELECT hash FROM tokens_acceso WHERE id = ?").bind(tokenId).first<{ hash: string }>();
    expect(fila!.hash).not.toBe(token);
    expect(fila!.hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("la ficha del admin no expone el hash", async () => {
    const { id } = await clienteConToken("Beta");
    const ficha = await (await comoAdmin(`/admin/clientes/${id}`)).json() as { tokens: Record<string, unknown>[] };
    expect(ficha.tokens[0]).not.toHaveProperty("hash");
  });

  it("un token inventado no entra", async () => {
    expect((await canjear("x".repeat(43))).status).toBe(401);
  });

  it("canjear da una cookie de sesión segura", async () => {
    const { token } = await clienteConToken("Gamma");
    const r = await pedir("/auth/token", { metodo: "POST", cuerpo: { token } });
    const cookie = r.headers.get("set-cookie") ?? "";
    expect(r.status).toBe(200);
    expect(cookie).toMatch(/^__Host-md_cliente=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/Secure/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
  });
});

describe("aislamiento entre clientes", () => {
  it("cada cliente ve solo sus proyectos", async () => {
    const a = await clienteConToken("Delta");
    const b = await clienteConToken("Epsilon");
    await comoAdmin(`/admin/clientes/${a.id}/proyectos`, { plan_id: "ley-adecuacion" });
    await comoAdmin(`/admin/clientes/${b.id}/proyectos`, { plan_id: "ia-prototipo" });

    const sa = await canjear(a.token);
    const ra = await (await pedir("/cliente/resumen", { cookie: sa.cookie })).json() as { cliente: { nombre: string }; proyectos: { plan_id: string; fases: unknown[] }[] };
    expect(ra.cliente.nombre).toBe("Delta");
    expect(ra.proyectos.map((p) => p.plan_id)).toEqual(["ley-adecuacion"]);
    expect(ra.proyectos[0].fases).toHaveLength(5); // las fases del plan en shared/oferta.js
  });

  it("la cookie de cliente no abre el admin", async () => {
    const a = await clienteConToken("Zeta");
    const s = await canjear(a.token);
    const r = await app.request(`${PROD}/api/admin/clientes`, { headers: { Cookie: s.cookie } }, { ...env, ENTORNO: "produccion" });
    expect(r.status).toBe(401);
  });

  it("sin sesión no hay resumen", async () => {
    expect((await pedir("/cliente/resumen")).status).toBe(401);
  });
});

describe("revocación", () => {
  it("revocar el token corta la sesión ya abierta", async () => {
    const a = await clienteConToken("Eta");
    const s = await canjear(a.token);
    expect((await pedir("/cliente/resumen", { cookie: s.cookie })).status).toBe(200);
    expect((await comoAdmin(`/admin/tokens/${a.tokenId}/revocar`, {})).status).toBe(200);
    expect((await pedir("/cliente/resumen", { cookie: s.cookie })).status).toBe(401);
    expect((await canjear(a.token)).status).toBe(401);
  });

  it("archivar al cliente también corta su acceso", async () => {
    const a = await clienteConToken("Theta");
    const s = await canjear(a.token);
    await comoAdmin(`/admin/clientes/${a.id}/archivar`, {});
    expect((await pedir("/cliente/resumen", { cookie: s.cookie })).status).toBe(401);
  });
});

describe("métricas del proyecto", () => {
  it("el avance sube al completar fases y queda en auditoría", async () => {
    const a = await clienteConToken("Iota");
    const { id } = await (await comoAdmin(`/admin/clientes/${a.id}/proyectos`, { plan_id: "ley-diagnostico" })).json() as { id: string };
    const ficha = await (await comoAdmin(`/admin/clientes/${a.id}`)).json() as { proyectos: { id: string; fases: { id: string }[] }[] };
    const fase = ficha.proyectos.find((p) => p.id === id)!.fases[0];
    expect((await comoAdmin(`/admin/fases/${fase.id}`, { estado: "completada" }, "PATCH")).status).toBe(200);

    const s = await canjear(a.token);
    const r = await (await pedir("/cliente/resumen", { cookie: s.cookie })).json() as { proyectos: { avance: number; fases: { estado: string; completada_el: string | null }[] }[] };
    expect(r.proyectos[0].avance).toBe(33); // 1 de 3 fases
    expect(r.proyectos[0].fases[0].completada_el).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const aud = await (await comoAdmin(`/admin/auditoria?cliente=${a.id}`)).json() as { eventos: { accion: string }[] };
    expect(aud.eventos.map((e) => e.accion)).toEqual(expect.arrayContaining(["cliente.crear", "token.crear", "proyecto.crear", "fase.actualizar", "cliente.ingreso"]));
  });

  it("el tablero del admin cuenta clientes y proyectos, y el cliente no lo ve", async () => {
    const t = await (await comoAdmin("/admin/resumen")).json() as Record<string, number>;
    expect(t.clientes).toBeGreaterThan(0);
    expect(t.proyectos_activos).toBeGreaterThan(0);
    const a = await clienteConToken("Kappa");
    const s = await canjear(a.token);
    const r = await app.request(`${PROD}/api/admin/resumen`, { headers: { Cookie: s.cookie } }, { ...env, ENTORNO: "produccion" });
    expect(r.status).toBe(401);
  });

  it("el admin ve proyectos, contactos y derechos, y el cliente no", async () => {
    await env.DB.prepare("INSERT INTO leads (name, email, interest) VALUES ('Ana', 'ana@x.cl', 'Ley 21.719')").run();
    await env.DB.prepare("INSERT INTO solicitudes_derechos (folio, tipo, email, vence_el) VALUES ('ABC12345', 'acceso', 'b@x.cl', '2026-10-30')").run();
    const pr = await (await comoAdmin("/admin/proyectos")).json() as { proyectos: { avance: number; cliente: string }[] };
    expect(pr.proyectos.length).toBeGreaterThan(0);
    expect(pr.proyectos[0]).toHaveProperty("cliente");
    const ct = await (await comoAdmin("/admin/contactos")).json() as { contactos: { email: string }[] };
    expect(ct.contactos.some((x) => x.email === "ana@x.cl")).toBe(true);
    expect((await comoAdmin("/admin/derechos/ABC12345/responder", {})).status).toBe(200);
    expect((await comoAdmin("/admin/derechos/ABC12345/responder", {})).status).toBe(404); // ya respondida
    const a = await clienteConToken("Lambda");
    const s = await canjear(a.token);
    for (const ruta of ["/admin/proyectos", "/admin/contactos", "/admin/derechos"]) {
      const r = await app.request(`${PROD}/api${ruta}`, { headers: { Cookie: s.cookie } }, { ...env, ENTORNO: "produccion" });
      expect(r.status).toBe(401);
    }
  });
});
