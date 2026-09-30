import { Hono } from "hono";
import { z } from "zod";
import { getPlan } from "../../../shared/oferta.js";
import { requiereAdmin } from "../auth/admin";
import { proyectosDe } from "../proyectos";
import type { Entorno } from "../tipos";
import { ahora, aleatorio, auditar, hoyChile, nuevoId, sha256 } from "../util";

export const admin = new Hono<Entorno>();
admin.use("*", requiereAdmin);

const noEncontrado = (c: { json: (b: unknown, s: 404) => Response }) => c.json({ error: "No encontrado" }, 404);
const leer = async <T extends z.ZodType>(req: { json: () => Promise<unknown> }, esquema: T) =>
  esquema.safeParse(await req.json().catch(() => null));

admin.get("/yo", (c) => c.json({ email: c.get("admin"), local: c.env.ENTORNO === "local" }));

// Tablero: lo que conviene ver apenas se entra.
admin.get("/resumen", async (c) => {
  const fila = await c.env.DB.prepare(
    `SELECT
       (SELECT count(*) FROM clientes WHERE archivado_en IS NULL) AS clientes,
       (SELECT count(*) FROM proyectos WHERE estado = 'activo') AS proyectos_activos,
       (SELECT count(*) FROM fases f JOIN proyectos p ON p.id = f.proyecto_id
         WHERE p.estado = 'activo' AND f.estado = 'por_aprobar') AS por_aprobar,
       (SELECT count(*) FROM fases f JOIN proyectos p ON p.id = f.proyecto_id
         WHERE p.estado = 'activo' AND f.estado != 'completada' AND f.estimada_el < ?) AS fases_atrasadas,
       (SELECT count(*) FROM tokens_acceso WHERE revocado_en IS NULL AND ultimo_uso_en > ?) AS accesos_7_dias`,
  ).bind(hoyChile(), ahora() - 7 * 86400).first();
  return c.json(fila);
});

// ── Clientes ─────────────────────────────────────────────────────────────────

const esquemaCliente = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  rut: z.string().trim().max(20).optional(),
  telefono: z.string().trim().max(40).optional(),
  notas: z.string().trim().max(2000).optional(),
});

admin.get("/clientes", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT cl.id, cl.nombre, cl.email, cl.creado_en, cl.archivado_en,
       (SELECT count(*) FROM proyectos p WHERE p.cliente_id = cl.id AND p.estado = 'activo') AS proyectos_activos,
       (SELECT max(ultimo_uso_en) FROM tokens_acceso t WHERE t.cliente_id = cl.id) AS ultimo_acceso
     FROM clientes cl ORDER BY cl.archivado_en IS NOT NULL, cl.creado_en DESC`,
  ).all();
  return c.json({ clientes: results });
});

admin.post("/clientes", async (c) => {
  const cuerpo = await leer(c.req, esquemaCliente);
  if (!cuerpo.success) return c.json({ error: "Datos inválidos", detalle: cuerpo.error.issues }, 400);
  const id = nuevoId();
  const d = cuerpo.data;
  await c.env.DB.prepare("INSERT INTO clientes (id, nombre, email, rut, telefono, notas) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, d.nombre, d.email, d.rut ?? null, d.telefono ?? null, d.notas ?? null).run();
  await auditar(c, "cliente.crear", { entidad: "cliente", entidadId: id, clienteId: id });
  return c.json({ id }, 201);
});

admin.get("/clientes/:id", async (c) => {
  const id = c.req.param("id");
  const cliente = await c.env.DB.prepare("SELECT * FROM clientes WHERE id = ?").bind(id).first();
  if (!cliente) return noEncontrado(c);
  // Nunca se devuelve el hash: no sirve para nada fuera de la base.
  const { results: tokens } = await c.env.DB.prepare(
    `SELECT id, etiqueta, alcance, vence_en, usos, ultimo_uso_en, revocado_en, creado_por, creado_en
     FROM tokens_acceso WHERE cliente_id = ? ORDER BY creado_en DESC`,
  ).bind(id).all();
  return c.json({ cliente, tokens, proyectos: await proyectosDe(c.env.DB, id) });
});

admin.post("/clientes/:id/archivar", async (c) => {
  const id = c.req.param("id");
  const r = await c.env.DB.prepare("UPDATE clientes SET archivado_en = ? WHERE id = ? AND archivado_en IS NULL").bind(ahora(), id).run();
  if (!r.meta.changes) return noEncontrado(c);
  await auditar(c, "cliente.archivar", { entidad: "cliente", entidadId: id, clienteId: id });
  return c.json({ ok: true });
});

// ── Tokens de acceso ─────────────────────────────────────────────────────────

const esquemaToken = z.object({
  etiqueta: z.string().trim().max(60).optional(),
  dias: z.number().int().min(1).max(730).optional(), // sin días: no vence
});

admin.post("/clientes/:id/tokens", async (c) => {
  const clienteId = c.req.param("id");
  const existe = await c.env.DB.prepare("SELECT 1 FROM clientes WHERE id = ? AND archivado_en IS NULL").bind(clienteId).first();
  if (!existe) return noEncontrado(c);
  const cuerpo = await leer(c.req, esquemaToken);
  if (!cuerpo.success) return c.json({ error: "Datos inválidos" }, 400);

  const token = aleatorio(32);
  const id = nuevoId();
  const venceEn = cuerpo.data.dias ? ahora() + cuerpo.data.dias * 86400 : null;
  await c.env.DB.prepare(
    "INSERT INTO tokens_acceso (id, cliente_id, hash, etiqueta, vence_en, creado_por) VALUES (?, ?, ?, ?, ?, ?)",
  ).bind(id, clienteId, await sha256(token), cuerpo.data.etiqueta ?? null, venceEn, c.get("admin")).run();
  await auditar(c, "token.crear", { entidad: "token", entidadId: id, clienteId, detalle: { vence_en: venceEn } });

  // Única vez que el token viaja en claro. Va después del #: el navegador no
  // lo manda al servidor, así que no queda en logs ni en el Referer.
  return c.json({ id, token, enlace: `${c.env.SITIO}/portal/entrar#${token}`, vence_en: venceEn }, 201);
});

