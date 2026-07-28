# Worker de captación de leads

Recibe el formulario de `/contacto`, lo guarda en **Cloudflare D1** y avisa por
correo vía **Resend**.

```
POST https://maudev-lead-intake.<subdominio>.workers.dev
```

Esa URL es la que va en `VITE_LEAD_WEBHOOK_URL` (Cloudflare Pages → Settings →
Environment variables, y como secret en GitHub Actions).

---

## Desplegar

```bash
cd workers/lead-intake
npx wrangler deploy
```

## Secrets

```bash
npx wrangler secret put RESEND_API_KEY      # obligatorio
npx wrangler secret put TURNSTILE_SECRET    # opcional, ver abajo
```

## Base de datos

```bash
npx wrangler d1 execute maudev-leads --remote --file=schema.sql
```

Consultar los leads guardados:

```bash
npx wrangler d1 execute maudev-leads --remote \
  --command "SELECT created_at, name, email, whatsapp, interest FROM leads ORDER BY id DESC LIMIT 20"
```

---

## Defensas del endpoint

Esto es un endpoint **público y sin autenticación** que escribe en la base y
manda correos. Su URL está en el JavaScript del sitio, así que es pública de
facto.

> **El chequeo de `Origin` no protege.** Solo decide qué cabecera CORS devolver.
> El navegador la respeta, pero `curl` no manda `Origin` y la petición se
> procesa igual. Por eso hacen falta las defensas de abajo.

| Defensa | Estado | Qué hace |
|---|---|---|
| **Honeypot** | Siempre activo | Campo `empresa_web` oculto en el formulario. Si llega con contenido, se descarta el envío y se responde **200** a propósito: si devolviéramos error, el bot sabría que lo detectamos y probaría otra cosa. |
| **Límites de largo** | Siempre activo | `message` máx. 2.000 caracteres, `name` 120, `email` 200. Antes, un mensaje de 10 MB se guardaba entero y se enviaba completo. |
| **Validación** | Siempre activo | Formato de email, y se exige email **o** WhatsApp: un lead sin forma de contactarlo no sirve. |
| **Turnstile** | Opcional | Captcha invisible de Cloudflare. Se activa solo si existe el secret. |

### Activar Turnstile

El worker funciona igual sin él — el bloque completo está dentro de
`if (env.TURNSTILE_SECRET)`. Para encenderlo:

1. Cloudflare → **Turnstile** → *Add site* → dominio `maudev.cl`
2. Guarda el **Secret Key**:
   ```bash
   npx wrangler secret put TURNSTILE_SECRET
   ```
3. En el frontend, agrega el widget con tu **Site Key** y manda el token como
   `turnstileToken` en el cuerpo del POST.

Mientras no hagas el paso 3, **no pongas el secret**: el worker empezaría a
rechazar todos los envíos con 403.

---

## Qué NO tiene

**Límite de tasa.** Cloudflare Workers no trae uno nativo en el plan gratuito.
Si algún día ves abuso, las opciones son WAF Rate Limiting (de pago) o un contador
por IP en D1. Con el honeypot y Turnstile activos, el volumen de bots baja lo
suficiente como para que no sea prioridad.

---

## Privacidad

Este worker es la razón por la que `/privacidad` §05 declara **Cloudflare D1** y
**Resend** como encargados de tratamiento. Guarda `name`, `email`, `whatsapp`,
`interest`, `message`, `source` y `submitted_at`.

**Si cambias dónde van los leads, actualiza esa lista.** Ya se desfasó dos veces:
declaraba Supabase después de migrar a n8n, y Telegram después de migrar acá.
