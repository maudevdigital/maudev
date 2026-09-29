# Plan: nueva oferta de servicios y portal de clientes

Referencia: r3q.cl (revisado el 29 sep 2026). Objetivo: rehacer la oferta de
Maudev con la estructura de r3q, borrar la oferta actual y agregar un portal de
clientes propio, todo en código (sin SaaS de terceros para el portal).

## 1. Qué hace r3q.cl

- **Posicionamiento:** consultoría tecnológica + IA + cumplimiento normativo.
- **Home, en orden:** hero con 2 CTA (Iniciar proyecto / Explorar capacidades)
  → métricas de confianza → 4 capacidades → plataformas propias con precio →
  metodología en 4 fases → clientes → blog → contacto → footer por categorías.
- **Catálogo:** 12 páginas, una por servicio, cada una con precio "desde" visible.
- **Tres modelos de cobro:** pago único (desarrollo), mensual (soporte, SEO,
  condominios) y arriendo con comisión (ticketera: compra $2.000.000 o 7 % por evento).
- **Página de servicio tipo (/soporte):** titular → propuesta → 3 planes
  (Básico $200.000, Estándar $350.000 "más popular", Premium $600.000 al mes)
  con "Contratar plan" → casos de uso → 5 FAQ → CTA final.
  Los planes se diferencian por SLA (48 h / 24 h / 4 h), frecuencia de respaldo
  y horas de cambios incluidas (0 / 4 / 10 al mes).
- **Portal (/portal):** email + contraseña y "ver el progreso de tus proyectos".
  Nada más. Es su punto más débil y donde Maudev puede superarlo.

### El énfasis real: IA y Ley 21.719

Son sus dos pilares principales: tienen entrada propia en el menú, antes que
plataformas y servicios, y el mensaje es "estrategia + IA + cumplimiento". La web
y el soporte pasan a segundo plano. Venden consultoría, no sitios.

**/adopcion-ia** ("Adoptar IA no es comprar software. Es transformar la operación.")
- 4 usos: agentes en WhatsApp que califican, cotizan y agendan; RAG privado sobre
  contratos y manuales, con citas; lectura de facturas y órdenes de compra con
  validación ante el SII; gobernanza de IA según la Ley 21.719.
- Venden **seguridad** ("zero-retention", anonimización previa) y **rapidez**
  (prototipo en 2-3 semanas). Método: diagnóstico → prototipo → integración → escala.
- Sin precios: el anzuelo es un "diagnóstico de IA sin costo".
- Cifras sin respaldo: -65 % de tiempo, 99,4 % de precisión, "cero riesgo".

**/ley-21719** ("Cumplimiento normativo para blindar tus datos…")
- Urgencia: multa de hasta 20.000 UTM, 72 h para reportar incidentes, fiscalización de la APDP.
- 6 servicios: mapeo de datos y análisis de brechas; cifrado, control de acceso y
  logs; portal ARCOP; DPO como servicio con EIPD; protocolo de incidentes; contratos
  con proveedores y capacitación.
- Clave: "No somos un estudio jurídico. Intervenimos repositorios, bases de datos
  y flujos". Es adecuación **técnica**.
- Sin precios; el anzuelo es una "auditoría de brechas". No publica la fecha de vigencia.

**Cómo se conectan:** la IA se vende como segura *porque* cumple con la 21.719, y
la 21.719 abre la puerta a clientes que después compran IA. Un servicio alimenta al otro.

## 2. Qué se copia y qué no

| Copiar | No copiar | Superar |
|---|---|---|
| Home por capacidades | Métricas no verificables (años, n.º de plataformas) | Portal con enlace mágico, avance por fases, pagos, tickets y horas |
| 3 planes con precio visible por servicio | Logos de clientes sin permiso | Fases del proyecto definidas por el plan contratado |
| Productos propios como vitrina | | |
| Modalidad compra / arriendo | | |

## 3. Nueva oferta (propuesta)

Igual que r3q, **IA y Ley 21.719 van primero**. La diferencia: Maudev publica
precios cerrados donde r3q esconde los suyos detrás de un diagnóstico, y apunta a
PYMEs, que r3q no atiende.

