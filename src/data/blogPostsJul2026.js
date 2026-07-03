// Blog de JULIO 2026 — 4 posts SEO basados en búsquedas reales de Google Chile
// (API de AnswerThePublic, jul 2026). Uno por semana, date-gated:
//   06-jul  chatbot-ia-whatsapp-pymes-2026        ("chatbot para whatsapp" ~100/mes)
//   13-jul  cuanto-cuesta-pagina-web-carrito-2026 ("página web con carrito" 140+70/mes)
//   20-jul  wix-vs-pagina-web-a-medida-2026       ("página web wix" 590/mes)
//   27-jul  metodologias-desarrollo-software-2026 ("metodologías" 140/mes)

const AUTHOR = "Equipo Maudev";

const cta = `

---

¿Quieres aplicar esto en tu negocio? En **Maudev** desarrollamos webs, software a medida y automatizaciones para PYMEs y emprendedores en Chile y Latinoamérica. [Agenda un diagnóstico gratuito](/contacto).`;

const ctaEN = `

---

Want to apply this to your business? At **Maudev** we build websites, custom software and automations for SMBs and founders in Chile and Latin America. [Book a free consult](/contacto).`;

const guia = `

> 📘 **Guía gratis**: si estás cotizando un proyecto, descarga nuestra guía *Software a medida sin perder plata* —precios reales, cómo elegir proveedor y qué exigir—. [Descárgala aquí](/guia).`;

const guiaEN = `

> 📘 **Free guide**: if you're getting quotes for a project, download our guide *Custom software without wasting money* —real prices, how to choose a provider and what to demand—. [Get it here](/guia).`;

