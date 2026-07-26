# Auditoría post-deploy — 26 de julio de 2026

Revisión carpeta por carpeta más verificación del sitio ya publicado.

**Conclusión: no hay errores.** El sitio está sano en producción. Lo que sigue
es deuda menor y una recomendación de seguridad que sí conviene atender.

---

## ✅ Verificado en producción (maudev.cl)

| Qué | Resultado |
|---|---|
| Consola del navegador | **0 errores** |
| Rutas reales (11) | Todas **200** |
| Rutas fusionadas (6) | Todas **redirigen** |
| Imágenes | 14 cargando, **0 rotas** |
| Botones de WhatsApp | 6 activos |
| Secciones del home | Las 5 presentes y con su ancla |

### El consentimiento de cookies funciona de verdad

Probado con `localStorage` limpio en el sitio en vivo:

- Banner **visible**
- `googletagmanager` **NO cargado**
- `connect.facebook` **NO cargado**
- **Cero cookies** (`document.cookie` vacío)

Y al aceptar, ambos scripts cargan y aparecen `_ga`, `_fbp`, `_ga_98P5BBFLQM`.
Es el comportamiento correcto bajo la Ley 21.719.

---

## 🔐 Lo único que recomiendo atender: `.env.local`

El archivo **no está en git** (`.gitignore` línea 17, `*.local`) y no aparece
ningún secreto duro en el código fuente. Eso está bien.

Pero tiene **25 claves**, y al menos **9 son de servicios que ya no usas**:

```
VITE_SUPABASE_URL                     ← Supabase eliminado
VITE_SUPABASE_ANON_KEY                ← Supabase eliminado
VITE_ADMIN_EMAILS                     ← panel /admin eliminado
IG_ACCESS_TOKEN                       ← ig-autopost dado de baja
IG_TRIGGER_SECRET                     ← ig-autopost dado de baja
LINKEDIN_ACCESS_TOKEN                 ← ig-autopost dado de baja
LINKEDIN_COMMUNITY_CLIENT_SECRET      ← ig-autopost dado de baja
TIKTOK_CLIENT_SECRET                  ← ig-autopost dado de baja
WPL_AP                                ← sin uso en el código
```

Verificado: **ninguna se referencia ya en `src/`, `scripts/` ni `workers/`.**

**Revócalas en cada proveedor.** Una credencial que no usas no te da nada y sí
te puede costar: si ese archivo se filtra —se sube por error, se comparte la
carpeta, se sincroniza a un OneDrive compartido— son nueve accesos vivos a
cuentas tuyas. Rotar lo que no se usa es gratis.

### Falta una variable

`VITE_LEAD_WEBHOOK_URL` **no está en `.env.local`**. En producción la toma de
Cloudflare Pages, pero en desarrollo local el formulario de `/contacto` va a
fallar con "Lead webhook not configured". Agrégala.

---

## 🧹 Limpiado en esta revisión

**`src/data/leadOptions.js` eliminado.** Era una segunda fuente de verdad de
`COUNTRIES` e `INTERESTS` que ya había divergido de la de `Contacto.jsx`:

| | `leadOptions.js` | `Contacto.jsx` |
|---|---|---|
| Opciones de interés | 5 | **6** (incluye "Mantención y soporte") |
| Traducción al inglés | No | Sí |

Nadie lo importaba —quedó huérfano al eliminar el embudo del hero antiguo— y
mantener dos listas que ya no coinciden es una fuente garantizada de bugs.

**Exports muertos quitados:** `hasDecided` y `onConsentChange` de `consent.js`
(con su registro de listeners), e `isChile` de `region.js`. Los escribí yo y
nunca se usaron.

---

## 📋 Deuda menor detectada (no rompe nada)

**Assets sin referenciar en `public/` — ~200 KB.**
`logo.png`, `logo-white.png`, `logo-wordmark.png`, `logo-1024.png`,
`app-icon-1024.png/.jpg`, `icons.svg`, `guia-software-a-medida.pdf`.
Los logos probablemente los uses fuera del sitio (redes, firmas), así que **no
los borré**. El PDF era un lead magnet que ya no está enlazado en ninguna parte.

**Scripts sin invocar en `scripts/` — 6 archivos.**
`gen-blog-cover`, `gen-blog-graphic`, `gen-carousel-w2/w3/w4`, `gen-guia-pdf`,
`gen-logo`. Son tus generadores de contenido para redes. No estorban, pero
ninguno está en `package.json` ni en un workflow: si los usas, vale la pena
darles un `npm run` para no perderlos.

**`relatedBlog` en las 8 automatizaciones.** Apunta a artículos de un `/blog`
que no existe. **No genera links rotos** —verifiqué que no se renderiza— pero es
dato muerto que confunde al leer el archivo.

**`docker-compose.yml` y `calificador-whatsapp.workflow.json` en la raíz.**
Sin referencias en docs ni en el código. Probablemente los usas a mano para n8n;
si es así, menciónalos en el README para que no parezcan basura.

**Soft 404.** Una ruta inexistente devuelve **200** en vez de 404, porque el
fallback SPA sirve `index.html`. Es el comportamiento normal de una SPA en
Cloudflare Pages y React muestra `PageNotFound`, pero Google puede indexar rutas
falsas. Solo importa si alguien enlaza URLs inventadas.

---

## Lo que está bien y no hay que tocar

- **0 imports rotos** en 129 imports internos de 52 archivos
- **0 `<img>` sin `alt`**
- **0 `target="_blank"` sin `rel="noopener"`**
- **Sitemap coherente**: las 17 URLs corresponden a rutas que existen
- **`projects.js`**: 4 proyectos, ningún campo vacío
- **`automations.js`**: las 8 con `priceCLP`, `priceUSD`, `image`, `video`,
  `icon`, `faqs`, `stats`, `integrations`, `howItWorks` y `outcomes` completos
- **ESLint limpio** en todos los archivos revisados

---

## Sigue pendiente (de antes, no es hallazgo nuevo)

1. **11 productos con `checkoutUrlCLP: null`** — no se pueden comprar
2. **Revisión legal con abogado** de las tres páginas
3. **Prueba social**: cero testimonios de clientes en todo el sitio
4. **Reenviar el sitemap** en Google Search Console
