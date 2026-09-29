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

// ── contenido de los 4 carruseles (temas ATP) ────────────────────────────────
const CTA = { kind: "cta", title: "¿Quieres decidir bien tu próximo proyecto?", line: "Comenta y te enviamos gratis la guía completa al privado", sub: "PDF · precios reales · checklist" };

const CAROUSELS = [
  {
    id: "ia",
    slides: [
      { kind: "cover", kicker: "página web con ia", title: "Tu web puede trabajar sola", sub: "5 usos reales de IA para tu negocio, sin humo" },
      { kind: "stat", big: "24/7", label: "tu web atendiendo mientras duermes", sub: "en 2026 esto ya es estándar, no ciencia ficción" },
      { kind: "list", title: "Usos que SÍ valen la plata", items: [
        { n: "1", head: "Chatbot que responde y califica", sub: "atiende al instante y te avisa cuando vale la pena entrar" },
        { n: "2", head: "Respuestas a preguntas frecuentes", sub: "el 70-80% de las consultas son las mismas 10" },
        { n: "3", head: "Agendamiento automático", sub: "el cliente elige hora y la reunión aparece sola" },
      ]},
      { kind: "list", title: "Y los que más se olvidan", items: [
        { n: "4", head: "Seguimiento de clientes fríos", sub: "el correo de recuerdo que nadie alcanza a mandar" },
        { n: "5", head: "Resumen y clasificación de mensajes", sub: "llegas a tu bandeja y ya está ordenada" },
      ]},
      { kind: "quote", text: "La IA es una herramienta del equipo, no el equipo.", sub: "las decisiones importantes siguen siendo tuyas" },
      { kind: "list", title: "Lo que NO deberías esperar", items: [
        { n: "✕", head: "Decisiones críticas sin supervisión", sub: "descuentos, reclamos delicados: eso es humano" },
        { n: "✕", head: "Que se configure sola", sub: "vale lo que valga la información que le cargues" },
        { n: "✕", head: "Arreglar un proceso desordenado", sub: "primero ordena, después automatiza" },
      ]},
      CTA,
    ],
  },
  {
    id: "tienda",
    slides: [
      { kind: "cover", kicker: "tienda online 2026", title: "¿Cuánto cuesta vender online?", sub: "Carrito, pagos y los costos que nadie te cotiza, con precios reales de Chile" },
      { kind: "list", title: "Las 3 decisiones que definen el precio", items: [
        { n: "1", head: "¿Plantilla o a medida?", sub: "arrendar mensual vs construir algo tuyo" },
        { n: "2", head: "¿Qué tan especial es tu venta?", sub: "20 productos simples ≠ 2.000 con variantes y despacho" },
        { n: "3", head: "¿Qué integraciones necesitas?", sub: "pagos, inventario, facturación, envíos" },
      ]},
      { kind: "compare", title: "Plantilla vs a medida", left: { head: "Plantilla (Shopify...)", items: ["Partir: $0 a $300.000", "Suscripción mensual para siempre", "Rápido: días", "Te adaptas tú a ella"] }, right: { head: "A medida", items: ["Desde $700.000 una vez", "Costo mensual mínimo", "3 a 6 semanas", "El código queda TUYO"] } },
      { kind: "stat", big: "1,5-3,5%", label: "comisión por venta de la pasarela de pago", sub: "Webpay, MercadoPago o Stripe la cobran con CUALQUIER opción: no es del desarrollador" },
      { kind: "list", title: "Los costos que nadie te cotiza", items: [
        { n: "!", head: "Fotos y fichas de producto", sub: "el costo más subestimado: sin buenas fotos no hay venta" },
        { n: "!", head: "Dominio: ~$12.000 al año", sub: "y debe quedar comprado A TU NOMBRE" },
        { n: "!", head: "Mantención desde $49.000/mes", sub: "opcional, para despreocuparte de respaldos y seguridad" },
      ]},
      { kind: "quote", text: "Plantilla para partir rápido. A medida para crecer.", sub: "la jugada madura: valida primero, construye cuando el volumen lo justifique" },
      CTA,
    ],
  },
  {
    id: "wix",
    slides: [
      { kind: "cover", kicker: "comparación honesta", title: "¿Wix o página a medida?", sub: "Sin caricaturas: cuándo conviene cada una de verdad" },
      { kind: "stat", big: "590", label: "personas buscan página web wix cada mes en Chile", sub: "y casi nadie les cuenta lo que viene en este carrusel" },
      { kind: "list", title: "Cuándo Wix es la opción CORRECTA", items: [
        { n: "✓", head: "Estás validando una idea", sub: "necesitas existir online esta semana" },
        { n: "✓", head: "Tu página es tarjeta de presentación", sub: "quiénes somos, fotos y contacto: suficiente" },
        { n: "✓", head: "Presupuesto inicial muy acotado", sub: "prefieres pagar mensual que invertir de una" },
      ]},
      { kind: "compare", title: "La diferencia de fondo", left: { head: "Wix", items: ["Lo ARRIENDAS: si dejas de pagar, desaparece", "No exporta: si migras, partes de cero", "Limitado a sus apps", "Plan gratis = subdominio + publicidad"] }, right: { head: "A medida", items: ["Es TUYO: código y dominio a tu nombre", "Se muda contigo a cualquier hosting", "Funciones sin límite (cotizador, IA...)", "Desde $390.000, sin suscripción"] } },
      { kind: "stat", big: "3 años", label: "haz la cuenta a este plazo antes de decidir", sub: "36 meses de plan + apps vs un proyecto único + mantención opcional" },
      { kind: "quote", text: "Con Wix arriendas tu página. A medida, es tuya.", sub: "y el caso más común que recibimos: 'le choqué el techo a Wix'" },
      CTA,
    ],
  },
  {
    id: "metodo",
    slides: [
      { kind: "cover", kicker: "antes de contratar", title: "¿Tu proveedor trabaja bien?", sub: "La metodología importa más que el precio, y así se revisa" },
      { kind: "quote", text: "Los proyectos no mueren por código malo. Mueren por proceso malo.", sub: "meses sin mostrar nada, cambios sin gestionar, entregas que no calzan" },
      { kind: "list", title: "Exígele esto (se llama Scrum)", items: [
        { n: "1", head: "Avances FUNCIONANDO cada 1-2 semanas", sub: "no capturas ni promesas: cosas que puedes probar" },
        { n: "2", head: "Cambios conversados por escrito", sub: "sin dramas ni cobros sorpresa a mitad de camino" },
        { n: "3", head: "Acceso a probar lo construido", sub: "tu feedback a tiempo es parte del proyecto" },
      ]},
      { kind: "list", title: "Señales de alerta", items: [
        { n: "✕", head: "Dice ágil pero no muestra nada en semanas", sub: "es cascada disfrazada: el riesgo lo cargas tú" },
        { n: "✕", head: "Cada cambio cuesta el doble", sub: "el proceso no absorbe cambios: mal síntoma" },
        { n: "✕", head: "Nunca te piden feedback", sub: "van a construir lo que ELLOS entendieron" },
      ]},
      { kind: "stat", big: "1-2", label: "semanas por sprint: el ritmo sano", sub: "si pasan meses sin ver avances, la 'metodología' es confía en mí" },
      { kind: "quote", text: "La metodología de confía en mí no es una metodología.", sub: "pide el proceso por escrito antes de firmar" },
      CTA,
    ],
  },
];

for (const c of CAROUSELS) {
  const total = c.slides.length;
  for (let i = 0; i < total; i++) {
    const s = c.slides[i];
    const svg = LAYOUTS[s.kind](s, { n: i + 1, total, last: s.kind === "cta" });
    const out = `public/social/cw2-${c.id}-${i + 1}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(out);
  }
}
console.log("Listo:", CAROUSELS.reduce((a, c) => a + c.slides.length, 0), "slides");
