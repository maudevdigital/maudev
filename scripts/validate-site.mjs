import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "http://127.0.0.1:4180";
const routes = [
  "/",
  "/automatizacion",
  "/software-a-medida",
  "/desarrollo-web",
  "/ecommerce",
  "/mantencion",
  "/casos",
  "/casos/systempro",
  "/casos/scissorhands",
  "/casos/partsmr",
  "/casos/paraguayaccess",
  "/nosotros",
  "/contacto",
  "/automatizaciones/agenda-automatica",
  "/terminos",
  "/privacidad",
];

const server = spawn(process.execPath, [
  path.join(root, "node_modules", "vite", "bin", "vite.js"),
  "preview",
  "--host", "127.0.0.1",
  "--port", "4180",
], { cwd: root, stdio: "ignore" });

const failures = [];
const internalLinks = new Set();
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // El preview todavía está iniciando.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("El servidor de preview no respondió.");
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await context.addInitScript(() => {
    localStorage.setItem("maudev_consent_v1", "denied");
    localStorage.setItem("theme", "light");
    sessionStorage.setItem("chat_seen", "1");
  });

  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    assert(response?.ok(), `${route}: respuesta HTTP ${response?.status()}`);
    assert(await page.locator("h1").count() === 1, `${route}: debe tener exactamente un H1`);
    assert(
      await page.evaluate(() => document.documentElement.lang) === "es-CL",
      `${route}: el atributo lang debe ser es-CL`
    );
    // El blog se eliminó: ninguna página puede volver a enlazarlo.
    assert(
      await page.locator('a[href*="/blog"]').count() === 0,
      `${route}: hay un enlace al blog eliminado`
    );
    // Sin schema de artículos (el sitio ya no publica contenido editorial).
    const ldTypes = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (nodes) => nodes.map((node) => node.textContent).join(" ")
    );
    assert(
      !/"@type"\s*:\s*"(Article|BlogPosting|NewsArticle)"/.test(ldTypes),
      `${route}: contiene schema de artículo`
    );
    assert((await page.title()).includes("Maudev"), `${route}: title ausente o incompleto`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    const expectedCanonical = route === "/" ? "https://maudev.cl/" : `https://maudev.cl${route}`;
    assert(canonical === expectedCanonical, `${route}: canonical incorrecta (${canonical})`);
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `${route}: desbordamiento horizontal`);
    assert(errors.length === 0, `${route}: errores de consola: ${errors.join(" | ")}`);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    hrefs.forEach((href) => internalLinks.add(href.split("#")[0] || "/"));
    await page.close();
  }

  const linkPage = await context.newPage();
  for (const href of internalLinks) {
    await linkPage.goto(`${baseUrl}${href}`, { waitUntil: "networkidle" });
    const isNotFound = await linkPage.getByRole("heading", { name: "Esta ruta no lleva a ningún proceso." }).count();
    assert(isNotFound === 0, `Enlace interno roto: ${href}`);
  }
  await linkPage.close();

  const responsivePage = await context.newPage();
  for (const width of [360, 390, 768, 1024, 1440]) {
    await responsivePage.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await responsivePage.goto(baseUrl, { waitUntil: "networkidle" });
    assert(!(await responsivePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `Home ${width}px: desbordamiento horizontal`);
  }

  await responsivePage.setViewportSize({ width: 390, height: 844 });
  await responsivePage.goto(baseUrl, { waitUntil: "networkidle" });
  const menuButton = responsivePage.getByRole("button", { name: "Abrir menú" });
  assert(await menuButton.count() === 1, "Menú móvil: botón no encontrado");
  await menuButton.click();
  assert(await responsivePage.getByRole("navigation", { name: "Navegación móvil" }).isVisible(), "Menú móvil: no se abrió");
  await responsivePage.keyboard.press("Escape");
  assert(await responsivePage.getByRole("navigation", { name: "Navegación móvil" }).count() === 0, "Menú móvil: Escape no lo cerró");
  await responsivePage.close();

  const formPage = await context.newPage();
  await formPage.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("webhook") || url.includes("workers.dev")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    } else {
      await route.continue();
    }
  });
  await formPage.goto(`${baseUrl}/contacto`, { waitUntil: "networkidle" });
  const visibleFields = formPage.locator("form input:not([aria-hidden='true']), form textarea, form select");
  const unlabeled = await visibleFields.evaluateAll((elements) => elements.filter((element) => !element.labels?.length && !element.getAttribute("aria-label")).length);
  assert(unlabeled === 0, `Formulario: ${unlabeled} campos sin etiqueta`);
  await formPage.getByRole("button", { name: "Enviar mi proceso" }).click();
  assert(await formPage.getByRole("alert").isVisible(), "Formulario: no muestra error al enviar vacío");
  await formPage.getByLabel("Nombre").fill("Prueba QA");
  await formPage.getByLabel("Empresa o tipo de negocio").fill("Empresa de prueba");
  await formPage.getByLabel("Qué necesitas").fill("Validar el envio del formulario sin contactar servicios externos.");
  await formPage.getByLabel("Correo o WhatsApp").fill("qa@example.com");
  await formPage.getByRole("button", { name: "Enviar mi proceso" }).click();
  await formPage.getByRole("heading", { name: "Mensaje recibido" }).waitFor({ state: "visible" });
  await formPage.close();

  const sitemap = await fs.readFile(path.join(root, "public", "sitemap.xml"), "utf8");
  for (const route of routes.slice(0, 13)) {
    const expected = route === "/" ? "https://maudev.cl/" : `https://maudev.cl${route}`;
    assert(sitemap.includes(`<loc>${expected}</loc>`), `Sitemap: falta ${expected}`);
  }
  assert(!/\/blog/.test(sitemap), "Sitemap: contiene URLs del blog eliminado");

  // Las páginas prerenderizadas deben quedar como `ruta.html` y NO como
  // `ruta/index.html`. Con la forma de directorio, Cloudflare Pages sirve la
  // URL con barra final y devuelve 308 a la que publica el sitemap: cada
  // página de servicio aparecería en Search Console como "URL con redirección".
  for (const route of ["/automatizacion", "/software-a-medida", "/desarrollo-web", "/ecommerce", "/mantencion", "/casos", "/nosotros", "/contacto"]) {
    const flat = path.join(root, "dist", `${route.slice(1)}.html`);
    const asDirectory = path.join(root, "dist", route.slice(1), "index.html");
    assert(
      await fs.access(flat).then(() => true, () => false),
      `Prerender: falta dist${route}.html`
    );
    assert(
      await fs.access(asDirectory).then(() => false, () => true),
      `Prerender: dist${route}/index.html provocaría un 308 hacia la barra final`
    );
  }

  // El destino de /blog/* vive en una Function de Cloudflare, no en _redirects:
  // un 301 masivo a la portada sería un soft 404.
  const redirects = await fs.readFile(path.join(root, "public", "_redirects"), "utf8");
  const blogRule = redirects.split("\n").find((line) => /^\/blog/.test(line.trim()));
  assert(!blogRule, `_redirects: /blog debe resolverse en functions/blog, no acá (${blogRule})`);
  const blogFunction = await fs.readFile(path.join(root, "functions", "blog", "[[path]].js"), "utf8");
  assert(/status:\s*410/.test(blogFunction), "functions/blog: falta la respuesta 410 Gone");

  await context.close();
  await browser.close();
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`Validación fallida (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validación completa: ${routes.length} rutas, 5 viewports, menú móvil, formulario, consola y sitemap.`);
