// Genera el lead magnet: guía PDF branded "Software a medida sin perder plata".
// Versión 2.0: tablas, comparativas, timeline, checklist ampliada y glosario.
// Ejecuta: node scripts/gen-guia-pdf.mjs  →  public/guia-software-a-medida.pdf
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const CYAN = "#0e7d88", CYAN_SOFT = "#eef7f8", DARK = "#0a0a0a", INK = "#1a1a1a",
  MUTE = "#5b6470", LINE = "#dde3e8", ZEBRA = "#f4f8f9", WARN = "#fdf6ec", WARN_BAR = "#d97706";
const M = 56;
const OUT = "public/guia-software-a-medida.pdf";

const doc = new PDFDocument({ size: "A4", margins: { top: M, bottom: M, left: M, right: M }, bufferPages: true });
doc.pipe(createWriteStream(OUT));
const W = doc.page.width, H = doc.page.height, CW = W - M * 2;

// ── helpers ──────────────────────────────────────────────────────────────────
const wordmark = (x, y, size, onDark) => {
  doc.font("Helvetica-Bold").fontSize(size);
  doc.fillColor(onDark ? "#fafafa" : INK).text("mau", x, y, { continued: true, lineBreak: false });
  doc.fillColor(CYAN).text("dev", { continued: false, lineBreak: false });
};
function ensure(space) { if (doc.y + space > H - M - 26) doc.addPage(); }
function h2(txt) {
  ensure(80);
  doc.moveDown(0.9);
  doc.rect(M, doc.y + 4, 26, 4).fill(CYAN);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(16.5).text(txt, M + 36, doc.y - 3, { width: CW - 36 });
  doc.moveDown(0.5);
}
function p(txt, opts = {}) {
  ensure(40);
  doc.fillColor(opts.color || INK).font(opts.bold ? "Helvetica-Bold" : "Helvetica").fontSize(opts.size || 10.5)
    .text(txt, M, doc.y, { width: CW, lineGap: 3, ...opts });
  doc.moveDown(0.4);
}
function bullets(items, { gap = 0.25 } = {}) {
  doc.font("Helvetica").fontSize(10.5).fillColor(INK);
  for (const it of items) {
    ensure(26);
    const y = doc.y;
    doc.circle(M + 4, y + 6, 2.3).fill(CYAN);
    doc.fillColor(INK).font("Helvetica").fontSize(10.5).text(it, M + 16, y, { width: CW - 16, lineGap: 2 });
    doc.moveDown(gap);
  }
  doc.moveDown(0.3);
}
// Caja destacada con barra lateral (para alertas/ideas clave).
function callout(text, { title = null, bar = CYAN, bg = CYAN_SOFT } = {}) {
  doc.font("Helvetica").fontSize(10);
  const tw = CW - 40;
  const th = doc.heightOfString(text, { width: tw, lineGap: 2.5 });
  const hh = th + (title ? 20 : 0) + 22;
  ensure(hh + 12);
  const y = doc.y + 4;
  doc.roundedRect(M, y, CW, hh, 6).fill(bg);
  doc.rect(M, y, 4, hh).fill(bar);
  let ty = y + 11;
  if (title) {
    doc.fillColor(INK).font("Helvetica-Bold").fontSize(10.5).text(title, M + 20, ty, { width: tw, lineBreak: false });
    ty += 17;
  }
  doc.fillColor(INK).font("Helvetica").fontSize(10).text(text, M + 20, ty, { width: tw, lineGap: 2.5 });
  doc.y = y + hh;
  doc.moveDown(0.6);
}
// Tabla con encabezado oscuro y filas zebra. widths = fracciones que suman 1.
function table({ widths, header, rows, aligns = [] }) {
  const colW = widths.map((f) => f * CW);
  const xs = colW.reduce((acc, w, i) => (acc.push((acc[i - 1] ?? M) + (i ? colW[i - 1] : 0)), acc), []);
  const pad = 7;
  const rowH = (cells, font, size) => {
    doc.font(font).fontSize(size);
    return Math.max(...cells.map((c, i) => doc.heightOfString(String(c), { width: colW[i] - pad * 2, lineGap: 1.5 }))) + pad * 2;
  };
  const drawRow = (cells, { bg, color, font, size }) => {
    const h = rowH(cells, font, size);
    ensure(h + 4);
    const y = doc.y;
    if (bg) doc.rect(M, y, CW, h).fill(bg);
    cells.forEach((c, i) => {
      doc.fillColor(color).font(font).fontSize(size)
        .text(String(c), xs[i] + pad, y + pad, { width: colW[i] - pad * 2, lineGap: 1.5, align: aligns[i] || "left" });
    });
    doc.rect(M, y, CW, h).strokeColor(LINE).lineWidth(0.5).stroke();
    doc.y = y + h;
  };
  drawRow(header, { bg: DARK, color: "#fafafa", font: "Helvetica-Bold", size: 9.5 });
  rows.forEach((r, i) => drawRow(r, { bg: i % 2 ? ZEBRA : null, color: INK, font: "Helvetica", size: 9.5 }));
  doc.moveDown(0.6);
}
// Paso del proceso (círculo numerado + texto).
function step(n, title, desc) {
  doc.font("Helvetica").fontSize(9.5);
  const dh = doc.heightOfString(desc, { width: CW - 46, lineGap: 2 });
  ensure(dh + 34);
  const y = doc.y;
  doc.circle(M + 12, y + 11, 11).fill(CYAN);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10).text(String(n), M + 4, y + 6.5, { width: 16, align: "center", lineBreak: false });
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(10.5).text(title, M + 34, y + 1, { width: CW - 46, lineBreak: false });
  doc.fillColor(MUTE).font("Helvetica").fontSize(9.5).text(desc, M + 34, y + 15, { width: CW - 46, lineGap: 2 });
  doc.y = y + 15 + dh;
  doc.moveDown(0.5);
}

