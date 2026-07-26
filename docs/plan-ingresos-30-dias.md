# Plan de ingresos — Lucas / Maudev

Caja rápida + activo en paralelo · Clientes en USD · Preferencia por demanda entrante
25 de julio de 2026 · Dólar observado: **$945 CLP** por USD

---

## 🔴 Lo primero: encontré un agujero en el balde

Revisé `src/data/n8nProducts.js` y `src/data/automations.js`. Tienes **11 productos** con precio en CLP y USD, copy bilingüe, reels renderizados y landings de conversión por slug.

Y en todos:

```js
checkoutUrlCLP: null,
checkoutUrlUSD: null,
```

**Ninguno de tus productos se puede comprar.** Tienes un catálogo de $49 a $315 USD donde el botón abre un modal en vez de cobrar. Si mañana llegaran 500 visitas calificadas, la conversión sería cero — no por el copy, sino porque no hay dónde pagar.

Esto es lo de mayor retorno por hora que puedes hacer en todo el proyecto, y te toma un fin de semana.

### El detalle que lo complica (y su solución)

**Stripe no opera en Chile**, y sigue sin hacerlo en 2026. Los únicos países hispanohablantes soportados son España y México. Por eso probablemente dejaste los checkout en `null`.

La salida es un **Merchant of Record** — una plataforma que vende legalmente a tu nombre, cobra en cualquier moneda, se hace cargo del IVA/VAT internacional y después te transfiere a ti:

| Opción | Comisión aprox. | Pago a Chile | Nota |
|---|---|---|---|
| **Lemon Squeezy** | ~5% + 50¢ | Sí (PayPal + banco, 279 países) | Adquirida por Stripe en 2024; hoy es la base de *Stripe Managed Payments*. La más directa para productos digitales |
| **Paddle** | ~5% | Sí | Alternativa madura, más orientada a SaaS |
| **Gumroad** | ~10% | Sí (PayPal) | La más simple de todas. Comisión alta pero cero fricción para partir |

Para tus `.json` de n8n (`$49–139 USD`) cualquiera sirve. Para servicios de instalación ($315 USD) conviene Lemon Squeezy o Paddle.

**Acción concreta:** crea la cuenta, sube los 3 productos de `n8nProducts.js`, pega las URLs en `checkoutUrlUSD` y `checkoutUrlCLP`. Fin de semana, y tu catálogo pasa de decorativo a vendible.

---

## 🧠 El reframe que cambia tu restricción

Dijiste que prefieres que los clientes lleguen a ti. Perfecto — pero hay una distinción que vale mucha plata:

> **Responder a un aviso publicado NO es outbound frío.**

Cuando alguien publica "necesito un experto en n8n, presupuesto USD 2.000", ya levantó la mano, ya declaró intención y ya pidió que le escriban. No estás interrumpiendo a nadie: estás atendiendo demanda existente.

Eso es completamente distinto de mandarle un DM a un dueño de restaurante que nunca pidió nada. Y es, por lejos, el canal más rápido para generar caja sin hacer venta en frío.

Tu SEO no te va a dar eso este trimestre. Tu propio `docs/seo-keywords-atp.md` lo dice: las keywords que persigues tienen **110–140 búsquedas/mes en todo Chile**. Rankeando #1 en todas serían ~40 visitas al mes. El SEO es un activo a 12 meses, no un plan de caja.

---

# Los tres carriles

## 🚀 Carril 1 — Caja rápida: freelance en USD (semanas)

Este es el arbitraje más grande que tienes disponible.

**Datos de mercado (julio 2026):**
- Un experto en n8n en Upwork cobra **USD 40–100/hora**; los senior, **125–250+**
- Las skills de integración de IA crecieron **178% año contra año** en Upwork
- **77%** de los líderes de empresa dicen preferir talento especializado *fraccional* antes que contrataciones full-time

**Traducido a pesos, con el dólar a $945:**

