import { Router } from "express";
import { db, emailSubscribersTable } from "@workspace/db";
import { SubscribeEmailBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { getUncachableResendClient } from "../lib/resend.js";

const router = Router();

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function buildUnsubscribeUrl(token: string): string {
  const base = process.env.APP_URL ?? "https://maudev.cl";
  return `${base}/api/email/unsubscribe?token=${token}`;
}

function welcomeEmailHtml(name: string | null | undefined, unsubscribeUrl: string): string {
  const greeting = name ? `Hola ${name}` : "Hola";
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bienvenido a MAUDEV</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',Courier,monospace;color:#e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid rgba(6,182,212,0.2);background:#111111;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid rgba(6,182,212,0.15);">
              <span style="font-size:22px;font-weight:bold;letter-spacing:-1px;">
                <span style="color:#06b6d4;">MAU</span><span style="color:#a1a1aa;">DEV</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:10px;color:#06b6d4;letter-spacing:2px;">BIENVENIDO</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:bold;color:#ffffff;line-height:1.2;">${greeting},<br>ya eres parte de MAUDEV.</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.7;">
                Recibirás actualizaciones sobre nuevos indicadores Pine Script para TradingView, herramientas MT5 y análisis de mercado. Sin spam. Solo lo que importa.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#06b6d4;padding:12px 28px;">
                    <a href="https://maudev.cl/products" style="color:#000000;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;">VER PRODUCTOS →</a>
                  </td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0;">
              <p style="margin:0;font-size:11px;color:#52525b;line-height:1.6;">
                Recibes este correo porque te suscribiste en maudev.cl.<br>
                ¿Ya no quieres recibir emails? <a href="${unsubscribeUrl}" style="color:#06b6d4;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(6,182,212,0.1);">
              <p style="margin:0;font-size:10px;color:#3f3f46;">© ${new Date().getFullYear()} MAUDEV. Santiago, Chile.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// POST /email/subscribe
router.post("/email/subscribe", async (req, res) => {
  try {
    const body = SubscribeEmailBody.parse(req.body);
    const token = generateToken();

    const existing = await db
      .select()
      .from(emailSubscribersTable)
      .where(eq(emailSubscribersTable.email, body.email))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].status === "unsubscribed") {
        await db
          .update(emailSubscribersTable)
          .set({ status: "active", name: body.name ?? existing[0].name })
          .where(eq(emailSubscribersTable.email, body.email));
      }
      res.json({ success: true, message: "¡Bienvenido de nuevo!" });
      return;
    }

    await db.insert(emailSubscribersTable).values({
      email: body.email,
      name: body.name ?? null,
      status: "active",
      unsubscribeToken: token,
    });

    // Send welcome email (non-blocking)
    const unsubscribeUrl = buildUnsubscribeUrl(token);
    try {
      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: `MAUDEV <${fromEmail}>`,
        to: [body.email],
        subject: "Bienvenido a MAUDEV — todo listo",
        html: welcomeEmailHtml(body.name, unsubscribeUrl),
      });
    } catch (emailErr) {
      req.log.warn({ emailErr }, "Failed to send welcome email");
    }

    res.json({ success: true, message: "Suscripción exitosa. ¡Gracias!" });
  } catch (err) {
    req.log.error({ err }, "Failed to subscribe email");
    res.status(400).json({ error: "Email inválido" });
  }
});

// GET /email/unsubscribe?token=
router.get("/email/unsubscribe", async (req, res) => {
  const token = req.query.token as string | undefined;
  if (!token) {
    res.status(400).send("Token inválido.");
    return;
  }

  const subscriber = await db
    .select()
    .from(emailSubscribersTable)
    .where(eq(emailSubscribersTable.unsubscribeToken, token))
    .limit(1);

  if (subscriber.length === 0) {
    res.status(404).send("Token no encontrado.");
    return;
  }

  await db
    .update(emailSubscribersTable)
    .set({ status: "unsubscribed" })
    .where(eq(emailSubscribersTable.unsubscribeToken, token));

  res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Baja exitosa</title>
    <style>body{margin:0;background:#0a0a0a;color:#e4e4e7;font-family:'Courier New',monospace;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;}
    h1{font-size:20px;color:#fff;} p{font-size:13px;color:#a1a1aa;} a{color:#06b6d4;}</style></head>
    <body><h1>MAUDEV</h1><p>Has cancelado tu suscripción exitosamente.</p>
    <p><a href="/">Volver al sitio →</a></p></body></html>`);
});

export default router;
