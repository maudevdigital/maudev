// Regenera el logo cuadrado usado por los datos estructurados del sitio.
// Ejecuta: npm run gen:logo
import sharp from "sharp";
import { mkdirSync } from "fs";

const CYAN = "#19d4d4";
const OUT = "public";
mkdirSync(OUT, { recursive: true });

// Marca cuadrada (idéntica a Logo.jsx) parametrizada por color.
const mark = (color, size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="14" fill="${color}" fill-opacity="0.08"/>
  <rect x="2" y="2" width="60" height="60" rx="13" fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="1.5"/>
  <g font-family="ui-monospace, Menlo, Consolas, monospace" font-weight="800" fill="${color}">
    <text x="10" y="42" font-size="22">m</text>
    <text x="28" y="42" font-size="22">/</text>
    <text x="40" y="42" font-size="22">d</text>
  </g>
  <circle cx="54" cy="14" r="3" fill="${color}"/>
</svg>`;

const jobs = [{ svg: mark(CYAN, 1024), file: "logo-1024.png" }];

for (const j of jobs) {
  await sharp(Buffer.from(j.svg)).png().toFile(`${OUT}/${j.file}`);
  const meta = await sharp(`${OUT}/${j.file}`).metadata();
  console.log(`${j.file}: ${meta.width}x${meta.height}`);
}
