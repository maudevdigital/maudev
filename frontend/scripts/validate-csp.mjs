import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { subservicios } from "../src/data/subservices.js";

// Comprobación de la Content-Security-Policy.
//
// `vite preview` no sirve `_headers` —eso lo hace Cloudflare Pages—, así que la
// cabecera se lee del archivo real y se inyecta en cada respuesta de documento.
// De ese modo se prueba EXACTAMENTE la política que se va a publicar y no una
// copia escrita aparte, que se desincronizaría a la primera.
//
// Cada violación se recoge del evento `securitypolicyviolation` de la propia
// página, que es lo que el navegador reporta.
//
// ⚠️ Esta comprobación NO sustituye revisar el sitio publicado. Cloudflare Pages
// inyecta su script de analítica por su cuenta y solo en producción, así que no
// aparece ni en `dist` ni acá. Se descubrió justamente así: la suite daba cero
// violaciones y maudev.cl bloqueaba el beacon en las nueve rutas revisadas.
// Al tocar la política, verificar también contra el dominio real.

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "http://127.0.0.1:4179";

const cabeceras = await fs.readFile(path.join(root, "public", "_headers"), "utf8");
const linea = cabeceras
  .split("\n")
  .map((l) => l.trim())
  .find((l) => l.startsWith("Content-Security-Policy"));

if (!linea) {
  console.error("No hay ninguna cabecera Content-Security-Policy en public/_headers.");
  process.exit(1);
}

const soloReporte = linea.startsWith("Content-Security-Policy-Report-Only");
const politica = linea.slice(linea.indexOf(":") + 1).trim();
const nombreCabecera = soloReporte
  ? "content-security-policy-report-only"
  : "content-security-policy";

// Una muestra ancha: portada, familias, un servicio de cada familia, casos,
// legales y las que cargan widgets.
const rutas = [
  "/",
  "/contacto",
  "/precios",
  "/casos",
  "/casos/partsmr",
  "/desarrollo-web",
  "/apps-moviles",
  "/diseno",
  "/software-a-medida",
  "/nosotros",
  "/terminos",
  "/privacidad",
  "/automatizaciones/agenda-automatica",
  ...subservicios.slice(0, 4).map((s) => s.path),
];

const server = spawn(
  process.execPath,
  [path.join(root, "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", "4179"],
  { cwd: root, stdio: "ignore" }
);

const violaciones = new Map();
const anotar = (v) => {
  const clave = `${v.directive} ← ${v.recurso}`;
  if (!violaciones.has(clave)) violaciones.set(clave, { ...v, rutas: new Set() });
  violaciones.get(clave).rutas.add(v.ruta);
};

try {
  for (let i = 0; i < 40; i += 1) {
    try {
      if ((await fetch(baseUrl)).ok) break;
    } catch {
      // El preview todavía está iniciando.
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const browser = await chromium.launch();
  // Con el consentimiento CONCEDIDO: sin él no se cargan analítica ni píxel, y
  // son justamente los orígenes que más fácil se olvidan en la lista.
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("maudev_consent_v2", JSON.stringify({ version: 2, analytics: true, marketing: true }));
    localStorage.setItem("theme", "light");
    sessionStorage.setItem("chat_seen", "1");
  });

  // La cabecera viaja en la respuesta del documento, como la pondrá Cloudflare.
  //
  // Solo en los documentos DE ESTE SITIO. Al aplicarla también a documentos de
  // terceros aparecía una violación de `script-src ← eval` que no era nuestra:
  // venía de dentro del iframe de Turnstile, al que le estábamos imponiendo una
  // política que en producción nunca recibe —Cloudflare Pages sirve `_headers`
  // para nuestras rutas, no para challenges.cloudflare.com—. Haber creído ese
  // reporte habría significado agregar 'unsafe-eval' sin ninguna necesidad.
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "document" || !request.url().startsWith(baseUrl)) {
      return route.continue();
    }
    const respuesta = await route.fetch();
    const headers = { ...respuesta.headers(), [nombreCabecera]: politica };
    return route.fulfill({ response: respuesta, headers });
  });

  const page = await context.newPage();
  await page.exposeFunction("reportarCsp", anotar);
  await context.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (evento) => {
      window.reportarCsp?.({
        directive: evento.effectiveDirective || evento.violatedDirective,
        recurso: (evento.blockedURI || "inline").split("?")[0],
        ruta: location.pathname,
      });
    });
  });

  for (const ruta of rutas) {
    try {
      await page.goto(`${baseUrl}${ruta}`, { waitUntil: "networkidle", timeout: 25000 });
    } catch {
      // Turnstile mantiene tráfico abierto en /contacto; con lo cargado basta.
    }
    await page.waitForTimeout(1200);
  }

  // El envío del formulario es el que ejercita connect-src contra el worker de
  // leads. Se responde el webhook desde acá para no generar un lead de verdad:
  // en modo reporte el navegador informa la violación igual, porque la petición
  // llega a salir.
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("lead-intake") || url.includes("webhook") || url.includes("workers.dev")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    return route.continue();
  });
  await page.goto(`${baseUrl}/contacto`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.getByLabel("Nombre").fill("Prueba CSP");
  await page.getByLabel("Empresa o tipo de negocio").fill("Prueba");
  await page.getByLabel("Qué necesitas").fill("Envio de prueba para ejercitar connect-src contra el worker de leads.");
  await page.getByLabel("Correo o WhatsApp").fill("qa@example.com");
  await page.getByRole("button", { name: "Enviar mi consulta" }).click();
  await page.waitForTimeout(12000);

  await browser.close();
} finally {
  server.kill();
}

if (violaciones.size) {
  console.error(`\nCSP: ${violaciones.size} tipo(s) de violación en ${rutas.length} rutas\n`);
  for (const [clave, v] of violaciones) {
    console.error(`  ${clave}`);
    console.error(`     en: ${[...v.rutas].slice(0, 4).join(", ")}`);
  }
  console.error(
    soloReporte
      ? "\nEstá en modo REPORTE, así que nada se bloqueó todavía. Agrega estos orígenes antes de activarla.\n"
      : "\n⚠️ Está ACTIVA: esto se está bloqueando de verdad en producción.\n"
  );
  process.exit(1);
}

console.log(
  `CSP sin violaciones en ${rutas.length} rutas y en el envío del formulario ` +
  `(modo ${soloReporte ? "reporte" : "activo"}).`
);