export const julyPosts = [
  // ═══════════════ 06-JUL · Chatbot con IA para WhatsApp ═══════════════
  {
    id: "chatbot-ia-whatsapp-pymes-2026",
    title: "Chatbot con IA para WhatsApp y tu web: guía completa para PYMEs (2026)",
    title_en: "AI chatbot for WhatsApp and your website: complete SMB guide (2026)",
    excerpt:
      "Qué es un chatbot con IA, qué puede hacer de verdad por tu negocio (y qué no), cuánto cuesta en Chile y cómo partir sin quemarte. Con tabla comparativa y preguntas frecuentes.",
    excerpt_en:
      "What an AI chatbot is, what it can really do for your business (and what it can't), how much it costs in Chile and how to start without getting burned. With a comparison table and FAQ.",
    category: "automatizacion",
    read_time: 13,
    author: AUTHOR,
    tags: ["chatbot", "whatsapp", "ia", "automatización", "pymes", "chile"],
    cover_image: "/blog/chatbot-ia-whatsapp-pymes-2026.png",
    created_date: "2026-07-06T09:00:00-04:00",
    content: `Si tienes un negocio, ya viviste esta escena: un cliente escribe por WhatsApp a las 11 de la noche, nadie responde, y a la mañana siguiente ya compró en otra parte. Un **chatbot con IA** existe exactamente para eso: responder al instante, calificar al interesado y avisarte cuando vale la pena que entres tú. En esta guía te explicamos qué es, qué puede hacer de verdad —sin humo— y cuánto cuesta implementarlo en Chile.

## ¿Qué es un chatbot (y qué cambió con la IA)?

Un chatbot es un programa que conversa con tus clientes por texto: en tu web, en WhatsApp, en Instagram. Los antiguos funcionaban con menús rígidos ("escribe 1 para ventas"). Los actuales usan **inteligencia artificial**: entienden la pregunta escrita en lenguaje normal y responden con información de TU negocio (precios, horarios, stock, políticas).

La diferencia práctica es enorme:

| | Chatbot clásico (menús) | Chatbot con IA |
|---|---|---|
| Entiende preguntas libres | ❌ Solo opciones fijas | ✅ Lenguaje natural |
| Respuestas | Genéricas | Con datos de tu negocio |
| Horario | 24/7 | 24/7 |
| Deriva a humano | A veces | ✅ Cuando detecta que debe |
| Califica al cliente | ❌ | ✅ (qué necesita, presupuesto, urgencia) |

![Un chatbot atiende 24/7 mientras tú duermes](/blog/chatbot-stat.png)

## Qué puede hacer de verdad por una PYME

- **Responder al instante, siempre.** La velocidad de respuesta mueve la venta: el interesado que recibe respuesta en minutos convierte mucho más que el que espera horas.
- **Filtrar curiosos de compradores.** El bot pregunta qué necesita, para cuándo y con qué presupuesto. Tú recibes el resumen y decides a quién dedicarle tiempo.
- **Contestar lo repetitivo.** Precios, horarios, cobertura, formas de pago: el 70-80% de las consultas de un negocio suelen ser las mismas 10 preguntas.
- **Agendar por ti.** Conectado a un calendario, el bot ofrece horarios y agenda la reunión sin intervención tuya.
- **Trabajar dentro de WhatsApp.** En Chile la conversación comercial pasa por WhatsApp; un bot ahí responde donde tu cliente ya está, sin apps nuevas.

## Qué NO deberías esperar (honestamente)

- **No reemplaza el criterio humano.** Decisiones sensibles —descuentos especiales, reclamos delicados, negociaciones— deben derivarse a una persona. Un buen bot sabe cuándo pasar la conversación.
- **No se configura solo.** La calidad depende de la información que le cargues: si tus precios y políticas no están claros, el bot tampoco lo estará.
- **No es "ponerlo y olvidarse".** Hay que revisar conversaciones las primeras semanas y ajustar respuestas. Es un empleado nuevo: bueno, pero hay que entrenarlo.

![El mejor chatbot sabe cuándo pasarte la conversación](/blog/chatbot-quote.png)

## ¿Y el "chatbot para WhatsApp gratis"?

Es de las búsquedas más comunes, así que respuesta directa: **WhatsApp Business (la app gratuita)** trae respuestas automáticas simples —mensaje de bienvenida y de ausencia— y eso puede bastar para partir. Pero para un bot con IA que converse de verdad necesitas la **API de WhatsApp Business**, que funciona con proveedores autorizados y tiene costos por conversación. Las herramientas "gratis" que prometen bots completos en WhatsApp suelen operar en zonas grises que arriesgan tu número (baneos). Si WhatsApp es tu canal de ventas, no lo arriesgues.

## ¿Cuánto cuesta un chatbot con IA en Chile?

Rangos realistas para una PYME (2026):

| Opción | Costo | Para quién |
|---|---|---|
| Respuestas automáticas de WhatsApp Business | $0 | Partir con lo básico |
| Herramienta SaaS de chatbot (suscripción) | ~US$20-100/mes | Necesidades estándar |
| Bot con IA a medida (web + WhatsApp API) | desde $290.000 CLP (proyecto de automatización) + costos de API según uso | Quien quiere el bot con SUS datos, SUS reglas y SUS integraciones |

El SaaS es más rápido de partir; el bot a medida se integra con tus sistemas (inventario, agenda, CRM) y el código queda tuyo. La jugada correcta depende de cuánto de tu venta pasa por la conversación.

## Preguntas frecuentes

**¿Qué son los chatbots exactamente?** Programas que conversan por texto con tus clientes y ejecutan tareas (responder, agendar, derivar). Con IA, entienden lenguaje natural.

**¿Cuál es mejor: chatbot o ChatGPT?** No compiten: ChatGPT es un modelo de IA general; un chatbot para tu negocio USA modelos como ese, pero conectado a tu información y tus canales.

**¿Sirve para Instagram y la web también?** Sí. Lo ideal es un solo "cerebro" con tu información, conectado a web, WhatsApp e Instagram a la vez.
${guia}${cta}`,
    content_en: `If you run a business, you've lived this scene: a customer writes on WhatsApp at 11 pm, nobody answers, and by morning they already bought elsewhere. An **AI chatbot** exists exactly for that: answering instantly, qualifying the lead and alerting you when it's worth stepping in. This guide explains what it is, what it can really do —no hype— and what it costs to implement in Chile.

## What is a chatbot (and what changed with AI)?

A chatbot is a program that talks to your customers by text: on your website, WhatsApp or Instagram. Old ones ran on rigid menus ("type 1 for sales"). Modern ones use **artificial intelligence**: they understand questions written in plain language and answer with YOUR business data (prices, hours, stock, policies).

| | Classic chatbot (menus) | AI chatbot |
|---|---|---|
| Understands free-form questions | ❌ Fixed options only | ✅ Natural language |
| Answers | Generic | With your business data |
| Availability | 24/7 | 24/7 |
| Hands off to a human | Sometimes | ✅ When it detects it should |
| Qualifies the lead | ❌ | ✅ (needs, budget, urgency) |

![A chatbot works 24/7 while you sleep](/blog/chatbot-stat.png)

## What it can really do for an SMB

- **Answer instantly, always.** Response speed moves sales: leads answered in minutes convert far better than those waiting hours.
- **Filter browsers from buyers.** The bot asks what they need, when and with what budget. You get the summary and decide who deserves your time.
- **Handle the repetitive.** Prices, hours, coverage, payment methods: 70-80% of inquiries are usually the same 10 questions.
- **Book meetings for you.** Connected to a calendar, the bot offers slots and schedules without you.
- **Work inside WhatsApp.** In Chile, business conversations happen on WhatsApp; a bot there answers where your customer already is.

## What you should NOT expect (honestly)

- **It doesn't replace human judgment.** Sensitive decisions —special discounts, delicate complaints— must be handed to a person. A good bot knows when to pass the conversation.
- **It doesn't configure itself.** Quality depends on the information you load: if your prices and policies aren't clear, neither will the bot be.
- **It's not "set and forget".** You review conversations the first weeks and adjust. It's a new employee: good, but needs training.

![The best chatbot knows when to hand you the conversation](/blog/chatbot-quote.png)

## What about "free WhatsApp chatbots"?

Straight answer: **WhatsApp Business (the free app)** includes simple auto-replies —welcome and away messages— and that can be enough to start. But a real conversational AI bot needs the **WhatsApp Business API**, which works through authorized providers and charges per conversation. "Free" tools promising full WhatsApp bots often operate in gray areas that risk your number getting banned. If WhatsApp is your sales channel, don't risk it.

## How much does an AI chatbot cost in Chile?

| Option | Cost | For whom |
|---|---|---|
| WhatsApp Business auto-replies | $0 | Starting with basics |
| Chatbot SaaS (subscription) | ~US$20-100/mo | Standard needs |
| Custom AI bot (web + WhatsApp API) | from $290,000 CLP (automation project) + API usage costs | Those who want the bot with THEIR data, rules and integrations |

SaaS is faster to start; a custom bot integrates with your systems (inventory, calendar, CRM) and you own the code.

## FAQ

**What exactly are chatbots?** Programs that talk to your customers by text and execute tasks (answer, schedule, hand off). With AI, they understand natural language.

**Which is better: a chatbot or ChatGPT?** They don't compete: ChatGPT is a general AI model; a business chatbot USES models like it, connected to your information and channels.

**Does it work for Instagram and the web too?** Yes. Ideally one "brain" with your information, connected to web, WhatsApp and Instagram at once.
${guiaEN}${ctaEN}`,
  },

  // ═══════════════ 13-JUL · Página web con carrito de compras ═══════════════
  {
    id: "cuanto-cuesta-pagina-web-carrito-compras-2026",
    title: "¿Cuánto cuesta una página web con carrito de compras en Chile? (2026)",
    title_en: "How much does a website with a shopping cart cost in Chile? (2026)",
    excerpt:
      "Precios reales de una tienda online en Chile: plantilla vs a medida, costos de Webpay y MercadoPago, los gastos ocultos que nadie cotiza y una tabla para comparar opciones.",
    excerpt_en:
      "Real prices for an online store in Chile: template vs custom, Webpay and MercadoPago costs, the hidden expenses nobody quotes, and a comparison table.",
    category: "desarrollo",
    read_time: 14,
    author: AUTHOR,
    tags: ["ecommerce", "carrito de compras", "tienda online", "precios", "webpay", "chile"],
    cover_image: "/blog/cuanto-cuesta-pagina-web-carrito-compras-2026.png",
    created_date: "2026-07-13T09:00:00-04:00",
    content: `"Quiero una página web con carrito de compras, ¿cuánto sale?" es de las preguntas más buscadas en Google Chile, y casi nadie la responde con números. Acá va la respuesta honesta: depende de 3 decisiones, y te las mostramos con precios reales para que compares sin sorpresas.

## Las 3 decisiones que definen el precio

1. **¿Plataforma con plantilla o desarrollo a medida?** La plantilla (Shopify, Jumpseller, WooCommerce) es más barata de partir; lo a medida se adapta a TU proceso y no paga suscripción para siempre.
2. **¿Cuántos productos y qué tan especial es tu venta?** No es lo mismo vender 20 productos simples que 2.000 con variantes, tallas, despacho por zonas o venta B2B con precios por cliente.
3. **¿Qué integraciones necesitas?** Pasarela de pago, inventario, facturación, envíos. Cada conexión suma valor (y costo).

## Tabla de precios realistas en Chile (2026)

| Opción | Costo inicial | Costo mensual | Para quién |
|---|---|---|---|
| Plataforma con plantilla (Shopify, Jumpseller) | $0 – $300.000 (configuración) | ~$15.000 – $80.000 (suscripción + apps) | Catálogo estándar, quieres partir YA |
| WooCommerce (WordPress) | $200.000 – $600.000 | Hosting ~$5.000 – $30.000 + mantención | Presupuesto ajustado, algo de flexibilidad |
| **Tienda a medida** | **desde $700.000** | Hosting bajo (a veces $0) + mantención opcional desde $49.000 | Proceso de venta propio, integraciones, el código queda TUYO |

![Una tienda a medida parte desde $700.000 en Chile](/blog/carrito-stat.png)

**El detalle que cambia la cuenta a 3 años:** la plantilla cobra suscripción para siempre y las "apps" extra suman rápido. Lo a medida cuesta más al inicio, pero después el costo mensual es mínimo y el activo es tuyo. Haz la multiplicación antes de decidir.

## Los costos que nadie te cotiza (y existen)

- **Pasarela de pago:** Webpay, MercadoPago o Stripe cobran **comisión por venta** (típicamente entre 1,5% y 3,5% + IVA según pasarela y medio de pago). No es costo del desarrollador: es de la pasarela, y lo pagas con cualquier opción.
- **Dominio:** ~$12.000/año el .cl.
- **Certificado y hosting:** en plataformas viene incluido; a medida puede ser desde $0 (infraestructura moderna) hasta ~$30.000/mes según tráfico.
- **Fotografía y fichas de producto:** el costo escondido más subestimado. Una tienda con fotos malas no vende, da lo mismo cuánto costó el desarrollo.
- **Mantención:** actualizaciones, respaldos, seguridad. En plantillas está en la suscripción; a medida, presupuesta desde $49.000/mes si quieres despreocuparte.

## ¿Cuándo conviene plantilla y cuándo a medida?

**Plantilla si:** vendes productos estándar, necesitas partir este mes, tu proceso calza con lo que la plataforma ofrece de fábrica.

**A medida si:** tu forma de vender es especial (B2B, cotizaciones, arriendos, suscripciones locales), necesitas integrar inventario/facturación/sistemas propios, o ya estás pagando tantas apps y comisiones que la suscripción te quedó chica.

![Plantilla para partir rápido; a medida para crecer sin arrendar tu negocio](/blog/carrito-quote.png)

## Señales de una cotización seria (para cualquier opción)

- Te preguntan por tu **proceso de venta** antes de dar un número.
- El precio incluye **pruebas con compras reales** en ambiente de prueba de la pasarela.
- Queda claro **de quién es el código y el dominio** (respuesta correcta: tuyos).
- Hay precio y alcance **por escrito**.

## Preguntas frecuentes

**¿Puedo partir con plantilla y migrar a medida después?** Sí, es un camino común: valida tu venta en plataforma y construye a medida cuando el volumen o las comisiones lo justifiquen. Considera que la migración tiene costo (datos, SEO, redirecciones).

**¿Webpay o MercadoPago?** Para venta en Chile, Webpay es el estándar que los compradores reconocen; MercadoPago suma billetera y cuotas atractivas. Muchas tiendas usan ambas.

**¿Cuánto demora?** Plantilla: días a 2 semanas. A medida: desde ~3 semanas para una tienda simple; más según integraciones.
${guia}${cta}`,
    content_en: `"How much does a website with a shopping cart cost?" is one of the most-searched questions on Google Chile, and almost nobody answers it with numbers. Here's the honest answer: it depends on 3 decisions, shown with real prices so you can compare without surprises.

## The 3 decisions that define the price

1. **Template platform or custom build?** Templates (Shopify, Jumpseller, WooCommerce) are cheaper to start; custom adapts to YOUR process and doesn't pay a subscription forever.
2. **How many products, and how special is your selling process?** Selling 20 simple products isn't the same as 2,000 with variants, sizes, zone-based shipping or B2B pricing per customer.
3. **Which integrations do you need?** Payment gateway, inventory, invoicing, shipping. Each connection adds value (and cost).

## Realistic prices in Chile (2026)

| Option | Upfront | Monthly | For whom |
|---|---|---|---|
| Template platform (Shopify, Jumpseller) | $0 – $300,000 CLP (setup) | ~$15,000 – $80,000 (subscription + apps) | Standard catalog, launch NOW |
| WooCommerce (WordPress) | $200,000 – $600,000 | Hosting ~$5,000 – $30,000 + maintenance | Tight budget, some flexibility |
| **Custom store** | **from $700,000** | Low hosting (sometimes $0) + optional maintenance from $49,000 | Unique sales process, integrations, YOU own the code |

![A custom store starts at $700,000 CLP in Chile](/blog/carrito-stat.png)

**The detail that changes the 3-year math:** templates charge subscriptions forever and extra "apps" add up fast. Custom costs more upfront, but the monthly cost afterwards is minimal and the asset is yours.

## The costs nobody quotes (but exist)

- **Payment gateway:** Webpay, MercadoPago or Stripe charge **commission per sale** (typically 1.5%–3.5% + VAT depending on gateway and payment method). It's not the developer's fee: every option pays it.
- **Domain:** ~$12,000/yr for .cl.
- **SSL and hosting:** included in platforms; custom can go from $0 (modern infra) to ~$30,000/mo depending on traffic.
- **Product photos and copy:** the most underestimated hidden cost. A store with bad photos doesn't sell, no matter what the build cost.
- **Maintenance:** updates, backups, security. In platforms it's in the subscription; custom, budget from $49,000/mo if you want it handled.

## When template, when custom?

**Template if:** you sell standard products, need to launch this month, and your process fits what the platform offers out of the box.

**Custom if:** your selling process is special (B2B, quotes, rentals, local subscriptions), you need to integrate inventory/invoicing/your own systems, or you're already paying so many apps and fees that the subscription outgrew you.

![Template to start fast; custom to grow without renting your business](/blog/carrito-quote.png)

## Signs of a serious quote (for any option)

- They ask about your **sales process** before giving a number.
- The price includes **test purchases** in the gateway's sandbox.
- It's clear **who owns the code and domain** (correct answer: you).
- Price and scope are **in writing**.

## FAQ

**Can I start with a template and migrate to custom later?** Yes, it's a common path: validate sales on a platform and build custom when volume or fees justify it. Migration has a cost (data, SEO, redirects).

**Webpay or MercadoPago?** For selling in Chile, Webpay is the standard buyers recognize; MercadoPago adds wallet and installments. Many stores use both.

**How long does it take?** Template: days to 2 weeks. Custom: from ~3 weeks for a simple store; more with integrations.
${guiaEN}${ctaEN}`,
  },

  // ═══════════════ 20-JUL · Wix vs a medida ═══════════════
  {
    id: "wix-vs-pagina-web-a-medida-2026",
    title: "Wix vs página web a medida: cuándo conviene cada una (comparación honesta)",
    title_en: "Wix vs custom website: when each one makes sense (honest comparison)",
    excerpt:
      "Wix es la opción más buscada en Chile para hacer una página. ¿Cuándo basta y cuándo te queda chica? Comparación sin caricaturas: costos reales, SEO, límites y una tabla directa.",
    excerpt_en:
      "Wix is Chile's most-searched option for building a site. When is it enough and when do you outgrow it? A comparison without caricatures: real costs, SEO, limits and a straight table.",
    category: "desarrollo",
    read_time: 12,
    author: AUTHOR,
    tags: ["wix", "página web", "comparación", "desarrollo web", "chile"],
    cover_image: "/blog/wix-vs-pagina-web-a-medida-2026.png",
    created_date: "2026-07-20T09:00:00-04:00",
    content: `"Página web Wix" es, por lejos, una de las búsquedas más populares en Chile cuando alguien quiere presencia online. Y tiene sentido: Wix es accesible y rápido. Como desarrollamos páginas a medida, sería fácil caricaturizarlo; no lo vamos a hacer. **Wix es una buena opción para ciertos casos** —y una trampa cara para otros—. Acá está la comparación honesta.

![590 búsquedas al mes de "página web wix" en Google Chile](/blog/wix-stat.png)

## Qué es Wix (y su verdadero fuerte)

Wix es un constructor de páginas con editor visual: arrastras bloques, eliges plantilla y publicas sin saber programar. Su fuerte real es la **velocidad para existir online**: en una tarde puedes tener algo publicado.

## ¿Wix es gratis?

Otra de las grandes búsquedas. Respuesta: **sí, hay plan gratis, pero con condiciones importantes**: tu página vive en un subdominio de Wix (no en tudominio.cl), muestra publicidad de Wix, y no puedes conectar pagos. Para un negocio real necesitas plan de pago mensual, y los planes con venta online son los más caros. El "gratis" sirve para probar, no para vender.

## Comparación directa

| Criterio | Wix | A medida |
|---|---|---|
| Velocidad para publicar | ✅ Horas o días | Días a semanas |
| Costo inicial | ✅ Bajo (plan mensual) | Mayor (proyecto una vez) |
| Costo a 3+ años | Suscripción para siempre | ✅ Mantención opcional, sin arriendo |
| Diseño | Plantillas (con límites) | ✅ Exactamente lo que necesitas |
| Velocidad de carga y SEO técnico | Aceptable, poco controlable | ✅ Control total (afecta Google) |
| Funciones especiales (cotizadores, integraciones, automatización) | ❌ Limitado a sus apps | ✅ Lo que tu proceso requiera |
| ¿De quién es el sitio? | De Wix (lo arriendas) | ✅ Tuyo (código y dominio a tu nombre) |
| Migrar después | ❌ No exporta el sitio: partes de cero | ✅ El código se lleva a cualquier hosting |

## El punto que casi nadie te cuenta

Con Wix **no eres dueño de tu página: la arriendas**. Si dejas de pagar, desaparece. Y si un día quieres algo que Wix no hace —un cotizador propio, integrarte con tu inventario, automatizar procesos—, no puedes "extenderlo": tienes que rehacer el sitio desde cero en otra parte, incluyendo el riesgo SEO de la mudanza.

![Con Wix arriendas tu página; a medida, es tuya](/blog/wix-quote.png)

## Cuándo Wix es la elección CORRECTA

Seamos justos, porque estos casos existen y son muchos:

- Estás **validando una idea** y necesitas presencia esta semana.
- Tu página es una **tarjeta de presentación** simple: quiénes somos, fotos, contacto.
- Tu presupuesto inicial es muy acotado y prefieres pagar mensual.
- No necesitas integraciones ni procesos especiales.

## Cuándo te conviene a medida

- Tu web debe **generar clientes**, no solo existir: SEO serio, velocidad, formularios inteligentes, medición real.
- Necesitas **funciones propias**: cotizador, reservas, portal de clientes, conexión con tus sistemas.
- Piensas en **años, no meses**: prefieres un activo propio a un arriendo eterno.
- Ya estás en Wix y **le chocaste el techo** (el caso más común que recibimos).

## ¿Y los precios?

Wix: plan de pago mensual permanente (sube si vendes online). A medida con nosotros: **una landing/sitio profesional parte en $390.000** con SEO técnico, captura de leads y el código a tu nombre; sin suscripción obligatoria. La cuenta que importa es a 3 años: suma 36 meses de plan + apps vs proyecto único + mantención opcional.

## Preguntas frecuentes

**¿Wix o WordPress?** WordPress da más control que Wix pero exige más mantención (plugins, seguridad). Para páginas simples, Wix es más fácil; para control con presupuesto, WordPress; para procesos propios y rendimiento, a medida.

**¿Puedo exportar mi página de Wix si me cambio?** No: Wix no permite exportar el sitio. Se rehace. Por eso la decisión inicial importa más de lo que parece.

**¿Una página a medida demora mucho?** Un sitio profesional de conversión: semanas, no meses. Desconfía de plazos de "un día" y también de los de 6 meses para una landing.
${guia}${cta}`,
    content_en: `"Wix website" is by far one of Chile's most popular searches when someone wants an online presence. It makes sense: Wix is accessible and fast. As custom developers it would be easy to caricature it; we won't. **Wix is a good option for certain cases** —and an expensive trap for others—. Here's the honest comparison.

![590 monthly searches for "wix website" on Google Chile](/blog/wix-stat.png)

## What Wix is (and its real strength)

Wix is a site builder with a visual editor: drag blocks, pick a template, publish without coding. Its real strength is **speed to exist online**: you can be published in an afternoon.

## Is Wix free?

Another top search. Answer: **yes, there's a free plan, with important conditions**: your site lives on a Wix subdomain (not yourdomain.cl), shows Wix ads, and can't take payments. A real business needs a monthly paid plan, and the selling plans are the priciest. "Free" is for testing, not selling.

## Head-to-head

| Criteria | Wix | Custom |
|---|---|---|
| Speed to publish | ✅ Hours or days | Days to weeks |
| Upfront cost | ✅ Low (monthly plan) | Higher (one-time project) |
| 3+ year cost | Subscription forever | ✅ Optional maintenance, no rent |
| Design | Templates (with limits) | ✅ Exactly what you need |
| Load speed & technical SEO | Acceptable, barely controllable | ✅ Full control (affects Google) |
| Special features (quoters, integrations, automation) | ❌ Limited to its apps | ✅ Whatever your process requires |
| Who owns the site? | Wix (you rent it) | ✅ You (code and domain in your name) |
| Migrating later | ❌ No site export: start over | ✅ Code moves to any hosting |

## The point almost nobody tells you

With Wix **you don't own your site: you rent it**. Stop paying and it disappears. And if one day you need something Wix doesn't do —your own quoter, inventory integration, automation— you can't "extend it": you rebuild from scratch elsewhere, including the SEO risk of moving.

![With Wix you rent your site; custom, you own it](/blog/wix-quote.png)

## When Wix is the RIGHT choice

Let's be fair, because these cases are real and common:

- You're **validating an idea** and need presence this week.
- Your site is a simple **business card**: about us, photos, contact.
- Your initial budget is tight and you prefer paying monthly.
- You need no integrations or special processes.

## When custom pays off

- Your site must **generate customers**, not just exist: serious SEO, speed, smart forms, real measurement.
- You need **your own features**: quoter, bookings, client portal, connections to your systems.
- You think in **years, not months**: you prefer an owned asset over eternal rent.
- You're on Wix and **hit the ceiling** (the most common case we get).

## And prices?

Wix: permanent monthly plan (higher if you sell online). Custom with us: **a professional site starts at $390,000 CLP** with technical SEO, lead capture and code in your name; no mandatory subscription. The math that matters is 3 years: 36 months of plan + apps vs one project + optional maintenance.

## FAQ

**Wix or WordPress?** WordPress gives more control than Wix but demands more maintenance (plugins, security). Simple sites: Wix is easier; control on a budget: WordPress; unique processes and performance: custom.

**Can I export my Wix site if I switch?** No: Wix doesn't allow site export. You rebuild. That's why the initial decision matters more than it seems.

**Does a custom site take long?** A professional conversion site: weeks, not months. Distrust "one day" promises, and also 6-month timelines for a landing page.
${guiaEN}${ctaEN}`,
  },

  // ═══════════════ 27-JUL · Metodologías para no técnicos ═══════════════
  {
    id: "metodologias-desarrollo-software-2026",
    title: "Metodologías de desarrollo de software explicadas para no técnicos",
    title_en: "Software development methodologies explained for non-technical people",
    excerpt:
      "Scrum, cascada, Kanban: qué significan de verdad, cuál conviene para tu proyecto y qué exigirle a tu proveedor. Sin jerga, con tabla comparativa y las señales de alerta.",
    excerpt_en:
      "Scrum, waterfall, Kanban: what they actually mean, which fits your project and what to demand from your provider. No jargon, with a comparison table and red flags.",
    category: "desarrollo",
    read_time: 12,
    author: AUTHOR,
    tags: ["metodologías", "scrum", "desarrollo de software", "gestión de proyectos", "chile"],
    cover_image: "/blog/metodologias-desarrollo-software-2026.png",
    created_date: "2026-07-27T09:00:00-04:00",
    content: `Cuando cotizas un software y el proveedor dice "trabajamos con metodología ágil", ¿sabes qué te está prometiendo en la práctica? La metodología no es jerga decorativa: **define cada cuánto ves avances, cómo se manejan los cambios y qué tan probable es que el proyecto llegue a puerto**. Esta guía la explica sin tecnicismos, para que elijas y exijas con criterio.

## Por qué debería importarte (aunque no seas técnico)

Porque la mayoría de los proyectos que fracasan no fallan por código malo, sino por **proceso malo**: meses sin mostrar nada, cambios que nadie gestionó, entregas que no calzan con lo pedido. La metodología es el seguro contra eso.

![Ves avances funcionando cada 1 a 2 semanas: eso promete Scrum](/blog/metodologias-stat.png)

## Cascada (waterfall): todo definido, todo al final

**Cómo funciona:** se define TODO al inicio (documento de requisitos), se desarrolla completo y se entrega al final.

**Su lógica:** si nada va a cambiar, es ordenada y predecible.

**Su problema:** en negocios reales, SIEMPRE algo cambia. Y en cascada, cada cambio duele: ya se construyó encima. Además pasas meses sin ver nada funcionando: el riesgo se acumula hasta el final.

**Tiene sentido cuando:** el alcance es pequeño, cerrado y regulado (por ejemplo, un requisito normativo específico).

## Scrum (ágil): entregas cortas, feedback constante

**Cómo funciona:** el proyecto se divide en **sprints** (ciclos de 1-2 semanas). Cada sprint termina con algo **funcionando que puedes probar**. Das feedback, se ajusta el rumbo, y se repite.

**Su lógica:** es imposible saberlo todo al inicio; mejor aprender rápido con software real que discutir documentos.

**Lo que te exige a ti:** participar. Revisar los avances y responder a tiempo. Los mejores proyectos son de clientes que acompañan.

**Tiene sentido cuando:** casi siempre en proyectos de negocio: webs, apps, sistemas internos, automatizaciones.

## Kanban: flujo continuo

**Cómo funciona:** un tablero con columnas (pendiente → en curso → listo) y trabajo fluyendo continuamente, sin ciclos fijos.

**Tiene sentido cuando:** mantención y mejoras continuas de algo que ya existe, más que construcción desde cero.

## Tabla comparativa honesta

| | Cascada | Scrum | Kanban |
|---|---|---|---|
| ¿Cuándo ves avances? | Al final | ✅ Cada 1-2 semanas | Continuo |
| Manejo de cambios | ❌ Caro y lento | ✅ Parte del proceso | ✅ Flexible |
| Riesgo de sorpresa final | Alto | ✅ Bajo | Bajo |
| Exige tu participación | Poca (al inicio) | Media (feedback regular) | Media |
| Ideal para | Alcance cerrado y regulado | Construir productos y sistemas | Mantención y mejoras |

## "¿Cuál es la MEJOR metodología?"

Es de las preguntas más buscadas y la respuesta honesta es: **la mejor es la que te muestra avances reales y gestiona cambios sin drama**. Para construir software de negocio, eso casi siempre es Scrum (o una variante ligera). Pero ojo: más importante que el nombre es que se practique de verdad.

![La metodología de "confía en mí" no es una metodología](/blog/metodologias-quote.png)

## Señales de alerta al contratar

- Dicen "ágil" pero **no te muestran nada funcionando** en semanas: es cascada disfrazada.
- No existe un **canal claro de avances** (demo periódica, acceso a versión de prueba).
- Cada cambio es "imposible" o "cuesta el doble": el proceso no absorbe cambios.
- No te piden feedback nunca: van a construir lo que ELLOS entendieron, no lo que necesitas.

## Qué exigir, en una frase

**Avances funcionando cada 1-2 semanas, cambios conversados por escrito, y acceso a probar lo construido durante el proyecto.** Si tu proveedor acepta eso, el nombre de la metodología es lo de menos.

## Preguntas frecuentes

**¿Cuál es el ciclo de desarrollo de software?** Las etapas de todo proyecto: descubrimiento → diseño → desarrollo → pruebas → despliegue → mantención. Las metodologías definen CÓMO recorrerlas (de una vez o en ciclos).

**¿Scrum sirve para proyectos chicos?** Sí, adaptado: sprints de 1 semana con entregas visibles. La escala cambia; el principio (avances reales + feedback) no.

**¿Y la IA no cambia esto?** La IA acelera la construcción, pero no reemplaza el proceso: exactamente por eso se vuelve más importante ver avances reales seguido.
${guia}${cta}`,
    content_en: `When you're quoting software and the provider says "we work agile", do you know what they're actually promising? Methodology isn't decorative jargon: **it defines how often you see progress, how changes are handled, and how likely the project is to arrive**. This guide explains it without technicalities.

## Why you should care (even if you're not technical)

Because most failed projects don't fail from bad code but from **bad process**: months without showing anything, unmanaged changes, deliveries that don't match what was asked. Methodology is the insurance against that.

![You see working progress every 1-2 weeks: that's Scrum's promise](/blog/metodologias-stat.png)

## Waterfall: everything defined, everything at the end

**How it works:** EVERYTHING is defined upfront (requirements document), built completely, delivered at the end.

**Its logic:** if nothing changes, it's orderly and predictable.

**Its problem:** in real businesses, something ALWAYS changes. In waterfall every change hurts: things were already built on top. And you spend months seeing nothing working: risk piles up until the end.

**Makes sense when:** scope is small, closed and regulated.

## Scrum (agile): short deliveries, constant feedback

**How it works:** the project is split into **sprints** (1-2 week cycles). Each sprint ends with something **working that you can try**. You give feedback, course-correct, repeat.

**What it demands from you:** participation. Review progress and reply on time. The best projects come from clients who engage.

**Makes sense when:** almost always for business projects: websites, apps, internal systems, automations.

## Kanban: continuous flow

**How it works:** a board with columns (pending → in progress → done) and work flowing continuously, no fixed cycles.

**Makes sense when:** maintenance and continuous improvements of something that already exists.

## Honest comparison

| | Waterfall | Scrum | Kanban |
|---|---|---|---|
| When do you see progress? | At the end | ✅ Every 1-2 weeks | Continuous |
| Change management | ❌ Expensive and slow | ✅ Part of the process | ✅ Flexible |
| Risk of final surprise | High | ✅ Low | Low |
| Your involvement | Low (upfront) | Medium (regular feedback) | Medium |
| Ideal for | Closed, regulated scope | Building products and systems | Maintenance and improvements |

## "Which methodology is BEST?"

One of the most-searched questions, and the honest answer: **the best one is whichever shows you real progress and handles change without drama**. For building business software, that's almost always Scrum (or a light variant). But the name matters less than the practice.

![The "trust me" methodology is not a methodology](/blog/metodologias-quote.png)

## Red flags when hiring

- They say "agile" but **show nothing working** for weeks: it's waterfall in disguise.
- There's no **clear progress channel** (periodic demo, access to a test version).
- Every change is "impossible" or "double the price": the process doesn't absorb change.
- They never ask for feedback: they'll build what THEY understood, not what you need.

## What to demand, in one sentence

**Working progress every 1-2 weeks, changes discussed in writing, and access to try what's built during the project.** If your provider accepts that, the methodology's name is secondary.

## FAQ

**What is the software development cycle?** The stages of every project: discovery → design → development → testing → deployment → maintenance. Methodologies define HOW to walk them (all at once or in cycles).

**Does Scrum work for small projects?** Yes, adapted: 1-week sprints with visible deliveries. Scale changes; the principle (real progress + feedback) doesn't.

**Doesn't AI change this?** AI speeds up building, but doesn't replace process: that's exactly why seeing real progress often becomes MORE important.
${guiaEN}${ctaEN}`,
  },
];
