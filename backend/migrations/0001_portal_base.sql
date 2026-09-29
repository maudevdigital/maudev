-- Portal de clientes: clientes, tokens de acceso, sesiones, proyectos y auditoría.
-- Los ids son aleatorios (no autoincrementales) en todo lo que ve un cliente:
-- un id correlativo invita a probar el siguiente.

CREATE TABLE clientes (
  id           TEXT PRIMARY KEY,
  nombre       TEXT NOT NULL,
  email        TEXT NOT NULL,            -- titular: recibe avisos y confirma acciones
  rut          TEXT,
  telefono     TEXT,
  notas        TEXT,                     -- solo las ve el admin
  creado_en    INTEGER NOT NULL DEFAULT (unixepoch()),
  archivado_en INTEGER
);

-- Solo el hash del token: el token en claro se muestra una vez y no se guarda.
CREATE TABLE tokens_acceso (
  id            TEXT PRIMARY KEY,
  cliente_id    TEXT NOT NULL REFERENCES clientes(id),
  hash          TEXT NOT NULL UNIQUE,
  etiqueta      TEXT,                    -- "Gerencia", "Contador"...
  alcance       TEXT NOT NULL DEFAULT 'ver',
  vence_en      INTEGER,                 -- null: no vence
  usos          INTEGER NOT NULL DEFAULT 0,
  ultimo_uso_en INTEGER,
  revocado_en   INTEGER,
  creado_por    TEXT NOT NULL,
  creado_en     INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_tokens_cliente ON tokens_acceso (cliente_id);

-- Cada sesión cuelga de su token: revocar el token corta la sesión al instante.
CREATE TABLE sesiones_cliente (
  id_hash    TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  token_id   TEXT NOT NULL REFERENCES tokens_acceso(id),
  vence_en   INTEGER NOT NULL,
  creado_en  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE proyectos (
  id         TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  plan_id    TEXT NOT NULL,              -- id del plan en shared/oferta.js
  nombre     TEXT NOT NULL,
  estado     TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'terminado')),
  creado_en  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_proyectos_cliente ON proyectos (cliente_id);

CREATE TABLE fases (
  id            TEXT PRIMARY KEY,
  proyecto_id   TEXT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  orden         INTEGER NOT NULL,
  nombre        TEXT NOT NULL,
  estado        TEXT NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'en_curso', 'por_aprobar', 'completada')),
  estimada_el   TEXT,                    -- AAAA-MM-DD
  completada_el TEXT
);
CREATE INDEX idx_fases_proyecto ON fases (proyecto_id, orden);

CREATE TABLE auditoria (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor      TEXT NOT NULL,              -- correo del admin o cliente:<id>
  accion     TEXT NOT NULL,
  entidad    TEXT,
  entidad_id TEXT,
  cliente_id TEXT,
  detalle    TEXT,
  creado_en  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_auditoria_cliente ON auditoria (cliente_id, creado_en);