admin.post("/tokens/:id/revocar", async (c) => {
  const id = c.req.param("id");
  const fila = await c.env.DB.prepare("SELECT cliente_id FROM tokens_acceso WHERE id = ? AND revocado_en IS NULL").bind(id).first<{ cliente_id: string }>();
  if (!fila) return noEncontrado(c);
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE tokens_acceso SET revocado_en = ? WHERE id = ?").bind(ahora(), id),
    c.env.DB.prepare("DELETE FROM sesiones_cliente WHERE token_id = ?").bind(id),
  ]);
  await auditar(c, "token.revocar", { entidad: "token", entidadId: id, clienteId: fila.cliente_id });
  return c.json({ ok: true });
});

// ── Proyectos y fases ────────────────────────────────────────────────────────

const esquemaProyecto = z.object({ plan_id: z.string(), nombre: z.string().trim().min(2).max(120).optional() });

admin.post("/clientes/:id/proyectos", async (c) => {
  const clienteId = c.req.param("id");
  const existe = await c.env.DB.prepare("SELECT 1 FROM clientes WHERE id = ? AND archivado_en IS NULL").bind(clienteId).first();
  if (!existe) return noEncontrado(c);
  const cuerpo = await leer(c.req, esquemaProyecto);
  const plan = cuerpo.success ? getPlan(cuerpo.data.plan_id) : null;
  if (!cuerpo.success || !plan) return c.json({ error: "Plan inválido" }, 400);

  // Las fases salen del plan contratado (shared/oferta.js): lo que se vendió es
  // lo que el cliente ve avanzar.
  const id = nuevoId();
  const fases: string[] = plan.fases ?? [];
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO proyectos (id, cliente_id, plan_id, nombre) VALUES (?, ?, ?, ?)")
      .bind(id, clienteId, plan.id, cuerpo.data.nombre ?? `${plan.capacidad} · ${plan.nombre}`),
    ...fases.map((nombre, i) =>
      c.env.DB.prepare("INSERT INTO fases (id, proyecto_id, orden, nombre) VALUES (?, ?, ?, ?)").bind(nuevoId(), id, i + 1, nombre)),
  ]);
  await auditar(c, "proyecto.crear", { entidad: "proyecto", entidadId: id, clienteId, detalle: { plan: plan.id } });
  return c.json({ id }, 201);
});

const esquemaFase = z.object({
  estado: z.enum(["pendiente", "en_curso", "por_aprobar", "completada"]).optional(),
  estimada_el: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

admin.patch("/fases/:id", async (c) => {
  const id = c.req.param("id");
  const cuerpo = await leer(c.req, esquemaFase);
  if (!cuerpo.success) return c.json({ error: "Datos inválidos" }, 400);
  const fila = await c.env.DB.prepare(
    "SELECT p.cliente_id FROM fases f JOIN proyectos p ON p.id = f.proyecto_id WHERE f.id = ?",
  ).bind(id).first<{ cliente_id: string }>();
  if (!fila) return noEncontrado(c);

  const { estado, estimada_el } = cuerpo.data;
  const hoy = hoyChile();
  await c.env.DB.prepare(
    `UPDATE fases SET
       estado = coalesce(?, estado),
       estimada_el = CASE WHEN ? THEN ? ELSE estimada_el END,
       completada_el = CASE WHEN ? = 'completada' THEN coalesce(completada_el, ?) WHEN ? IS NULL THEN completada_el ELSE NULL END
     WHERE id = ?`,
  ).bind(estado ?? null, estimada_el !== undefined ? 1 : 0, estimada_el ?? null, estado ?? null, hoy, estado ?? null, id).run();
  await auditar(c, "fase.actualizar", { entidad: "fase", entidadId: id, clienteId: fila.cliente_id, detalle: cuerpo.data });
  return c.json({ ok: true });
});

// ── Auditoría ────────────────────────────────────────────────────────────────

admin.get("/auditoria", async (c) => {
  const cliente = c.req.query("cliente");
  const { results } = await (cliente
    ? c.env.DB.prepare("SELECT * FROM auditoria WHERE cliente_id = ? ORDER BY id DESC LIMIT 200").bind(cliente)
    : c.env.DB.prepare("SELECT * FROM auditoria ORDER BY id DESC LIMIT 200")).all();
  return c.json({ eventos: results });
});