| Capacidad | Básico | Estándar | Premium | Cobro |
|---|---|---|---|---|
| **Ley 21.719** (técnica) | Diagnóstico de brechas del sitio y los formularios | Adecuación: consentimiento, ARCOP, cifrado, registro de tratamientos | Adecuación + mantención y protocolo de incidentes | Único + mensual |
| **IA aplicada** | Prototipo en 2-3 semanas (1 caso) | Agente de WhatsApp o lectura de documentos | Agente + RAG privado + integraciones | Único + mensual de operación |
| Desarrollo web y software | Landing | Sitio o e-commerce | Portal o sistema a medida | Único |
| Soporte y mantención | Correo 48 h, respaldo mensual | WhatsApp 24 h, 2 h de cambios | 4 h, respaldo diario, 6 h de cambios | Mensual |

**Por qué conviene la 21.719:** entra en vigencia el 1 dic 2026, es decir, en ~2
meses. Esa urgencia es real y verificable, y la mayoría de las PYMEs no tiene quién
la resuelva. Maudev ya tiene la base hecha: `CookieConsent`, `consent.js`,
`/privacidad` y `/eliminacion-datos`. **maudev.cl debe cumplirla primero y
usarse como demostración.** El portal de clientes incluye su propio módulo ARCOP,
que después se vende como componente.

**Límites que no se cruzan:**
- Nada de asesoría legal, DPO ni "representación ante la APDP". Siendo una sola
  persona, eso es responsabilidad profesional ajena. Se ofrece adecuación técnica y
  un abogado aliado cuando haga falta.
- Nada de "cero riesgo", -65 % ni 99,4 %. Solo cifras medidas en proyectos propios.
- Cifras legales a confirmar con el texto oficial antes de publicarlas: las multas
  por tramo (hasta 20.000 UTM) y el plazo para notificar incidentes (las 72 h pueden
  venir del RGPD europeo y no de la ley chilena).
- En IA, prometer solo lo que ofrece el proveedor del modelo: sin entrenamiento con
  datos de la API y retención cero solo si hay un acuerdo firmado.

Opcional: **productos propios**, con Rifa Clara como plataforma de marca blanca
(compra única). r3q vende la suya desde $1.200.000.

Los precios quedan por definir. Referencia actual: mantención desde $35.000/mes;
los pisos de web salen hoy de `desdePrecio()` del catálogo.

## 4. Arquitectura del sitio

**Una sola fuente de datos:** `src/data/oferta.js` (capacidades, planes, precios,
FAQ y **fases de proyecto por plan**). De ahí salen el menú, el footer, las páginas,
`scripts/paginas.mjs` (sitemap y prerender) y las plantillas del portal.

Rutas:
- `/` home nueva (orden de r3q, sin métricas infladas)
- `/servicios` catálogo · `/servicios/:slug` **una sola plantilla** con 3 planes
- `/productos/:slug` · `/casos` · `/nosotros` · `/contacto` · legales (se mantienen)
- `/portal/*` (noindex, fuera de sitemap y prerender)

**Se borra:** `services.js`, `subservices.js`, `catalog.js`, `automations.js`,
`pricing.js`, `from-price.js`, `quote.js`, `ServicePage`, `SubservicePage`,
`AutomatizacionDetail`, `Precios`, `PlanTiers`, `SolutionsOverview`,
`Capabilities`, `TierModal`, `CheckoutModal`, `QuickQuote` (y lo que knip marque huérfano).

**Redirecciones 301** en `public/_redirects` para no perder lo indexado:
`/automatizacion`, `/software-a-medida`, `/desarrollo-web`, `/ecommerce`,
`/mantencion`, `/apps-moviles`, `/diseno`, `/servicios/<slugs viejos>`,
`/automatizaciones/*`, `/precios` → su equivalente nuevo.

## 5. Portal de clientes

### 5.1 Hosting: de Pages a un Worker con assets

Hoy el sitio es Cloudflare Pages + `functions/blog`. El portal necesita **cron**
(vencimientos, recordatorios de cobro y horas del mes), y Pages Functions no lo
tiene. Recomendación: al empezar la entrega 2, pasar a **un solo Worker** que sirva:

- los estáticos de `dist/` (`not_found_handling = "single-page-application"`;
  `_headers` y `_redirects` siguen funcionando)
- la API en `/api/*` (Hono, `run_worker_first`)
- el proxy de `/blog/*` (hoy en `functions/`)
- el cron (1 de los 5 que tiene la cuenta; Rifa Clara ya usa otro)

Mismo origen para todo: sin CORS y con cookie `__Host-`. Es el mismo modelo que
Rifa Clara, así que el despliegue y la experiencia ya están probados.

### 5.2 Estructura de carpetas

