// Genera el lead magnet: guía PDF branded (condensada de la serie high-ticket).
// Ejecuta: node scripts/gen-guia-pdf.mjs  →  public/guia-software-a-medida.pdf
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const CYAN = "#0fb5b5", DARK = "#0a0a0a", INK = "#1a1a1a", MUTE = "#5b6470", LINE = "#e3e6ea";
const M = 56; // margen
const OUT = "public/guia-software-a-medida.pdf";

const doc = new PDFDocument({ size: "A4", margins: { top: M, bottom: M, left: M, right: M }, bufferPages: true });
doc.pipe(createWriteStream(OUT));
const W = doc.page.width, H = doc.page.height, CW = W - M * 2;

// ---- helpers ----
const wordmark = (x, y, size, onDark) => {
  doc.font("Helvetica-Bold").fontSize(size);
  doc.fillColor(onDark ? "#fafafa" : INK).text("mau", x, y, { continued: true });
  doc.fillColor(CYAN).text("dev", { continued: false });
};
function ensure(space) { if (doc.y + space > H - M - 24) doc.addPage(); }
function h2(txt) {
  ensure(70);
  doc.moveDown(0.8);
  doc.rect(M, doc.y + 3, 26, 4).fill(CYAN);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(17).text(txt, M + 36, doc.y - 4, { width: CW - 36 });
  doc.moveDown(0.5);
}
function p(txt) { ensure(40); doc.fillColor(INK).font("Helvetica").fontSize(10.5).text(txt, M, doc.y, { width: CW, align: "left", lineGap: 3 }); doc.moveDown(0.4); }
function bullets(items) {
  doc.font("Helvetica").fontSize(10.5).fillColor(INK);
  for (const it of items) {
    ensure(26);
    const y = doc.y;
    doc.circle(M + 4, y + 6, 2.3).fill(CYAN);
    doc.fillColor(INK).text(it, M + 16, y, { width: CW - 16, lineGap: 2 });
    doc.moveDown(0.25);
  }
  doc.moveDown(0.3);
}
function priceRow(label, value) {
  ensure(30);
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(label, M, y, { width: CW * 0.6 });
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(CYAN).text(value, M + CW * 0.6, y, { width: CW * 0.4, align: "right" });
  doc.moveTo(M, doc.y + 4).lineTo(W - M, doc.y + 4).strokeColor(LINE).lineWidth(0.5).stroke();
  doc.moveDown(0.55);
}

// ---- PORTADA ----
doc.rect(0, 0, W, H).fill(DARK);
doc.rect(0, 0, 8, H).fill(CYAN);
wordmark(M, 70, 22, true);
doc.fillColor(CYAN).font("Helvetica-Bold").fontSize(12).text("GUÍA GRATUITA", M, 150, { characterSpacing: 2 });
doc.fillColor("#fafafa").font("Helvetica-Bold").fontSize(34).text("Software a medida\nsin perder plata", M, 180, { lineGap: 4 });
doc.fillColor("#a9b2bd").font("Helvetica").fontSize(13).text("Cómo decidir bien: precios reales, cuándo conviene, con quién construir y qué exigir. Sin tecnicismos.", M, 290, { width: CW - 60, lineGap: 4 });
doc.fillColor(CYAN).font("Helvetica").fontSize(11).text("maudev.cl", M, H - 80);
doc.fillColor("#6b7480").font("Helvetica").fontSize(9).text("Desarrollo web · Software a medida · Automatización — Chile", M, H - 62);

// ---- CONTENIDO ----
doc.addPage();
doc.fillColor(INK).font("Helvetica-Bold").fontSize(20).text("Por qué esta guía", M, M);
doc.moveDown(0.4);
p("Construir software a medida es una de las decisiones más caras —y más rentables— que toma una empresa. Pero casi nadie te enseña a tomarla bien, y la mayoría termina pagando dos veces. Esta guía resume lo esencial para que decidas con cabeza fría: cuánto cuesta de verdad, cuándo conviene, cómo elegir con quién, qué retorno esperar y qué exigir antes de firmar.");

h2("1. ¿Cuánto cuesta de verdad?");
p("No hay un precio único: depende del alcance, la complejidad de la lógica, las integraciones, los usuarios y roles, el diseño y la escala. Estos son los rangos con los que trabajamos en Chile (2026), como orden de magnitud:");
priceRow("Landing / sitio de conversión", "$390.000 – $900.000");
priceRow("Automatización / integraciones", "$290.000 – $700.000");
priceRow("Software a medida (app, dashboard, MVP)", "desde $900.000");
priceRow("Sistema o plataforma más grande", "se cotiza por proyecto");
p("Ojo: eso es la construcción inicial. El software, como un auto, también tiene mantención (desde $49.000/mes). Y si te cotizan en 5 minutos sin entender tu negocio, cuidado: o es una plantilla disfrazada, o ese precio va a subir. El precio fijo exacto para tu caso te llega por escrito en el diagnóstico, sin costos ocultos.");

