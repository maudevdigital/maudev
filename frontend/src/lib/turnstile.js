// Verificación de Cloudflare Turnstile para los formularios.
//
// El token lo produce <TurnstileGate>, que se monta con cada página, y lo
// consume `submitLead`, que es el único punto por donde salen los cuatro
// formularios. Así los cuatro quedan cubiertos sin tocar ninguno.
//
// Por qué el widget vive en la página y no en el momento de enviar: la primera
// versión lo pedía al pulsar "enviar", con quince segundos de plazo, y se
// comprobó en producción que no funciona. Cuando Cloudflare estima que hace
// falta interacción dibuja un desafío y espera un clic; el envío se quedaba sin
// token, el worker respondía 403 y el lead se perdía. Montado con la página, el
// token está resuelto mucho antes de que alguien termine de escribir.
//
// ── Cómo se enciende (son DOS llaves y el orden importa) ────────────────────
//   1. Site key (pública) → secreto VITE_TURNSTILE_SITE_KEY en GitHub Actions,
//      que es donde corre el build. Desplegar y comprobar que el formulario
//      sigue enviando.
//   2. Secret key (privada) → wrangler secret put TURNSTILE_SECRET en el worker.
//
// ⚠️ Configurar SOLO el secreto rompe el formulario: el worker exige token y el
// sitio no lo manda, así que todo envío responde 403. Para apagarlo, al revés:
// primero se quita el secreto.
//
// Los dominios donde se use tienen que estar en la lista del widget, incluidos
// los previews y localhost si se quiere probar fuera de producción.

export const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Cuánto espera el envío si el widget todavía no terminó. Es un margen para el
// visitante rapidísimo, no el mecanismo principal: en el caso normal el token
// ya está desde hace rato.
const ESPERA_MS = 8000;

let token = null;
let avisar = [];
let scriptPromise = null;
let reiniciarWidget = null;

export function cargarTurnstile() {
  if (!SITE_KEY) return Promise.reject(new Error("Turnstile sin site key"));
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile no cargó"));
    document.head.appendChild(script);
  }).catch((error) => {
    // No dejamos la promesa rechazada en caché: el siguiente intento debe poder
    // reintentar la carga.
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

/**
 * El widget registra acá cómo pedirse un token nuevo.
 *
 * Los tokens de Turnstile son de un solo uso: una vez enviados no valen para un
 * segundo intento. Sin esto, si el primer envío falla por cualquier motivo —red,
 * un error del servidor— el reintento salía sin token y el worker lo rechazaba
 * con 403. El visitante quedaba encerrado: el formulario correcto, y aun así
 * imposible de mandar.
 */
export function registrarReinicio(fn) {
  reiniciarWidget = fn;
}

/** La llama el widget cada vez que resuelve, caduca o falla. */
export function guardarToken(valor) {
  token = valor;
  if (valor) {
    const pendientes = avisar;
    avisar = [];
    pendientes.forEach((resolver) => resolver(valor));
  }
}

/**
 * Devuelve el token pendiente, o null si la verificación no está configurada o
 * no llegó a tiempo. Nunca lanza: del token ausente se encarga el worker.
 *
 * El token es de un solo uso, así que se consume al entregarlo.
 */
export async function obtenerTokenTurnstile() {
  if (!SITE_KEY || typeof window === "undefined") return null;

  if (token) {
    const actual = token;
    token = null;
    // Se pide el siguiente de inmediato: así un reintento no se queda esperando.
    reiniciarWidget?.();
    return actual;
  }

  return new Promise((resolve) => {
    let listo = false;
    const terminar = (valor) => {
      if (listo) return;
      listo = true;
      avisar = avisar.filter((fn) => fn !== recibir);
      resolve(valor);
    };
    const recibir = (valor) => {
      token = null;
      reiniciarWidget?.();
      terminar(valor);
    };
    avisar.push(recibir);
    setTimeout(() => terminar(null), ESPERA_MS);
  });
}
