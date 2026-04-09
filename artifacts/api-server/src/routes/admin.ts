import { Router } from "express";
import { eq, sum, count } from "drizzle-orm";
import { db, ordersTable, emailSubscribersTable, productsTable } from "@workspace/db";
import { requireAdmin } from "./auth";
import { getUncachableResendClient } from "../lib/resend.js";

const router = Router();

// GET /admin/check — lightweight admin verification endpoint
router.get("/admin/check", requireAdmin, (_req, res) => {
  res.json({ admin: true });
});

// GET /admin/products — full product list including file URLs (admin only)
router.get("/admin/products", requireAdmin, async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(products.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      createdAt: p.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch admin products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/stats
router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    // Total revenue from paid orders
    const [revenueResult] = await db
      .select({ total: sum(ordersTable.amount) })
      .from(ordersTable)
      .where(eq(ordersTable.status, "paid"));

    const [totalOrdersResult] = await db.select({ count: count() }).from(ordersTable);
    const [paidOrdersResult] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    const [pendingOrdersResult] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "pending"));
    const [subscribersResult] = await db.select({ count: count() }).from(emailSubscribersTable);
    const [productsResult] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.active, true));

    // Revenue by category (join orders with products)
    const recentOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(ordersTable.createdAt)
      .limit(10);

    // Revenue by category via products
    const paidOrders = await db
      .select({ amount: ordersTable.amount, productId: ordersTable.productId })
      .from(ordersTable)
      .where(eq(ordersTable.status, "paid"));

    const products = await db.select().from(productsTable);
    const productMap = new Map(products.map((p) => [p.id, p]));

    const categoryRevenue: Record<string, number> = {};
    for (const order of paidOrders) {
      const product = productMap.get(order.productId);
      const category = product?.category || "other";
      categoryRevenue[category] = (categoryRevenue[category] || 0) + Number(order.amount);
    }

    const revenueByCategory = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue,
    }));

    res.json({
      totalRevenue: Number(revenueResult.total || 0),
      totalOrders: Number(totalOrdersResult.count),
      paidOrders: Number(paidOrdersResult.count),
      pendingOrders: Number(pendingOrdersResult.count),
      totalSubscribers: Number(subscribersResult.count),
      totalProducts: Number(productsResult.count),
      revenueByCategory,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        amount: Number(o.amount),
        createdAt: o.createdAt.toISOString(),
        paidAt: o.paidAt ? o.paidAt.toISOString() : null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/orders
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders.map((o) => ({
      ...o,
      amount: Number(o.amount),
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list all orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/subscribers
router.get("/admin/subscribers", requireAdmin, async (req, res) => {
  try {
    const subscribers = await db.select().from(emailSubscribersTable).orderBy(emailSubscribersTable.subscribedAt);
    res.json(subscribers.map((s) => ({
      ...s,
      subscribedAt: s.subscribedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list subscribers");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/email/campaign
router.post("/admin/email/campaign", requireAdmin, async (req, res) => {
  const { subject, html, previewText } = req.body as { subject?: string; html?: string; previewText?: string };

  if (!subject || !html) {
    res.status(400).json({ error: "subject y html son requeridos" });
    return;
  }

  try {
    const subscribers = await db
      .select()
      .from(emailSubscribersTable)
      .where(eq(emailSubscribersTable.status, "active"));

    if (subscribers.length === 0) {
      res.json({ success: true, sent: 0, message: "No hay suscriptores activos." });
      return;
    }

    const { client, fromEmail } = await getUncachableResendClient();

    const baseUrl = process.env.APP_URL ?? "https://maudev.cl";

    // Resend supports batch sending up to 100 emails at once
    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const emails = batch.map((sub) => {
        const unsubscribeUrl = `${baseUrl}/api/email/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
        const bodyWithFooter = `${html}
<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0;">
<p style="font-size:11px;color:#52525b;font-family:monospace;">
  Recibes este correo porque estás suscrito en maudev.cl.<br>
  <a href="${unsubscribeUrl}" style="color:#06b6d4;">Cancelar suscripción</a>
</p>`;
        return {
          from: `MAUDEV <${fromEmail}>`,
          to: [sub.email],
          subject,
          html: bodyWithFooter,
        };
      });

      try {
        const result = await client.batch.send(emails);
        req.log.info({ result }, `Batch ${i / BATCH_SIZE + 1} result`);
        sent += batch.length;
      } catch (batchErr) {
        req.log.warn({ batchErr }, `Batch ${i / BATCH_SIZE + 1} failed`);
        failed += batch.length;
      }
    }

    res.json({ success: true, sent, failed, total: subscribers.length });
  } catch (err) {
    req.log.error({ err }, "Failed to send campaign");
    res.status(500).json({ error: "Error enviando la campaña" });
  }
});

export default router;
