import { pgTable, serial, text, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("CLP"),
  category: text("category").notNull(), // trading_scripts | digital_service
  subcategory: text("subcategory").notNull(),
  imageUrl: text("image_url"),
  mediaUrls: jsonb("media_urls").$type<Array<{ url: string; type: "image" | "video" }>>().default([]),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  downloadUrl: text("download_url"),
  manualUrl: text("manual_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
