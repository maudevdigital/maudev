import { hoyChile } from "./util";

// Métricas de proyecto: las mismas para la ficha del admin y para el portal del
// cliente, así los dos ven exactamente el mismo avance.

export interface Fase {
  id: string;
  orden: number;
  nombre: string;
  estado: "pendiente" | "en_curso" | "por_aprobar" | "completada";
  estimada_el: string | null;
  completada_el: string | null;
}

interface FilaProyecto {
  id: string;
  plan_id: string;
  nombre: string;
  estado: "activo" | "pausado" | "terminado";
  creado_en: number;
}

export async function proyectosDe(db: D1Database, clienteId: string) {
  const [proyectos, fases] = await db.batch([
    db.prepare("SELECT id, plan_id, nombre, estado, creado_en FROM proyectos WHERE cliente_id = ? ORDER BY creado_en DESC").bind(clienteId),
    db.prepare(
      `SELECT f.id, f.proyecto_id, f.orden, f.nombre, f.estado, f.estimada_el, f.completada_el
       FROM fases f JOIN proyectos p ON p.id = f.proyecto_id
       WHERE p.cliente_id = ? ORDER BY f.orden`,
    ).bind(clienteId),
  ]);
  const hoy = hoyChile();

  return (proyectos.results as unknown as FilaProyecto[]).map((p) => {
    const suyas = (fases.results as (Fase & { proyecto_id: string })[]).filter((f) => f.proyecto_id === p.id);
    const completadas = suyas.filter((f) => f.estado === "completada").length;
    return {
      ...p,
      avance: suyas.length ? Math.round((completadas / suyas.length) * 100) : 0,
      fase_actual: suyas.find((f) => f.estado !== "completada")?.nombre ?? null,
      // Atrasada: tenía fecha estimada, ya pasó y no está completada.
      fases_atrasadas: suyas.filter((f) => f.estado !== "completada" && f.estimada_el && f.estimada_el < hoy).length,
      por_aprobar: suyas.filter((f) => f.estado === "por_aprobar").length,
      fases: suyas.map(({ proyecto_id: _, ...f }) => f),
    };
  });
}
