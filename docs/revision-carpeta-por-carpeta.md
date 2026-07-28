# Revisión carpeta por carpeta — 27 de julio de 2026

Análisis del estado actual tras los cambios recientes: auditoría de peso, worker
de captación de leads con D1 y Resend, workflow de n8n, y el capturador de
portafolio que ya corrió solo.

**Resumen: el código nuevo está bien escrito. Hay 3 cosas que sí conviene
arreglar** — una legal, una de seguridad y una de higiene de git.

---

## 🔴 1. La política de privacidad volvió a quedar desfasada

Es el mismo problema que tuvimos con Supabase, y por la misma razón: cambió la
infraestructura y el documento legal se quedó atrás.

| `/privacidad` declara | Realidad hoy |
|---|---|
| Cloudflare | ✅ Correcto — y ahora además **D1**, la base donde se guardan los leads |
| n8n | ⚠️ El worker lo reemplazó para lo esencial |
| **Telegram** | ❌ **Ya no se usa** |
| — | ❌ **Resend** envía el correo de aviso y **no está declarado** |
| Meta, GA4 | ✅ Correcto |

El worker guarda en D1 `name`, `email`, `whatsapp`, `interest`, `message`,
`source` y `submitted_at`. Eso es tratamiento de datos personales en un
proveedor que el documento no menciona.

**Qué hay que hacer:** en `src/pages/Privacidad.jsx` §05, quitar Telegram, dejar
n8n solo si lo sigues usando, y agregar:

- **Cloudflare D1** — base de datos donde se almacenan los formularios (EE.UU. / red global)
- **Resend** — envío del correo de aviso de nuevos contactos (EE.UU.)

Y en §04, los plazos de conservación ahora aplican a una base real, no a una
carpeta de correos. Vale la pena decir cuánto se guarda en D1.

---

## 🟠 2. El endpoint de leads no tiene ninguna defensa

`workers/lead-intake/worker.js` es un endpoint **público, sin autenticación**,
que por cada POST escribe en tu base y **envía un correo**.

Verificado — no tiene:

| Defensa | Estado |
|---|---|
| Límite de tasa | ✗ |
| Captcha / Turnstile | ✗ |
| Honeypot | ✗ |
| Validación de largo | ✗ |
| Validación de formato de email | ✗ |

El chequeo de `Origin` **no protege**: solo decide qué cabecera CORS devolver.
El navegador la respeta, pero `curl` no manda `Origin` y la petición se procesa
igual. Cualquiera que vea la URL en el bundle puede:

- Llenarte la base de basura
- **Inundarte la casilla** de correos (y quemar tu cuota de Resend)
- Mandar un `message` de 10 MB, que se guarda y se envía completo

**La solución más barata:** Cloudflare Turnstile es gratis, invisible para el
usuario y se integra en unas 20 líneas. Alternativa mínima si quieres algo hoy
mismo: limitar `message` a 2.000 caracteres, validar que `email` tenga formato, y
un honeypot (campo oculto que los bots rellenan y los humanos no).

> No es urgente mientras nadie conozca la URL, pero está en el JavaScript público
> de tu sitio: encontrarla toma treinta segundos.

---

## 🟡 3. Diffs fantasma por finales de línea

`git status` muestra `worker.js` y `n8n/lead-intake.json` modificados. Pero:

```
148 líneas añadidas, 148 borradas  ← el archivo tiene 148 líneas
```

Es decir, **el archivo entero cambió sin que cambiara nada**. Con
`--ignore-all-space` el diff queda vacío: son finales de línea CRLF ↔ LF que
Windows y OneDrive reescriben solos.

No hay `.gitattributes` ni `core.autocrlf` configurado. El costo real: cada
commit se ve enorme, no puedes revisar qué cambiaste, y en cualquier merge
tendrás conflictos en archivos que nadie tocó.

**Solución:** crear `.gitattributes` en la raíz con `* text=auto eol=lf`.

---

## Carpeta por carpeta

### `src/` — 382 KB · sano

- **0 imports rotos**, **0 `<img>` sin alt**, **0 `target="_blank"` sin `rel`**
- El `CookieConsent` lo cambiaste a **modal bloqueante** con `aria-modal`, bloqueo
  de scroll y foco en Aceptar. Comento esto abajo.
- `src/lib/leads.js` sigue documentado como "webhook de n8n". Ahora apunta al
  worker: vale actualizar el comentario para no confundirte en tres meses.

### `workers/` — 16 KB · el código nuevo, bien hecho

**`lead-intake/`** — lo que está bien y merece decirse:

- Consultas **preparadas con `bind()`** → sin inyección SQL
- **Escapa el HTML** del mensaje antes de meterlo al correo
- **Degradación elegante**: guarda en D1 *y* envía correo; solo devuelve error si
  fallan las dos. Un lead no se pierde por una base caída.
- El secret **no está en `wrangler.toml`**, va por `wrangler secret put`

**`meta-capi/`** — sigue en uso por `MetaPixelTracker.jsx`. Correcto.

### `n8n/` — 8 KB

`lead-intake.json` convive con el worker. **Define cuál manda**: si el worker ya
cubre avisar y guardar, el workflow de n8n es redundante y mantener dos caminos
para lo mismo es una fuente de confusión futura.

### `public/` — 3,7 MB · limpio

Las capturas del portafolio se actualizaron solas el lunes
(commit `6899e6f`): **el capturador automático funciona.**

### `docs/` — 96 KB · 8 documentos

Todos vigentes salvo `checklist-deploy.md`, que ya cumplió su propósito.

### `.github/workflows/` — actualizado a v5

Subiste las actions de v4 a v5. Bien: v4 quedó obsoleta.

### `scripts/` — 92 KB · 7 generadores

Solo `capture-portfolio.mjs` está enganchado a `npm run` y a un workflow. Los
otros 6 son tuyos, de contenido para redes; no estorban, pero considera darles un
`npm run` para no perderlos.

---

## Sobre tu cambio al banner de cookies

Lo pasaste de barra discreta abajo a **modal bloqueante con backdrop**, sin
salida por Esc ni clic fuera.

**Legalmente es más defendible.** Con la barra, un visitante podía navegar e
irse sin decidir; ahora la decisión es explícita y previa, que es exactamente lo
que pide la 21.719.

**Pero tiene un costo de conversión que conviene que sepas.** Un muro antes de
ver nada es fricción en el peor momento: el visitante llegó de un anuncio y lo
primero que encuentra es un obstáculo. Y como "Aceptar" está primero en el orden
visual, algunos reguladores europeos lo leen como *dark pattern* — aunque
"Rechazar" esté igual de visible, que en tu caso lo está.

No te digo que lo revirtieras. Es una decisión legítima y priorizaste bien lo
legal. Solo mídelo: si ves caída de sesiones o de conversión en las próximas
semanas, ya sabes de dónde viene.

---

## Estado general

| | |
|---|---|
| Imports rotos | 0 |
| Assets faltantes | 0 |
| Secretos en el repo | 0 |
| Consola en producción | 0 errores |
| Rutas | 11 en 200, 6 redirigiendo |
| Consentimiento | Verificado bloqueando GA4 y Pixel |

Nada roto. Las tres cosas de arriba son deuda real pero acotada, y la única con
plazo es la de privacidad — porque describe mal un tratamiento que ya está
ocurriendo.
