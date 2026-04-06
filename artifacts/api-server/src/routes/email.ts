import { Router } from "express";
import { db, emailSubscribersTable } from "@workspace/db";
import { SubscribeEmailBody } from "@workspace/api-zod";

const router = Router();

// POST /email/subscribe
router.post("/email/subscribe", async (req, res) => {
  try {
    const body = SubscribeEmailBody.parse(req.body);

    // Upsert subscriber (ignore if already exists)
    await db.insert(emailSubscribersTable)
      .values({
        email: body.email,
        name: body.name ?? null,
      })
      .onConflictDoNothing();

    res.json({ success: true, message: "Suscripción exitosa. ¡Gracias!" });
  } catch (err) {
    req.log.error({ err }, "Failed to subscribe email");
    res.status(400).json({ error: "Email inválido" });
  }
});

export default router;
