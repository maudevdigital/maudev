import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { requireAdmin } from "./auth";

const router = Router();

function serializePost(p: any) {
  return {
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    publishedAt: p.publishedAt ? (p.publishedAt instanceof Date ? p.publishedAt.toISOString() : p.publishedAt) : null,
  };
}

router.get("/blog", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.publishedAt));

    res.json(posts.map(serializePost));
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, req.params.slug));

    if (!post || !post.published) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(serializePost(post));
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/blog", requireAdmin, async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.createdAt));

    res.json(posts.map(serializePost));
  } catch (err) {
    req.log.error({ err }, "Failed to list admin blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

router.post("/admin/blog", requireAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, published, metaTitle, metaDescription, metaKeywords, canonicalUrl, author, tags } = req.body as {
      title?: string;
      content?: string;
      excerpt?: string;
      imageUrl?: string;
      published?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
      canonicalUrl?: string;
      author?: string;
      tags?: string;
    };

    if (!title || !content || !excerpt) {
      return res.status(400).json({ error: "title, content y excerpt son requeridos" });
    }

    const sanitizedContent = sanitizeHtml(content);
    const slug = slugify(title) + "-" + Date.now().toString(36);

    const [post] = await db.insert(blogPostsTable).values({
      title,
      slug,
      content: sanitizedContent,
      excerpt,
      imageUrl: imageUrl || null,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      canonicalUrl: canonicalUrl || null,
      author: author || "MauDev",
      readingTimeMin: estimateReadingTime(sanitizedContent),
      tags: tags || null,
    }).returning();

    res.status(201).json(serializePost(post));
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/blog/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, excerpt, imageUrl, published, metaTitle, metaDescription, metaKeywords, canonicalUrl, author, tags } = req.body as {
      title?: string;
      content?: string;
      excerpt?: string;
      imageUrl?: string;
      published?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
      canonicalUrl?: string;
      author?: string;
      tags?: string;
    };

    const [existing] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id));
    if (!existing) return res.status(404).json({ error: "Post no encontrado" });

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) {
      updates.content = sanitizeHtml(content);
      updates.readingTimeMin = estimateReadingTime(sanitizeHtml(content));
    }
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl || null;
    if (published !== undefined) {
      updates.published = published;
      if (published && !existing.publishedAt) {
        updates.publishedAt = new Date();
      }
    }
    if (metaTitle !== undefined) updates.metaTitle = metaTitle || null;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription || null;
    if (metaKeywords !== undefined) updates.metaKeywords = metaKeywords || null;
    if (canonicalUrl !== undefined) updates.canonicalUrl = canonicalUrl || null;
    if (author !== undefined) updates.author = author || "MauDev";
    if (tags !== undefined) updates.tags = tags || null;

    const [post] = await db.update(blogPostsTable).set(updates).where(eq(blogPostsTable.id, id)).returning();
    res.json(serializePost(post));
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/blog/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;