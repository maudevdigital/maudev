import { Router } from "express";
import { eq } from "drizzle-orm";
import axios from "axios";
import crypto from "crypto";
import { db, ordersTable } from "@workspace/db";

const router = Router();

const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || "";
const FLOW_API_URL = process.env.FLOW_SANDBOX === "true"
  ? "https://sandbox.flow.cl/api"
  : "https://www.flow.cl/api";
const BASE_URL = process.env.BASE_URL_PUBLIC || "http://localhost:80";

function signFlowParams(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().reduce((acc: Record<string, string>, key) => {
    acc[key] = params[key];
    return acc;
  }, {});
  const toSign = Object.entries(sorted).map(([k, v]) => `${k}${v}`).join("");
  return crypto.createHmac("sha256", FLOW_SECRET_KEY).update(toSign).digest("hex");
}

async function getFlowPaymentStatus(token: string) {
  const params: Record<string, string> = {
    apiKey: FLOW_API_KEY,
    token,
  };
  params.s = signFlowParams(params);
  const { data } = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params });
  return data;
}

// GET /payments/flow/confirm — Flow calls this after payment
router.get("/payments/flow/confirm", async (req, res) => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) return res.redirect(`${BASE_URL}/dashboard?error=no_token`);

    if (FLOW_API_KEY && FLOW_SECRET_KEY) {
      const status = await getFlowPaymentStatus(token);
      const commerceOrder = status.commerceOrder;
      const orderId = Number(commerceOrder);

      if (status.status === 2) {
        // Payment successful
        await db.update(ordersTable)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(ordersTable.id, orderId));
      } else {
        await db.update(ordersTable)
          .set({ status: "failed" })
          .where(eq(ordersTable.id, orderId));
      }
    } else {
      // Mock mode: find order by token or just mark as success
      const [order] = await db.select().from(ordersTable).where(eq(ordersTable.flowToken, token));
      if (order) {
        await db.update(ordersTable)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(ordersTable.id, order.id));
      }
    }

    res.redirect(`${BASE_URL}/dashboard?payment=success`);
  } catch (err) {
    res.redirect(`${BASE_URL}/dashboard?payment=error`);
  }
});

// POST /payments/flow/webhook — Flow webhook notification
router.post("/payments/flow/webhook", async (req, res) => {
  try {
    const { token } = req.body as { token?: string };
    if (!token) return res.status(400).json({ error: "No token" });

    if (FLOW_API_KEY && FLOW_SECRET_KEY) {
      const status = await getFlowPaymentStatus(token);
      const orderId = Number(status.commerceOrder);

      if (status.status === 2) {
        await db.update(ordersTable)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(ordersTable.id, orderId));
      } else if (status.status === 3) {
        await db.update(ordersTable)
          .set({ status: "failed" })
          .where(eq(ordersTable.id, orderId));
      }
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
