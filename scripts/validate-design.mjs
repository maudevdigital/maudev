import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const base = "http://127.0.0.1:4182";
const capture = process.argv.includes("--screenshots");
const server = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4182", "--strictPort"], { cwd: root, stdio: "ignore" });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Esperar al preview. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, "El preview no inició");
  browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.route("**challenges.cloudflare.com**", route => route.fulfill({ status: 200, body: "" }));
  // Conversión determinista con las tasas de respaldo, sin consultar un proveedor.
  await context.route("**open.er-api.com**", route => route.fulfill({ status: 503, body: "" }));
  await context.addInitScript(() => localStorage.setItem("maudev_consent_v1", "denied"));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  for (const theme of ["light", "dark"]) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(value => {
        document.documentElement.classList.toggle("dark", value === "dark");
        localStorage.setItem("theme", value);
      }, theme);
      assert(await page.locator("h1").count() === 1, "Un único encabezado principal");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width}: desbordamiento`);
      const header = await page.locator("header").boundingBox();
      const heading = await page.locator("h1").boundingBox();
      assert(heading.y > header.y + header.height, `${theme} ${width}: el menú tapa el titular`);
      await page.locator("#cotizador > summary").click();
      assert(await page.getByRole("heading", { name: "Estima tu inversión" }).isVisible());
      await page.getByRole("button", { name: "Tienda online", exact: true }).click();
      await page.getByRole("button", { name: "8 o más", exact: true }).click();
      assert.match(await page.getByRole("link", { name: "Pedir precio por escrito" }).getAttribute("href"), /tipo=tienda&tamano=grande/);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width}: cotizador desborda`);
      await page.locator("#cotizador > summary").click();

      if (capture && [390, 1440].includes(width)) {
        await page.evaluate(() => document.fonts.ready);
        await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(img => { img.loading = "eager"; }));
        await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
        await page.evaluate(() => scrollTo(0, 0));
        await fs.mkdir(path.join(root, "docs/redesign"), { recursive: true });
        await page.screenshot({ path: path.join(root, `docs/redesign/${theme}-${width}.jpg`), fullPage: true, type: "jpeg", quality: 75 });
        if (theme === "light" && width === 1440) {
          await page.screenshot({ path: path.join(root, "docs/redesign/portada.jpg"), type: "jpeg", quality: 85 });
        }
      }
    }
  }

  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Usar tema claro" }).click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains("dark")), false, "El tema debe persistir");
  await page.getByRole("button", { name: /Moneda:.*Cambiar moneda/ }).filter({ visible: true }).click();
  await page.getByRole("option", { name: "USD", exact: true }).click();
  await page.locator("#cotizador > summary").click();
  assert.match(await page.locator("#cotizador").innerText(), /USD/);
  assert.match(await page.locator("#cotizador dl").innerText(), /≈/);

  await page.getByRole("button", { name: "Explorar este plan" }).first().click();
  assert(await page.getByRole("dialog", { name: "Presencia", exact: true }).isVisible());
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.locator(".service-extras > summary").click();
  assert(await page.locator('.service-extras a[href="/apps-moviles"]').isVisible());
  assert(await page.locator('.service-extras a[href="/diseno"]').isVisible());
  await page.locator(".footer-catalog > summary").first().click();
  assert(await page.locator(".footer-catalog").first().getByRole("link").first().isVisible());

  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole("button", { name: "Servicios", exact: true }).click();
  assert(await page.locator("#mega-servicios").isVisible());
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#mega-servicios").count(), 0);
  await page.getByRole("button", { name: "Abrir chat" }).click();
  assert(await page.getByRole("dialog", { name: "Opciones de contacto" }).isVisible());
  await page.keyboard.press("Escape");
  assert(await page.getByRole("button", { name: "Abrir chat" }).evaluate(el => el === document.activeElement));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: "Planes", exact: true }).click();
  assert.equal(await page.locator("#menu-movil").count(), 0);
  assert.equal(new URL(page.url()).hash, "#planes");
  assert.equal(await page.evaluate(() => document.body.style.position), "");
  await page.waitForFunction(() => {
    const y = document.getElementById("planes").getBoundingClientRect().top;
    return y >= 0 && y < 160;
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  assert.equal(await page.getByRole("dialog", { name: "Opciones de contacto" }).count(), 0, "La ayuda no debe abrirse automáticamente");
  assert.deepEqual(errors, [], "Errores de ejecución");
  console.log("Diseño validado: 10 combinaciones de tema/ancho, cotizador, moneda, planes, catálogo, menús y ayuda.");
} finally {
  await browser?.close();
  server.kill();
}
