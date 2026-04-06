import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";
import { requireAuth } from "./auth";
import { getUncachableStripeClient } from "../lib/stripeClient.js";

const router = Router();

const BASE_URL = process.env.BASE_URL_PUBLIC
  || (process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80");

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

// POST /orders — create order + Stripe Checkout Session
router.post("/orders", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const body = CreateOrderBody.parse(req.body);

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.productId));
    if (!product || !product.active) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Create pending order first
    const [order] = await db.insert(ordersTable).values({
      userId,
      userEmail: body.userEmail,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      currency: product.currency,
      status: "pending",
    }).returning();

    // Determine currency for Stripe — CLP is zero-decimal (no cents)
    const currency = (product.currency || "CLP").toLowerCase();
    const unitAmount = currency === "clp"
      ? Math.round(Number(product.price))
      : Math.round(Number(product.price) * 100);

    const successUrl = `${BASE_URL}/dashboard?payment=success&orderId=${order.id}`;
    const cancelUrl = `${BASE_URL}/dashboard?payment=cancelled&orderId=${order.id}`;

    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency,
              unit_amount: unitAmount,
              product_data: {
                name: product.name,
                description: product.description?.slice(0, 255) ?? undefined,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: body.userEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId: String(order.id),
          userId,
          productId: String(product.id),
        },
      });

      // Save session ID + URL on order
      await db.update(ordersTable)
        .set({ stripeSessionId: session.id, stripePaymentUrl: session.url })
        .where(eq(ordersTable.id, order.id));

      res.status(201).json({
        order: {
          ...order,
          amount: Number(order.amount),
          createdAt: order.createdAt.toISOString(),
          paidAt: null,
          stripeSessionId: session.id,
          stripePaymentUrl: session.url,
        },
        paymentUrl: session.url,
      });
    } catch (stripeErr: any) {
      req.log.error({ stripeErr }, "Stripe session creation failed");
      // Dev fallback: return order without payment URL
      res.status(201).json({
        order: {
          ...order,
          amount: Number(order.amount),
          createdAt: order.createdAt.toISOString(),
          paidAt: null,
        },
        paymentUrl: null,
        error: `Stripe no configurado: ${stripeErr.message}`,
      });
    }
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /orders/:id/retry — generate new Stripe session for an existing pending order
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

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, order.productId));
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const currency = (order.currency || "CLP").toLowerCase();
    const unitAmount = currency === "clp"
      ? Math.round(Number(order.amount))
      : Math.round(Number(order.amount) * 100);

    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: order.productName,
              description: product.description?.slice(0, 255) ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: order.userEmail,
      success_url: `${BASE_URL}/dashboard?payment=success&orderId=${order.id}`,
      cancel_url: `${BASE_URL}/dashboard?payment=cancelled&orderId=${order.id}`,
      metadata: {
        orderId: String(order.id),
        userId,
        productId: String(product.id),
      },
    });

    await db.update(ordersTable)
      .set({ stripeSessionId: session.id, stripePaymentUrl: session.url })
      .where(eq(ordersTable.id, order.id));

    res.json({ paymentUrl: session.url });
  } catch (err) {
    req.log.error({ err }, "Failed to retry order checkout");
    res.status(500).json({ error: "Error al reintentar el pago" });
  }
});

// GET /orders/:id/verify — verify Stripe session and update status
router.get("/orders/:id/verify", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const orderId = Number(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (order.status === "paid") {
      return res.json({ status: "paid", order: { ...order, amount: Number(order.amount), createdAt: order.createdAt.toISOString(), paidAt: order.paidAt?.toISOString() ?? null } });
    }

    if (!order.stripeSessionId) {
      return res.json({ status: order.status });
    }

    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

      if (session.payment_status === "paid") {
        await db.update(ordersTable)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(ordersTable.id, orderId));
        return res.json({ status: "paid" });
      }

      return res.json({ status: session.status ?? order.status });
    } catch {
      return res.json({ status: order.status });
    }
  } catch (err) {
    req.log.error({ err }, "Failed to verify order");
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
