-- ============================================================
-- Migración: corregir tabla blog_posts
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Renombrar cover_url → cover_image (si la columna ya existe con el nombre viejo)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='blog_posts' AND column_name='cover_url'
  ) THEN
    ALTER TABLE public.blog_posts RENAME COLUMN cover_url TO cover_image;
  END IF;
END$$;

-- Agregar columnas faltantes
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_image      text,
  ADD COLUMN IF NOT EXISTS category         text,
  ADD COLUMN IF NOT EXISTS author           text,
  ADD COLUMN IF NOT EXISTS read_time        int default 5,
  ADD COLUMN IF NOT EXISTS meta_title       text,
  ADD COLUMN IF NOT EXISTS meta_description text;
