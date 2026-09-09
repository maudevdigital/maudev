import { chromium } from "playwright";

// Comprobación contra el sitio DESPLEGADO. Es la única que ve lo que ninguna
// suite local puede: Cloudflare Pages inyecta su propio script de analítica solo
// en producción, y las cabeceras reales (CSP incluida) las sirve Cloudflare, no
// `vite preview`.
const base = process.argv[2];
if (!base) throw new Error("uso: npm run test:deployed -- https://maudev.cl");

const browser = await chromium.launch();
const fallos = [];
const ok = (cond, msg) => { if (!cond) fallos.push(msg); };

for (const consent of [
  { nombre: "sin consentimiento", valor: { version: 2, analytics: false, marketing: false } },
  { nombre: "todo aceptado", valor: { version: 2, analytics: true, marketing: true } },
]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((v) => {
    localStorage.setItem("maudev_consent_v2", JSON.stringify(v));
    localStorage.setItem("theme", "light");
    sessionStorage.setItem("chat_seen", "1");
  }, consent.valor);

  const page = await ctx.newPage();
  const violaciones = [];
  const errores = [];
  await page.exposeFunction("reportarCsp", (v) => violaciones.push(v));
  await ctx.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      window.reportarCsp?.(`${e.effectiveDirective || e.violatedDirective} <- ${(e.blockedURI || "inline").split("?")[0]}`);
    });
  });
  page.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
  page.on("pageerror", (e) => errores.push(e.message));

  const rutas = ["/", "/precios", "/contacto", "/servicios/landing-page", "/en"];
  for (const r of rutas) {
    // domcontentloaded y no networkidle: /contacto nunca queda en silencio
    // porque el widget de Turnstile sondea a Cloudflare en segundo plano.
    const res = await page.goto(base + r, { waitUntil: "domcontentloaded" });
    ok(res?.ok(), `${r}: HTTP ${res?.status()}`);
    await page.waitForTimeout(1200);
  }

  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const estado = await page.evaluate(() => ({
    ga: Boolean(document.getElementById("maudev-ga")),
    pixel: Boolean(document.getElementById("maudev-pixel")),
    gtag: typeof window.gtag === "function",
    fbq: typeof window.fbq === "function",
    glow: Boolean(document.querySelector(".pointer-glow")),
    particulas: document.querySelectorAll(".particle").length,
  }));

  const debe = consent.valor.analytics;
  ok(estado.ga === debe, `[${consent.nombre}] Google Analytics ${estado.ga ? "cargó" : "no cargó"} y debía ${debe ? "cargar" : "no cargar"}`);
  ok(estado.pixel === consent.valor.marketing, `[${consent.nombre}] Meta Pixel ${estado.pixel ? "cargó" : "no cargó"} y debía ${consent.valor.marketing ? "cargar" : "no cargar"}`);
  ok(violaciones.length === 0, `[${consent.nombre}] violaciones de CSP: ${[...new Set(violaciones)].join(" | ")}`);
  ok(errores.length === 0, `[${consent.nombre}] errores de consola: ${[...new Set(errores)].slice(0, 3).join(" | ")}`);

  console.log(`\n── ${consent.nombre}`);
  console.log(`   GA ${estado.ga ? "sí" : "no"} · Pixel ${estado.pixel ? "sí" : "no"} · gtag ${estado.gtag} · fbq ${estado.fbq}`);
  console.log(`   foco de luz: ${estado.glow ? "presente" : "AUSENTE"} · partículas: ${estado.particulas}`);
  console.log(`   violaciones CSP: ${violaciones.length} · errores de consola: ${errores.length}`);
  if (violaciones.length) console.log("   " + [...new Set(violaciones)].join("\n   "));
  if (errores.length) console.log("   " + [...new Set(errores)].slice(0, 5).join("\n   "));
  await ctx.close();
}

await browser.close();
if (fallos.length) {
  console.error(`\nFALLOS (${fallos.length}):\n- ${fallos.join("\n- ")}`);
  process.exit(1);
}
console.log("\nSitio desplegado verificado: consentimiento, CSP y consola limpios.");
