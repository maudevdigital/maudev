// Genera gráficos inline branded para los blogs (stat cards / quote cards), sin IA.
// Uso:
//   node scripts/gen-blog-graphic.mjs stat  "<slug>" "<NÚMERO>" "<bajada>"
//   node scripts/gen-blog-graphic.mjs quote "<slug>" "<frase>"  "<autor/contexto>"
import sharp from "sharp";

const CYAN = "#19d4d4";
const [, , kind = "stat", slug = "graphic", a = "", b = ""] = process.argv;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, max) {
  const words = String(text).split(" ");
  const lines = []; let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; }
    else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

const W = 1200, H = 675;
const base = `
  <defs>
    <radialGradient id="g" cx="80%" cy="20%" r="75%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.18"/><stop offset="60%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#262626" stroke-opacity="0.5" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="${CYAN}"/>
  <text x="64" y="84" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="34" fill="#fafafa">mau<tspan fill="${CYAN}">dev</tspan></text>`;

let body = "";
if (kind === "stat") {
  body = `
    <text x="64" y="360" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="200" fill="${CYAN}">${esc(a)}</text>
    ${wrap(b, 40).map((ln, i) => `<text x="68" y="${440 + i * 52}" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="40" fill="#fafafa">${esc(ln)}</text>`).join("")}`;
} else {
  const lines = wrap(a, 28);
  const fs = lines.length > 3 ? 56 : 66;
  const startY = 300 - ((lines.length - 1) * fs * 1.15) / 2;
  body = `
    <text x="64" y="200" font-family="Georgia, serif" font-size="120" fill="${CYAN}" opacity="0.4">&#8220;</text>
    ${lines.map((ln, i) => `<text x="70" y="${startY + i * fs * 1.15}" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="${fs}" fill="#fafafa">${esc(ln)}</text>`).join("")}
    <text x="70" y="${startY + lines.length * fs * 1.15 + 30}" font-family="Consolas, monospace" font-size="26" fill="${CYAN}">${esc(b)}</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${base}${body}
  <text x="${W - 64}" y="${H - 48}" text-anchor="end" font-family="Consolas, monospace" font-size="24" fill="#a3a3a3">maudev.cl</text></svg>`;

await sharp(Buffer.from(svg)).png().toFile(`public/blog/${slug}.png`);
console.log(`public/blog/${slug}.png generado (${kind})`);
