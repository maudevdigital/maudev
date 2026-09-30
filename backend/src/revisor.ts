// Revisor de cookies (/ley-21719/revisor-cookies): analiza el HTML inicial de un
// sitio en busca de rastreadores y terceros que se cargan antes del
// consentimiento. Es análisis estático: lo que un gestor de etiquetas inyecta
// después, al ejecutarse en el navegador, no se ve, y el resultado lo dice.

export interface Tercero {
  id: string;
  nombre: string;
  tipo: "analitica" | "publicidad" | "terceros";
  bloqueado: boolean; // el script viene como type="text/plain" hasta aceptar
}

export interface Resultado {
  url: string;
  https: boolean;
  terceros: Tercero[];
  gestor: string | null; // gestor de consentimiento detectado
  consentMode: boolean; // gtag('consent', 'default', …)
  cookiesServidor: string[]; // nombres de cookies en Set-Cookie
  politica: boolean;
  formularios: number;
  nivel: "alto" | "medio" | "bajo";
}

const CATALOGO: { id: string; nombre: string; tipo: Tercero["tipo"]; patrones: RegExp[] }[] = [
  { id: "google-analytics", nombre: "Google Analytics / Tag Manager", tipo: "analitica", patrones: [/googletagmanager\.com/i, /google-analytics\.com/i, /\bgtag\s*\(/] },
  { id: "meta", nombre: "Píxel de Meta", tipo: "publicidad", patrones: [/connect\.facebook\.net/i, /\bfbq\s*\(/] },
  { id: "tiktok", nombre: "Píxel de TikTok", tipo: "publicidad", patrones: [/analytics\.tiktok\.com/i, /\bttq\.(load|page|track)/] },
  { id: "linkedin", nombre: "LinkedIn Insight", tipo: "publicidad", patrones: [/snap\.licdn\.com/i, /_linkedin_partner_id/] },
  { id: "google-ads", nombre: "Google Ads", tipo: "publicidad", patrones: [/googleadservices\.com/i, /googlesyndication\.com/i, /doubleclick\.net/i] },
  { id: "hotjar", nombre: "Hotjar", tipo: "analitica", patrones: [/static\.hotjar\.com/i, /\bhjid\b/] },
  { id: "clarity", nombre: "Microsoft Clarity", tipo: "analitica", patrones: [/clarity\.ms/i] },
  { id: "youtube", nombre: "Videos de YouTube (sin modo privado)", tipo: "terceros", patrones: [/youtube\.com\/embed/i] },
  { id: "google-fonts", nombre: "Google Fonts", tipo: "terceros", patrones: [/fonts\.googleapis\.com/i] },
  { id: "google-maps", nombre: "Google Maps", tipo: "terceros", patrones: [/maps\.googleapis\.com/i, /google\.com\/maps\/embed/i] },
  { id: "recaptcha", nombre: "Google reCAPTCHA", tipo: "terceros", patrones: [/google\.com\/recaptcha/i, /recaptcha\/api\.js/i] },
];

const GESTORES: [string, RegExp][] = [
  ["Cookiebot", /cookiebot/i], ["OneTrust", /onetrust|optanon/i], ["CookieYes", /cookieyes|cookie-law-info/i],
  ["Complianz", /complianz|cmplz/i], ["iubenda", /iubenda/i], ["Osano", /osano/i], ["Termly", /termly/i],
  ["Usercentrics", /usercentrics/i], ["Klaro", /klaro/i], ["Borlabs", /borlabs/i], ["CookieConsent", /cookieconsent/i],
];

/** Solo direcciones http(s) públicas con nombre de dominio: sin IPs, puertos ni nombres internos. */
export function urlRevisable(entrada: string): URL | null {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(entrada.trim()) ? entrada.trim() : `https://${entrada.trim()}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!["http:", "https:"].includes(url.protocol) || url.port || url.username || url.password) return null;
  if (!host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":") || host.startsWith("[")) return null;
  if (/(^|\.)(localhost|local|internal|lan|home|arpa)$/.test(host)) return null;
  return url;
}

export function analizar(html: string, cookiesServidor: string[], urlFinal: string): Resultado {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((m) => ({ attrs: m[1], texto: `${m[1]} ${m[2]}` }));
  const resto = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");

  const terceros: Tercero[] = [];
  for (const t of CATALOGO) {
    const enScripts = scripts.filter((s) => t.patrones.some((p) => p.test(s.texto)));
    const enResto = t.patrones.some((p) => p.test(resto));
    if (!enScripts.length && !enResto) continue;
    // Bloqueado solo si TODAS sus apariciones son scripts inertes hasta aceptar.
    const bloqueado = !enResto && enScripts.every((s) => /type\s*=\s*["']?text\/plain/i.test(s.attrs));
    terceros.push({ id: t.id, nombre: t.nombre, tipo: t.tipo, bloqueado });
  }

  const gestor = GESTORES.find(([, re]) => re.test(html))?.[0] ?? null;
  const consentMode = /gtag\s*\(\s*['"]consent['"]\s*,\s*['"]default['"]/i.test(html);
  const politica = /href\s*=\s*["'][^"']*(privacidad|privacy|datos-personales|proteccion-de-datos)[^"']*["']/i.test(html);
  const formularios = (html.match(/<form\b/gi) ?? []).length;

  const rastreadoresActivos = terceros.filter((t) => t.tipo !== "terceros" && !t.bloqueado);
  const nivel: Resultado["nivel"] =
    rastreadoresActivos.length && !gestor && !consentMode ? "alto"
      : rastreadoresActivos.length || !politica || terceros.some((t) => !t.bloqueado) ? "medio"
        : "bajo";

  return { url: urlFinal, https: urlFinal.startsWith("https://"), terceros, gestor, consentMode, cookiesServidor, politica, formularios, nivel };
}