| Tarifa USD/hora | En CLP/hora | 10 h/semana | 20 h/semana |
|---|---|---|---|
| $30 (inicio) | $28.350 | $1.134.000/mes | $2.268.000/mes |
| $50 | $47.250 | $1.890.000/mes | $3.780.000/mes |
| $80 | $75.600 | $3.024.000/mes | $6.048.000/mes |

Una sola hora facturada a USD 50 te deja más que revender cuatro teclados usados.

**Dónde postular (todos son demanda ya declarada):**

| Plataforma | Qué es | Nota |
|---|---|---|
| **Upwork** | El volumen más grande de trabajos n8n/automatización | Tiene directorio propio de expertos n8n. Empieza acá |
| **Contra** | Freelance sin comisión | Menos volumen, mejores márgenes |
| **Get on Board** | Bolsa chilena de tech, muchos remotos pagados en USD | Local, en español, sin barrera cultural |
| **Wellfound** | Startups contratando contractors | Buen fit para tu stack |
| **Foro / comunidad n8n** | Canal de jobs donde piden expertos | Nicho puro, poca competencia |
| **Braintrust / Gun.io / Toptal** | Redes de talento senior | Filtro de entrada duro, tarifas altas |

**Tu stack es exactamente el que se está pidiendo:** n8n self-hosted, REST APIs, webhooks, JavaScript en code nodes, y pipelines de agentes IA/RAG. Eso es literalmente lo que describe el mercado como "el perfil que se busca".

### Sé honesto con el arranque
Las primeras 15–25 postulaciones en Upwork suelen no convertir. Sin reseñas partes en desventaja. Estrategia realista:

1. Primeros 2 contratos: cobra **bajo** (USD 20–25/h) y apunta a proyectos chicos y rápidos. Estás comprando reseñas, no facturando.
2. Con 3 reseñas de 5 estrellas, subes a USD 40–50.
3. Con 5–6 reseñas y un nicho claro ("n8n + WhatsApp Business API"), USD 60–80.

**Especialízate, no generalices.** "Desarrollador full-stack" compite con 50.000 personas. "n8n + WhatsApp Business Cloud API + calificación de leads con IA" compite con 50 — y tú ya lo tienes construido.

---

## 🔧 Carril 2 — Arreglar el balde (este fin de semana)

Trabajo de una vez que desbloquea todo lo demás:

1. **Cablear el checkout** (arriba). Sin esto, los carriles 1 y 3 gotean.
2. **Publicar tu caso de estudio real.** Tienes `CasoEstudio.jsx` y `projects.js`. Un caso con números concretos ("califica X leads/día, ahorra Y horas semanales") vale más que las 8 landings de verticales juntas — para clientes y para tu perfil de Upwork.
3. **Perfil de Upwork con tu portafolio existente.** Ya tienes sitio, reels y productos. Es copiar y pegar, no crear.

---

## 🌱 Carril 3 — Activo que compone: templates de n8n (2–3 meses)

Esto sí es inbound puro y encaja perfecto con tu preferencia.

**La jugada:** publicar workflows **gratis** en la librería de templates de n8n. Es distribución regalada frente a una audiencia que ya usa la herramienta y ya tiene el problema. Cada template lleva tu nombre y tu link. n8n está construyendo un marketplace de creadores con programa de afiliados encima.

Ya tienes dos workflows construidos: `lead-intake.json` y `calificador-whatsapp.workflow.json`.

**El embudo:**

```
Template gratis en n8n  →  cientos/miles de instalaciones
        ↓
Versión Pro en Lemon Squeezy ($49 USD)
        ↓
"Me lo instalas?"  →  servicio a $315 USD
        ↓
Retainer mensual  →  USD 1.000–3.000/mes por cliente
```

Ese último escalón es el premio: los retainers de consultoría n8n van entre **USD 1.000 y 3.000 al mes por cliente**. Un solo cliente en retainer ≈ $1–2,8 millones CLP mensuales recurrentes.

**Dónde vender los pagados:** Gumroad (más simple), Lemon Squeezy (mejor margen), n8nmarkets (audiencia nicho). Rango de mercado: **$29 USD** por workflows simples hasta **$299+** por soluciones complejas de industria. Tus $49 están bien calibrados.

