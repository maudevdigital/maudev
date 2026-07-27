-- Esquema de la base de leads (Cloudflare D1).
-- Aplicar con: wrangler d1 execute maudev-leads --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT,
  email        TEXT,
  whatsapp     TEXT,
  interest     TEXT,
  message      TEXT,
  source       TEXT,
  submitted_at TEXT,                              -- lo que reporta el sitio
  created_at   TEXT DEFAULT (datetime('now'))     -- cuándo lo guardó el worker (UTC)
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);
