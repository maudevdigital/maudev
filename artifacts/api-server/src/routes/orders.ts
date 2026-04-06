import { Router } from "express";
import { eq } from "drizzle-orm";
import axios from "axios";
import crypto from "crypto";
import { db, ordersTable, productsTable } from "@workspace/db";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";
import { requireAuth } from "./auth";

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

// GET /orders — user's orders
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId));
    res.json(orders.map((o) => ({
      ...o,
      amount: Number(o.amount),
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders — create order and initiate Flow payment
router.post("/orders", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const body = CreateOrderBody.parse(req.body);

    // Get product
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.productId));
    if (!product || !product.active) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create order
    const [order] = await db.insert(ordersTable).values({
      userId,
      userEmail: body.userEmail,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      currency: product.currency,
      status: "pending",
    }).returning();

    // If no Flow credentials, return a mock URL for dev
    if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
      const paymentUrl = `${BASE_URL}/payment-success?orderId=${order.id}&mock=true`;
      res.status(201).json({
        order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
        paymentUrl,
      });
      return;
    }

    // Create Flow payment
    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      amount: Math.round(Number(product.price)).toString(),
      commerceOrder: String(order.id),
      currency: product.currency || "CLP",
      email: body.userEmail,
      subject: `Compra MauDev: ${product.name}`,
      urlConfirmation: `${BASE_URL}/api/payments/flow/confirm`,
      urlReturn: `${BASE_URL}/dashboard`,
    };
    params.s = signFlowParams(params);

    const formData = new URLSearchParams(params);
    const flowRes = await axios.post(`${FLOW_API_URL}/payment/create`, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { token, url } = flowRes.data;
    await db.update(ordersTable).set({ flowToken: token }).where(eq(ordersTable.id, order.id));

    const paymentUrl = `${url}?token=${token}`;
    res.status(201).json({
      order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
      paymentUrl,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:id
router.get("/orders/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order || order.userId !== userId) return res.status(404).json({ error: "Not found" });
    res.json({ ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: order.paidAt ? order.paidAt.toISOString() : null });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
