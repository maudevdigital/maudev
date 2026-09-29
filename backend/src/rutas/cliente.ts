import { Hono } from "hono";
import { requiereCliente } from "../auth/cliente";
import { proyectosDe } from "../proyectos";
import type { Entorno } from "../tipos";

// Todo lo que ve el cliente sale de SU sesión: ninguna ruta recibe un id de
// cliente por la URL, así que no hay id ajeno que probar.
export const cliente = new Hono<Entorno>();
cliente.use("*", requiereCliente);

cliente.get("/resumen", async (c) => {
  const { clienteId, alcance } = c.get("cliente")!;
  const datos = await c.env.DB.prepare("SELECT nombre FROM clientes WHERE id = ?").bind(clienteId).first<{ nombre: string }>();
  const proyectos = await proyectosDe(c.env.DB, clienteId);
  return c.json({
    cliente: { nombre: datos?.nombre },
    alcance,
    metricas: {
      proyectos_activos: proyectos.filter((p) => p.estado === "activo").length,
      avance_promedio: proyectos.length ? Math.round(proyectos.reduce((s, p) => s + p.avance, 0) / proyectos.length) : 0,
      fases_por_aprobar: proyectos.reduce((s, p) => s + p.por_aprobar, 0),
      fases_atrasadas: proyectos.reduce((s, p) => s + p.fases_atrasadas, 0),
    },
    proyectos,
  });
});
