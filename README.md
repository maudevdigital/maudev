# Maudev

Sitio de **Maudev** — automatización y software para empresas en Chile.
React 19 + Vite + Tailwind CSS v4, desplegado en Cloudflare Pages.

**Sin backend propio.** El contenido (portafolio, automatizaciones, productos)
vive en archivos versionados dentro de `src/data/`; los leads salen por webhook.

---

## Desarrollo

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.local.example` a `.env.local`:

```txt
VITE_LEAD_WEBHOOK_URL=https://TU-N8N/webhook/maudev-lead
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA_tu_site_key
VITE_PSI_API_KEY=
```

> **Formato.** Toda variable necesita su signo igual. Una línea suelta del tipo
> `nombre valor` no se ignora: dotenv absorbe como parte de *ese* nombre todo lo
> que venga después, y las variables siguientes dejan de existir sin ningún
> aviso. Si una variable "no llega" al código, revisa esto antes que nada.

`VITE_LEAD_WEBHOOK_URL` es **obligatoria**: ya no hay fallback (el worker
`ig-autopost/notify-lead` se dio de baja). Si falta, el formulario de `/contacto`
falla con un error explícito ("Lead webhook not configured") en vez de morir en
silencio. El CTA principal es WhatsApp, que no depende de esto. Ver
`src/lib/leads.js`.

---

## Arquitectura

### Conversión

El CTA principal lleva al formulario breve de `/contacto`. WhatsApp se mantiene
como alternativa directa en contacto y footer. `CtaButton.jsx` registra el
contexto del clic; el formulario conserva UTM y envía el lead al webhook actual.

### Rutas

| Ruta | Qué es |
|---|---|
| `/` | Portada: posicionamiento, tres categorías, demostración, casos y CTA |
| `/automatizacion` | Automatización de procesos para PYMEs |
| `/software-a-medida` | Sistemas internos, portales y dashboards |
| `/desarrollo-web` | Sitios web orientados a conversión y SEO técnico |
| `/ecommerce` | Ecommerce conectado a pagos, inventario y pedidos |
| `/casos` | Índice de proyectos reales |
| `/casos/:projectId` | Caso de estudio con problema, solución y beneficio |
| `/nosotros` | Forma de trabajo y responsable del servicio |
| `/automatizaciones/:slug` | 8 landings de conversión (destino de los anuncios) |
| `/contacto` | Formulario breve y acceso directo a WhatsApp |
| `/precios` | Productos n8n autoservicio. **Fuera del navbar a propósito**: es otra audiencia (técnica, internacional, en USD) y mezclarla en la home diluye el mensaje |
| `/terminos` `/privacidad` `/eliminacion-datos` | Legales — obligatorias para pautar en Meta |
| `/ig` `/links` | Link in bio |

Las rutas fusionadas redirigen con **301 desde `public/_redirects`** (eso es lo
que lee Google) y además con `<Navigate>` en `App.jsx` para la navegación
interna. Si agregas o quitas rutas, actualiza los dos lugares **y**
`public/sitemap.xml`.

### Secciones de la home

`src/pages/Landing.jsx` compone, en este orden:

```
Hero → Problema → 3 categorías → Demostración → Casos → Proceso → Confianza → FAQ → CTA
```

Las promesas de alcance, propiedad, garantía y soporte se concentran en una sola
sección. La portada no repite CTA ni beneficios después de cada bloque.

---

## Operación con n8n (fuera del sitio)

Estos archivos de la raíz **no son parte del bundle web** — son para levantar y
poblar el n8n self-hosted que recibe los leads y corre las automatizaciones:

- `docker-compose.yml` — levanta n8n en local/VPS.
- `n8n/lead-intake.json` — workflow para importar en n8n y recibir leads.

Se usan a mano; no los invoca ningún build ni workflow de GitHub. Ver
[`docs/`](docs/) para el resto del contexto operativo.

## Scripts de generación de contenido

Los generadores de `scripts/` (portadas de blog, carruseles, logo SEO y guía PDF)
están registrados en `package.json` con el prefijo `gen:`. Ej.:

```bash
npm run gen:logo
npm run gen:carousel-w2
```

Producen media para redes; no forman parte del build del sitio.

## Media

- `public/social/` contiene **solo los 8 videos** que usan las landings de
  automatizaciones, comprimidos a ~350 KB (720p, sin audio, porque van con
  `muted`). Los originales en 1080×1920 están en `_media-archivo/`.
- `_media-archivo/` está **gitignoreado**. Ahí viven los reels y carruseles de
  Instagram, que no tienen por qué viajar en el bundle web.
- `public/img/auto/` contiene las imágenes de respaldo de las landings de
  automatizaciones. Sus prompts están en [`docs/prompts-imagenes.md`](docs/prompts-imagenes.md).

> ⚠️ No vuelvas a poner media pesada en `public/`. Todo lo que esté ahí se
> despliega en cada build. Fue el motivo de que el repo llegara a 771 MB.

---

## Producción — Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Variables de entorno: `VITE_LEAD_WEBHOOK_URL` y `VITE_TURNSTILE_SITE_KEY`

Ojo: el build **no** corre en Cloudflare, corre en GitHub Actions, que le entrega
a Pages la carpeta `dist` ya compilada. Las variables del build viven entonces en
Settings → Secrets → Actions del repositorio; ponerlas en Pages no tiene efecto.

## Verificación anti-bots (Turnstile)

El endpoint de leads es público. El worker valida Turnstile solo si existe
`TURNSTILE_SECRET`, y el sitio manda el token solo si existe la site key, así que
se enciende en dos pasos **y el orden importa**:

1. Site key pública → secreto `VITE_TURNSTILE_SITE_KEY` en Actions. Desplegar y
   comprobar que el formulario sigue enviando.
2. Secret key → `cd workers/lead-intake && wrangler secret put TURNSTILE_SECRET`.

Al revés el worker exige un token que el sitio todavía no manda y **todo envío
responde 403**. Para apagarlo, quitar primero el secreto.

El widget va en modo `interaction-only`: invisible salvo que Cloudflare pida
interacción. Ver `src/lib/turnstile.js`.

`public/_redirects` maneja los 301 y el fallback SPA.
`public/_headers` maneja cache y seguridad.

---

## Pendiente conocido

**Los productos de `src/data/n8nProducts.js` y `src/data/automations.js` tienen
`checkoutUrlCLP: null` y `checkoutUrlUSD: null`.** Es decir: no se pueden
comprar. Stripe no opera en Chile, así que la vía es un Merchant of Record
(Lemon Squeezy, Paddle o Gumroad), que cobra en cualquier moneda, se hace cargo
del IVA internacional y transfiere a Chile. Ver
[`docs/plan-ingresos-30-dias.md`](docs/plan-ingresos-30-dias.md).