h2("2. ¿A medida o una herramienta de mercado (SaaS)?");
p("El SaaS gana en lo estándar, rápido y barato de partida. El software a medida gana cuando el proceso ES tu ventaja, cuando ya peleas con la herramienta, o cuando el costo de arrendar para siempre supera al de construir lo tuyo.");
bullets([
  "Calcula: ¿cuánto pagarás en suscripciones en 5 años, y qué te quedará? (Spoiler: nada tuyo.)",
  "Si exportas a Excel para hacer lo que la herramienta no hace, ya te quedó chico.",
  "La jugada maestra suele ser combinar: SaaS para lo estándar, a medida para tu ventaja.",
]);

h2("3. Cómo elegir con quién construir");
p("El precio es lo que MENOS importa de la decisión. Lo barato sale caro: suele venir sin pruebas, sin seguridad, sin soporte y a veces sin que el código quede a tu nombre. Compara por lo que INCLUYE, no por el número final.");
p("Qué mirar:");
bullets([
  "Portafolio funcionando (no solo capturas) y referencias que puedas hablar.",
  "Contrato con precio y alcance por escrito.",
  "Que el código y el dominio queden a TU nombre.",
  "Que puedas hablar con quien programa, no solo con un vendedor.",
  "Avances visibles durante el proyecto + soporte después de entregar.",
]);
p("Señales de alerta (corre si las ves): te cotizan sin entender tu negocio · no muestran avances hasta el final · precio sospechosamente bajo · evaden de quién es el código · solo te atiende un vendedor.");

h2("4. El ROI real de automatizar");
p("Lo manual no es gratis: tiene un costo escondido en horas, errores y ventas perdidas que suele superar al de automatizar. Empieza por lo que más se repite y más errores genera:");
bullets([
  "Responder y calificar leads al instante (la velocidad de respuesta mueve la venta).",
  "Cotizaciones y documentos automáticos.",
  "Seguimientos que se mandan solos (ahí se recuperan ventas).",
  "Reportes que se arman solos.",
]);
p("Error caro: automatizar el caos. Si el proceso es malo, solo lo harás más rápido. Ordena primero, automatiza después.");

h2("5. De idea a sistema: el proceso");
p("Un proyecto sano no es una caja negra. Tiene etapas claras y tú ves el avance:");
bullets([
  "Descubrimiento (entender tu negocio) → Diseño y arquitectura.",
  "Desarrollo por sprints: ves algo funcionando cada 1-2 semanas.",
  "Pruebas (QA) → Despliegue seguro → Soporte y evolución.",
]);
p("Plazos realistas: un MVP, semanas a un par de meses; un sistema mediano, 2 a 5 meses. Desconfía de quien promete algo serio 'para la próxima semana'. Y recuerda: los mejores proyectos son los que el cliente acompaña (feedback a tiempo).");

// ---- CHECKLIST ----
doc.addPage();
doc.rect(M - 16, doc.y - 8, CW + 32, 0).stroke();
doc.fillColor(INK).font("Helvetica-Bold").fontSize(20).text("Checklist: antes de firmar", M, M);
doc.moveDown(0.6);
const checks = [
  "¿De quién queda el código y el dominio? (Respuesta correcta: tuyo.)",
  "¿Hay un precio y un alcance por escrito?",
  "¿Voy a ver avances funcionando durante el proyecto?",
  "¿Qué incluye exactamente el soporte y por cuánto tiempo?",
  "¿Qué pasa si necesito cambios a mitad de camino?",
  "¿Cómo manejan las pruebas y la seguridad?",
  "¿Quién va a programar esto y puedo hablar con esa persona?",
];
doc.font("Helvetica").fontSize(11.5).fillColor(INK);
for (const c of checks) {
  ensure(34);
  const y = doc.y;
  doc.lineWidth(1.3).strokeColor(CYAN).rect(M, y + 1, 13, 13).stroke();
  doc.fillColor(INK).text(c, M + 24, y, { width: CW - 24, lineGap: 2 });
  doc.moveDown(0.6);
}

// ---- CTA ----
ensure(160);
doc.moveDown(1);
const cy = doc.y;
doc.roundedRect(M, cy, CW, 130, 10).fill(DARK);
wordmark(M + 24, cy + 22, 16, true);
doc.fillColor("#fafafa").font("Helvetica-Bold").fontSize(15).text("¿Lo aplicamos a tu negocio?", M + 24, cy + 52, { width: CW - 48 });
doc.fillColor("#a9b2bd").font("Helvetica").fontSize(10.5).text("En maudev construimos webs, software a medida y automatización para PYMEs y empresas en Chile. Agenda un diagnóstico gratuito y conversemos.", M + 24, cy + 74, { width: CW - 48, lineGap: 2 });
doc.fillColor(CYAN).font("Helvetica-Bold").fontSize(11).text("maudev.cl/contacto", M + 24, cy + 104);

// ---- pie de página con numeración ----
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count; i++) {
  doc.switchToPage(i);
  doc.fillColor(MUTE).font("Helvetica").fontSize(8);
  doc.text("maudev · Software a medida sin perder plata", M, H - 38, { width: CW * 0.7 });
  doc.text(`${i} / ${range.count - 1}`, M + CW * 0.7, H - 38, { width: CW * 0.3, align: "right" });
}

doc.end();
console.log("Generado:", OUT);
