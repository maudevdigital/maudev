// Parámetros globales de la app Maudev.
// Histórico: existía un sistema de appId/token desde URL para multi-tenant; ya no se usa.
export const appParams = {
  appId: 'maudev',
  token: null,
  fromUrl: typeof window !== 'undefined' ? window.location.href : '',
  functionsVersion: null,
  appBaseUrl: null,
};
