// Cliente de la API del portal. Mismo origen: la cookie de sesión (HttpOnly) y la
// de Cloudflare Access viajan solas; ningún token se guarda en el navegador.

export class ErrorApi extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

export async function api(ruta, { metodo = "GET", cuerpo } = {}) {
  const res = await fetch(`/api${ruta}`, {
    method: metodo,
    credentials: "same-origin",
    headers: cuerpo === undefined ? undefined : { "Content-Type": "application/json" },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw new ErrorApi(res.status, datos.error || "No se pudo completar la acción.");
  return datos;
}

export const fecha = (unix) =>
  unix ? new Date(unix * 1000).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const ESTADOS_FASE = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  por_aprobar: "Por aprobar",
  completada: "Completada",
};
