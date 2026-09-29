// Motor de CARRUSELES 2.0 (semana 6-12 jul) — slides 1080x1350 con diseño real:
// portada, stat gigante, listas numeradas, comparativa 2 columnas, quote y CTA.
// Basado en búsquedas reales de Google Chile (AnswerThePublic).
// Ejecuta: node scripts/gen-carousel-w2.mjs  →  public/social/cw2-{id}-{n}.png
import sharp from "sharp";

const CYAN = "#19d4d4", BG = "#0a0a0a", CARD = "#121417", TEXT = "#fafafa",
  MUTE = "#9aa4b0", LINE = "#23272d", AMBER = "#f5b544";
const W = 1080, H = 1350;

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
const tspan = (lines, x, y, lh, style) =>
  lines.map((ln, i) => `<text x="${x}" y="${y + i * lh}" ${style}>${esc(ln)}</text>`).join("");

const F = 'font-family="Segoe UI, Arial, sans-serif"';
const FM = 'font-family="Consolas, monospace"';

// Marco común: fondo, grid, glow, wordmark, contador de slide, footer y flecha.
function frame(inner, { n, total, last = false, accent = CYAN }) {
  const dots = Array.from({ length: total }, (_, i) =>
    `<circle cx="${W - 64 - (total - 1 - i) * 26}" cy="78" r="${i === n - 1 ? 7 : 5}" fill="${i === n - 1 ? accent : "#3a4048"}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="85%" cy="10%" r="80%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/><stop offset="55%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="8%" cy="95%" r="70%">
      <stop offset="0%" stop-color="#5b6cff" stop-opacity="0.10"/><stop offset="60%" stop-color="#5b6cff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0H0V54" fill="none" stroke="#20242a" stroke-opacity="0.55" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="${accent}"/>
  <text x="64" y="92" ${F} font-weight="800" font-size="38" fill="${TEXT}">mau<tspan fill="${accent}">dev</tspan></text>
  ${dots}
  ${inner}
  <text x="64" y="${H - 54}" ${FM} font-size="24" fill="#6b7480">maudev.cl</text>
  <text x="${W - 64}" y="${H - 54}" text-anchor="end" ${FM} font-size="24" fill="#6b7480">@maudev.cl</text>
  ${last ? "" : `<text x="${W - 64}" y="${H - 120}" text-anchor="end" ${F} font-weight="800" font-size="64" fill="${accent}">»</text>`}
</svg>`;
}

// ── layouts ──────────────────────────────────────────────────────────────────
function coverSlide(s, meta) {
  const title = wrap(s.title, 17);
  const sub = wrap(s.sub, 34);
  const ty = 420;
  return frame(`
    <rect x="64" y="300" width="56" height="8" fill="${CYAN}"/>
    <text x="64" y="360" ${FM} font-size="30" fill="${CYAN}" letter-spacing="6">${esc(s.kicker.toUpperCase())}</text>
    ${tspan(title, 64, ty + 76, 108, `${F} font-weight="800" font-size="96" fill="${TEXT}" letter-spacing="-2"`)}
    ${tspan(sub, 64, ty + 76 + title.length * 108 + 40, 52, `${F} font-size="38" fill="${MUTE}"`)}
  `, meta);
}
function statSlide(s, meta) {
  const label = wrap(s.label, 26);
  const sub = s.sub ? wrap(s.sub, 40) : [];
  return frame(`
    <text x="64" y="560" ${F} font-weight="800" font-size="230" fill="${CYAN}" letter-spacing="-6">${esc(s.big)}</text>
    ${tspan(label, 68, 660, 68, `${F} font-weight="800" font-size="54" fill="${TEXT}"`)}
    ${sub.length ? `<rect x="64" y="${660 + label.length * 68 + 28}" width="640" height="2" fill="${LINE}"/>` : ""}
    ${tspan(sub, 68, 660 + label.length * 68 + 78, 44, `${F} font-size="32" fill="${MUTE}"`)}
  `, meta);
}
function listSlide(s, meta) {
  const title = wrap(s.title, 22);
  let y = 330 + title.length * 74;
  let items = "";
  for (const it of s.items) {
    const head = wrap(it.head, 30);
    const sub = it.sub ? wrap(it.sub, 44) : [];
    const boxH = 56 + head.length * 52 + sub.length * 40 + (sub.length ? 14 : 0);
    items += `
      <rect x="64" y="${y}" width="${W - 128}" height="${boxH}" rx="18" fill="${CARD}" stroke="${LINE}" stroke-width="1.5"/>
      <rect x="64" y="${y}" width="8" height="${boxH}" rx="4" fill="${meta.accent || CYAN}"/>
      <circle cx="128" cy="${y + 52}" r="30" fill="${meta.accent || CYAN}" fill-opacity="0.14" stroke="${meta.accent || CYAN}" stroke-width="2"/>
      <text x="128" y="${y + 65}" text-anchor="middle" ${F} font-weight="800" font-size="34" fill="${meta.accent || CYAN}">${esc(it.n)}</text>
      ${tspan(head, 186, y + 62, 52, `${F} font-weight="800" font-size="40" fill="${TEXT}"`)}
      ${tspan(sub, 186, y + 62 + head.length * 52 + 6, 40, `${F} font-size="29" fill="${MUTE}"`)}
    `;
    y += boxH + 26;
  }
  return frame(`
    ${tspan(title, 64, 300, 74, `${F} font-weight="800" font-size="62" fill="${TEXT}" letter-spacing="-1"`)}
    ${items}
  `, meta);
}
function compareSlide(s, meta) {
  const colW = (W - 128 - 28) / 2;
  const col = (x, head, items, color) => {
    let y = 500;
    let out = `
      <rect x="${x}" y="380" width="${colW}" height="800" rx="20" fill="${CARD}" stroke="${LINE}" stroke-width="1.5"/>
      <rect x="${x}" y="380" width="${colW}" height="86" rx="20" fill="${color}" fill-opacity="0.14"/>
      <text x="${x + colW / 2}" y="${380 + 56}" text-anchor="middle" ${F} font-weight="800" font-size="38" fill="${color}">${esc(head)}</text>`;
    for (const it of items) {
      const lines = wrap(it, 22);
      out += `<circle cx="${x + 38}" cy="${y + 14}" r="6" fill="${color}"/>` +
        tspan(lines, x + 62, y + 24, 42, `${F} font-size="31" fill="${TEXT}"`);
      y += lines.length * 42 + 30;
    }
    return out;
  };
  const title = wrap(s.title, 24);
  return frame(`
    ${tspan(title, 64, 300, 70, `${F} font-weight="800" font-size="58" fill="${TEXT}" letter-spacing="-1"`)}
    ${col(64, s.left.head, s.left.items, MUTE === s.leftColor ? MUTE : (s.leftColor || AMBER))}
    ${col(64 + colW + 28, s.right.head, s.right.items, CYAN)}
  `, meta);
}
function quoteSlide(s, meta) {
  const lines = wrap(s.text, 20);
  const startY = 560;
  const sub = s.sub ? wrap(s.sub, 38) : [];
  return frame(`
    <text x="60" y="440" font-family="Georgia, serif" font-size="200" fill="${CYAN}" opacity="0.35">&#8220;</text>
    ${tspan(lines, 64, startY, 92, `${F} font-weight="800" font-size="74" fill="${TEXT}" letter-spacing="-1.5"`)}
    <rect x="64" y="${startY + lines.length * 92 + 10}" width="90" height="6" fill="${CYAN}"/>
    ${tspan(sub, 64, startY + lines.length * 92 + 66, 46, `${F} font-size="33" fill="${MUTE}"`)}
  `, meta);
}
function ctaSlide(s, meta) {
  const title = wrap(s.title, 26);
  const tY = 400;
  const guiaY = tY + title.length * 66 + 150;
  const line = wrap(s.line, 30);
  const lineY = guiaY + 96;
  const arrowY = lineY + line.length * 54 + 40;
  const pillW = Math.min(W - 160, s.sub.length * 17 + 90);
  const pillY = arrowY + 110;
  return frame(`
    ${tspan(title, W / 2, tY, 66, `${F} font-weight="700" font-size="50" fill="${TEXT}" text-anchor="middle"`)}
    <text x="${W / 2}" y="${guiaY}" text-anchor="middle" ${F} font-weight="800" font-size="170" fill="${CYAN}" letter-spacing="2">GUÍA</text>
    ${tspan(line, W / 2, lineY, 54, `${F} font-weight="700" font-size="42" fill="${TEXT}" text-anchor="middle"`)}
    <path d="M ${W / 2 - 34} ${arrowY} L ${W / 2 + 34} ${arrowY} L ${W / 2} ${arrowY + 52} Z" fill="${CYAN}"/>
    <rect x="${W / 2 - pillW / 2}" y="${pillY}" width="${pillW}" height="76" rx="38" fill="${CYAN}" fill-opacity="0.12" stroke="${CYAN}" stroke-width="2"/>
    <text x="${W / 2}" y="${pillY + 49}" text-anchor="middle" ${FM} font-size="30" fill="${CYAN}">${esc(s.sub)}</text>
  `, { ...meta, last: true });
}

const LAYOUTS = { cover: coverSlide, stat: statSlide, list: listSlide, compare: compareSlide, quote: quoteSlide, cta: ctaSlide };

// ── contenido lote 3 (temas ATP frescos) ────────────────────────────────────
const CTA = { kind: "cta", title: "¿Quieres decidir bien tu próximo proyecto?", line: "Comenta y te enviamos gratis la guía completa al privado", sub: "PDF · precios reales · checklist" };

const CAROUSELS = [
  {
    id: "seo",
    slides: [
      { kind: "cover", kicker: "seo local", title: "¿Por qué no apareces en Google?", sub: "Y cómo arreglarlo sin pagar anuncios" },
      { kind: "quote", text: "Aparecer en Google es técnica, no suerte.", sub: "esto es lo que Google revisa de tu negocio" },
      { kind: "list", title: "Lo primero es GRATIS", items: [
        { n: "1", head: "Perfil de Empresa en Google (Maps)", sub: "sales en las búsquedas de tu comuna, hoy" },
        { n: "2", head: "Reseñas de tus clientes", sub: "venden por ti y suben tu posición" },
        { n: "3", head: "Datos completos", sub: "horario, fotos reales, link a tu web" },
      ]},
      { kind: "list", title: "Después, tu página", items: [
        { n: "4", head: "Velocidad de carga", sub: "si tarda, Google te baja y la gente se va" },
        { n: "5", head: "Las palabras que tu cliente busca", sub: "escribe como busca tu cliente, no como hablas tú" },
        { n: "6", head: "Responder preguntas reales", sub: "un blog que contesta lo que la gente googlea" },
      ]},
      { kind: "compare", title: "¿Anuncios u orgánico?", left: { head: "Anuncios", items: ["Resultados hoy mismo", "Pagas por cada clic", "Dejas de pagar y desapareces"] }, right: { head: "Orgánico (SEO)", items: ["Toma semanas o meses", "No pagas por clic", "El posicionamiento queda TUYO"] } },
      { kind: "quote", text: "Los anuncios se arriendan. El SEO se construye.", sub: "lo ideal: combinar según tu etapa" },
      CTA,
    ],
  },
  {
    id: "anatomia",
    slides: [
      { kind: "cover", kicker: "anatomía de una web", title: "Una página que SÍ vende tiene esto", sub: "Los 7 elementos. Revisa la tuya al final" },
      { kind: "stat", big: "3 seg", label: "para que el visitante entienda qué vendes", sub: "si no lo logra en ese tiempo, se va" },
      { kind: "list", title: "Arriba, sin scroll", items: [
        { n: "1", head: "Mensaje claro", sub: "qué vendes, para quién y por qué tú" },
        { n: "2", head: "UN botón de acción visible", sub: "no cinco: uno que diga qué hacer ahora" },
        { n: "3", head: "Prueba social", sub: "reseñas, casos, logos: la confianza vende" },
      ]},
      { kind: "list", title: "Debajo del capó", items: [
        { n: "4", head: "Carga instantánea", sub: "la mitad de las visitas no espera" },
        { n: "5", head: "Perfecta en el celular", sub: "ahí está la mayoría de tu tráfico" },
        { n: "6", head: "WhatsApp a un toque", sub: "en Chile la venta se cierra conversando" },
      ]},
      { kind: "list", title: "Y el que casi nadie tiene", items: [
        { n: "7", head: "Medición instalada", sub: "si no mides visitas y contactos, no sabes qué funciona ni qué mejorar" },
      ]},
      { kind: "quote", text: "Lo bonito atrae. Lo claro convierte.", sub: "una web es un vendedor, no un cuadro" },
      CTA,
    ],
  },
  {
    id: "corredores",
    slides: [
      { kind: "cover", kicker: "corredores de propiedades", title: "Tu cartera merece casa propia", sub: "Los portales te arriendan la visibilidad. Hay otra forma" },
      { kind: "quote", text: "En el portal, tus propiedades compiten al lado de las de todos.", sub: "en tu web, compiten solas" },
      { kind: "list", title: "Lo que tu web propia debe tener", items: [
        { n: "1", head: "Fichas con fotos y filtros", sub: "comuna, precio, dormitorios: como buscan tus clientes" },
        { n: "2", head: "WhatsApp directo en cada propiedad", sub: "del interés al contacto en un toque" },
        { n: "3", head: "Tu marca al frente", sub: "que te recuerden a ti, no al portal" },
      ]},
      { kind: "list", title: "Y lo que te hace crecer", items: [
        { n: "4", head: "Captación de propietarios", sub: "formulario para captar nuevas propiedades" },
        { n: "5", head: "Autoadministrable", sub: "tú subes y bajas propiedades sin depender de nadie" },
        { n: "6", head: "Aparecer en Google en tu zona", sub: "corredor + tu comuna = tú" },
      ]},
      { kind: "compare", title: "Portal vs web propia", left: { head: "Solo portales", items: ["Pagas por publicar y destacar", "Leads compartidos con la competencia", "La marca que crece es la del portal"] }, right: { head: "Con web propia", items: ["Inversión una vez, desde $390.000", "Los interesados son SOLO tuyos", "Tu marca y tu cartera crecen juntas"] } },
      { kind: "stat", big: "24/7", label: "tu vitrina propia mostrando la cartera", sub: "cada visita es un dato que queda contigo, no con el portal" },
      CTA,
    ],
  },
  {
    id: "errores-web",
    slides: [
      { kind: "cover", kicker: "revisa tu página", title: "6 errores de webs que espantan clientes", sub: "¿Cuántos tiene la tuya? Cuenta honestamente" },
      { kind: "list", title: "Los tres que se ven al llegar", items: [
        { n: "1", head: "Tarda en cargar", sub: "más de la mitad de las visitas se va sin esperar" },
        { n: "2", head: "Se ve mal en el celular", sub: "donde está casi todo tu tráfico" },
        { n: "3", head: "Sin candado (https)", sub: "el navegador dice 'no seguro' y el cliente te descarta" },
      ]},
      { kind: "list", title: "Los tres que matan la venta", items: [
        { n: "4", head: "No se entiende qué vendes", sub: "frases genéricas tipo 'soluciones integrales'" },
        { n: "5", head: "Sin botón claro de contacto", sub: "el interesado no sabe qué hacer y se va" },
        { n: "6", head: "Fotos de stock falsas", sub: "la gente las reconoce y desconfía" },
      ]},
      { kind: "quote", text: "Tu página es tu vendedor 24/7.", sub: "¿contratarías a un vendedor que espanta clientes?" },
      { kind: "list", title: "El arreglo, en este orden", items: [
        { n: "1", head: "Velocidad y celular primero", sub: "sin eso, lo demás no se alcanza a ver" },
        { n: "2", head: "Mensaje claro + un botón", sub: "qué vendes y qué hacer ahora" },
        { n: "3", head: "Fotos reales + prueba social", sub: "confianza: reseñas, casos, tu cara" },
      ]},
      { kind: "stat", big: "1ª", label: "impresión: tu web decide antes que tú", sub: "el cliente te googlea antes de escribirte" },
      CTA,
    ],
  },
  {
    id: "costos",
    slides: [
      { kind: "cover", kicker: "sin letra chica", title: "¿Cuánto cuesta MANTENER una web?", sub: "Los costos anuales reales, y los cobros que no deberías aceptar" },
      { kind: "stat", big: "$12.000", label: "al año cuesta tu dominio .cl", sub: "y debe estar comprado A TU NOMBRE, no del proveedor" },
      { kind: "list", title: "Los costos reales al año", items: [
        { n: "1", head: "Dominio: ~$12.000/año", sub: "tu dirección en internet" },
        { n: "2", head: "Hosting: puede ser $0", sub: "con infraestructura moderna; no siempre hay que pagar" },
        { n: "3", head: "Mantención: opcional, desde $49.000/mes", sub: "respaldos, seguridad y cambios, si quieres despreocuparte" },
      ]},
      { kind: "list", title: "Cobros que NO deberías aceptar", items: [
        { n: "✕", head: "Hosting carísimo 'de la agencia'", sub: "pregunta qué incluye y compara" },
        { n: "✕", head: "Renovaciones infladas sin detalle", sub: "pide el desglose: dominio + hosting + qué más" },
        { n: "✕", head: "Quedar rehén del proveedor", sub: "si no puedes irte con tu web y tu dominio, no es tuya" },
      ]},
      { kind: "quote", text: "Una web bien hecha cuesta poco mantenerla.", sub: "desconfía de los costos mensuales que nadie explica" },
      CTA,
    ],
  },
];

for (const c of CAROUSELS) {
  const total = c.slides.length;
  for (let i = 0; i < total; i++) {
    const s = c.slides[i];
    const svg = LAYOUTS[s.kind](s, { n: i + 1, total, last: s.kind === "cta" });
    const out = `public/social/cw3-${c.id}-${i + 1}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(out);
  }
}
console.log("Listo:", CAROUSELS.reduce((a, c) => a + c.slides.length, 0), "slides");
