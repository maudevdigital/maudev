import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { rutas } from "./paginas.mjs";

// Escribe el CUERPO de cada ruta dentro de su archivo ya generado.
//
// Por que existe: `prerender-meta.mjs` deja el <head> correcto en cada ruta,
// pero el cuerpo seguia siendo `<div id="root"></div>`. Un rastreador que mira
// la primera respuesta no veia ni un titulo H1 ni un parrafo ni un enlace: todo
// lo pintaba React despues. Google renderiza JavaScript, pero en una segunda
// pasada, en una cola aparte y sin garantias, y un sitio sin nada que
// posicionar se rastrea cada vez menos. El sintoma fue que en septiembre el
// indice todavia mostraba el titulo del negocio anterior, abandonado en julio.
//
// Se inyecta SOLO el interior de #root, no se vuelca el documento completo: el
// <head> que arma prerender-meta —hreflang, canonical, lang por idioma— esta
// afinado a mano y no lo tiene que pisar el navegador.
//
// Corre despues de `npx playwright install chromium` en el workflow, y antes de
// `npm test`, para que las validaciones vean el HTML que de verdad se publica.
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const puerto = 4181; // 4180 lo usa validate-site.mjs
const baseUrl = `http://127.0.0.1:${puerto}`;
const MARCA = '<div id="root"></div>';

const servidor = spawn(process.execPath, [
  path.join(root, "node_modules", "vite", "bin", "vite.js"),
  "preview",
  "--host", "127.0.0.1",
  "--port", String(puerto),
], { cwd: root, stdio: "ignore" });

async function esperarServidor() {
  for (let intento = 0; intento < 40; intento += 1) {
    try {
      const respuesta = await fetch(baseUrl);
      if (respuesta.ok) return;
    } catch {
      // El preview todavia esta iniciando.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("El servidor de preview no respondio.");
}

// `/` es dist/index.html; el resto es ruta.html plano, nunca ruta/index.html,
// porque la forma de directorio hace que Cloudflare Pages redirija 308 a la
// barra final y el canonical la declara sin barra.
const archivoDe = (ruta) => path.join(dist, ruta === "/" ? "index.html" : `${ruta.slice(1)}.html`);

const fallos = [];
let escritas = 0;
let bytes = 0;

try {
  await esperarServidor();
  const navegador = await chromium.launch({ headless: true });
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });

  // Turnstile sondea a Cloudflare en segundo plano y /contacto nunca alcanzaria
  // `networkidle`. Mismo motivo por el que validate-site.mjs lo corta.
  await contexto.route("**challenges.cloudflare.com**", (peticion) =>
    peticion.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );

  // El cartel de cookies y el globo del chat no se hornean en el HTML: son
  // estado del visitante, no contenido de la pagina. React los muestra al
  // montar, a quien corresponda.
  await contexto.addInitScript(() => {
    localStorage.setItem("maudev_consent_v2", JSON.stringify({ version: 2, analytics: false, marketing: false }));
    localStorage.setItem("theme", "light");
  });

  for (const ruta of rutas) {
    const pagina = await contexto.newPage();
    try {
      const respuesta = await pagina.goto(`${baseUrl}${ruta}`, { waitUntil: "networkidle" });
      if (!respuesta?.ok()) {
        fallos.push(`${ruta}: respuesta HTTP ${respuesta?.status()}`);
        continue;
      }

      // Las rutas se cargan con lazy(), asi que primero aparece el spinner de
      // Suspense. Si lo que se guarda es el spinner, el prerender no sirve de
      // nada y ademas mete una ruleta girando en el HTML de todos.
      await pagina.waitForFunction(() => {
        const nodo = document.getElementById("root");
        return nodo && nodo.querySelector("h1") && !nodo.querySelector(".animate-spin");
      }, null, { timeout: 15000 });

      // Las partículas son decoración que el navegador genera al cargar (hasta
      // 96 nodos por campo). Guardarlas en el HTML estático lo engordaba un 37 %
      // sin que ningún rastreador las leyera: se vacían antes de capturar.
      const cuerpo = await pagina.evaluate(() => {
        document.querySelectorAll(".particle-field").forEach((campo) => campo.replaceChildren());
        return document.getElementById("root").innerHTML;
      });
      const archivo = archivoDe(ruta);
      const html = await fs.readFile(archivo, "utf8");
      if (!html.includes(MARCA)) {
        fallos.push(`${ruta}: ${path.relative(root, archivo)} no tiene el <div id="root"> vacio`);
        continue;
      }
      await fs.writeFile(archivo, html.replace(MARCA, `<div id="root">${cuerpo}</div>`));
      escritas += 1;
      bytes += Buffer.byteLength(cuerpo);
    } catch (error) {
      fallos.push(`${ruta}: ${error.message.split("\n")[0]}`);
    } finally {
      await pagina.close();
    }
  }

  await navegador.close();
} finally {
  servidor.kill();
}

if (fallos.length) {
  console.error(`\nPrerender: ${fallos.length} rutas sin cuerpo\n`);
  for (const fallo of fallos) console.error(`  ✗ ${fallo}`);
  process.exit(1);
}

console.log(`Cuerpo prerenderizado en ${escritas} rutas (${Math.round(bytes / 1024)} kB de HTML).`);
