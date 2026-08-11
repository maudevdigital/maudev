// Verificación de Cloudflare Turnstile para los formularios.
//
// Por qué acá y no dentro de cada formulario: son cuatro, y el envío ya pasa
// todo por `submitLead`. Resolviendo el token en ese único punto, los cuatro
// quedan protegidos sin tocar ninguno, y el que se agregue mañana también.
//
// ── Cómo se enciende (son DOS llaves y el orden importa) ────────────────────
// En el panel de Cloudflare → Turnstile se crea un widget y salen dos valores:
//
//   1. Site key (pública) → variable VITE_TURNSTILE_SITE_KEY en Cloudflare
//      Pages y en el secreto del mismo nombre en GitHub Actions, porque se
//      hornea en el build.
//   2. Secret key (privada) → `wrangler secret put TURNSTILE_SECRET` en el
//      worker de leads.
//
// ⚠️ Configurar SOLO el secreto rompe el formulario: el worker exige token y el
// sitio no lo manda, así que todo envío responde 403. Primero la site key —con
// el secreto ausente el worker acepta igual—, se despliega, y recién entonces
// el secreto. Para apagarlo, al revés: primero se quita el secreto.
//
// Con la site key ausente esto no carga nada ni pide una sola petición de red:
// el sitio se comporta exactamente como antes.

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Si el visitante tarda más que esto, se sigue sin token y el worker decide.
// Preferimos que el envío falle con un mensaje visible antes que dejar el
// formulario colgado sin explicación.
const TIMEOUT_MS = 15000;

let scriptPromise = null;
let widgetId = null;
let contenedor = null;

export const turnstileHabilitado = () => Boolean(SITE_KEY);

function cargarScript() {
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
    // Un fallo de carga no puede quedar cacheado como promesa rechazada para
    // siempre: el siguiente intento del visitante debe poder reintentar.
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

// El widget va en modo "interaction-only": para la inmensa mayoría de los
// visitantes no dibuja nada y resuelve solo, y únicamente aparece cuando
// Cloudflare considera que hace falta interacción. Por eso el contenedor existe
// siempre pero mide cero mientras no haya nada que mostrar: si estuviera oculto
// con display:none, el visitante que sí recibe el desafío no podría resolverlo
// y se quedaría sin poder enviar el formulario.
function obtenerContenedor() {
  if (contenedor?.isConnected) return contenedor;
  contenedor = document.createElement("div");
  contenedor.setAttribute("aria-live", "polite");
  Object.assign(contenedor.style, {
    position: "fixed",
    left: "50%",
    bottom: "1.5rem",
    transform: "translateX(-50%)",
    zIndex: "60",
  });
  document.body.appendChild(contenedor);
  return contenedor;
}

/**
 * Devuelve un token de un solo uso, o null si la verificación no está
 * configurada o no se pudo obtener. Nunca lanza: quien envía el formulario no
 * debe romperse por esto, y del token ausente se encarga el worker.
 */
export async function obtenerTokenTurnstile() {
  if (!SITE_KEY || typeof window === "undefined") return null;

  try {
    await cargarScript();
  } catch {
    return null;
  }
  if (!window.turnstile) return null;

  return new Promise((resolve) => {
    let resuelto = false;
    const terminar = (valor) => {
      if (resuelto) return;
      resuelto = true;
      clearTimeout(reloj);
      resolve(valor);
    };
    const reloj = setTimeout(() => terminar(null), TIMEOUT_MS);

    const opciones = {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      callback: (token) => terminar(token),
      "error-callback": () => terminar(null),
      "timeout-callback": () => terminar(null),
      "expired-callback": () => terminar(null),
    };

    try {
      if (widgetId === null) {
        widgetId = window.turnstile.render(obtenerContenedor(), opciones);
        // render() ya dispara la verificación del primer envío.
        return;
      }
      // Los tokens son de un solo uso: para el segundo envío hay que reiniciar
      // el widget y pedir uno nuevo, si no Cloudflare rechaza por repetido.
      window.turnstile.reset(widgetId);
      window.turnstile.execute(widgetId, opciones);
    } catch {
      terminar(null);
    }
  });
}
