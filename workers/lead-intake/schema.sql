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
  created_at   TEXT DEFAULT (datetime('now')),    -- cuándo lo guardó el worker (UTC)

  -- De dónde vino el lead. El sitio ya mandaba esto y el worker lo descartaba,
  -- así que la pregunta más útil del negocio —qué trae clientes— no se podía
  -- responder. Es medición sin cookies y del 100% de los envíos: no depende de
  -- que nadie acepte nada.
  page_path    TEXT,                              -- página desde la que escribió
  referrer     TEXT,                              -- de dónde llegó al sitio
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);

-- Migración para una base que ya existe (las columnas se agregan una por una;
-- SQLite no admite varias en un solo ALTER):
--   wrangler d1 execute maudev-leads --remote --command "ALTER TABLE leads ADD COLUMN page_path TEXT"
