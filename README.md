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

## Admin

Los correos autorizados para el panel `/admin` se definen en dos lugares que deben mantenerse sincronizados:

- Frontend: `src/lib/auth.js` (`ADMIN_EMAILS`) — `AdminGuard` bloquea cualquier otra cuenta.
- Backend: función `public.is_admin()` en `supabase/schema.sql` — las políticas RLS solo permiten a esos correos leer/editar datos privados.

Admins actuales:

```txt
maudevchile@gmail.com
lucasmaulenr@gmail.com
```

El login del panel usa Google OAuth vía Supabase Auth (`api.auth.redirectToLogin`).

## Tema (blanco y negro, adaptativo)

El diseño es monocromo y se adapta automáticamente al sistema del usuario (claro/oscuro) mediante `prefers-color-scheme`. La detección está en el script inline de `index.html`, que aplica la clase `.dark` y reacciona en vivo a los cambios del sistema. Las variables de color viven en `src/index.css` (`:root` = tema claro, `.dark` = tema oscuro).

## Producción — Cloudflare Pages

El sitio se despliega en **Cloudflare Pages**. No usa Firebase Hosting.

Configuración del proyecto en Cloudflare Pages:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Variables de entorno: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

El archivo [`public/_redirects`](public/_redirects) define el fallback SPA (`/* /index.html 200`)
para que el enrutado de React Router funcione en rutas profundas (`/servicios`, `/portafolio`, etc.).

> Importante: NO debe existir `public/index.html` ni `public/404.html` (eran archivos
> por defecto de Firebase Hosting). Vite genera `dist/index.html` desde el `index.html` raíz.

El directorio `workers/uploads/` es un Worker antiguo que validaba tokens de Firebase y
**ya no se usa**: las subidas de imágenes ahora pasan por Supabase Storage. Puede eliminarse.