// ── PORTADA ──────────────────────────────────────────────────────────────────
doc.rect(0, 0, W, H).fill(DARK);
doc.rect(0, 0, 8, H).fill(CYAN);
wordmark(M, 66, 22, true);
doc.fillColor(CYAN).font("Helvetica-Bold").fontSize(11).text("GUÍA GRATUITA · EDICIÓN 2026", M, 150, { characterSpacing: 2, lineBreak: false });
doc.fillColor("#fafafa").font("Helvetica-Bold").fontSize(34).text("Software a medida\nsin perder plata", M, 178, { lineGap: 4 });
doc.fillColor("#a9b2bd").font("Helvetica").fontSize(12.5).text("Cómo decidir bien: precios reales en Chile, cuándo conviene,\ncon quién construir y qué exigir. Sin tecnicismos.", M, 288, { lineGap: 4 });

doc.fillColor("#6b7480").font("Helvetica-Bold").fontSize(10).text("DENTRO DE ESTA GUÍA", M, 380, { characterSpacing: 1.5 });
const toc = [
  "Cuánto cuesta de verdad (tabla de precios 2026)",
  "¿Plantilla, SaaS o a medida? La cuenta a 3 años",
  "Cómo elegir proveedor y las señales de alerta",
  "El retorno real de automatizar tu negocio",
  "El proceso de un proyecto sano, paso a paso",
  "Los 7 errores más caros (y cómo evitarlos)",
  "Checklist antes de firmar + glosario sin jerga",
];
let ty = 404;
for (const item of toc) {
  doc.rect(M, ty + 3, 7, 7).fill(CYAN);
  doc.fillColor("#d8dde3").font("Helvetica").fontSize(11).text(item, M + 18, ty, { lineBreak: false });
  ty += 24;
}
doc.page.margins.bottom = 0;
doc.fillColor(CYAN).font("Helvetica").fontSize(11).text("maudev.cl", M, H - 78, { lineBreak: false });
doc.fillColor("#6b7480").font("Helvetica").fontSize(9).text("Desarrollo web · Software a medida · Automatización con IA · Chile", M, H - 60, { lineBreak: false });
doc.page.margins.bottom = M;

// ── 1 · POR QUÉ ESTA GUÍA ────────────────────────────────────────────────────
doc.addPage();
doc.fillColor(INK).font("Helvetica-Bold").fontSize(20).text("Por qué esta guía", M, M);
doc.moveDown(0.4);
p("Encargar una web o un software es de las inversiones más importantes que hace un negocio, y casi nadie te enseña a hacerlo bien. El resultado: la mayoría paga dos veces por lo mismo, firma sin entender qué está comprando, o arrienda para siempre algo que pudo ser suyo.");
p("Esta guía condensa lo que vemos todos los días trabajando con PYMEs y emprendedores en Chile. Al terminarla vas a poder leer cualquier cotización con ojo crítico, comparar opciones con números reales y exigir lo que corresponde antes de firmar.");
callout("Nada de lo que leerás aquí requiere conocimientos técnicos. Si algo suena a jerga, está explicado en el glosario de la última página.", { title: "Para leerla sin miedo" });

