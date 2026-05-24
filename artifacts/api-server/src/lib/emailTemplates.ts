// Styled HTML email templates matching MAUDEV brand
// Colors: bg #0a0a0a, card #111111, primary #06b6d4, muted #a1a1aa, border rgba(6,182,212,0.2)

const APP_URL = () => process.env.BASE_URL_PUBLIC || "https://maudev.cl";

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>MAUDEV</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',Courier,monospace;color:#e4e4e7;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid rgba(6,182,212,0.2);background:#111111;">
<!-- Header -->
<tr><td style="padding:24px 40px;border-bottom:1px solid rgba(6,182,212,0.15);">
  <span style="font-size:22px;font-weight:bold;letter-spacing:-1px;">
    <span style="color:#06b6d4;">MAU</span><span style="color:#a1a1aa;">DEV</span>
  </span>
</td></tr>
<!-- Content -->
<tr><td style="padding:40px;">
${content}
</td></tr>
<!-- Footer -->
<tr><td style="padding:20px 40px;border-top:1px solid rgba(6,182,212,0.1);">
  <p style="margin:0;font-size:10px;color:#3f3f46;">© ${new Date().getFullYear()} MAUDEV. Santiago, Chile.</p>
  <p style="margin:4px 0 0;font-size:10px;color:#3f3f46;">
    <a href="${APP_URL()}" style="color:#06b6d4;text-decoration:none;">maudev.cl</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`.trim();
}

function btn(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="background:#06b6d4;padding:12px 28px;">
  <a href="${href}" style="color:#000000;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;">${label}</a>
</td></tr>
</table>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
  <td style="padding:8px 12px;font-size:11px;color:#71717a;border-bottom:1px solid rgba(255,255,255,0.05);white-space:nowrap;">${label}</td>
  <td style="padding:8px 12px;font-size:12px;color:#e4e4e7;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${value}</td>
</tr>`;
}

// ─── Purchase confirmation for TRADING SCRIPTS (indicators) ───
export function purchaseScriptEmail(params: {
  productName: string;
  amount: string;
  currency: string;
  orderId: number;
  paidAt: string;
}): { subject: string; html: string } {
  const dashUrl = `${APP_URL()}/dashboard`;
  const content = `
<p style="margin:0 0 8px;font-size:10px;color:#06b6d4;letter-spacing:2px;">COMPRA CONFIRMADA</p>
<h1 style="margin:0 0 20px;font-size:22px;font-weight:bold;color:#ffffff;line-height:1.3;">¡Gracias por tu compra!</h1>
<p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.7;">
  Tu pago ha sido procesado exitosamente. Ya puedes descargar tu indicador y el manual de uso desde tu dashboard.
</p>

<!-- Order details -->
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(6,182,212,0.15);margin:0 0 24px;">
  <tr><td colspan="2" style="padding:10px 12px;font-size:10px;color:#06b6d4;letter-spacing:2px;border-bottom:1px solid rgba(6,182,212,0.15);background:rgba(6,182,212,0.05);">DETALLE DEL PEDIDO</td></tr>
  ${infoRow("Producto", params.productName)}
  ${infoRow("Monto", `$${params.amount} ${params.currency}`)}
  ${infoRow("Orden", `#${params.orderId}`)}
  ${infoRow("Fecha", params.paidAt)}
</table>

<!-- Steps -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 1</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Ingresa a tu dashboard</p>
    </td>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 2</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Descarga el indicador</p>
    </td>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 3</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Revisa el manual de uso</p>
    </td>
  </tr>
</table>

${btn("IR A MI DASHBOARD →", dashUrl)}

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0 16px;">
<p style="margin:0;font-size:11px;color:#52525b;line-height:1.6;">
  Si tienes alguna duda, responde directamente a este email. Estamos para ayudarte.
</p>`;
  return {
    subject: `Compra confirmada — ${params.productName}`,
    html: layout(content),
  };
}

// ─── Purchase confirmation for DIGITAL SERVICES (landing, n8n, fullstack, mobile) ───
export function purchaseServiceEmail(params: {
  productName: string;
  amount: string;
  currency: string;
  orderId: number;
  paidAt: string;
}): { subject: string; html: string } {
  const dashUrl = `${APP_URL()}/dashboard`;
  const content = `
<p style="margin:0 0 8px;font-size:10px;color:#06b6d4;letter-spacing:2px;">SERVICIO CONTRATADO</p>
<h1 style="margin:0 0 20px;font-size:22px;font-weight:bold;color:#ffffff;line-height:1.3;">¡Proyecto confirmado!</h1>
<p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.7;">
  Tu pago ha sido procesado exitosamente. Nuestro equipo te contactará dentro de las próximas <strong style="color:#e4e4e7;">24 horas</strong> para coordinar los detalles de tu proyecto.
</p>

<!-- Order details -->
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(6,182,212,0.15);margin:0 0 24px;">
  <tr><td colspan="2" style="padding:10px 12px;font-size:10px;color:#06b6d4;letter-spacing:2px;border-bottom:1px solid rgba(6,182,212,0.15);background:rgba(6,182,212,0.05);">DETALLE DEL PEDIDO</td></tr>
  ${infoRow("Servicio", params.productName)}
  ${infoRow("Monto", `$${params.amount} ${params.currency}`)}
  ${infoRow("Orden", `#${params.orderId}`)}
  ${infoRow("Fecha", params.paidAt)}
</table>

<!-- Steps -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 1</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Te contactamos en 24h para coordinar</p>
    </td>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 2</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Definimos requerimientos y plazos</p>
    </td>
    <td style="padding:14px;border:1px solid rgba(6,182,212,0.1);background:rgba(6,182,212,0.03);width:33%;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;color:#06b6d4;letter-spacing:1px;">PASO 3</p>
      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">Desarrollo, revisiones y entrega</p>
    </td>
  </tr>
</table>

${btn("VER MI PEDIDO →", dashUrl)}

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0 16px;">
<p style="margin:0;font-size:11px;color:#52525b;line-height:1.6;">
  Si tienes alguna duda, responde directamente a este email. Estamos para ayudarte.
</p>`;
  return {
    subject: `Servicio contratado — ${params.productName}`,
    html: layout(content),
  };
}
