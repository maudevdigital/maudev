import { Router } from "express";
import { eq } from "drizzle-orm";
import axios from "axios";
import crypto from "crypto";
import { db, ordersTable, productsTable } from "@workspace/db";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";
import { requireAuth } from "./auth";
import rateLimit from "express-rate-limit";

const router = Router();

const createOrderLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de compra, intenta nuevamente en 15 minutos" },
});

const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || "";
const FLOW_API_URL = process.env.FLOW_SANDBOX === "true"
  ? "https://sandbox.flow.cl/api"
  : "https://www.flow.cl/api";
const COINGATE_API_KEY = process.env.COINGATE_API_KEY || "";
const COINGATE_API_URL = process.env.COINGATE_SANDBOX === "true"
  ? "https://api-sandbox.coingate.com/v2"
  : "https://api.coingate.com/v2";
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

// GET /orders — user's orders (with product file URLs for paid orders)
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId));

    const productIds = [...new Set(orders.map((o) => o.productId))];
    const products = productIds.length > 0
      ? await db.select().from(productsTable)
      : [];
    const productMap = new Map(products.map((p) => [p.id, p]));

    res.json(orders.map((o) => {
      const product = productMap.get(o.productId);
      return {
        ...o,
        amount: Number(o.amount),
        createdAt: o.createdAt.toISOString(),
        paidAt: o.paidAt ? o.paidAt.toISOString() : null,
        downloadUrl: o.status === "paid" ? (product?.downloadUrl ?? null) : null,
        manualUrl: o.status === "paid" ? (product?.manualUrl ?? null) : null,
        productCategory: product?.category ?? null,
      };
    }));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders — create order + Flow payment
router.post("/orders", requireAuth, createOrderLimit, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const body = CreateOrderBody.parse(req.body);
    const paymentMethod = body.paymentMethod ?? "flow";

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.productId));
    if (!product || !product.active) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const [order] = await db.insert(ordersTable).values({
      userId,
      userEmail: body.userEmail,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      currency: product.currency,
      status: "pending",
      paymentProvider: paymentMethod,
    }).returning();

    // ── CoinGate crypto payment ──
    if (paymentMethod === "coingate") {
      if (!COINGATE_API_KEY) {
        const mockUrl = `${BASE_URL}/dashboard?payment=success&orderId=${order.id}&mock=true`;
        res.status(201).json({
          order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
          paymentUrl: mockUrl,
        });
        return;
      }

      // CoinGate does not support CLP — convert to USD
      let priceUsd: number;
      if ((product.currency || "CLP") === "CLP") {
        // Fetch live USD/CLP rate, fallback to ~950
        try {
          const rateRes = await axios.get("https://api.exchangerate-api.com/v4/latest/USD", { timeout: 5000 });
          const clpRate = rateRes.data?.rates?.CLP ?? 950;
          priceUsd = Math.round((Number(product.price) / clpRate) * 100) / 100;
        } catch {
          priceUsd = Math.round((Number(product.price) / 950) * 100) / 100;
        }
      } else {
        priceUsd = Number(product.price);
      }

      const cgRes = await axios.post(
        `${COINGATE_API_URL}/orders`,
        {
          order_id: String(order.id),
          price_amount: priceUsd,
          price_currency: "USD",
          receive_currency: "USD",
          title: product.name,
          description: `MauDev: ${product.name}`,
          callback_url: `${BASE_URL}/api/payments/coingate/webhook`,
          success_url: `${BASE_URL}/dashboard?payment=success&orderId=${order.id}`,
          cancel_url: `${BASE_URL}/dashboard?payment=cancelled&orderId=${order.id}`,
        },
        {
          headers: {
            Authorization: `Token ${COINGATE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentUrl = cgRes.data.payment_url;
      await db.update(ordersTable)
        .set({ stripeSessionId: String(cgRes.data.id), stripePaymentUrl: paymentUrl })
        .where(eq(ordersTable.id, order.id));

      res.status(201).json({
        order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
        paymentUrl,
      });
      return;
    }

    // ── Flow.cl payment (default) ──
    // Dev/mock mode — no Flow credentials configured
    if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
      const mockUrl = `${BASE_URL}/dashboard?payment=success&orderId=${order.id}&mock=true`;
      res.status(201).json({
        order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
        paymentUrl: mockUrl,
      });
      return;
    }

    // Create Flow payment
    const commerceOrderId = `${order.id}-${Date.now()}`;
    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      amount: Math.round(Number(product.price)).toString(),
      commerceOrder: commerceOrderId,
      currency: product.currency || "CLP",
      email: body.userEmail,
      subject: `MauDev: ${product.name}`,
      urlConfirmation: `${BASE_URL}/api/payments/flow/webhook`,
      urlReturn: `${BASE_URL}/api/payments/flow/confirm`,
    };
    params.s = signFlowParams(params);

    const formData = new URLSearchParams(params);
    const flowRes = await axios.post(`${FLOW_API_URL}/payment/create`, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { token, url } = flowRes.data;
    const paymentUrl = `${url}?token=${token}`;

    // Store Flow token in stripeSessionId column and payment URL in stripePaymentUrl
    await db.update(ordersTable)
      .set({ stripeSessionId: token, stripePaymentUrl: paymentUrl })
      .where(eq(ordersTable.id, order.id));

    res.status(201).json({
      order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: null },
      paymentUrl,
    });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: err?.response?.data?.message || "Error interno del servidor" });
  }
});

// POST /orders/:id/retry — generate new Flow payment for existing pending order
router.post("/orders/:id/retry", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orderId = Number(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    if (order.status === "paid") {
      return res.status(400).json({ error: "Este pedido ya está pagado" });
    }

    if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
      return res.json({ paymentUrl: `${BASE_URL}/dashboard?payment=success&orderId=${order.id}&mock=true` });
    }

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, order.productId));
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const retryId = `${order.id}-R${Date.now()}`;
    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      amount: Math.round(Number(order.amount)).toString(),
      commerceOrder: retryId,
      currency: order.currency || "CLP",
      email: order.userEmail,
      subject: `MauDev: ${order.productName}`,
      urlConfirmation: `${BASE_URL}/api/payments/flow/webhook`,
      urlReturn: `${BASE_URL}/api/payments/flow/confirm`,
    };
    params.s = signFlowParams(params);

    const formData = new URLSearchParams(params);
    const flowRes = await axios.post(`${FLOW_API_URL}/payment/create`, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { token, url } = flowRes.data;
    const paymentUrl = `${url}?token=${token}`;
    await db.update(ordersTable)
      .set({ stripeSessionId: token, stripePaymentUrl: paymentUrl })
      .where(eq(ordersTable.id, order.id));

    res.json({ paymentUrl });
  } catch (err: any) {
    req.log.error({ err }, "Failed to retry order checkout");
    res.status(500).json({ error: "Error al reintentar el pago" });
  }
});

// GET /orders/:id/verify — verify order status (used after redirect)
router.get("/orders/:id/verify", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orderId = Number(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ status: order.status });
  } catch (err) {
    req.log.error({ err }, "Failed to verify order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /orders/:id — delete a pending/failed order
router.delete("/orders/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orderId = Number(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    if (order.status === "paid") {
      return res.status(400).json({ error: "No se puede eliminar un pedido pagado" });
    }

    await db.delete(ordersTable).where(eq(ordersTable.id, orderId));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete order");
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
});

// GET /orders/:id
router.get("/orders/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order || order.userId !== userId) return res.status(404).json({ error: "Not found" });
    res.json({
      ...order,
      amount: Number(order.amount),
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
