# Maudev

Sitio de [maudev.cl](https://maudev.cl), portal de clientes y panel admin.
Maudev ofrece adecuación técnica a la Ley 21.719, inteligencia artificial
aplicada, desarrollo web y soporte para empresas en Chile.

```
frontend/   sitio público, portal del cliente y panel admin (Vite + React)
backend/    API en maudev.cl/api/* (Cloudflare Worker + Hono + D1)
shared/     oferta.js: precios, planes y fases; lo leen el sitio y la API
workers/    lead-intake: formulario, derechos ARCOP, consentimiento y borrado diario
docs/       plan de la oferta y el portal, inventario del proyecto
```

## Desarrollo local

```bash
cd backend && npm install && npm run db:local && npm run dev   # API en 127.0.0.1:8787
cd frontend && npm install && npm run dev                      # sitio en localhost:5173
```

- `frontend` reenvía `/api` al backend local (ver `vite.config.js`).
- En local el panel admin (`/portal/admin`) no pide ingreso: el entorno `local`
  de `backend/wrangler.jsonc` define un admin de desarrollo que solo funciona
  en localhost. En producción lo protege Cloudflare Access.
- Antes de `dev` y `build` se descargan las guías publicadas
  (`scripts/descargar-guias.mjs`). Para usar las de tu base local:
  `GUIAS_API=http://127.0.0.1:8787 npm run dev`.

### Variables de entorno (`frontend/.env.local`)

Copia `frontend/.env.local.example`:

```txt
VITE_LEAD_WEBHOOK_URL=https://maudev-lead-intake.<cuenta>.workers.dev
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA_tu_site_key
```

Toda variable lleva su signo igual: una línea `nombre valor` hace que dotenv
absorba el resto del archivo y las variables siguientes desaparezcan sin aviso.
`VITE_LEAD_WEBHOOK_URL` es obligatoria: sin ella el formulario falla con un error
explícito.

## Pruebas

```bash
cd backend && npx tsc --noEmit && npm test     # matriz de permisos contra D1 local
cd frontend && npm run lint && npm run build && npm run prerender && npm test
```

`frontend/npm test` recorre las rutas en un navegador (5 tamaños de pantalla,
menú, formulario, consentimiento, precios, enlaces, sitemap) y valida la CSP.
`npm run test:deployed` repite lo esencial contra maudev.cl.

## Despliegue

Cada push a `main` corre `.github/workflows/deploy.yml`: primero las pruebas del
backend y, si pasan, el build del sitio, el prerender, las validaciones y la
publicación en Cloudflare Pages. El build corre en GitHub Actions, así que sus
variables viven en *Settings → Secrets → Actions* del repositorio.

El backend se despliega aparte:

```bash
cd backend
npm run db:remoto   # migraciones pendientes en D1
npm run deploy      # Worker en maudev.cl/api/*
```

Secretos del Worker (`npx wrangler secret put NOMBRE`):

| Secreto | Para qué |
|---|---|
| `GITHUB_TOKEN` | Botón "Actualizar sitio" del admin. Token fine-grained con *Actions: Read and write* solo en este repositorio. |

## Contenido

- **Oferta y precios:** `shared/oferta.js`. Cambiar un precio ahí lo cambia en
  el sitio, el SEO y las fases del portal.
- **Textos de los servicios:** `frontend/src/data/paginas-servicio.js`.
- **Guías (`/guias`):** se escriben en Markdown desde `/portal/admin/guias`. El
  build las descarga desde la API y las convierte en HTML estático; publicar o
  editar requiere luego "Actualizar sitio".

## Seguridad

- **Admin:** Cloudflare Access delante de `/portal/admin` y `/api/admin`, y el
  Worker verifica además el JWT de Access en cada petición.
- **Clientes:** entran con un enlace único (`/portal/entrar#token`). En la base
  se guarda solo el hash del token, que se canjea por una cookie `__Host-`
  HttpOnly; revocarlo corta la sesión al instante.
- **Formulario:** Turnstile se enciende en dos pasos y el orden importa.
  Primero la site key en Actions (`VITE_TURNSTILE_SITE_KEY`) y desplegar; después
  el secreto en el worker (`TURNSTILE_SECRET`). Al revés, todo envío responde 403.
