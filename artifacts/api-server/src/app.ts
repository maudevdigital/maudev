import express, { type Express } from "express";
import path from "path";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { flowCallbackRouter } from "./routes/payments";
import { logger } from "./lib/logger";
import { eq, desc } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";

const app: Express = express();

// Trust proxy in production (Cloudflare, Vercel, etc.)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// HTTPS redirect in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("X-Forwarded-Proto") !== "https") {
      return res.redirect(301, `https://${req.header("host")}${req.url}`);
    }
    next();
  });
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",").map(s => s.trim());
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (browser navigations, server-to-server)
    // or from whitelisted origins (frontend AJAX)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      // Don't error — just don't set CORS headers. This allows browser
      // navigations (e.g. Flow.cl payment redirects) to still be processed.
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  maxAge: 3600,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Flow.cl payment callbacks — mounted BEFORE Clerk so redirects/webhooks
// from Flow are never intercepted by Clerk auth handshake.
app.use("/api", flowCallbackRouter);

app.use(clerkMiddleware());

const BASE_URL = "https://maudev.cl";

app.get("/robots.txt", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /blog
Allow: /products
Disallow: /admin
Disallow: /dashboard
Disallow: /campaigns
Disallow: /sign-in
Disallow: /sign-up

Sitemap: ${BASE_URL}/sitemap.xml`);
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await db
      .select({
        slug: blogPostsTable.slug,
        updatedAt: blogPostsTable.updatedAt,
        publishedAt: blogPostsTable.publishedAt,
      })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.publishedAt));

    const postUrls = posts.map((p) => {
      const lastmod = (p.updatedAt || p.publishedAt || new Date()).toISOString().split("T")[0];
      return `  <url>\n    <loc>${BASE_URL}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/products</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/herramientas-seo</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${postUrls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (err) {
    req.log.error({ err }, "Failed to generate sitemap");
    res.status(500).send("Error generating sitemap");
  }
});

app.use("/api", router);

// ── Serve frontend static files in production ──
if (process.env.NODE_ENV === "production") {
  const frontendDir = path.resolve(__dirname, "../../../artifacts/maudev/dist/public");
  app.use(express.static(frontendDir, {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html") || filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  }));
  app.get("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(frontendDir, "index.html"));
  });
}

export default app;
