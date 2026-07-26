// Capa de datos del sitio (sin backend). Blog y portafolio se sirven desde los
// archivos locales del repo (versionados en git); los leads salen por el webhook
// de n8n (ver lib/leads.js). Se conserva la MISMA forma `api.entities.X.method`
// para no tocar los componentes que ya la consumen.

import { projects, getProjectById } from "@/data/projects";
import { submitLead } from "@/lib/leads";

// Orden: "-campo" = descendente. Registros sin ese campo mantienen su posición.
const sortBy = (arr, sortStr) => {
  if (!sortStr) return arr;
  const desc = sortStr.startsWith("-");
  const key = desc ? sortStr.slice(1) : sortStr;
  return [...arr].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
};

// Filtro tolerante: si el registro NO tiene la propiedad, pasa (los datos
// locales no traen `status`, así que `{status:"published"}` deja pasar todo).
const matches = (row, whereObj) => {
  if (!whereObj) return true;
  return Object.entries(whereObj).every(([k, v]) => row[k] === undefined || row[k] === v);
};

const localEntity = (source, getById) => ({
  list: async (sortStr, lim) => {
    const out = sortBy(source, sortStr);
    return lim ? out.slice(0, lim) : out;
  },
  filter: async (whereObj, sortStr, lim) => {
    const out = sortBy(source.filter((r) => matches(r, whereObj)), sortStr);
    return lim ? out.slice(0, lim) : out;
  },
  get: async (id) => getById(id) || null,
});

export const api = {
  entities: {
    Project: localEntity(projects, getProjectById),
    Lead: {
      // Único método con efecto: envía el lead al webhook de n8n.
      create: async (payload) => submitLead(payload),
    },
  },
};
