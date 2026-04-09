import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router = Router();

function stripSensitiveFields(p: any) {
  const { downloadUrl, manualUrl, ...safe } = p;
  return {
    ...safe,
    price: Number(safe.price),
    originalPrice: safe.originalPrice ? Number(safe.originalPrice) : null,
    mediaUrls: safe.mediaUrls ?? [],
    createdAt: safe.createdAt.toISOString(),
  };
}

// GET /products/featured — must come before /products/:id
router.get("/products/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.featured, true), eq(productsTable.active, true)));
    res.json(products.map(stripSensitiveFields));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /products
router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.safeParse(req.query);
    const params = query.success ? query.data : {};

    const conditions = [eq(productsTable.active, true)];
    if (params.category) {
      conditions.push(eq(productsTable.category, params.category));
    }

    const products = await db
      .select()
      .from(productsTable)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions));

    res.json(products.map(stripSensitiveFields));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /products (admin only)
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db
      .insert(productsTable)
      .values({
        ...body,
        price: String(body.price),
        originalPrice: body.originalPrice != null ? String(body.originalPrice) : null,
        mediaUrls: body.mediaUrls ?? [],
        featured: body.featured ?? false,
        active: body.active ?? true,
        downloadUrl: body.downloadUrl ?? null,
        manualUrl: body.manualUrl ?? null,
      })
      .returning();
    res.status(201).json({ ...product, price: Number(product.price), originalPrice: product.originalPrice ? Number(product.originalPrice) : null, mediaUrls: product.mediaUrls ?? [], createdAt: product.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(400).json({ error: "Invalid data" });
  }
});

// GET /products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: Number(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(stripSensitiveFields(product));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /products/:id (admin only)
router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
    const body = UpdateProductBody.parse(req.body);
    const [product] = await db
      .update(productsTable)
      .set({
        ...body,
        price: body.price !== undefined ? String(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice != null ? String(body.originalPrice) : null) : undefined,
        mediaUrls: body.mediaUrls !== undefined ? (body.mediaUrls ?? []) : undefined,
        downloadUrl: body.downloadUrl ?? null,
        manualUrl: body.manualUrl ?? null,
      })
      .where(eq(productsTable.id, id))
      .returning();
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ ...product, price: Number(product.price), originalPrice: product.originalPrice ? Number(product.originalPrice) : null, mediaUrls: product.mediaUrls ?? [], createdAt: product.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(400).json({ error: "Invalid data" });
  }
});

// DELETE /products/:id (admin only)
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
