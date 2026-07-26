# Maudev

Sitio de **Maudev** — automatización con IA para PYMEs en Chile.
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
VITE_PSI_API_KEY=
```

Si `VITE_LEAD_WEBHOOK_URL` está vacío, los leads caen automáticamente al worker
`/notify-lead` (Telegram + email), así el formulario nunca queda muerto.
Ver `src/lib/leads.js`.

---

## Arquitectura

### Un solo CTA en todo el sitio

La acción única es **escribir por WhatsApp**. Se define en `src/data/site.js`
(`CTA_LABEL`, `CTA_MESSAGE`) y se renderiza siempre con
`src/components/landing/CtaButton.jsx`.

> Si agregas un botón que compita con ese, estás agregando una razón para dudar.
> El único CTA secundario permitido es el link a `/contacto` para quien prefiere
> dejar sus datos, y va deliberadamente en texto plano, nunca como botón.

El prop `context` de `CtaButton` precarga el mensaje de WhatsApp según desde
dónde se hizo clic, así sabes qué estaba mirando el cliente sin preguntarle.

### Rutas

| Ruta | Qué es |
|---|---|
| `/` | Home única. Absorbió lo que antes eran `/servicios`, `/precios`, `/automatizaciones` y `/portafolio` |
| `/automatizaciones/:slug` | 8 landings de conversión (destino de los anuncios) |
| `/portafolio/:projectId` | Casos de estudio |
| `/contacto` | Formulario, como alternativa a WhatsApp |
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
Hero → AutomationsGrid → PortafolioPreview → Steps → Faq → FinalCta
```

Cada sección termina en el mismo botón de WhatsApp. La garantía vive dentro de
`FinalCta` y no en su propia sección: es lo último que hay que leer antes de
apretar, no un tema aparte.

---

## Media

- `public/social/` contiene **solo los 8 videos** que usan las landings de
  automatizaciones, comprimidos a ~350 KB (720p, sin audio, porque van con
  `muted`). Los originales en 1080×1920 están en `_media-archivo/`.
- `_media-archivo/` está **gitignoreado**. Ahí viven los reels y carruseles de
  Instagram, que no tienen por qué viajar en el bundle web.
- Imágenes del home: van en `public/img/`. Los prompts para generarlas están en
  [`docs/prompts-imagenes.md`](docs/prompts-imagenes.md). Mientras no existan, cada
  `<img>` tiene `onError` que oculta el contenedor — el sitio no se rompe.

> ⚠️ No vuelvas a poner media pesada en `public/`. Todo lo que esté ahí se
> despliega en cada build. Fue el motivo de que el repo llegara a 771 MB.

---

## Producción — Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Variable de entorno: `VITE_LEAD_WEBHOOK_URL`

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
