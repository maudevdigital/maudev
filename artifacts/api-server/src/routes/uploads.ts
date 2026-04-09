import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { getAuth } from "@clerk/express";
import { requireAdmin } from "./auth";
import { eq, and } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import { logger } from "../lib/logger.js";

const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/* ── Metadata helpers: store original filename alongside UUID file ── */
function metaPath(storedFilename: string): string {
  return path.join(UPLOAD_DIR, `${storedFilename}.meta.json`);
}

function saveMeta(storedFilename: string, originalName: string): void {
  try {
    fs.writeFileSync(metaPath(storedFilename), JSON.stringify({ originalName }), "utf-8");
  } catch (err) {
    logger.warn({ err, storedFilename }, "Failed to save file metadata");
  }
}

function readOriginalName(storedFilename: string): string | null {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath(storedFilename), "utf-8"));
    return meta.originalName || null;
  } catch {
    return null;
  }
}

/* ── Multer config ── */
const ALLOWED_EXTENSIONS = [
  ".pine", ".txt", ".mq5", ".ex5", ".mq4", ".ex4",
  ".pdf", ".doc", ".docx", ".zip", ".rar",
  ".png", ".jpg", ".jpeg", ".webp", ".gif",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = crypto.randomUUID();
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${ext}`));
    }
  },
});

// POST /uploads/file — admin uploads indicator/manual files
router.post("/uploads/file", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se envió archivo" });
    return;
  }

  // Persist original filename as sidecar metadata
  saveMeta(req.file.filename, req.file.originalname);

  const filePath = `/api/uploads/files/${req.file.filename}`;
  res.json({
    filePath,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

// GET /uploads/files/:filename — serve uploaded files (with ACL check for paid products)
router.get("/uploads/files/:filename", async (req, res) => {
  const { filename } = req.params;

  // ── 1. Strict filename validation ──
  // Only allow UUID-based filenames with allowed extensions (no path chars)
  const safeFilenameRe = /^[a-f0-9\-]+\.[a-z0-9]+$/i;
  if (!safeFilenameRe.test(filename)) {
    res.status(403).json({ error: "Invalid filename" });
    return;
  }

  // ── 2. Resolve and verify real path stays within UPLOAD_DIR (symlink protection) ──
  const candidatePath = path.join(UPLOAD_DIR, filename);
  let filePath: string;
  try {
    filePath = fs.realpathSync(candidatePath);
  } catch {
    res.status(404).json({ error: "Archivo no encontrado" });
    return;
  }

  const resolvedUploadDir = fs.realpathSync(UPLOAD_DIR);
  if (!filePath.startsWith(resolvedUploadDir + path.sep) && filePath !== resolvedUploadDir) {
    logger.warn({ filename, filePath }, "Path traversal attempt blocked");
    res.status(403).json({ error: "Access denied" });
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Archivo no encontrado" });
    return;
  }

  // ── 3. Validate file extension is in allowed list ──
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    res.status(403).json({ error: "File type not allowed" });
    return;
  }

  // ── 4. ACL: check if this file belongs to a paid product ──
  const products = await db.select().from(productsTable);
  const matchingProduct = products.find((p) => {
    const dl = p.downloadUrl || "";
    const ml = p.manualUrl || "";
    return dl.includes(filename) || ml.includes(filename);
  });

  if (matchingProduct) {
    // This file belongs to a product — require authentication
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) {
      res.status(401).json({ error: "Autenticación requerida" });
      return;
    }

    const paidOrders = await db
      .select()
      .from(ordersTable)
      .where(
        and(
          eq(ordersTable.userId, userId),
          eq(ordersTable.productId, matchingProduct.id),
          eq(ordersTable.status, "paid")
        )
      );

    if (paidOrders.length === 0) {
      res.status(403).json({ error: "Debes comprar este producto para descargarlo" });
      return;
    }
  }

  // ── 5. Build response headers ──
  const contentTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".txt": "text/plain",
    ".pine": "application/octet-stream",
    ".mq5": "application/octet-stream",
    ".ex5": "application/octet-stream",
    ".mq4": "application/octet-stream",
    ".ex4": "application/octet-stream",
  };

  // Resolve original filename from metadata sidecar (falls back to stored name)
  const originalName = readOriginalName(filename) || filename;

  // RFC 5987 encoding for non-ASCII filenames
  const asciiName = originalName.replace(/[^\x20-\x7E]/g, "_");
  const utf8Name = encodeURIComponent(originalName).replace(/['()]/g, (c) => "%" + c.charCodeAt(0).toString(16));

  res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${utf8Name}`);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", matchingProduct ? "private, no-cache" : "public, max-age=3600");

  const stat = fs.statSync(filePath);
  res.setHeader("Content-Length", stat.size);

  fs.createReadStream(filePath).pipe(res);
});

export default router;
