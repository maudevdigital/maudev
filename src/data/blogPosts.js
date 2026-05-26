// Blog estático de Maudev (bilingüe ES/EN). Sirve como respaldo cuando la tabla
// 'blog_posts' de Supabase está vacía, y permite publicar contenido SEO sin
// depender de la base. Cada post tiene campos ES y su equivalente _en.
// Los componentes usan pick(post, "title"|"excerpt"|"content") según el idioma.

import { t } from "@/lib/i18n";

const AUTHOR = "Equipo Maudev";

export const blogCategories = {
  desarrollo: t("Desarrollo", "Development"),
  automatizacion: t("Automatización", "Automation"),
  fintech: "Fintech",
  marketing: "Marketing",
  tutoriales: t("Tutoriales", "Tutorials"),
};

const cta = `

---

¿Quieres aplicar esto en tu negocio? En **Maudev** desarrollamos webs, software a medida y automatizaciones para PYMEs y emprendedores en Chile y Latinoamérica. [Agenda un diagnóstico gratuito](/contacto).`;

const ctaEN = `

---

Want to apply this to your business? At **Maudev** we build websites, custom software and automations for SMBs and founders in Chile and Latin America. [Book a free consult](/contacto).`;

export const blogPosts = [
  // ===== 20 de mayo =====
  {
    id: "por-que-tu-pyme-necesita-una-landing-page",
    title: "Por qué tu PYME necesita una landing page (y no solo un Instagram)",
    title_en: "Why your small business needs a landing page (not just Instagram)",
    excerpt: "Las redes sociales te dan visibilidad, pero una landing page convierte esa atención en clientes reales. Te explicamos la diferencia.",
    excerpt_en: "Social media gives you reach, but a landing page turns that attention into real customers. Here's the difference.",
    category: "marketing",
    read_time: 5,
    author: AUTHOR,
    tags: ["landing page", "pymes", "conversion"],
    created_date: "2026-05-20T09:00:00-04:00",
    content: `Tener un perfil en Instagram o Facebook está bien para mostrarte, pero **no es tu casa: es tu vitrina en terreno alquilado**. Una landing page propia es donde de verdad conviertes visitas en clientes.

## La diferencia entre visibilidad y conversión

Las redes sociales generan alcance, pero el algoritmo decide quién te ve. Una landing page trabaja para ti 24/7 con un solo objetivo: que el visitante haga una acción concreta.

## Qué hace una buena landing page

- Carga rápido y se ve perfecto en el celular.
- Tiene un mensaje claro y un solo llamado a la acción.
- Captura datos de contacto que quedan en tu base.
- Está optimizada para aparecer en Google (SEO).

## Cuándo te conviene

Si inviertes en publicidad o quieres verte profesional ante un cliente grande, una landing es lo mínimo.${cta}`,
    content_en: `Having an Instagram or Facebook profile is fine to show yourself off, but **it isn't your home: it's a storefront on rented land**. Your own landing page is where you actually turn visits into customers.

## Visibility vs. conversion

Social media generates reach, but the algorithm decides who sees you. A landing page works for you 24/7 with a single goal: getting the visitor to take a concrete action.

## What a good landing page does

- Loads fast and looks perfect on mobile.
- Has a clear message and a single call to action.
- Captures contact data that stays in your database.
- Is optimized to rank on Google (SEO).

## When you need one

If you invest in ads or want to look professional to a big client, a landing page is the minimum.${ctaEN}`,
  },
  {
    id: "meta-ads-para-principiantes",
    title: "Meta Ads para principiantes: cómo no quemar tu presupuesto",
    title_en: "Meta Ads for beginners: how not to burn your budget",
    excerpt: "Antes de poner plata en Facebook e Instagram Ads, asegúrate de tener estos fundamentos. Evita los errores más caros de quienes empiezan.",
    excerpt_en: "Before spending on Facebook and Instagram Ads, get these fundamentals right. Avoid the costliest beginner mistakes.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["meta ads", "publicidad", "leads"],
    created_date: "2026-05-20T12:00:00-04:00",
    content: `Meta Ads puede traer clientes a bajo costo… o convertirse en un agujero negro de plata. La diferencia casi siempre está en lo que pasa **antes** de crear la campaña.

## Primero el destino, después el anuncio

El error más común es mandar el tráfico al perfil de Instagram. Manda siempre a una **landing page** pensada para esa campaña.

## Define una sola acción medible

- Que dejen su correo o WhatsApp.
- Que agenden una reunión.
- Que compren un producto.

## Mide lo que importa

No te enamores de los "me gusta". Mira el **costo por lead** y el **costo por venta**.${cta}`,
    content_en: `Meta Ads can bring customers at a low cost… or become a money black hole. The difference is almost always in what happens **before** you create the campaign.

## Destination first, ad second

The most common mistake is sending traffic to your Instagram profile. Always send it to a **landing page** built for that campaign.

## Define a single measurable action

- Leave their email or WhatsApp.
- Book a meeting.
- Buy a product.

## Measure what matters

Don't fall in love with "likes". Watch your **cost per lead** and **cost per sale**.${ctaEN}`,
  },
  {
    id: "que-es-una-automatizacion",
    title: "Qué es una automatización y cómo te ahorra horas cada semana",
    title_en: "What automation is and how it saves you hours every week",
    excerpt: "Si copias y pegas datos entre planillas, correos y WhatsApp, estás perdiendo horas. Te mostramos qué se puede automatizar y cómo.",
    excerpt_en: "If you copy and paste data between spreadsheets, email and WhatsApp, you're losing hours. Here's what you can automate and how.",
    category: "automatizacion",
    read_time: 5,
    author: AUTHOR,
    tags: ["automatizacion", "productividad", "pymes"],
    created_date: "2026-05-20T16:00:00-04:00",
    content: `Una automatización es simplemente **que el computador haga la tarea repetitiva en lugar de ti**.

## Señales de que necesitas automatizar

- Copias datos de un formulario a una planilla a mano.
- Respondes el mismo mensaje muchas veces al día.
- Te enteras tarde de un lead.

## Ejemplos reales

- Un lead llena tu formulario → entra solo a tu CRM → te llega un aviso.
- Llega un pago → se emite el comprobante automáticamente.

## El retorno

Automatizar una tarea de 10 minutos que haces 5 veces al día son **más de 4 horas a la semana** recuperadas.${cta}`,
    content_en: `Automation simply means **the computer does the repetitive task instead of you**.

## Signs you need to automate

- You copy form data into a spreadsheet by hand.
- You answer the same message many times a day.
- You find out about a lead too late.

## Real examples

- A lead fills your form → it enters your CRM on its own → you get an alert.
- A payment arrives → the receipt is issued automatically.

## The return

Automating a 10-minute task you do 5 times a day is **over 4 hours a week** recovered.${ctaEN}`,
  },

  // ===== 21 de mayo =====
  {
    id: "landing-page-vs-sitio-web",
    title: "Landing page vs sitio web: cuál necesitas según tu negocio",
    title_en: "Landing page vs website: which one your business needs",
    excerpt: "No son lo mismo y no cuestan lo mismo. Esta guía te ayuda a elegir según tu objetivo actual.",
    excerpt_en: "They're not the same and don't cost the same. This guide helps you choose based on your current goal.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["landing page", "sitio web", "desarrollo"],
    created_date: "2026-05-21T09:00:00-04:00",
    content: `"Necesito una página" puede significar dos cosas muy distintas.

## Landing page

Es **una sola página con un objetivo único**: captar leads o vender un producto. Ideal para campañas.

## Sitio web

Son **varias páginas** (inicio, servicios, nosotros, blog, contacto). Sirve para construir presencia y posicionarte en Google.

## Cómo elegir

- ¿Vas a hacer campañas ahora? → Landing page.
- ¿Quieres aparecer en Google y verte como empresa? → Sitio web.${cta}`,
    content_en: `"I need a page" can mean two very different things.

## Landing page

It's **a single page with one goal**: capture leads or sell a product. Ideal for ad campaigns.

## Website

It's **several pages** (home, services, about, blog, contact). It builds presence and helps you rank on Google.

## How to choose

- Running ads now? → Landing page.
- Want to rank on Google and look established? → Website.${ctaEN}`,
  },
  {
    id: "5-procesos-que-toda-pyme-puede-automatizar",
    title: "5 procesos que toda PYME chilena puede automatizar hoy",
    title_en: "5 processes every small business can automate today",
    excerpt: "Ideas concretas y de bajo costo para dejar de hacer a mano lo que el software puede hacer por ti.",
    excerpt_en: "Concrete, low-cost ideas to stop doing by hand what software can do for you.",
    category: "automatizacion",
    read_time: 6,
    author: AUTHOR,
    tags: ["automatizacion", "pymes", "chile"],
    created_date: "2026-05-21T12:00:00-04:00",
    content: `No hace falta un gran presupuesto para automatizar.

## 1. Captura de leads
Que cada formulario llegue a tu CRM con aviso instantáneo.

## 2. Respuestas frecuentes
Un bot de WhatsApp que responda horarios, precios y ubicación.

## 3. Recordatorios de cobro
Detectar facturas vencidas y enviar el recordatorio.

## 4. Reportes automáticos
Un resumen de ventas cada lunes en tu correo.

## 5. Onboarding de clientes
Disparar el correo de bienvenida automáticamente.${cta}`,
    content_en: `You don't need a big budget to automate.

## 1. Lead capture
Every form lands in your CRM with an instant alert.

## 2. Frequent answers
A WhatsApp bot that replies hours, prices and location.

## 3. Payment reminders
Detect overdue invoices and send the reminder.

## 4. Automatic reports
A sales summary every Monday in your inbox.

## 5. Customer onboarding
Trigger the welcome email automatically.${ctaEN}`,
  },
  {
    id: "como-cobrar-en-usdt-legal-desde-chile",
    title: "Cómo cobrar en USDT de forma ordenada desde Chile",
    title_en: "How to get paid in USDT in an orderly way from Chile",
    excerpt: "Cada vez más clientes internacionales pagan en cripto. Te explicamos cómo recibir USDT de forma transparente y ordenada con tu contabilidad.",
    excerpt_en: "More international clients pay in crypto. Here's how to receive USDT transparently and keep your books in order.",
    category: "fintech",
    read_time: 6,
    author: AUTHOR,
    tags: ["usdt", "pagos", "fintech"],
    created_date: "2026-05-21T16:00:00-04:00",
    content: `Si trabajas con clientes fuera de Chile, recibir pagos en **USDT** puede ser rápido y barato.

> Nota: información general, no asesoría tributaria. Consulta a tu contador.

## Por qué USDT
- Transferencias internacionales en minutos.
- Comisiones bajas.
- Paridad estable cercana a 1 USDT ≈ 1 USD.

## Cómo mantenerlo ordenado
- Define en el contrato que el pago será en USDT y en qué red.
- Registra el monto en USD y conviértelo a CLP para tu contabilidad.
- Guarda el comprobante (hash) de cada transacción.${cta}`,
    content_en: `If you work with clients outside Chile, getting paid in **USDT** can be fast and cheap.

> Note: general information, not tax advice. Check with your accountant.

## Why USDT
- International transfers in minutes.
- Low fees.
- Stable parity near 1 USDT ≈ 1 USD.

## How to keep it orderly
- State in the contract that payment is in USDT and on which network.
- Record the amount in USD and convert to CLP for your books.
- Keep the receipt (hash) of each transaction.${ctaEN}`,
  },

  // ===== 22 de mayo =====
  {
    id: "seo-local-en-chile",
    title: "SEO local en Chile: aparece en Google cuando te buscan",
    title_en: "Local SEO: show up on Google when people search for you",
    excerpt: "Tus clientes te buscan en Google con su comuna o ciudad. Estos pasos te ayudan a aparecer primero.",
    excerpt_en: "Your customers search Google with their city or area. These steps help you show up first.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["seo", "google", "local"],
    created_date: "2026-05-22T09:00:00-04:00",
    content: `Cuando alguien busca "diseñador web en Santiago", quieres aparecer ahí. Eso es **SEO local**.

## Lo primero: tu ficha de Google
Crea y completa tu perfil de Google Business: rubro, horario, fotos y reseñas.

## En tu sitio web
- Menciona tu ciudad o comuna en títulos y textos.
- Ten una página de contacto con tu zona de cobertura.

## Reseñas y constancia
Pide reseñas a tus clientes contentos: Google premia la buena reputación.${cta}`,
    content_en: `When someone searches "web designer in Santiago", you want to appear there. That's **local SEO**.

## First: your Google profile
Create and complete your Google Business profile: category, hours, photos and reviews.

## On your website
- Mention your city or area in titles and text.
- Have a contact page with your coverage zone.

## Reviews and consistency
Ask happy customers for reviews: Google rewards good reputation.${ctaEN}`,
  },
  {
    id: "stripe-vs-mercadopago-vs-webpay",
    title: "Stripe vs MercadoPago vs Webpay: cuál conviene para tu web",
    title_en: "Stripe vs MercadoPago vs Webpay: which fits your site",
    excerpt: "Comparamos las tres pasarelas de pago más usadas en Chile para que elijas según tu tipo de cliente.",
    excerpt_en: "We compare the three most-used payment gateways in Chile so you choose by client type.",
    category: "fintech",
    read_time: 7,
    author: AUTHOR,
    tags: ["pagos", "stripe", "mercadopago"],
    created_date: "2026-05-22T12:00:00-04:00",
    content: `Ninguna es "la mejor" en absoluto: depende de a quién le vendes.

## Webpay (Transbank)
El estándar chileno. Ideal si vendes dentro de Chile.

## MercadoPago
Buena cobertura en Latinoamérica y cuotas.

## Stripe
El estándar global para clientes internacionales y suscripciones.

## Cómo decidir
- Solo Chile → Webpay.
- Latinoamérica → MercadoPago.
- Internacional o suscripciones → Stripe.${cta}`,
    content_en: `None is "the best" in absolute terms: it depends on who you sell to.

## Webpay (Transbank)
The Chilean standard. Ideal if you sell within Chile.

## MercadoPago
Good Latin American coverage and installments.

## Stripe
The global standard for international clients and subscriptions.

## How to decide
- Chile only → Webpay.
- Latin America → MercadoPago.
- International or subscriptions → Stripe.${ctaEN}`,
  },
  {
    id: "que-es-un-mvp",
    title: "Qué es un MVP y por qué deberías lanzar uno antes de invertir de más",
    title_en: "What an MVP is and why you should launch one before overspending",
    excerpt: "Antes de construir el producto completo, valida la idea con lo mínimo necesario. Así se ahorra tiempo y plata.",
    excerpt_en: "Before building the full product, validate the idea with the bare minimum. That saves time and money.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["mvp", "producto", "startup"],
    created_date: "2026-05-22T16:00:00-04:00",
    content: `MVP significa **Producto Mínimo Viable**: la versión más simple de tu idea que ya resuelve el problema.

## Por qué empezar por un MVP
- Llegas al mercado en semanas.
- Inviertes poco antes de saber si funciona.
- Aprendes de usuarios reales.

## Qué SÍ lleva
Lo esencial para que el usuario logre su objetivo. Nada más.

## La regla de oro
Si te da un poco de vergüenza la primera versión, saliste a tiempo.${cta}`,
    content_en: `MVP means **Minimum Viable Product**: the simplest version of your idea that already solves the problem.

## Why start with an MVP
- You reach the market in weeks.
- You invest little before knowing if it works.
- You learn from real users.

## What it includes
Only what's essential for the user to reach their goal. Nothing more.

## The golden rule
If the first version slightly embarrasses you, you launched on time.${ctaEN}`,
  },

  // ===== 23 de mayo =====
  {
    id: "chatbots-de-whatsapp",
    title: "Chatbots de WhatsApp: responde a tus clientes 24/7",
    title_en: "WhatsApp chatbots: answer your customers 24/7",
    excerpt: "Un bot bien configurado responde lo repetitivo al instante y deja a las personas para lo importante.",
    excerpt_en: "A well-set-up bot answers the repetitive instantly and frees people for what matters.",
    category: "automatizacion",
    read_time: 5,
    author: AUTHOR,
    tags: ["whatsapp", "chatbot", "automatizacion"],
    created_date: "2026-05-23T09:00:00-04:00",
    content: `WhatsApp es donde tus clientes te escriben. Un chatbot te ayuda a no dejar a nadie esperando.

## Qué puede resolver un bot
- Horarios, ubicación y precios.
- Estado de un pedido.
- Derivar al área correcta o agendar.

## Lo que NO debe hacer
Reemplazar por completo el trato humano. Las consultas importantes llegan a una persona.${cta}`,
    content_en: `WhatsApp is where your customers message you. A chatbot helps you keep no one waiting.

## What a bot can handle
- Hours, location and prices.
- Order status.
- Route to the right area or book a call.

## What it should NOT do
Fully replace the human touch. Important questions reach a person.${ctaEN}`,
  },
  {
    id: "como-escribir-una-landing-que-convierte",
    title: "Cómo escribir una landing que convierte visitas en clientes",
    title_en: "How to write a landing page that turns visits into customers",
    excerpt: "El diseño llama la atención, pero el texto vende. Esta estructura de copy aumenta tus conversiones.",
    excerpt_en: "Design grabs attention, but copy sells. This copy structure boosts your conversions.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["copywriting", "landing page", "conversion"],
    created_date: "2026-05-23T12:00:00-04:00",
    content: `Una landing bonita pero muda no vende. El texto es lo que convence.

## 1. Titular claro
Qué ofreces y para quién, en una frase.

## 2. Problema y solución
Muestra que entiendes el dolor del cliente.

## 3. Beneficios, no características
No digas "usamos React"; di "tu web carga en 2 segundos".

## 4. Prueba social
Testimonios y números reales.

## 5. Un solo llamado a la acción
Repite el mismo botón sin distracciones.${cta}`,
    content_en: `A pretty but mute landing doesn't sell. Copy is what convinces.

## 1. Clear headline
What you offer and for whom, in one sentence.

## 2. Problem and solution
Show you understand the customer's pain.

## 3. Benefits, not features
Don't say "we use React"; say "your site loads in 2 seconds".

## 4. Social proof
Testimonials and real numbers.

## 5. One call to action
Repeat the same button, no distractions.${ctaEN}`,
  },
  {
    id: "react-vite-tailwind-stack-moderno",
    title: "React, Vite y Tailwind: el stack moderno para tu producto",
    title_en: "React, Vite and Tailwind: the modern stack for your product",
    excerpt: "Por qué elegimos estas tecnologías para construir webs y apps rápidas, mantenibles y fáciles de escalar.",
    excerpt_en: "Why we choose these technologies to build fast, maintainable and easy-to-scale sites and apps.",
    category: "tutoriales",
    read_time: 6,
    author: AUTHOR,
    tags: ["react", "vite", "tailwind"],
    created_date: "2026-05-23T16:00:00-04:00",
    content: `Cuando construimos un producto, partimos de un stack moderno y probado.

## React
La librería más usada del mundo para interfaces. Fácil de mantener.

## Vite
Arranca en milisegundos y el sitio final carga rapidísimo.

## Tailwind CSS
Estilos consistentes y responsivos, mobile-first por defecto.

## Por qué importa
Sitios rápidos, código ordenado y que cualquier desarrollador pueda continuar.${cta}`,
    content_en: `When we build a product, we start from a modern, proven stack.

## React
The world's most-used UI library. Easy to maintain.

## Vite
Starts in milliseconds and the final site loads blazing fast.

## Tailwind CSS
Consistent, responsive styles, mobile-first by default.

## Why it matters
Fast sites, clean code, and any developer can continue it.${ctaEN}`,
  },

  // ===== 24 de mayo =====
  {
    id: "de-excel-a-un-dashboard",
    title: "De Excel a un dashboard: ordena los datos de tu negocio",
    title_en: "From Excel to a dashboard: get your business data in order",
    excerpt: "Las planillas se vuelven inmanejables. Un dashboard a medida te da claridad en tiempo real.",
    excerpt_en: "Spreadsheets become unmanageable. A custom dashboard gives you real-time clarity.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["dashboard", "datos", "gestion"],
    created_date: "2026-05-24T09:00:00-04:00",
    content: `Excel es genial para empezar, pero llega un punto en que **las planillas se rompen y se duplican**.

## Síntomas de que necesitas un dashboard
- Tienes varias planillas que deberían ser una.
- Armas el mismo reporte cada mes.
- Decides "a ojo".

## Qué te da
- Una sola fuente de verdad.
- Indicadores clave a la vista.
- Acceso por roles.${cta}`,
    content_en: `Excel is great to start, but at some point **spreadsheets break and duplicate**.

## Signs you need a dashboard
- You have several spreadsheets that should be one.
- You build the same report every month.
- You decide "by gut feel".

## What it gives you
- A single source of truth.
- Key metrics at a glance.
- Role-based access.${ctaEN}`,
  },
  {
    id: "como-medir-tus-meta-ads",
    title: "Cómo medir si tus Meta Ads están funcionando (métricas clave)",
    title_en: "How to measure if your Meta Ads are working (key metrics)",
    excerpt: "Invertir en anuncios sin medir es manejar con los ojos cerrados. Estas son las métricas que sí importan.",
    excerpt_en: "Running ads without measuring is driving blind. These are the metrics that actually matter.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["meta ads", "metricas", "roi"],
    created_date: "2026-05-24T12:00:00-04:00",
    content: `Muchos gastan en Meta Ads sin saber si recuperan la inversión.

## Costo por lead (CPL)
Cuánto te cuesta cada contacto interesado.

## Tasa de conversión
De cada 100 que llegan, cuántos dejan datos.

## Costo por adquisición (CPA)
Cuánto te cuesta cada venta real.

## ROAS
Cuánto vendes por cada peso invertido.

## La base
Nada se mide sin seguimiento bien instalado.${cta}`,
    content_en: `Many spend on Meta Ads without knowing if they recover the investment.

## Cost per lead (CPL)
How much each interested contact costs.

## Conversion rate
Of every 100 who arrive, how many leave their data.

## Cost per acquisition (CPA)
How much each real sale costs.

## ROAS
How much you sell per dollar invested.

## The foundation
Nothing gets measured without proper tracking installed.${ctaEN}`,
  },
  {
    id: "integrar-pagos-en-tu-web",
    title: "Integrar pagos en tu web sin morir en el intento",
    title_en: "Adding payments to your site without losing your mind",
    excerpt: "Cobrar online suena complejo, pero con la arquitectura correcta es seguro y simple. Te explicamos las claves.",
    excerpt_en: "Charging online sounds complex, but with the right architecture it's safe and simple. Here are the keys.",
    category: "fintech",
    read_time: 5,
    author: AUTHOR,
    tags: ["pagos", "ecommerce", "integracion"],
    created_date: "2026-05-24T16:00:00-04:00",
    content: `Cobrar en tu propia web abre ventas 24/7, suscripciones y menos fricción.

## Elige la pasarela según tu cliente
Webpay para Chile, MercadoPago para Latam, Stripe para internacional.

## Seguridad primero
Nunca guardes datos de tarjetas en tu servidor: eso lo maneja la pasarela.

## Automatiza lo que sigue
Cuando entra un pago: emite comprobante, notifica y registra la venta.${cta}`,
    content_en: `Charging on your own site unlocks 24/7 sales, subscriptions and less friction.

## Choose the gateway by client
Webpay for Chile, MercadoPago for Latam, Stripe for international.

## Security first
Never store card data on your server: the gateway handles that.

## Automate what follows
When a payment arrives: issue the receipt, notify and log the sale.${ctaEN}`,
  },

  // ===== 25 de mayo =====
  {
    id: "checklist-seo-tecnico",
    title: "Checklist SEO técnico para tu nueva página web",
    title_en: "Technical SEO checklist for your new website",
    excerpt: "Antes de lanzar, revisa estos puntos para que Google entienda y posicione tu sitio desde el día uno.",
    excerpt_en: "Before launching, check these points so Google understands and ranks your site from day one.",
    category: "tutoriales",
    read_time: 6,
    author: AUTHOR,
    tags: ["seo", "checklist", "web"],
    created_date: "2026-05-25T09:00:00-04:00",
    content: `El SEO técnico es la base sobre la que se construye todo lo demás.

## Velocidad y mobile
- Carga en menos de 3 segundos.
- Se ve perfecto en el celular.

## Etiquetas y estructura
- Cada página con su título y meta description únicos.
- Un solo H1 por página.
- Datos estructurados (schema.org).

## Indexación
- Sitemap.xml en Search Console.
- URLs limpias.
- Imágenes con texto alternativo.${cta}`,
    content_en: `Technical SEO is the foundation everything else is built on.

## Speed and mobile
- Loads in under 3 seconds.
- Looks perfect on mobile.

## Tags and structure
- Each page with a unique title and meta description.
- A single H1 per page.
- Structured data (schema.org).

## Indexing
- Sitemap.xml in Search Console.
- Clean URLs.
- Images with alt text.${ctaEN}`,
  },
  {
    id: "automatiza-seguimiento-de-leads-n8n-supabase",
    title: "Automatiza tu seguimiento de leads con n8n y Supabase",
    title_en: "Automate your lead follow-up with n8n and Supabase",
    excerpt: "Cada lead que no respondes a tiempo es una venta que se enfría. Así se automatiza el seguimiento de punta a punta.",
    excerpt_en: "Every lead you don't answer in time is a sale going cold. Here's how to automate follow-up end to end.",
    category: "automatizacion",
    read_time: 7,
    author: AUTHOR,
    tags: ["n8n", "supabase", "leads"],
    created_date: "2026-05-25T12:00:00-04:00",
    content: `Responder rápido a un lead multiplica tus probabilidades de cerrar.

## La arquitectura
1. El formulario guarda el lead en **Supabase**.
2. **n8n** detecta el nuevo registro y dispara el flujo.
3. Se envía un correo o WhatsApp de bienvenida.
4. Tú recibes una notificación.

## Por qué Supabase
Base de datos moderna y segura; tus datos quedan tuyos.

## Por qué n8n
Conecta todo sin código complejo.${cta}`,
    content_en: `Answering a lead fast multiplies your chances of closing.

## The architecture
1. The form saves the lead in **Supabase**.
2. **n8n** detects the new record and triggers the flow.
3. A welcome email or WhatsApp is sent.
4. You get a notification.

## Why Supabase
A modern, secure database; your data stays yours.

## Why n8n
It connects everything without complex code.${ctaEN}`,
  },
  {
    id: "cuanto-cuesta-una-pagina-web-en-chile-2026",
    title: "Cuánto cuesta una página web en Chile en 2026",
    title_en: "How much a website costs in Chile in 2026",
    excerpt: "Rangos de precios reales según el tipo de proyecto, y por qué lo barato muchas veces sale caro.",
    excerpt_en: "Real price ranges by project type, and why cheap often ends up expensive.",
    category: "desarrollo",
    read_time: 6,
    author: AUTHOR,
    tags: ["precios", "web", "chile"],
    created_date: "2026-05-25T16:00:00-04:00",
    content: `"¿Cuánto cuesta una página web?" es como preguntar cuánto cuesta un auto: depende.

## Landing page
Desde aproximadamente **$390.000 CLP**.

## Sitio web corporativo
Varias páginas y blog; el precio sube según secciones y funciones.

## Software a medida
Se cotiza por proyecto según el roadmap.

## Por qué lo barato sale caro
Una web de $50.000 suele venir sin SEO, lenta y sin que el código sea tuyo.

## Cómo cotizar bien
Pide siempre alcance, plazos y **precio fijo** por escrito.${cta}`,
    content_en: `"How much does a website cost?" is like asking how much a car costs: it depends.

## Landing page
From roughly **CLP $390,000**.

## Corporate website
Several pages and a blog; price rises with sections and features.

## Custom software
Quoted per project based on the roadmap.

## Why cheap ends up expensive
A CLP $50,000 site usually comes without SEO, slow, and the code isn't yours.

## How to quote well
Always ask for scope, timelines and a **fixed price** in writing.${ctaEN}`,
  },
];

export const getBlogPostById = (id) => blogPosts.find((p) => p.id === id);
