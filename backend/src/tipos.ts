export interface Bindings {
  DB: D1Database;
  SITIO: string;
  ENTORNO: string; // "produccion" | "local"
  ADMINS: string; // correos separados por coma
  ACCESS_EQUIPO: string; // p. ej. "maudev.cloudflareaccess.com"
  ACCESS_AUD: string; // "Application Audience (AUD) Tag" de la app de Access
  ADMIN_LOCAL?: string; // solo desarrollo: ver auth/admin.ts
  LIMITE_TOKEN?: RateLimit;
  GITHUB_REPO: string; // "dueño/repositorio" para "Actualizar sitio"
  GITHUB_TOKEN?: string; // secreto: token con permiso de Actions en ese repo
}

export interface SesionCliente {
  clienteId: string;
  tokenId: string;
  alcance: string;
}

export type Entorno = {
  Bindings: Bindings;
  Variables: { admin: string | null; cliente: SesionCliente | null };
};
