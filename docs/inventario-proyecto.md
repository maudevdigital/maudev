# Inventario del proyecto maudev

Estado al 30 sep 2026, después de la entrega 1 y la limpieza. Ábrelo en vista
previa (Ctrl+Shift+V) para ver los desplegables. Marca `[x]` en lo que quieras
**eliminar** o **compactar** y escribe tu decisión al final de la línea.

Leyenda: ✅ mantener · 🗑 eliminar · 🗜 compactar · ❓ decides tú

**Ya eliminado** (queda en el historial de git): la oferta anterior (19 servicios,
`/precios`, automatizaciones, cotizador y multimoneda, con sus imágenes y videos),
el inglés y el portugués, `remotion/`, `n8n/` y `docker-compose.yml` (el formulario
envía al worker `lead-intake`, no a n8n), los generadores de carruseles y de la guía
PDF, `validate-design.mjs`, `WorkProcess` y el botón genérico sin uso.

<details>
<summary><b>0. Páginas públicas (18 rutas)</b></summary>

- [ ] `/` portada — ✅ compactada: hero, servicios, casos, 4 preguntas, cierre
- [ ] `/ley-21719`, `/inteligencia-artificial`, `/desarrollo`, `/soporte` — ✅ la oferta
- [ ] `/casos` y `/casos/:id` (5 proyectos) — ✅
- [ ] `/nosotros` — 🗜 el texto todavía habla de "estudio de diseño web"
- [ ] `/contacto` — ✅
- [ ] `/privacidad`, `/terminos`, `/eliminacion-datos` — ✅ legales (Meta exige la última)
- [ ] `/ig` y `/links` (enlaces para la bio de Instagram) — ❓ ¿sigues usando Instagram?
- [ ] `/blog/*` (301 o 410 del blog antiguo) — ✅ mientras Google recuerde esas URLs
</details>

<details>
<summary><b>1. Portal y panel admin (no se indexan)</b></summary>

- [ ] `/portal/ingresar`, `/portal/entrar#…`, `/portal` — ✅ el cliente entra con su enlace y ve sus métricas
- [ ] `/portal/admin` (Resumen, Clientes, Proyectos, Contactos, Derechos ARCOP, Auditoría) — ✅ detrás de Cloudflare Access
</details>

<details>
<summary><b>2. Raíz</b></summary>

- [ ] `README.md` — 🗜 describe el sitio anterior; conviene reescribirlo con frontend/backend/shared
- [ ] `.gitattributes`, `.gitignore` — ✅
- [ ] `.github/workflows/deploy.yml` — ✅ pruebas del backend y despliegue del sitio
- [ ] `.github/workflows/capture-portfolio.yml` — ✅ actualiza las capturas de los casos
- [ ] `shared/oferta.js` — ✅ precios, planes y fases; lo leen el sitio y el backend
</details>

<details>
<summary><b>3. docs/ (13 archivos, ~2 MB de imágenes)</b></summary>

- [ ] `plan-servicios-portal.md` — ✅ plan vigente
- [ ] `inventario-proyecto.md` — ✅ este archivo
- [ ] `pagos-flow-lemon.md` — 🗜 dejar solo lo de Flow, que usará la entrega de pagos
- [ ] `checklist-deploy.md` — 🗜 fusionar lo vigente en el README
- [ ] `prompt-rediseno-figma.md` — 🗑 dijiste que no sirvió
- [ ] `auditoria-post-deploy.md`, `revision-carpeta-por-carpeta.md`, `rediseno-experiencia-visual.md` — 🗑 históricos
- [ ] `redesign/` (5 capturas, ~2 MB) y `prompts-imagenes.md` — 🗑 del rediseño anterior
- [ ] `seo-keywords-atp.md` — ❓ palabras clave de la oferta anterior
- [ ] `plan-ingresos-30-dias.md`, `catalogo-tech-reventa.md`, `flips-marketplace-valparaiso.md` — 🗑 personales, no son del sitio (sácalos a otra carpeta si los quieres)
</details>

<details>
<summary><b>4. frontend/ — configuración, public y scripts</b></summary>

- [ ] `package.json`, `vite.config.js`, `eslint.config.js`, `jsconfig.json`, `knip.json`, `index.html` — ✅
- [ ] `functions/blog/[[path]].js` — ✅ 301/410 del blog antiguo
- [ ] `functions/portal/[[path]].js` — ✅ sirve el portal en cualquier ruta `/portal/...`
- [ ] `public/_headers`, `_redirects`, `robots.txt`, `404.html`, `favicon.svg`, `logo-1024.png`, `og-image.png`, `portfolio/` — ✅
- [ ] `scripts/paginas.mjs`, `prerender-meta.mjs`, `prerender-html.mjs`, `gen-sitemap.mjs` — ✅ build
- [ ] `scripts/validate-site.mjs`, `validate-csp.mjs`, `validate-deployed.mjs`, `validate-redirects.mjs` — ✅ pruebas
- [ ] `scripts/capture-portfolio.mjs`, `gen-logo.mjs` — ✅
</details>

<details>
<summary><b>5. frontend/src</b></summary>

- [ ] `data/`: `paginas-servicio.js`, `projects.js`, `seo.js`, `site.js` — ✅
- [ ] `pages/`: `Landing`, `Ley21719`, `Servicio` (plantilla), `Cases`, `CasoEstudio`, `Contacto`, `About`, legales — ✅
- [ ] `pages/LinkInBio.jsx` — ❓ igual que `/ig` y `/links`
- [ ] `components/landing/`: menú, pie, hero, servicios, planes, casos, preguntas, cierre, aviso de cookies, derechos, Turnstile — ✅
- [ ] `components/landing/ParticleField`, `PointerGlow` — ✅ vuelven a pedido; el prerender no los guarda en el HTML
- [ ] `components/landing/ChatWidget.jsx` — ❓ repite el botón de WhatsApp
- [ ] `lib/MetaPixelTracker.jsx` y `workers/meta-capi/` — ❓ solo si pagas anuncios en Meta
- [ ] `api/maudev.js` — 🗜 capa delgada sobre `lib/leads.js`; se puede fusionar
- [ ] `portal/` (cliente y admin) — ✅
</details>

<details>
<summary><b>6. backend/ (Worker en maudev.cl/api/*)</b></summary>

- [ ] `src/` (Hono): autenticación admin (Access) y cliente (token), rutas admin y cliente — ✅
- [ ] `migrations/0001_portal_base.sql`, `0002_contactos_y_derechos.sql` — ✅
- [ ] `test/permisos.test.ts` (18 pruebas) — ✅ corre en cada despliegue
</details>

<details>
<summary><b>7. workers/</b></summary>

- [ ] `lead-intake/` (formulario, derechos, consentimiento, borrado diario) — ✅ hasta que el backend lo absorba (entrega 2d)
- [ ] `meta-capi/` — ❓ igual que el píxel
</details>

---

**Decisiones abiertas (❓):** link in bio, ChatWidget, píxel de Meta + meta-capi y
palabras clave. **Siguiente limpieza sugerida (🗑/🗜):** los documentos de `docs/` y
reescribir el README.
