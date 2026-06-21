# ig-autopost — publicación automática en Instagram

Worker de Cloudflare que, en un horario fijo (cron), genera un post con Claude
(hook + caption con enfoque SEO/posicionamiento + hashtags), elige una imagen
on-brand y lo publica en tu cuenta de Instagram Business vía la Graph API.

```
cron → caption (captions.js, gratis) → imagen (IMAGE_POOL) → Instagram Graph API → (log Supabase)
```

## Requisitos (una vez)

### 1. Captions (gratis, ya listos)
Los textos viven en `captions.js` (los escribe Claude en el chat, sin costo de API).
Cuando se agoten, pide otro lote. **No necesitas API key de pago.**

### 2. Instagram Business/Creator + Página de Facebook
- En la app de Instagram: **Configuración → Cuenta → Cambiar a cuenta profesional → Business** (o Creator).
- Vincúlala a una **Página de Facebook** (Configuración → vincular página). Sin página, la API no publica.

### 3. App de Meta + token + IG user id
1. https://developers.facebook.com → **My Apps → Create App → Business**.
2. Agrega el producto **Instagram** (Instagram Graph API).
3. En **Roles**, agrégate como admin/tester (así publicas en TU cuenta sin App Review).
4. Con el **Graph API Explorer**, genera un token con permisos:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
5. Convierte el token a uno **de larga duración (60 días)** (endpoint `oauth/access_token` con `grant_type=fb_exchange_token`).
6. Obtén el **IG user id**: `GET /me/accounts` → page id → `GET /{page-id}?fields=instagram_business_account`.

> El paso 3 es el que evita las "2–8 semanas de App Review": al publicar en tu propia
> cuenta con tu rol en la app, no necesitas revisión de Meta.

## Despliegue

```bash
cd workers/ig-autopost
# (usa el CLOUDFLARE_API_TOKEN del proyecto, o `wrangler login`)
wrangler secret put IG_USER_ID
wrangler secret put IG_ACCESS_TOKEN
wrangler secret put TRIGGER_SECRET        # cualquier string, para el disparo manual de prueba
# opcionales (log/calendario en Supabase):
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_KEY

wrangler deploy
```

Edita en `worker.js`:
- **IMAGE_POOL**: URLs públicas de imágenes on-brand (sube las tuyas; pueden ser las de maudev.cl).
- **BRAND** / **ANGULOS**: tono, servicios y ángulos de los posts.
- El cron en `wrangler.toml` (frecuencia/horario).

## Probar sin esperar al cron

```bash
curl -H "x-trigger: TU_TRIGGER_SECRET" https://ig-autopost.<tu-subdominio>.workers.dev
```

## (Opcional) Tabla de log en Supabase

```sql
create table if not exists public.ig_posts (
  id uuid primary key default gen_random_uuid(),
  ig_post_id text,
  hook text,
  image_url text,
  caption text,
  created_at timestamptz default now()
);
```

## Fase 2 — Reels en video
Publicar reels por API requiere un `.mp4` en una URL pública. El flujo sería:
generar el video (p. ej. Higgsfield) → subirlo a almacenamiento público (R2/Supabase
Storage) → `POST /media` con `media_type=REELS` y `video_url`. Se agrega después.
