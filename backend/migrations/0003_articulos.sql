-- Guías del sitio (/guias/:slug). Se escriben en Markdown desde el panel admin.
-- El build del sitio descarga las publicadas y las convierte en HTML estático,
-- así que publicar requiere además "Actualizar sitio" (reconstruye y despliega).

CREATE TABLE articulos (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  titulo         TEXT NOT NULL,
  descripcion    TEXT NOT NULL,           -- meta description: la que muestra Google
  categoria      TEXT NOT NULL DEFAULT 'ley-21719',
  contenido      TEXT NOT NULL,           -- Markdown
  estado         TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado')),
  publicado_el   TEXT,                    -- AAAA-MM-DD, la primera vez que se publicó
  actualizado_el TEXT NOT NULL,           -- AAAA-MM-DD, el último cambio de contenido
  creado_en      INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_articulos_estado ON articulos (estado, publicado_el);