h2("1. ¿Cuánto cuesta de verdad?");
p("No hay un precio único: depende del alcance, la complejidad, las integraciones y la escala. Estos son rangos realistas con los que trabajamos en Chile (2026):");
table({
  widths: [0.46, 0.30, 0.24],
  header: ["Tipo de proyecto", "Rango de inversión", "Plazo típico"],
  aligns: ["left", "right", "right"],
  rows: [
    ["Landing / sitio de conversión", "$390.000 - $900.000", "1 a 3 semanas"],
    ["Automatización / integraciones", "$290.000 - $700.000", "1 a 3 semanas"],
    ["Tienda online (carrito + pagos)", "desde $700.000", "3 a 6 semanas"],
    ["Software a medida (app, sistema)", "desde $900.000", "1 a 3 meses"],
    ["Plataforma o sistema mayor", "se cotiza por proyecto", "3 a 6 meses"],
  ],
});
p("A eso súmale la operación: dominio (~$12.000/año), hosting (puede ser $0 con infraestructura moderna) y mantención si quieres despreocuparte (desde $49.000/mes). El precio fijo exacto para tu caso debe llegarte por escrito, sin costos ocultos.");
callout("Si te dan un precio en 5 minutos sin entender tu negocio, cuidado: o es una plantilla disfrazada, o ese número va a subir a mitad de camino.", { title: "Señal de alerta nº 1", bar: WARN_BAR, bg: WARN });

// ── 2 · PLANTILLA VS A MEDIDA ────────────────────────────────────────────────
h2("2. ¿Plantilla, SaaS o a medida? La cuenta a 3 años");
p("Las plataformas con plantilla (Wix, Shopify, arriendos mensuales) son excelentes para partir rápido. El problema es que casi nadie hace la cuenta completa antes de decidir:");
table({
  widths: [0.4, 0.3, 0.3],
  header: ["Criterio", "Plantilla / SaaS", "A medida"],
  rows: [
    ["Velocidad para publicar", "Días", "Semanas"],
    ["Costo inicial", "Bajo (mensualidad)", "Mayor (una vez)"],
    ["Costo permanente", "Suscripción para siempre", "Mantención opcional"],
    ["¿Se adapta a TU proceso?", "Tú te adaptas a ella", "Se construye para ti"],
    ["Funciones propias (cotizador, integraciones, IA)", "Limitado a sus apps", "Sin límite"],
    ["¿De quién es el sitio?", "Lo arriendas", "Tuyo, con el código a tu nombre"],
    ["¿Puedes migrar después?", "Partes de cero", "El código se muda contigo"],
  ],
});
callout("Ejemplo con números: un plan de plantilla + apps de $45.000/mes son $1.620.000 en 3 años, y al final el sitio no es tuyo. Un desarrollo a medida de $700.000 con mantención opcional cuesta menos a ese plazo y queda como activo de tu negocio. Haz esta multiplicación siempre antes de decidir.", { title: "La cuenta que nadie hace" });
p("¿Cuándo SÍ conviene la plantilla? Si estás validando una idea, necesitas presencia esta semana o tu página es una tarjeta de presentación simple. La jugada madura suele ser: valida en plantilla, construye a medida cuando el negocio lo justifique.");

// ── 3 · CÓMO ELEGIR ──────────────────────────────────────────────────────────
h2("3. Cómo elegir con quién construir");
p("El precio es lo que MENOS importa al comparar. Lo barato sale caro: suele venir sin pruebas, sin seguridad, sin soporte y a veces sin que el código quede a tu nombre. Compara por lo que INCLUYE cada propuesta:");
bullets([
  "Portafolio funcionando (proyectos reales que puedas visitar, no solo capturas).",
  "Contrato con precio y alcance por escrito, con hitos claros.",
  "El código y el dominio quedan a TU nombre al pagar.",
  "Hablas con quien programa, no solo con un vendedor.",
  "Avances visibles durante el proyecto (no una caja negra de meses).",
  "Soporte después de la entrega, con condiciones claras.",
]);
callout("Te cotizan sin preguntar por tu negocio · no muestran avances hasta el final · precio sospechosamente bajo · evaden decir de quién queda el código · solo te atiende un vendedor · te apuran a firmar hoy. Con dos de estas, corre.", { title: "Señales de alerta al contratar", bar: WARN_BAR, bg: WARN });
callout("Pregunta: \"¿El código y el dominio quedan a mi nombre?\". Es la pregunta que espanta a los malos proveedores. Si dudan o dan vueltas, ya tienes tu respuesta.", { title: "La pregunta filtro" });

