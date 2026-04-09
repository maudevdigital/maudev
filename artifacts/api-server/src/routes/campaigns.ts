import { Router } from "express";
import { requireAdmin } from "./auth";
import { getUncachableResendClient } from "../lib/resend.js";
import { userCampaignEmail } from "../lib/email-template.js";

const router = Router();

router.post("/admin/campaigns/send", requireAdmin, async (req, res) => {
  try {
    const { subject, html, recipients } = req.body as {
      subject?: string;
      html?: string;
      recipients?: string[];
    };

    if (!subject || !html || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "subject, html y recipients son requeridos" });
    }

    if (recipients.length > 50) {
      return res.status(400).json({ error: "Maximo 50 destinatarios por campana" });
    }

    const validEmails = recipients.filter((e) =>
      typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
    );

    if (validEmails.length === 0) {
      return res.status(400).json({ error: "No se encontraron emails validos" });
    }

    const { client, fromEmail } = await getUncachableResendClient();
    const wrappedHtml = userCampaignEmail(html);

    const BATCH_SIZE = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
      const batch = validEmails.slice(i, i + BATCH_SIZE);
      const emails = batch.map((to) => ({
        from: `MAUDEV <${fromEmail}>`,
        to: [to],
        subject,
        html: wrappedHtml,
      }));

      try {
        await client.batch.send(emails);
        sent += batch.length;
      } catch (batchErr) {
        req.log.warn({ batchErr }, `Campaign batch failed`);
        failed += batch.length;
      }
    }

    res.json({ sent, failed, total: validEmails.length });
  } catch (err) {
    req.log.error({ err }, "Failed to send campaign");
    res.status(500).json({ error: "Error enviando la campana" });
  }
});

export default router;
