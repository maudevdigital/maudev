-- Ley 21.719: solicitudes de derechos y prueba de consentimiento.
-- Aplicar con: wrangler d1 execute maudev-leads --remote --file=0002_derechos_consentimiento.sql

CREATE TABLE IF NOT EXISTS solicitudes_derechos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  folio         TEXT NOT NULL UNIQUE,
  tipo          TEXT NOT NULL,          -- acceso | rectificacion | supresion | oposicion | portabilidad | bloqueo
  nombre        TEXT,
  email         TEXT NOT NULL,
  detalle       TEXT,
  vence_el      TEXT NOT NULL,          -- fecha límite de respuesta (30 días corridos)
  respondida_el TEXT,                   -- se marca al responder (a mano hasta que exista el portal)
  creado_en     TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_solicitudes_pendientes ON solicitudes_derechos (respondida_el, vence_el);

-- Sin IP ni user-agent: el id lo genera el navegador al azar y no identifica a nadie.
CREATE TABLE IF NOT EXISTS consentimientos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  navegador_id TEXT NOT NULL,
  analitica    INTEGER NOT NULL,
  marketing    INTEGER NOT NULL,
  version      TEXT,
  creado_en    TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_consentimientos_creado ON consentimientos (creado_en);