```
maudev/
├─ src/                       FRONT (Vite + React, JS). Lo público no se mueve.
│  ├─ components/landing/     sitio público (se mantiene)
│  ├─ pages/                  sitio público (se mantiene; se borra lo viejo)
│  └─ portal/                 NUEVO: carga diferida, noindex, fuera del prerender
│     ├─ api.js               fetch same-origin; un 401 lleva a /portal/ingresar
│     ├─ sesion.jsx           SesionProvider, useSesion, <Protegida permiso="…">
│     ├─ PortalShell.jsx      layout: menú según rol
│     ├─ ingresar/            Ingresar.jsx (correo + Turnstile), Verificar.jsx
│     ├─ cliente/             Resumen, Proyecto, Pagos, Soporte, Documentos, Equipo
│     └─ admin/               Clientes, ClienteDetalle, Proyectos, Cobros, Tickets, Horas, Auditoria
├─ server/                    BACK (Hono, TypeScript: aquí los tipos sí evitan errores de permisos)
│  ├─ index.ts                export default { fetch, scheduled }
│  ├─ auth/
│  │  ├─ sesion.ts            enlace mágico, cookie, sesiones (base: rifas/api/src/auth.ts)
│  │  └─ permisos.ts          requiereAdmin, requierePermiso(p), alcance por cliente
│  ├─ rutas/
│  │  ├─ publico/             leads, arcop, webhooks/flow, blog
│  │  ├─ cliente/             /api/c/:clienteId/…  (siempre acotado al cliente)
│  │  └─ admin/               /api/admin/…
│  ├─ servicios/              correo.ts, flow.ts, archivos.ts (R2), auditoria.ts
│  ├─ cron.ts                 cobros vencidos, avisos, cierre de horas del mes
│  └─ db/migraciones/         0001_base.sql, 0002_…  (wrangler d1 migrations)
├─ shared/                    lo usan front y back (alias @shared)
│  ├─ oferta.js               planes, precios y fases → el servidor cobra desde aquí
│  └─ permisos.js             matriz rol → permisos (una sola fuente)
├─ wrangler.toml              Worker + assets + D1 + R2 + cron
├─ workers/meta-capi/         se mantiene aparte (no toca el portal)
├─ workers/lead-intake/       se absorbe en server/rutas/publico/leads (entrega 2)
└─ functions/                 se elimina al migrar
```

¿Por qué no un repo aparte para el back? El portal comparte dominio, oferta y
despliegue con el sitio. Separarlo duplicaría `oferta.js`, obligaría a usar CORS
y a mantener dos pipelines. Rifa Clara usa carpetas en un solo repo y le funciona.

### 5.3 Roles y permisos

**Dos niveles, no uno:**

1. **Rol global** (`usuarios.rol`): `admin` | `cliente`. Ningún endpoint puede
   otorgar `admin`: sale de la variable `ADMIN_CORREO` o de una migración (patrón de Rifa Clara).
2. **Rol dentro de la empresa** (`miembros.rol`): una empresa cliente puede tener
   varias personas (dueño, contador, encargado TI).

| Permiso (`shared/permisos.js`) | admin | titular | colaborador |
|---|:-:|:-:|:-:|
| ver proyectos y fases | ✔ | ✔ | ✔ |
| aprobar hitos | ✔ | ✔ | — |
| ver y pagar cobros | ✔ | ✔ | — |
| crear tickets y responder | ✔ | ✔ | ✔ |
| ver y descargar documentos | ✔ | ✔ | ✔ |
| invitar o quitar colaboradores | ✔ | ✔ | — |
| crear clientes, proyectos y cobros, subir documentos, registrar horas | ✔ | — | — |
| ver auditoría | todo | su empresa | — |

**Sobre los "tokens":** no uses un JWT guardado en `localStorage`. Un XSS lo roba
y no se puede revocar. Se usa una **cookie de sesión opaca**:
- `__Host-md_sesion`, HttpOnly, Secure, SameSite=Lax. En D1 se guarda solo su
  hash SHA-256, así que cerrar sesión o expulsar a alguien surte efecto al instante.
- Duración: 30 días para clientes; **12 h para admin**, con reingreso para
  acciones críticas (emitir cobro, borrar, cambiar un titular).
- Enlace mágico de un solo uso, válido 15 min, guardado como hash.
- Tokens de API **solo para máquinas** (n8n, integraciones), con alcance y
  guardados como hash. Cuando haga falta, no antes.

