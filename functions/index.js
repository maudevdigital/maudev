const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const ADMIN_EMAIL = "maudevchile@gmail.com";
const SEND_AUTOREPLY = process.env.SEND_AUTOREPLY === "true";

const interestLabels = {
  marketing_funnel: "Embudo de ventas",
  seo_landing: "Landing SEO",
  trading_script: "Trading Script",
  web_app: "Sistema web",
  bot_automation: "Automatización",
  general: "Consulta general",
};

const sourceLabels = {
  hero_funnel: "Hero funnel",
  contact_form: "Formulario de contacto",
  newsletter: "Newsletter",
  blog_cta: "CTA blog",
  product_detail: "Ficha de producto",
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const compact = (entries) =>
  entries.filter(([, value]) => value !== undefined && value !== null && value !== "");

const detailsText = (entries) =>
  compact(entries).map(([label, value]) => `${label}: ${value}`).join("\n");

const detailsHtml = (entries) =>
  `<ul>${compact(entries)
    .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`)
    .join("")}</ul>`;

const queueEmail = (data) => db.collection("mail").add(data);

exports.queueLeadEmail = onDocumentCreated("leads/{leadId}", async (event) => {
  const lead = event.data && event.data.data();
  if (!lead) return;

  const interest = interestLabels[lead.interest] || lead.interest || "General";
  const source = sourceLabels[lead.source] || lead.source || "Sin fuente";
  const subject = `Nuevo lead Maudev: ${interest}`;
  const rows = [
    ["Nombre", lead.name],
    ["Email", lead.email],
    ["Interés", interest],
    ["Fuente", source],
    ["Mensaje", lead.message],
    ["Página", lead.page_path],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
  ];

  await queueEmail({
    to: [ADMIN_EMAIL],
    replyTo: lead.email,
    message: {
      subject,
      text: `Entró un nuevo lead desde maudev.\n\n${detailsText(rows)}`,
      html: `<p>Entró un nuevo lead desde <strong>maudev</strong>.</p>${detailsHtml(rows)}`,
    },
  });

  if (SEND_AUTOREPLY && lead.email) {
    await queueEmail({
      to: [lead.email],
      message: {
        subject: "Recibimos tu solicitud en Maudev",
        text: "Gracias por escribirnos. Revisaremos tu proyecto y responderemos con una ruta inicial en menos de 24 horas.",
        html: "<p>Gracias por escribirnos.</p><p>Revisaremos tu proyecto y responderemos con una ruta inicial en menos de 24 horas.</p>",
      },
    });
  }

  logger.info("Lead email queued", { leadId: event.params.leadId, email: lead.email });
});

exports.queueOrderEmail = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data && event.data.data();
  if (!order) return;

  const subject = `Nueva orden Maudev: ${order.product_title || "Producto"}`;
  const rows = [
    ["Cliente", order.customer_name],
    ["Email", order.customer_email],
    ["Producto", order.product_title],
    ["Monto", order.amount],
    ["Estado", order.status],
    ["Fuente", sourceLabels[order.source] || order.source],
    ["Página", order.page_path],
  ];

  await queueEmail({
    to: [ADMIN_EMAIL],
    replyTo: order.customer_email,
    message: {
      subject,
      text: `Entró una nueva orden desde maudev.\n\n${detailsText(rows)}`,
      html: `<p>Entró una nueva orden desde <strong>maudev</strong>.</p>${detailsHtml(rows)}`,
    },
  });

  logger.info("Order email queued", { orderId: event.params.orderId, email: order.customer_email });
});
