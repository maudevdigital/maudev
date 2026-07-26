// Motor de CARRUSELES 2.0 (lote 4, semana 13-19 jul) — slides 1080x1350 con diseño real:
// portada, stat gigante, listas numeradas, comparativa 2 columnas, quote y CTA.
// Basado en búsquedas reales de Google Chile (AnswerThePublic).
// Ejecuta: node scripts/gen-carousel-w4.mjs  →  public/social/cw4-{id}-{n}.png
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

// ── contenido lote 4 (temas ATP frescos, aprobados 7-jul) ───────────────────
const CTA = { kind: "cta", title: "¿Quieres decidir bien tu próximo proyecto?", line: "Comenta y te enviamos gratis la guía completa al privado", sub: "PDF · precios reales · checklist" };

const CAROUSELS = [
  {
    id: "agenda",
    slides: [
      { kind: "cover", kicker: "agenda online", title: "Deja de agendar por WhatsApp", sub: "Los chilenos ya agendan todo online. Tu negocio también puede" },
      { kind: "stat", big: "24/7", label: "tu agenda tomando horas mientras atiendes o duermes", sub: "las horas que te piden de noche hoy las estás perdiendo" },
      { kind: "compare", title: "Agendar: antes y después", left: { head: "Por WhatsApp", items: ["Respondes uno por uno", "Horas dobles por error", "Sin recordatorio: no llegan", "Solo cuando estás despierto"] }, right: { head: "Agenda online", items: ["El cliente elige su hora solo", "Disponibilidad siempre al día", "Recordatorio automático", "Funciona a toda hora"] } },
      { kind: "list", title: "Para quién es", items: [
        { n: "1", head: "Peluquerías y barberías", sub: "la hora se reserva sola, tú sigues cortando" },
        { n: "2", head: "Consultas y centros", sub: "kine, dental, psicólogos: menos inasistencias" },
        { n: "3", head: "Talleres y servicios", sub: "el cliente agenda revisión sin llamarte" },
      ]},
      { kind: "list", title: "Lo que necesitas", items: [
        { n: "1", head: "Agenda conectada a tu web", sub: "con tus horarios y servicios reales" },
        { n: "2", head: "Recordatorios automáticos", sub: "por correo o WhatsApp: bajan las inasistencias" },
        { n: "3", head: "Abono para reservar (opcional)", sub: "la hora reservada con pago casi nunca se pierde" },
      ]},
      { kind: "quote", text: "Cada hora no agendada es plata que no llega.", sub: "la agenda online se paga sola" },
      CTA,
    ],
  },
  {
    id: "delivery",
    slides: [
      { kind: "cover", kicker: "restaurantes", title: "La matemática del delivery", sub: "Cuánto te queda de verdad en cada pedido por app" },
      { kind: "stat", big: "201 mil", label: "búsquedas al mes de 'restaurante cerca de mí' en Chile", sub: "datos de búsqueda de Google Chile" },
      { kind: "stat", big: "-30%", label: "comisión que puede cobrarte una app de delivery", sub: "en un pedido de $15.000 son hasta $4.500 que no ves" },
      { kind: "compare", title: "Pedido de $15.000", left: { head: "Por la app", items: ["Comisión: hasta $4.500", "El cliente es de la app", "Compites en el listado", "Sin datos de tus clientes"] }, right: { head: "Por tu web", items: ["Comisión: $0", "El cliente es TUYO", "Tu carta, sin competencia al lado", "Datos para hacer que vuelva"] } },
      { kind: "list", title: "Tu web de restaurante", items: [
        { n: "1", head: "Carta digital con QR", sub: "se actualiza al momento, sin reimprimir" },
        { n: "2", head: "Reservas y pedidos directos", sub: "del cliente a tu cocina, sin intermediario" },
        { n: "3", head: "Aparecer en Google y Maps", sub: "cuando buscan dónde comer en tu comuna" },
      ]},
      { kind: "quote", text: "Las apps te prestan clientes. Tu web los hace tuyos.", sub: "usa las apps para captar; tu web para fidelizar" },
      CTA,
    ],
  },
  {
    id: "automatiza",
    slides: [
      { kind: "cover", kicker: "automatización", title: "5 procesos que puedes automatizar hoy", sub: "2 horas al día en tareas repetidas son 500 horas al año" },
      { kind: "stat", big: "500 h", label: "al año pierdes con 2 horas diarias de tareas manuales", sub: "más de 12 semanas laborales completas" },
      { kind: "list", title: "Los primeros tres", items: [
        { n: "1", head: "Boletas y facturas", sub: "se emiten al vender, directo al SII" },
        { n: "2", head: "Stock e inventario", sub: "se descuenta solo y avisa cuándo reponer" },
        { n: "3", head: "Recordatorios a clientes", sub: "citas, pagos y seguimientos, sin acordarte tú" },
      ]},
      { kind: "list", title: "Y los que casi nadie hace", items: [
        { n: "4", head: "Informes de venta", sub: "el resumen llega solo, cada semana" },
        { n: "5", head: "Datos entre planillas", sub: "los sistemas se hablan; nadie copia y pega" },
      ]},
      { kind: "quote", text: "Si lo haces igual todas las semanas, se puede automatizar.", sub: "la regla más simple para partir" },
      { kind: "stat", big: "1º", label: "paso: anota qué tareas repites cada semana", sub: "esa lista vale más que cualquier cotización" },
      CTA,
    ],
  },
];

for (const c of CAROUSELS) {
  const total = c.slides.length;
  for (let i = 0; i < total; i++) {
    const s = c.slides[i];
    const svg = LAYOUTS[s.kind](s, { n: i + 1, total, last: s.kind === "cta" });
    const out = `public/social/cw4-${c.id}-${i + 1}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(out);
  }
}
console.log("Listo:", CAROUSELS.reduce((a, c) => a + c.slides.length, 0), "slides");
