const BRAND_CYAN = "#06b6d4";
const BRAND_ZINC = "#a1a1aa";
const BG_DARK = "#0a0a0a";
const CARD_BG = "#111111";
const BORDER_COLOR = "rgba(6,182,212,0.2)";
const BORDER_LIGHT = "rgba(6,182,212,0.15)";
const BORDER_SUBTLE = "rgba(6,182,212,0.1)";
const TEXT_MUTED = "#52525b";
const TEXT_SECONDARY = "#a1a1aa";
const TEXT_PRIMARY = "#e4e4e7";
const FONT = "'Courier New',Courier,monospace";

function header(): string {
  return `<tr>
    <td style="padding:32px 40px;border-bottom:1px solid ${BORDER_LIGHT};">
      <span style="font-size:22px;font-weight:bold;letter-spacing:-1px;">
        <span style="color:${BRAND_CYAN};">MAU</span><span style="color:${BRAND_ZINC};">DEV</span>
      </span>
    </td>
  </tr>`;
}

function footer(extra?: string): string {
  return `<tr>
    <td style="padding:20px 40px;border-top:1px solid ${BORDER_SUBTLE};">
      ${extra ? `<p style="margin:0 0 8px;font-size:11px;color:${TEXT_MUTED};line-height:1.6;">${extra}</p>` : ""}
      <p style="margin:0;font-size:10px;color:#3f3f46;">© ${new Date().getFullYear()} MAUDEV. Santiago, Chile.</p>
    </td>
  </tr>`;
}

export function wrapEmail(bodyHtml: string, footerExtra?: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BG_DARK};font-family:${FONT};color:${TEXT_PRIMARY};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_DARK};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid ${BORDER_COLOR};background:${CARD_BG};">
        ${header()}
        <tr><td style="padding:40px;">
          ${bodyHtml}
        </td></tr>
        ${footer(footerExtra)}
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function btn(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr><td style="background:${BRAND_CYAN};padding:12px 28px;">
      <a href="${href}" style="color:#000000;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;">${text}</a>
    </td></tr>
  </table>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0;">`;
}

function label(text: string): string {
  return `<p style="margin:0 0 8px;font-size:10px;color:${BRAND_CYAN};letter-spacing:2px;">${text}</p>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 24px;font-size:24px;font-weight:bold;color:#ffffff;line-height:1.2;">${text}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:14px;color:${TEXT_SECONDARY};line-height:1.7;">${text}</p>`;
}

function detail(labelText: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:12px;color:${TEXT_MUTED};border-bottom:1px solid rgba(255,255,255,0.04);">${labelText}</td>
    <td style="padding:8px 0;font-size:12px;color:${TEXT_PRIMARY};text-align:right;border-bottom:1px solid rgba(255,255,255,0.04);">${value}</td>
  </tr>`;
}

function detailTable(rows: { label: string; value: string }[]): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
    ${rows.map((r) => detail(r.label, r.value)).join("")}
  </table>`;
}

export function welcomeEmail(name: string | null | undefined, unsubscribeUrl: string): string {
  const greeting = name ? `Hola ${name}` : "Hola";
  const body = `
    ${label("BIENVENIDO")}
    ${heading(`${greeting},<br>ya eres parte de MAUDEV.`)}
    ${paragraph("Recibirás actualizaciones sobre nuevos indicadores Pine Script para TradingView, herramientas MT5 y análisis de mercado. Sin spam. Solo lo que importa.")}
    ${btn("VER PRODUCTOS →", "https://maudev.cl/products")}
  `;
  const footerExtra = `Recibes este correo porque te suscribiste en maudev.cl.<br><a href="${unsubscribeUrl}" style="color:${BRAND_CYAN};">Cancelar suscripción</a>`;
  return wrapEmail(body, footerExtra);
}

function formatCLP(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-CL")}`;
}

export function paymentConfirmationEmail(order: {
  id: number;
  productName: string;
  amount: number;
  currency: string;
  userEmail: string;
  category?: string;
}): string {
  const isService = order.category === "digital_service";
  const body = `
    ${label("CONFIRMACIÓN DE PAGO")}
    ${heading("¡Pago recibido exitosamente!")}
    ${paragraph(`Tu compra de <strong style="color:#ffffff;">${order.productName}</strong> ha sido procesada correctamente.`)}
    ${detailTable([
      { label: "Pedido", value: `#${order.id}` },
      { label: "Producto", value: order.productName },
      { label: "Total", value: `${formatCLP(order.amount)} ${order.currency}` },
      { label: "Estado", value: `<span style="color:#22c55e;">✓ Pagado</span>` },
    ])}
    ${divider()}
    ${isService
      ? `${paragraph("Nuestro equipo se pondrá en contacto contigo dentro de las próximas <strong style='color:#ffffff;'>24 horas hábiles</strong> para coordinar los detalles de tu servicio.")}
         ${btn("VER MI DASHBOARD →", "https://maudev.cl/dashboard")}`
      : `${paragraph("Ya puedes descargar tu producto desde tu dashboard. Ahí encontrarás los archivos y el manual de uso.")}
         ${btn("DESCARGAR AHORA →", "https://maudev.cl/dashboard")}`
    }
  `;
  return wrapEmail(body);
}

export function adminCampaignEmail(html: string, unsubscribeUrl: string): string {
  const footerExtra = `Recibes este correo porque estás suscrito en maudev.cl.<br><a href="${unsubscribeUrl}" style="color:${BRAND_CYAN};">Cancelar suscripción</a>`;
  return wrapEmail(html, footerExtra);
}

export function userCampaignEmail(html: string): string {
  return wrapEmail(html);
}