**Reglas que evitan la fuga de datos entre clientes** (el riesgo n.º 1 de un portal):
- El `clienteId` de la URL **nunca se cree**: el middleware verifica la membresía
  del usuario y además **cada consulta** filtra por `cliente_id`.
- Un recurso de otro cliente responde **404**, no 403 (no confirma que existe).
- IDs aleatorios (no autoincrementales) en todo lo que ve el cliente.
- Documentos en R2 **privado**: se descargan solo a través de la API después de
  revisar el permiso. Nunca con una URL pública.
- `<Protegida>` en el front es solo para la experiencia de uso: **quien manda es el servidor**.
- **Test obligatorio:** una matriz endpoint × {anónimo, colaborador, titular de
  *otra* empresa, titular, admin} con el status esperado. Corre en CI; si alguien
  agrega un endpoint sin permiso, el CI falla.

**Acceso y registro:**
- Sin registro público: el admin crea la empresa e invita al titular, y la
  invitación *es* el primer enlace mágico.
- `/portal/ingresar` responde lo mismo exista o no el correo (así no se puede
  averiguar quién es cliente), con Turnstile (ya existe `TurnstileGate`) y
  límite de intentos por correo e IP.
- **Auditoría** de toda escritura (quién, qué, cuándo, empresa). Además vende
  la 21.719: el portal de Maudev es la demostración.
- Admin "ver como cliente" (solo lectura, auditado) para dar soporte sin pedir capturas.
- Más adelante: **passkey para el admin**, que es la cuenta de mayor valor.

### 5.4 Tablas

`usuarios`, `sesiones`, `enlaces`, `clientes`, `miembros`, `invitaciones`,
`proyectos`, `fases`, `documentos`, `cobros`, `suscripciones`, `tickets`,
`mensajes`, `horas`, `auditoria`, `solicitudes_arcop`. Todo lo que pertenece a
una empresa lleva `cliente_id`.

**Vista del cliente:**
- Resumen: proyectos con % de avance, próximo cobro, horas de soporte restantes.
- Proyecto: línea de tiempo de fases, entregables y aprobación de hitos.
- Pagos: cobros pendientes pagables con Flow (se reutiliza la integración de Rifa Clara).
- Soporte: crear ticket, conversación y horas consumidas frente a las del plan.
- Documentos: propuesta, contrato y entregables (R2, enlaces firmados).

**Vista admin** (`/portal/admin`, solo contacto@maudev.cl): invitar cliente, crear
proyecto **desde el plan contratado** (las fases vienen de `oferta.js`), avanzar
fases, subir documentos, registrar horas y emitir cobros. Avisos por correo al
completar una fase, emitir un cobro o responder un ticket.

## 6. Entregas (cada una se despliega sola)

0. **Urgente por la fecha:** maudev.cl adecuado a la 21.719 + página `/ley-21719`
   con planes, publicada antes de noviembre para posicionarse mientras dure la búsqueda.
1. **Oferta:** `oferta.js` + plantilla de servicio + home nueva (IA y 21.719 primero)
   + borrado + 301 + sitemap y validaciones (`npm test`).
2. **Portal base:** migración de Pages a un Worker con assets, `server/` y `shared/`,
   acceso con roles, test de la matriz de permisos, clientes, proyectos con fases,
   admin mínimo y auditoría.
3. **Documentos y soporte:** R2, tickets, registro de horas y colaboradores.
4. **Cobros:** Flow para cobros puntuales y suscripción mensual de soporte.
5. **Productos y artículos:** páginas de productos propios y sección de artículos.

## 7. Cómo se gastan pocos tokens

- Contenido en datos y una plantilla por tipo de página: agregar un servicio es editar un objeto.
- Auth, Resend y Flow se copian desde el repo de Rifa Clara, no se reescriben.
- Cada entrega es un commit validado con los scripts existentes; no se relee lo ya cerrado.

## Decisiones (29 sep 2026)

- IA y Ley 21.719 son los pilares principales.
- Precios aprobados, tal como están en `src/data/oferta.js`.
- Rifa Clara no se ofrece como producto (no hay usuarios reales confirmados).
- Sin versiones en inglés ni portugués: retiradas con 301 a su equivalente en español.
- Portal en `/portal`.

Estado: entrega 0, parte 1 (página `/ley-21719` con planes y autodiagnóstico) lista.
Falta la parte 2: adecuar maudev.cl (canal ARCOP completo, retención de leads,
registro de consentimiento).
