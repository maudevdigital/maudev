import { Router } from "express";
import { getStripePublishableKey } from "../lib/stripeClient.js";

const router = Router();

// GET /payments/config — returns Stripe publishable key for frontend
router.get("/payments/config", async (_req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err) {
    res.status(503).json({ error: "Stripe not configured" });
  }
});

export default router;
