// Genera una portada de blog branded (1200x630) por código, sin IA.
// Uso: node scripts/gen-blog-cover.mjs "<título>" "<categoría>" "<slug>" [readMin]
import sharp from "sharp";

const CYAN = "#19d4d4";
const [, , title = "Sin título", category = "Desarrollo", slug = "post", readMin = "20"] = process.argv;

// Envuelve el título en líneas de ~22 chars (mayúsculas pesan más).
function wrap(text, max = 22) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; }
    else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const lines = wrap(title);
const fs = lines.length > 3 ? 64 : 74;
const startY = 385 - ((lines.length - 1) * fs * 1.12) / 2; // centrado bajo el chip

const titleSvg = lines
  .map((ln, i) => `<text x="70" y="${startY + i * fs * 1.12}" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="${fs}" fill="#fafafa">${esc(ln)}</text>`)
  .join("\n");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="22%" r="70%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.20"/>
      <stop offset="60%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#262626" stroke-opacity="0.5" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="10" height="630" fill="${CYAN}"/>

  <!-- wordmark -->
  <text x="70" y="92" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="38" fill="#fafafa">mau<tspan fill="${CYAN}">dev</tspan></text>

  <!-- categoría -->
  <g transform="translate(70,140)">
    <rect x="0" y="0" width="${50 + category.length * 13}" height="40" rx="10" fill="${CYAN}" fill-opacity="0.12" stroke="${CYAN}" stroke-opacity="0.5"/>
    <text x="20" y="27" font-family="Consolas, monospace" font-weight="700" font-size="20" letter-spacing="2" fill="${CYAN}">${esc(category.toUpperCase())}</text>
  </g>

  <!-- título -->
  ${titleSvg}

  <!-- footer -->
  <text x="70" y="560" font-family="Consolas, monospace" font-size="24" fill="#a3a3a3">maudev.cl</text>
  <text x="1130" y="560" text-anchor="end" font-family="Consolas, monospace" font-size="24" fill="${CYAN}">${esc(readMin)} min de lectura</text>
  <line x1="70" y1="585" x2="1130" y2="585" stroke="#262626" stroke-width="1"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(`public/blog/${slug}.png`);
console.log(`public/blog/${slug}.png generado (${lines.length} líneas, fs ${fs})`);
