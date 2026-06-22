# maudev-remotion — reels y tarjetas de valor

Proyecto [Remotion](https://www.remotion.dev) para generar **contenido con valor**
on-brand para Instagram/Facebook (y TikTok):

- **TipReel** → reel vertical 1080x1920 (MP4) con un tip animado.
- **ValueCard** → tarjeta 1080x1350 (PNG) para post unitario o **carrusel**.

El contenido vive en `src/tips.ts` (texto corto = se ve bien). Misma data sirve
para reels y tarjetas.

## Previsualizar y editar (en tu máquina)

```bash
cd remotion
npm install
npm run studio      # abre Remotion Studio en el navegador para ver/ajustar
```

## Renderizar a archivo

```bash
# Reel (MP4) con el tip por defecto
npm run render:reel

# Reel de un tip específico (índice de src/tips.ts) — pasa props:
npx remotion render TipReel out/reel.mp4 --props='{"category":"SEO","title":"...","bullets":["...","..."],"outro":"..."}'

# Tarjeta (PNG) para carrusel/post
npm run still:card
npx remotion still ValueCard out/card-2.png --props='{...}'
```

> Para que las fuentes calcen 1:1 con el sitio (Inter / JetBrains Mono), instala
> `@remotion/google-fonts` y cárgalas en `theme.ts`. Por defecto usa fuentes del
> sistema para no depender de nada.

## Automatización (siguiente paso)

Remotion **no corre dentro del Cloudflare Worker** (necesita Node + Chromium).
El plan para publicar reels solos:

1. **GitHub Action** programada (cron) → instala deps → `remotion render`.
2. Sube el MP4 a un host público (Cloudflare R2, o Supabase Storage del proyecto).
3. Llama a la Graph API: `POST /{ig_user_id}/media` con `media_type=REELS` y
   `video_url=<url pública>`, hace polling de `status_code`, luego `media_publish`.
   (Igual que el worker `ig-autopost`, pero con video.)
4. Cross-post a Facebook con `/{page_id}/videos`.

Para **carruseles** (tarjetas), se renderizan N stills → se publican como
`media_type=CAROUSEL` (varios contenedores hijos + 1 contenedor carrusel).

Cuando quieras, armamos esa GitHub Action y conectamos el publish.