// ── 4 · ROI DE AUTOMATIZAR ───────────────────────────────────────────────────
h2("4. El retorno real de automatizar");
p("Lo manual no es gratis: tiene un costo escondido en horas, errores y ventas perdidas. Casi siempre supera al costo de automatizar. Por dónde partir (de mayor a menor impacto):");
bullets([
  "Responder y calificar clientes al instante: la velocidad de respuesta mueve la venta. Un chatbot o respuesta automática atiende 24/7.",
  "Cotizaciones y documentos que se generan solos a partir de un formulario.",
  "Seguimientos automáticos: ahí se recuperan las ventas que se enfrían.",
  "Datos que fluyen entre tus herramientas sin copiar y pegar (integraciones).",
  "Reportes que se arman solos cada semana.",
]);
callout("Ejemplo ilustrativo: si alguien de tu equipo pierde 1 hora al día copiando datos entre planillas, son ~22 horas al mes. Valoradas incluso a $6.000/hora, hablamos de $132.000 mensuales, $1.584.000 al año, por UNA tarea. Ese es el costo de lo manual que no se ve.", { title: "El costo invisible" });
callout("No automatices el caos: si el proceso es malo, automatizarlo solo lo hace más rápido. Primero ordena el proceso, después automatiza.", { title: "Error caro", bar: WARN_BAR, bg: WARN });

// ── 5 · EL PROCESO ───────────────────────────────────────────────────────────
h2("5. De idea a sistema: el proceso sano");
p("Un proyecto serio no es una caja negra. Tiene etapas claras y tú ves el avance en cada una:");
step(1, "Descubrimiento", "Entender tu negocio, tu proceso y el problema real a resolver antes de proponer nada.");
step(2, "Diseño y arquitectura", "Cómo se verá, cómo funcionará y sobre qué tecnología. Aquí se define el plan.");
step(3, "Desarrollo por sprints", "Ciclos de 1 a 2 semanas. Al final de cada uno ves algo FUNCIONANDO y das feedback (metodología Scrum).");
step(4, "Pruebas (QA)", "Se prueba todo: flujos, pagos, errores, seguridad. Lo que falla se corrige antes de salir.");
step(5, "Despliegue", "Publicación segura con dominio, respaldos y monitoreo configurados.");
step(6, "Soporte y evolución", "Acompañamiento después de la entrega. El software evoluciona con tu negocio.");
p("Plazos realistas: una landing, semanas; un sistema mediano, algunos meses. Desconfía de \"un sistema serio para la otra semana\", y también de plazos eternos para cosas simples. Tu participación (feedback a tiempo) es parte del plazo.");

// ── 6 · ERRORES CAROS ────────────────────────────────────────────────────────
h2("6. Los 7 errores más caros");
table({
  widths: [0.34, 0.66],
  header: ["Error", "Por qué duele"],
  rows: [
    ["1. Elegir por precio", "Lo que falta (pruebas, seguridad, soporte) lo pagas después, más caro."],
    ["2. No definir el alcance", "Sin alcance escrito, todo cambio es pelea o cobro sorpresa."],
    ["3. Olvidar la mantención", "El software, como un auto, tiene costo de uso. Presupuéstalo desde el día 1."],
    ["4. No preguntar por el código", "Si no queda a tu nombre, no compraste: arrendaste."],
    ["5. Pagar todo por adelantado", "Pierdes tu única palanca. Lo sano: 50% al inicio, 50% contra entrega."],
    ["6. No pedir avances", "Meses sin ver nada = riesgo acumulado hasta el final."],
    ["7. Automatizar el caos", "Proceso malo + automatización = caos más rápido."],
  ],
});

