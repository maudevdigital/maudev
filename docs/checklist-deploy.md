# Checklist antes de desplegar

Estado al 26 de julio de 2026. Ordenado por lo que **rompe el deploy** primero.

---

## 🔴 Bloqueantes — sin esto el deploy falla o el sitio sale roto

### 1. Regenerar `package-lock.json`

**Esto revienta el deploy si no lo haces.** Tu workflow usa `npm ci`, que aborta
cuando `package.json` y el lockfile no coinciden. Y hoy no coinciden: saqué 6
dependencias sin uso y agregué `playwright`.

```bash
npm install          # regenera el lock
git add package.json package-lock.json
```

Verifica que el lock ya no mencione `moment`, `react-quill`, `react-markdown`,
`remark-gfm`, `@radix-ui/react-dialog` ni `@radix-ui/react-select`.

### 2. Correr el build de verdad

Yo no pude: el build completo excede el límite de tiempo de mi entorno. Verifiqué
lint sobre los archivos tocados y que los 120 imports resuelven, pero eso no
sustituye un build.

```bash
npm run lint
npm run build
npm run preview      # revisa el sitio compilado en local
```

### 3. `VITE_LEAD_WEBHOOK_URL` en Cloudflare Pages

Ya **no hay fallback** (el worker `ig-autopost` se dio de baja). Si falta esta
variable, el formulario de `/contacto` falla.

- Cloudflare Pages → Settings → Environment variables
- GitHub → Settings → Secrets → Actions (el workflow ya la pasa)

No es crítico para el CTA principal —WhatsApp no depende de nada— pero el
formulario sí.

---

## 🟡 Importantes — el sitio funciona, pero se ve incompleto

### 4. ~~Las imágenes~~ ✅ listas

Las cinco están puestas y optimizadas a WebP: `hero-whatsapp.webp` (28 KB),
`proceso.webp` (20 KB), y las cuatro del portafolio (32–64 KB cada una).
`og-image.png` se dejó **en PNG a propósito**: WhatsApp y Facebook no renderizan
WebP de forma fiable en las vistas previas de enlaces, y tu CTA es WhatsApp.

### 5. Primera corrida del capturador

```bash
npm install
npx playwright install chromium
npm run capture
```

Después queda automático los lunes.

### 6. Revisión legal

Las tres páginas (`/privacidad`, `/terminos`, `/eliminacion-datos`) están
redactadas para la Ley 21.719, que entra en vigencia el **1 de diciembre de
2026**. Llevan un comentario `⚠️ REVISAR CON ABOGADO` en el código.

Lo más delicado: el **derecho de retracto** (Términos §05) y la **jurisdicción**
(§10). Un reclamo en SERNAC sale más caro que la consulta.

Además: en Privacidad §05 dice que n8n corre en "servidor propio". **Confirma
dónde está realmente** — si es un VPS en Alemania, la jurisdicción declarada
cambia.

### 7. Probar el banner de cookies

En local, con DevTools → Application → Local Storage borrado:

- Aparece a los ~1,2 s
- **Rechazar** → en la pestaña Network no debe aparecer `gtag/js` ni `fbevents.js`
- **Aceptar** → ambos cargan
- Recargar → no vuelve a preguntar
- Footer → "Preferencias de cookies" → reabre

---

## 🟢 Opcionales — mejoran el negocio, no bloquean

### 8. Cablear los checkout

**11 productos siguen con `checkoutUrlCLP: null`** (8 en `automations.js`, 3 en
`n8nProducts.js`). No se pueden comprar. Stripe no opera en Chile; la vía es un
Merchant of Record — Lemon Squeezy, Paddle o Gumroad. Ver
`docs/plan-ingresos-30-dias.md`.

Es lo de mayor retorno por hora de todo el proyecto.

### 9. Verificar el ChatWidget

Apunta a `https://cal.com/maudev/30min`. Confirma que ese calendario existe y
tiene disponibilidad, o el widget manda gente a una página muerta.

### 10. Después del deploy

- Google Search Console → reenviar `sitemap.xml` (cambió: 17 URLs, antes tenía
  entradas que devolvían 404)
- Probar en móvil real: el banner de cookies no debe tapar el botón de WhatsApp
- PageSpeed Insights sobre la home ya desplegada

---

## Ya resuelto

- `public/` de 465 MB → 4,3 MB (videos comprimidos, media de redes archivada)
- 4 páginas fusionadas en la home, con 301 en `_redirects`
- Sitemap regenerado desde las rutas reales
- `robots.txt` ya no bloquea `/admin` ni `/lp` (no existen)
- Bug del portafolio: las capturas aparecían y desaparecían
- Fallback muerto de leads eliminado
- Consentimiento de cookies real, con Consent Mode v2
- `founder.photo` apuntaba a `/founder.jpg` inexistente — quitado
- 6 dependencias sin uso fuera
