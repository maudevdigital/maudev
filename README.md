# Maudev

Landing y panel admin para **Maudev**, construido con React 19, Vite, Tailwind CSS v4 y **Supabase** (base de datos, autenticación y storage).

> Backend único: **Supabase**. El proyecto no usa Firebase/Firestore. Toda la lógica de datos pasa por `src/api/maudev.js` sobre el cliente de `src/lib/supabase.js`.

## Desarrollo

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.local.example` a `.env.local` y completa con los datos de tu proyecto (Supabase → Settings → API):

```txt
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi....
```

## Base de datos

El esquema completo está en [`supabase/schema.sql`](supabase/schema.sql). Ejecútalo en **Supabase → SQL Editor → New query**. Crea tres tablas con Row Level Security (RLS):

- `leads` — captación desde la landing (incluye campos UTM para atribución de campañas: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`). Cualquiera puede insertar; solo los admin pueden leer/editar.
- `blog_posts` — contenido del blog (público lee solo `published`).
- `projects` — portafolio (público lee solo `published`).

Para storage de imágenes crea un bucket público llamado `uploads` (Supabase → Storage).

## 