// ── 7 · CHECKLIST ────────────────────────────────────────────────────────────
h2("7. Checklist: antes de firmar");
p("Imprime esta página o tenla a mano en la reunión. Si alguna respuesta te incomoda, pregunta de nuevo:");
const checks = [
  "¿De quién queda el código y el dominio? (Respuesta correcta: tuyos.)",
  "¿Hay precio y alcance por escrito, con hitos?",
  "¿Voy a ver avances funcionando durante el proyecto?",
  "¿Cada cuánto veré esos avances? (Lo sano: cada 1-2 semanas.)",
  "¿Qué incluye exactamente el soporte y por cuánto tiempo?",
  "¿Qué pasa si necesito cambios a mitad de camino?",
  "¿Cómo manejan las pruebas y la seguridad?",
  "¿Quién va a programar esto y puedo hablar con esa persona?",
  "¿Cuáles son los costos de terceros (dominio, hosting, APIs) y quién los paga?",
  "¿Cómo es la forma de pago? (Lo estándar: 50% inicio, 50% contra entrega.)",
];
doc.font("Helvetica").fontSize(10.5).fillColor(INK);
for (const c of checks) {
  ensure(30);
  const y = doc.y;
  doc.lineWidth(1.2).strokeColor(CYAN).rect(M, y + 1, 12, 12).stroke();
  doc.fillColor(INK).text(c, M + 22, y, { width: CW - 22, lineGap: 2 });
  doc.moveDown(0.45);
}

// ── 8 · GLOSARIO ─────────────────────────────────────────────────────────────
h2("8. Glosario sin jerga");
const glossary = [
  ["A medida", "software diseñado para tu proceso exacto, no una plantilla genérica."],
  ["SaaS", "software que arriendas por suscripción mensual (ej: Shopify, herramientas en la nube)."],
  ["MVP", "la versión mínima que ya aporta valor. Se lanza rápido y crece con lo que aprendes."],
  ["Sprint", "ciclo corto de trabajo (1-2 semanas) que termina con algo funcionando que puedes probar."],
  ["Scrum", "la metodología de trabajar por sprints con feedback constante del cliente."],
  ["QA", "control de calidad: probar el software para encontrar errores antes que tus clientes."],
  ["Hosting", "el servidor donde vive tu página o sistema. Hoy puede costar muy poco o nada."],
  ["Dominio", "tu dirección en internet (tunegocio.cl). Debe estar comprado A TU NOMBRE."],
  ["Integración / API", "la conexión que permite que dos sistemas se hablen y compartan datos solos."],
  ["Pasarela de pago", "el servicio que cobra online por ti (Webpay, MercadoPago, Stripe). Cobra comisión por venta."],
];
for (const [term, def] of glossary) {
  ensure(28);
  const y = doc.y;
  doc.fillColor(CYAN).font("Helvetica-Bold").fontSize(10).text(term + ":", M, y, { continued: true, lineBreak: true });
  doc.fillColor(INK).font("Helvetica").fontSize(10).text(" " + def, { width: CW, lineGap: 2 });
  doc.moveDown(0.28);
}

// ── CTA FINAL ────────────────────────────────────────────────────────────────
ensure(240);
doc.moveDown(1);
const cy = doc.y;
doc.roundedRect(M, cy, CW, 178, 10).fill(DARK);
wordmark(M + 26, cy + 22, 16, true);
doc.fillColor("#fafafa").font("Helvetica-Bold").fontSize(16).text("¿Lo aplicamos a tu negocio?", M + 26, cy + 52, { lineBreak: false });
doc.fillColor("#a9b2bd").font("Helvetica").fontSize(10.5).text(
  "Agenda un diagnóstico gratuito de 30 minutos: revisamos tu idea o proceso y te decimos qué conviene construir, en qué plazo y a qué precio fijo. Sin compromiso y sin jerga.",
  M + 26, cy + 76, { width: CW - 52, lineGap: 2.5 });
doc.fillColor(CYAN).font("Helvetica-Bold").fontSize(12).text("Agenda directo:  cal.com/maudev/30min", M + 26, cy + 120, { lineBreak: false });
doc.fillColor("#8a94a0").font("Helvetica").fontSize(10).text("maudev.cl  ·  contacto@maudev.cl  ·  Chile y Latinoamérica", M + 26, cy + 144, { lineBreak: false });

// ── pie de página con numeración ─────────────────────────────────────────────
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0; // clave: sin esto pdfkit añade páginas en blanco
  doc.fillColor(MUTE).font("Helvetica").fontSize(8);
  doc.text("maudev · Software a medida sin perder plata · maudev.cl", M, H - 36, { width: CW * 0.7, lineBreak: false });
  doc.text(`${i} / ${range.count - 1}`, M + CW * 0.7, H - 36, { width: CW * 0.3, align: "right", lineBreak: false });
}

doc.end();
console.log("Generado:", OUT);
