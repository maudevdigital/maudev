-- Tablas que ya creó workers/lead-intake en producción (contactos del
-- formulario y solicitudes de derechos). Se declaran acá con IF NOT EXISTS para
-- que el backend las conozca y las pruebas las tengan: en producción no cambia
-- nada, porque ya existen con esta misma forma.

CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT,
  email        TEXT,
  whatsapp     TEXT,
  interest     TEXT,
  message      TEXT,
  source       TEXT,
  submitted_at TEXT,
  created_at   TEXT DEFAULT (datetime('now')),
  page_path    TEXT,
  referrer     TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);

CREATE TABLE IF NOT EXISTS solicitudes_derechos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  folio         TEXT NOT NULL UNIQUE,
  tipo          TEXT NOT NULL,
  nombre        TEXT,
  email         TEXT NOT NULL,
  detalle       TEXT,
  vence_el      TEXT NOT NULL,
  respondida_el TEXT,
  creado_en     TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_solicitudes_pendientes ON solicitudes_derechos (respondida_el, vence_el);