**Bonus que ya tienes:** Remotion + los reels en `/social/pro-*.mp4`. Video corto mostrando un automatismo funcionando es el formato que mejor rinde en este nicho. Ya tienes la infraestructura para producirlo en serie.

---

# Plan de 30 días

| Semana | Carril 1 (caja) | Carril 2/3 (activo) |
|---|---|---|
| **1** | Crear perfil Upwork + Get on Board. Postular a **5 avisos diarios** de n8n/automatización | Cablear checkout con Lemon Squeezy en los 3 productos n8n |
| **2** | Seguir postulando 5/día. Aceptar el primer proyecto aunque pague poco | Publicar `calificador-whatsapp` **gratis** como template en n8n |
| **3** | Entregar impecable. Pedir reseña explícitamente | Publicar `lead-intake` como segundo template. Subir versión Pro a Gumroad |
| **4** | Subir tarifa. Postular solo a proyectos sobre USD 500 | Escribir el caso de estudio con números reales del primer cliente |

**Meta realista mes 1:** 1–2 contratos chicos, USD 400–900 (≈ $380.000–850.000 CLP) + los primeros templates publicados.
**Meta mes 3:** tarifa en USD 50+/hora, 2 templates con tracción y el primer retainer en conversación.

---

## Lo que descarté, y por qué

| Opción | Veredicto |
|---|---|
| **Dropshipping (Dropi)** | Con $100.000 no alcanza ni a validar un producto. Es una apuesta, no un negocio |
| **Meiggs / reventa** | Márgenes de $20–40k por unidad. Ocupa el mismo tiempo que una hora facturada a USD 50. Costo de oportunidad brutal |
| **Ads pagados a las automatizaciones** | No todavía. Pagar tráfico hacia un sitio sin checkout es quemar plata. Primero el balde, después el agua |
| **SEO como plan de caja** | 110–140 búsquedas/mes a nivel nacional. Buen activo a 12 meses, nulo como plan de este trimestre |
| **Buscar empleo tradicional** | No lo descarto del todo — pero con tu stack, el freelance en USD paga más que la mayoría de los sueldos de dev en Chile |

---

## Un par de cosas prácticas

- **Boleta de honorarios:** los ingresos de Upwork tributan en Chile. Guarda entre un 15% y 20% de cada pago para la operación renta. No soy asesor tributario — vale la pena una consulta puntual con un contador cuando empieces a facturar en serio.
- **Recibir la plata:** Upwork paga a cuentas chilenas vía transferencia o a través de servicios como Global66/Wise, que suelen dar mejor tipo de cambio que el banco directo. Compara antes del primer retiro.
- **Prioriza en este orden:** checkout → perfil Upwork → postulaciones → templates. En ese orden, no en paralelo. Lo que te ha frenado no es falta de capacidad, es dispersión: tienes ocho verticales de automatización construidos y cero forma de cobrar por ninguno.

---

*Sources: [Upwork — n8n experts](https://www.upwork.com/hire/n8n-experts/) · [Upwork — tarifas 2026](https://www.upwork.com/resources/upwork-hourly-rates) · [Upwork skills en demanda 2026](https://www.barchart.com/story/news/21201/upworks-in-demand-skills-2026-demand-for-top-ai-skills-more-than-doubles-as-ai-is-embedded-into-everyday-work) · [Stripe — disponibilidad global](https://stripe.com/global) · [Global66 — Stripe en Chile](https://www.global66.com/blog/stripe-chile/) · [Lemon Squeezy — países soportados](https://docs.lemonsqueezy.com/help/getting-started/supported-countries) · [Lemon Squeezy — actualización 2026](https://www.lemonsqueezy.com/blog/2026-update) · [Monetizar n8n](https://ritz7.ai/blog/monetize-n8n-automation-skills/) · [n8n Markets](https://n8nmarkets.com/en/) · [Dólar hoy Chile](https://dolarhoy.net/chile/)*
