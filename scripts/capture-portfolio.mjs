// ─────────────────────────────────────────────────────────────────────────────
// Captura automática de las vistas previas del portafolio.
//
//   node scripts/capture-portfolio.mjs              → todos los proyectos
//   node scripts/capture-portfolio.mjs scissorhands → solo uno
//
// ── Por qué esto y no un <iframe> en vivo ──
// Verificado empíricamente: los sitios responden con `X-Frame-Options: DENY` y
// `frame-ancestors 'none'`. Ningún navegador los va a embeber, y está bien que
// sea así: es la defensa contra clickjacking. En vez de debilitar la seguridad
// de sitios de clientes, capturamos de verdad y con frecuencia.
//
// Requiere Playwright (solo en desarrollo, no viaja al bundle):
//   npm i -D playwright && npx playwright install chromium
//
// Se ejecuta solo cada semana vía .github/workflows/capture-portfolio.yml
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync, statSync } from "fs";
import path from "path";

const OUT_DIR = "public/portfolio";
const WIDTH = 1280;
const MAX_HEIGHT = 2560; // 2:1 → dispara el scroll-on-hover de SitePreview
const MAX_KB = 220;
const FORMAT = "webp"; // ~10x más liviano que PNG en estos renders

// Leemos id y url directamente del archivo de datos, sin importarlo:
// projects.js usa alias "@/..." que Node no resuelve fuera de Vite.
function readProjects() {
  const src = readFileSync("src/data/projects.js", "utf8");
  const out = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], url: m[2] });
  return out;
}

async function capture(page, { id, url }) {
  const dest = path.join(OUT_DIR, `${id}.${FORMAT}`);
  process.stdout.write(`  ${id.padEnd(16)} ${url} … `);

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

  // Muchos sitios animan la entrada por scroll. Bajamos y volvemos a subir
  // para que todo termine de aparecer antes de disparar.
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 180);
        else { window.scrollTo(0, 0); setTimeout(res, 900); }
      };
      step();
    });
  });

  // Red de seguridad: si alguna animación de entrada quedó a medias, el texto
  // se queda en opacity:0 y la captura sale con un bloque en blanco o negro.
  // Le pasa hoy al sitio de Scissorhands (los `.reveal` del hero nunca reciben
  // su clase). Forzamos visible cualquier elemento con texto que siga invisible
  // por transición — no cambia el sitio real, solo la captura.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.05 && el.textContent.trim().length > 2) {
        el.style.setProperty("opacity", "1", "important");
        el.style.setProperty("transform", "none", "important");
        el.style.setProperty("transition", "none", "important");
      }
    }
  });

  await page.waitForTimeout(1200);

  const full = await page.screenshot({ fullPage: true, type: "png" });

  // Recortamos por arriba y por el costado.
  //
  // El alto: una home de 8000px daría un scroll-on-hover eterno.
  //
  // El ancho: `fullPage` no captura el viewport, captura toda el área
  // desplazable. Un sitio con desbordamiento horizontal —ParaguayAccess se pasa
  // 80px— devuelve una imagen más ancha que WIDTH, y esa franja sobrante sale
  // vacía: en el portafolio se veía como una barra blanca vertical pegada al
  // borde derecho de la tarjeta. Se recortó a mano una vez y la siguiente
  // ejecución programada la trajo de vuelta, así que se corrige acá.
  const meta = await sharp(full).metadata();
  const ancho = Math.min(meta.width, WIDTH);
  const alto = Math.min(meta.height, MAX_HEIGHT);
  let img = sharp(full);
  if (ancho !== meta.width || alto !== meta.height) {
    img = img.extract({ left: 0, top: 0, width: ancho, height: alto });
  }

  mkdirSync(OUT_DIR, { recursive: true });
  await img.webp({ quality: 82, effort: 6 }).toFile(dest);

  let kb = Math.round(statSync(dest).size / 1024);
  // Si sigue pesada, bajamos a la mitad de resolución antes que degradar más.
  if (kb > MAX_KB) {
    await sharp(dest).resize({ width: Math.round(WIDTH / 1.6) })
      .webp({ quality: 78, effort: 6 }).toFile(dest + ".tmp");
    const { renameSync } = await import("fs");
    renameSync(dest + ".tmp", dest);
    kb = Math.round(statSync(dest).size / 1024);
  }

  console.log(`ok · ${ancho}x${alto} · ${kb}KB`);
}

const only = process.argv[2];
const projects = readProjects().filter((p) => !only || p.id === only);

if (!projects.length) {
  console.error(only ? `No existe el proyecto "${only}".` : "No se encontraron proyectos.");
  process.exit(1);
}

console.log(`\nCapturando ${projects.length} sitio(s) a ${WIDTH}px de ancho:\n`);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: 800 },
  deviceScaleFactor: 1,
  // Algunos sitios sirven banners de cookies distintos según idioma.
  locale: "es-CL",
});
const page = await ctx.newPage();

let fallidos = 0;
for (const p of projects) {
  try {
    await capture(page, p);
  } catch (e) {
    fallidos++;
    console.log(`FALLÓ — ${String(e.message).split("\n")[0].slice(0, 90)}`);
    // No abortamos: que un sitio caído no impida actualizar el resto.
    // Si falla, se conserva la captura anterior y SitePreview sigue mostrándola.
  }
}

await browser.close();

console.log(
  `\n${projects.length - fallidos}/${projects.length} capturas actualizadas en ${OUT_DIR}/\n`
);
if (fallidos && !existsSync(OUT_DIR)) process.exit(1);
