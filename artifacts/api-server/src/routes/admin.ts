import { Router } from "express";
import { eq, sum, count } from "drizzle-orm";
import { db, ordersTable, emailSubscribersTable, productsTable } from "@workspace/db";
import { requireAdmin } from "./auth";

const router = Router();

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

export default router;
