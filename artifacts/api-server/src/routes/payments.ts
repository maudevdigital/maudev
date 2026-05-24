import { Router } from "express";
import { eq, and } from "drizzle-orm";
import axios from "axios";
import crypto from "crypto";
import { db, ordersTable, productsTable } from "@workspace/db";
import { getUncachableResendClient } from "../lib/resend.js";
import { purchaseScriptEmail, purchaseServiceEmail } from "../lib/emailTemplates.js";
import { logger } from "../lib/logger.js";

const router = Router();

const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || "";
const FLOW_API_URL = process.env.FLOW_SANDBOX === "true"
  ? "https://sandbox.flow.cl/api"
  : "https://www.flow.cl/api";
const BASE_URL = process.env.BASE_URL_PUBLIC
  || (process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80");

function signFlowParams(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().reduce((acc: Record<string, string>, key) => {
    acc[key] = params[key];
    return acc;
  }, {});
  const toSign = Object.entries(sorted).map(([k, v]) => `${k}${v}`).join("");
  return crypto.createHmac("sha256", FLOW_SECRET_KEY).update(toSign).digest("hex");
}

async function getFlowPaymentStatus(token: string) {
  const params: Record<string, string> = { apiKey: FLOW_API_KEY, token };
  params.s = signFlowParams(params);
  const { data } = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params });
  return data;
}

function parseOrderId(commerceOrder: string): number {
  // Formats: "11", "11-1712345678901", "11-R1712345678901"
  const base = commerceOrder.split("-")[0];
  return Number(base);
}

async function sendPurchaseEmail(orderId: number) {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (!order || order.status !== "paid") return;

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, order.productId));
    if (!product) return;

    const isScript = product.category === "trading_scripts";
    const paidAt = order.paidAt
      ? new Date(order.paidAt).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
      : new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

    const emailData = isScript
      ? purchaseScriptEmail({
          productName: order.productName,
          amount: Number(order.amount).toLocaleString("es-CL"),
          currency: order.currency,
          orderId: order.id,
          paidAt,
        })
      : purchaseServiceEmail({
          productName: order.productName,
          amount: Number(order.amount).toLocaleString("es-CL"),
          currency: order.currency,
          orderId: order.id,
          paidAt,
        });

    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: order.userEmail,
      subject: emailData.subject,
      html: emailData.html,
    });
    logger.info({ orderId, email: order.userEmail }, "Purchase confirmation email sent");
  } catch (err) {
    // Don't fail the payment flow if email fails
    logger.error({ err, orderId }, "Failed to send purchase confirmation email");
  }
}

async function handleFlowReturn(req: any, res: any) {
  const token = (req.query?.token as string) || (req.body?.token as string);
  if (!token) return res.redirect(302, `${BASE_URL}/dashboard?payment=error`);

  try {
    const status = await getFlowPaymentStatus(token);
    const orderId = parseOrderId(status.commerceOrder);

    if (status.status === 2) {
      await db.update(ordersTable)
        .set({ status: "paid", paidAt: new Date() })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
      // Send styled purchase confirmation email (non-blocking)
      sendPurchaseEmail(orderId);
      res.redirect(302, `${BASE_URL}/dashboard?payment=success&orderId=${orderId}`);
    } else if (status.status === 3 || status.status === 4) {
      // 3 = rejected, 4 = cancelled by user
      await db.update(ordersTable)
        .set({ status: "failed" })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
      res.redirect(302, `${BASE_URL}/dashboard?payment=cancelled&orderId=${orderId}`);
    } else {
      res.redirect(302, `${BASE_URL}/dashboard?payment=error`);
    }
  } catch (err) {
    res.redirect(302, `${BASE_URL}/dashboard?payment=error`);
  }
}

// These callback routes are mounted separately in app.ts BEFORE clerkMiddleware
// so that Flow.cl redirects/webhooks are never intercepted by Clerk auth.
export const flowCallbackRouter = Router();

flowCallbackRouter.get("/payments/flow/confirm", handleFlowReturn);
flowCallbackRouter.post("/payments/flow/confirm", handleFlowReturn);

flowCallbackRouter.post("/payments/flow/webhook", async (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).json({ error: "No token" });

  try {
    const status = await getFlowPaymentStatus(token);
    const orderId = parseOrderId(status.commerceOrder);

    if (status.status === 2) {
      await db.update(ordersTable)
        .set({ status: "paid", paidAt: new Date() })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
      sendPurchaseEmail(orderId);
    } else if (status.status === 3) {
      await db.update(ordersTable)
        .set({ status: "failed" })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Webhook error" });
  }
});

// ── CoinGate callback ──
flowCallbackRouter.post("/payments/coingate/webhook", async (req, res) => {
  try {
    const { order_id, status } = req.body as { order_id?: string; status?: string };
    if (!order_id) return res.status(400).json({ error: "No order_id" });

    const orderId = Number(order_id);
    if (Number.isNaN(orderId)) return res.status(400).json({ error: "Invalid order_id" });

    if (status === "paid") {
      await db.update(ordersTable)
        .set({ status: "paid", paidAt: new Date() })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
      sendPurchaseEmail(orderId);
    } else if (status === "canceled" || status === "expired" || status === "invalid") {
      await db.update(ordersTable)
        .set({ status: "failed" })
        .where(and(eq(ordersTable.id, orderId), eq(ordersTable.status, "pending")));
    }

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "CoinGate webhook error");
    res.status(500).json({ error: "Webhook error" });
  }
});

export default router;
