// Verifica el destino de las URLs del blog eliminado contra el runtime real de
// Cloudflare Pages (`wrangler pages dev`), que es el único que ejecuta
// functions/blog/[[path]].js y aplica _redirects.
//
// Va aparte de validate-site.mjs porque ese corre sobre `vite preview`, que no
// conoce ni las Functions ni _redirects.
//
// Uso: npm run test:redirects   (requiere haber hecho `npm run build` antes)

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const port = 8793;
const base = `http://127.0.0.1:${port}`;

// Muestra representativa: dos con equivalente, tres sin él, la raíz del blog y
// un slug inventado (nadie debe caer en la portada con un 200).
const expectations = [
  { url: "/blog", status: 410 },
  { url: "/blog/que-es-una-automatizacion", status: 301, location: "/inteligencia-artificial" },
  { url: "/blog/cuanto-cuesta-software-a-medida-2026", status: 301, location: "/desarrollo" },
  { url: "/blog/cuanto-cuesta-pagina-web-carrito-compras-2026", status: 301, location: "/desarrollo" },
  { url: "/blog/checklist-seo-tecnico", status: 410 },
  { url: "/blog/seo-local-en-chile", status: 410 },
  { url: "/blog/slug-que-nunca-existio", status: 410 },
  // Las rutas vivas no pueden verse afectadas por la Function.
  { url: "/", status: 200 },
  { url: "/inteligencia-artificial", status: 200 },
  { url: "/casos/systempro", status: 200 },
];

await fs.access(path.join(root, "dist", "index.html")).catch(() => {
  console.error("No hay dist/. Corre `npm run build` primero.");
  process.exit(1);
});

// `shell: true` es obligatorio en Windows: npx es un .cmd y spawn() directo
// falla con EINVAL desde Node 20.
const server = spawn(
  "npx",
  ["--yes", "wrangler@latest", "pages", "dev", "dist", "--port", String(port), "--ip", "127.0.0.1", "--compatibility-date=2026-01-01"],
  { cwd: root, stdio: "ignore", shell: true }
);

const failures = [];

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      await fetch(base, { redirect: "manual" });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("wrangler pages dev no respondió.");
}

try {
  await waitForServer();

  for (const expected of expectations) {
    const response = await fetch(`${base}${expected.url}`, { redirect: "manual" });
    if (response.status !== expected.status) {
      failures.push(`${expected.url}: esperaba ${expected.status}, recibió ${response.status}`);
      continue;
    }
    if (expected.location) {
      const location = new URL(response.headers.get("location"), base).pathname;
      if (location !== expected.location) {
        failures.push(`${expected.url}: esperaba redirigir a ${expected.location}, fue a ${location}`);
      }
    }
  }
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`Redirecciones con problemas (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Redirecciones correctas: ${expectations.length} comprobaciones (301 con equivalente, 410 sin él, rutas vivas intactas).`);
