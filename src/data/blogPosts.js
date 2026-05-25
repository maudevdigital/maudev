// Blog estático de Maudev. Sirve como respaldo cuando la tabla 'blog_posts' de
// Supabase está vacía, y permite publicar contenido SEO sin depender de la base.
// Cada post: id (slug usado en la URL /blog/:id), title, excerpt, category,
// read_time, author, tags, created_date (ISO) y content en Markdown.

const AUTHOR = "Equipo Maudev";

export const blogCategories = {
  desarrollo: "Desarrollo",
  automatizacion: "Automatización",
  fintech: "Fintech",
  marketing: "Marketing",
  tutoriales: "Tutoriales",
};

const cta = `

---

¿Quieres aplicar esto en tu negocio? En **Maudev** desarrollamos webs, software a medida y automatizaciones para PYMEs y emprendedores en Chile y Latinoamérica. [Agenda un diagnóstico gratuito](/contacto).`;

export const blogPosts = [
  // ===== 20 de mayo =====
  {
    id: "por-que-tu-pyme-necesita-una-landing-page",
    title: "Por qué tu PYME necesita una landing page (y no solo un Instagram)",
    excerpt: "Las redes sociales te dan visibilidad, pero una landing page convierte esa atención en clientes reales. Te explicamos la diferencia.",
    category: "marketing",
    read_time: 5,
    author: AUTHOR,
    tags: ["landing page", "pymes", "conversion"],
    created_date: "2026-05-20T09:00:00-04:00",
    content: `Tener un perfil en Instagram o Facebook está bien para mostrarte, pero **no es tu casa: es tu vitrina en terreno alquilado**. Una landing page propia es donde de verdad conviertes visitas en clientes.

## La diferencia entre visibilidad y conversión

Las redes sociales generan alcance, pero el algoritmo decide quién te ve. Una landing page trabaja para ti 24/7 con un solo objetivo: que el visitante haga una acción concreta (cotizar, agendar o comprar).

## Qué hace una buena landing page

- Carga rápido y se ve perfecto en el celular.
- Tiene un mensaje claro y un solo llamado a la acción.
- Captura datos de contacto que quedan en tu base, no en la de Meta.
- Está optimizada para aparecer en Google (SEO).

## Cuándo te conviene

Si inviertes en publicidad, si vendes un servicio o si quieres verte profesional ante un cliente grande, una landing es lo mínimo. Es la base sobre la que después montas campañas de Meta Ads con datos medibles.${cta}`,
  },
  {
    id: "meta-ads-para-principiantes",
    title: "Meta Ads para principiantes: cómo no quemar tu presupuesto",
    excerpt: "Antes de poner plata en Facebook e Instagram Ads, asegúrate de tener estos fundamentos. Evita los errores más caros de quienes empiezan.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["meta ads", "publicidad", "leads"],
    created_date: "2026-05-20T12:00:00-04:00",
    content: `Meta Ads (Facebook e Instagram) puede traer clientes a bajo costo… o convertirse en un agujero negro de plata. La diferencia casi siempre está en lo que pasa **antes** de crear la campaña.

## Primero el destino, después el anuncio

El error más común es mandar el tráfico al perfil de Instagram o a un WhatsApp sin contexto. Manda siempre a una **landing page** pensada para esa campaña, con un mensaje alineado al anuncio.

## Define una sola acción medible

- Quiero que dejen su correo o WhatsApp.
- Quiero que agenden una reunión.
- Quiero que compren un producto.

Una campaña con un objetivo claro es medible; una sin objetivo solo gasta.

## Mide lo que importa

No te enamores de los "me gusta". Mira el **costo por lead** y el **costo por venta**. Si no tienes cómo medir esos números, instala primero el seguimiento (Meta Pixel y eventos) y deja todo conectado a tu base de datos.${cta}`,
  },
  {
    id: "que-es-una-automatizacion",
    title: "Qué es una automatización y cómo te ahorra horas cada semana",
    excerpt: "Si copias y pegas datos entre planillas, correos y WhatsApp, estás perdiendo horas. Te mostramos qué se puede automatizar y cómo.",
    category: "automatizacion",
    read_time: 5,
    author: AUTHOR,
    tags: ["automatizacion", "productividad", "pymes"],
    created_date: "2026-05-20T16:00:00-04:00",
    content: `Una automatización es simplemente **que el computador haga la tarea repetitiva en lugar de ti**. No necesitas ser una empresa grande para aprovecharla.

## Señales de que necesitas automatizar

- Copias datos de un formulario a una planilla a mano.
- Respondes el mismo mensaje muchas veces al día.
- Te enteras tarde de un lead porque revisas el correo cuando puedes.

## Ejemplos reales

- Un lead llena tu formulario → entra solo a tu planilla o CRM → te llega un aviso al instante.
- Llega un pago → se emite el comprobante y se notifica al cliente automáticamente.
- Un cliente escribe por WhatsApp fuera de horario → recibe una respuesta automática con opciones.

## El retorno

Automatizar una tarea de 10 minutos que haces 5 veces al día son **más de 4 horas a la semana** recuperadas. Ese es tiempo para vender, no para copiar y pegar.${cta}`,
  },

  // ===== 21 de mayo =====
  {
    id: "landing-page-vs-sitio-web",
    title: "Landing page vs sitio web: cuál necesitas según tu negocio",
    excerpt: "No son lo mismo y no cuestan lo mismo. Esta guía te ayuda a elegir según tu objetivo actual.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["landing page", "sitio web", "desarrollo"],
    created_date: "2026-05-21T09:00:00-04:00",
    content: `"Necesito una página" puede significar dos cosas muy distintas. Aclararlo te ahorra plata y tiempo.

## Landing page

Es **una sola página con un objetivo único**: captar leads o vender un producto. Ideal para campañas de publicidad, lanzamientos o validar una idea rápido.

## Sitio web

Son **varias páginas** (inicio, servicios, nosotros, blog, contacto). Sirve para construir presencia, posicionarte en Google a largo plazo y mostrar todo tu negocio.

## Cómo elegir

- ¿Vas a hacer campañas de Meta o Google Ads ahora? → Landing page.
- ¿Quieres aparecer en Google cuando te buscan y verte como empresa establecida? → Sitio web.
- ¿Ambas? Empieza por la landing y crece hacia el sitio.

Lo importante es no pagar por un sitio de 8 páginas cuando lo que necesitas hoy es una landing que convierta.${cta}`,
  },
  {
    id: "5-procesos-que-toda-pyme-puede-automatizar",
    title: "5 procesos que toda PYME chilena puede automatizar hoy",
    excerpt: "Ideas concretas y de bajo costo para dejar de hacer a mano lo que el software puede hacer por ti.",
    category: "automatizacion",
    read_time: 6,
    author: AUTHOR,
    tags: ["automatizacion", "pymes", "chile"],
    created_date: "2026-05-21T12:00:00-04:00",
    content: `No hace falta un gran presupuesto para automatizar. Aquí van cinco procesos que casi cualquier PYME puede dejar funcionando solo.

## 1. Captura de leads

Que cada formulario llegue automáticamente a tu base de datos o CRM, con aviso instantáneo a tu correo o WhatsApp.

## 2. Respuestas frecuentes

Un bot de WhatsApp que responda horarios, precios y ubicación sin que muevas un dedo.

## 3. Recordatorios de cobro

Detectar facturas vencidas y enviar el recordatorio con el tono adecuado según el cliente.

## 4. Reportes automáticos

Recibir cada lunes un resumen de ventas y leads de la semana en tu correo.

## 5. Onboarding de clientes

Cuando alguien compra o contrata, disparar automáticamente el correo de bienvenida y los siguientes pasos.

Cada una de estas se conecta con herramientas que probablemente ya usas (correo, planillas, WhatsApp).${cta}`,
  },
  {
    id: "como-cobrar-en-usdt-legal-desde-chile",
    title: "Cómo cobrar en USDT de forma ordenada desde Chile",
    excerpt: "Cada vez más clientes internacionales pagan en cripto. Te explicamos cómo recibir USDT de forma transparente y ordenada con tu contabilidad.",
    category: "fintech",
    read_time: 6,
    author: AUTHOR,
    tags: ["usdt", "pagos", "fintech"],
    created_date: "2026-05-21T16:00:00-04:00",
    content: `Si trabajas con clientes fuera de Chile, recibir pagos en **USDT** (una stablecoin atada al dólar) puede ser rápido y barato. Lo importante es hacerlo ordenado.

> Nota: esto es información general, no asesoría tributaria. Consulta a tu contador para tu caso.

## Por qué USDT

- Transferencias internacionales en minutos, sin esperar días.
- Comisiones bajas comparadas con la banca tradicional.
- Paridad estable cercana a 1 USDT ≈ 1 USD.

## Cómo mantenerlo ordenado

- Define en tu cotización y contrato que el pago será en USDT y en qué red.
- Registra el monto en USD y conviértelo a CLP al tipo de cambio del día para tu contabilidad.
- Guarda el comprobante de cada transacción (hash) como respaldo.

## En la práctica

En Maudev aceptamos pagos en CLP, USD y USDT según el país del cliente, y dejamos todo documentado en el contrato para que ambas partes estén tranquilas.${cta}`,
  },

  // ===== 22 de mayo =====
  {
    id: "seo-local-en-chile",
    title: "SEO local en Chile: aparece en Google cuando te buscan",
    excerpt: "Tus clientes te buscan en Google con su comuna o ciudad. Estos pasos te ayudan a aparecer primero.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["seo", "google", "local"],
    created_date: "2026-05-22T09:00:00-04:00",
    content: `Cuando alguien busca "diseñador web en Santiago" o "repuestos en Concepción", quieres aparecer ahí. Eso es **SEO local**.

## Lo primero: tu ficha de Google

Crea y completa tu perfil de Google Business: rubro, horario, fotos y reseñas. Es gratis y es lo que más mueve la aguja a nivel local.

## En tu sitio web

- Menciona tu ciudad o comuna en títulos y textos.
- Ten una página de contacto con tu zona de cobertura.
- Asegúrate de que cargue rápido en celular.

## Reseñas y constancia

Pide reseñas a tus clientes contentos: Google premia los negocios con buena reputación. El SEO local no es magia instantánea, pero es de las inversiones con mejor retorno para una PYME.${cta}`,
  },
  {
    id: "stripe-vs-mercadopago-vs-webpay",
    title: "Stripe vs MercadoPago vs Webpay: cuál conviene para tu web",
    excerpt: "Comparamos las tres pasarelas de pago más usadas en Chile para que elijas según tu tipo de cliente.",
    category: "fintech",
    read_time: 7,
    author: AUTHOR,
    tags: ["pagos", "stripe", "mercadopago"],
    created_date: "2026-05-22T12:00:00-04:00",
    content: `Cobrar online en Chile tiene varias opciones. Ninguna es "la mejor" en absoluto: depende de a quién le vendes.

## Webpay (Transbank)

El estándar chileno. Tus clientes pagan con tarjetas locales y confían en el logo. Ideal si vendes principalmente dentro de Chile.

## MercadoPago

Buena cobertura en Chile y Latinoamérica, cuotas y billetera propia. Útil si tu público ya usa MercadoLibre/MercadoPago.

## Stripe

El estándar global para clientes internacionales y suscripciones. Excelente experiencia de desarrollador, ideal para SaaS y cobros recurrentes.

## Cómo decidir

- Vendes solo en Chile → Webpay (o MercadoPago).
- Vendes a Latinoamérica → MercadoPago.
- Cobras a clientes internacionales o suscripciones → Stripe.

Y si necesitas flexibilidad total, se pueden integrar varias a la vez.${cta}`,
  },
  {
    id: "que-es-un-mvp",
    title: "Qué es un MVP y por qué deberías lanzar uno antes de invertir de más",
    excerpt: "Antes de construir el producto completo, valida la idea con lo mínimo necesario. Así se ahorra tiempo y plata.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["mvp", "producto", "startup"],
    created_date: "2026-05-22T16:00:00-04:00",
    content: `MVP significa **Producto Mínimo Viable**: la versión más simple de tu idea que ya resuelve el problema y se puede usar de verdad.

## Por qué empezar por un MVP

- Llegas al mercado en semanas, no en meses.
- Inviertes poco antes de saber si la idea funciona.
- Aprendes de usuarios reales en vez de suponer.

## Qué SÍ lleva un MVP

Lo esencial para que el usuario logre su objetivo principal. Nada más.

## Qué NO lleva todavía

Funciones "bonitas", casos borde y pantallas que nadie ha pedido aún. Eso viene después, con datos en la mano.

## La regla de oro

Si te da un poco de vergüenza la primera versión, probablemente saliste a tiempo. Lanzar y mejorar es mejor que perfeccionar en silencio.${cta}`,
  },

  // ===== 23 de mayo =====
  {
    id: "chatbots-de-whatsapp",
    title: "Chatbots de WhatsApp: responde a tus clientes 24/7",
    excerpt: "Un bot bien configurado responde lo repetitivo al instante y deja a las personas para lo importante.",
    category: "automatizacion",
    read_time: 5,
    author: AUTHOR,
    tags: ["whatsapp", "chatbot", "automatizacion"],
    created_date: "2026-05-23T09:00:00-04:00",
    content: `WhatsApp es donde tus clientes te escriben. Un chatbot te ayuda a no dejar a nadie esperando, incluso fuera de horario.

## Qué puede resolver un bot

- Horarios, ubicación y precios.
- Estado de un pedido.
- Derivar al área correcta o agendar una llamada.

## Lo que NO debe hacer

Reemplazar por completo el trato humano. El bot resuelve lo repetitivo; las consultas importantes llegan a una persona con contexto.

## El resultado

Respuestas instantáneas, clientes más contentos y tu equipo enfocado en lo que de verdad necesita criterio. Bien hecho, un bot paga su inversión en pocas semanas.${cta}`,
  },
  {
    id: "como-escribir-una-landing-que-convierte",
    title: "Cómo escribir una landing que convierte visitas en clientes",
    excerpt: "El diseño llama la atención, pero el texto vende. Esta estructura de copy aumenta tus conversiones.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["copywriting", "landing page", "conversion"],
    created_date: "2026-05-23T12:00:00-04:00",
    content: `Una landing bonita pero muda no vende. El texto (copy) es lo que convence. Usa esta estructura probada.

## 1. Titular claro

En una frase: qué ofreces y para quién. Nada de frases creativas que nadie entiende.

## 2. El problema y la solución

Muestra que entiendes el dolor del cliente y cómo lo resuelves.

## 3. Beneficios, no características

No digas "usamos React"; di "tu web carga en menos de 2 segundos".

## 4. Prueba social

Testimonios, logos o números reales que generen confianza.

## 5. Un solo llamado a la acción

Repite el mismo botón a lo largo de la página: "Agenda tu diagnóstico". Sin distracciones.${cta}`,
  },
  {
    id: "react-vite-tailwind-stack-moderno",
    title: "React, Vite y Tailwind: el stack moderno para tu producto",
    excerpt: "Por qué elegimos estas tecnologías para construir webs y apps rápidas, mantenibles y fáciles de escalar.",
    category: "tutoriales",
    read_time: 6,
    author: AUTHOR,
    tags: ["react", "vite", "tailwind"],
    created_date: "2026-05-23T16:00:00-04:00",
    content: `Cuando construimos un producto en Maudev, partimos de un stack moderno y probado. Te contamos por qué.

## React

La librería más usada del mundo para interfaces. Enorme comunidad, mucha documentación y fácil de mantener por cualquier equipo.

## Vite

La herramienta de build: arranca en milisegundos y el sitio final carga rapidísimo. Mejor experiencia para quien desarrolla y para quien visita.

## Tailwind CSS

Estilos consistentes y responsivos sin pelear con hojas de estilo gigantes. Diseño mobile-first por defecto.

## Por qué importa para ti

No es por moda: este stack significa **sitios rápidos, código ordenado y que cualquier desarrollador pueda continuar el proyecto**. No quedas amarrado a nadie.${cta}`,
  },

  // ===== 24 de mayo =====
  {
    id: "de-excel-a-un-dashboard",
    title: "De Excel a un dashboard: ordena los datos de tu negocio",
    excerpt: "Las planillas se vuelven inmanejables. Un dashboard a medida te da claridad en tiempo real.",
    category: "desarrollo",
    read_time: 5,
    author: AUTHOR,
    tags: ["dashboard", "datos", "gestion"],
    created_date: "2026-05-24T09:00:00-04:00",
    content: `Excel es genial para empezar, pero llega un punto en que **las planillas se rompen, se duplican y nadie sabe cuál es la versión buena**. Ahí entra un dashboard a medida.

## Síntomas de que necesitas un dashboard

- Tienes varias planillas que deberían ser una.
- Pierdes tiempo armando el mismo reporte cada mes.
- Las decisiones se toman "a ojo" porque los datos están desordenados.

## Qué te da un dashboard

- Una sola fuente de verdad, siempre actualizada.
- Indicadores clave a la vista (ventas, leads, cobros).
- Acceso por roles: cada quien ve lo que le corresponde.

## El cambio

Pasas de "buscar el dato" a "ver el dato". Eso acelera decisiones y reduce errores caros.${cta}`,
  },
  {
    id: "como-medir-tus-meta-ads",
    title: "Cómo medir si tus Meta Ads están funcionando (métricas clave)",
    excerpt: "Invertir en anuncios sin medir es manejar con los ojos cerrados. Estas son las métricas que sí importan.",
    category: "marketing",
    read_time: 6,
    author: AUTHOR,
    tags: ["meta ads", "metricas", "roi"],
    created_date: "2026-05-24T12:00:00-04:00",
    content: `Muchos negocios gastan en Meta Ads sin saber si recuperan la inversión. Estas son las métricas que de verdad importan.

## Costo por lead (CPL)

Cuánto te cuesta cada contacto interesado. Te dice si la campaña es sostenible.

## Tasa de conversión

De cada 100 que llegan a tu landing, cuántos dejan sus datos. Si es baja, el problema suele estar en la página, no en el anuncio.

## Costo por adquisición (CPA)

Cuánto te cuesta cada venta real. Es el número que conecta la publicidad con la plata.

## ROAS

Cuánto vendes por cada peso invertido. Si gastas $1 y vendes $4, vas bien.

## La base de todo

Nada de esto se puede medir sin seguimiento bien instalado (Meta Pixel + eventos) y los leads cayendo en tu base de datos.${cta}`,
  },
  {
    id: "integrar-pagos-en-tu-web",
    title: "Integrar pagos en tu web sin morir en el intento",
    excerpt: "Cobrar online suena complejo, pero con la arquitectura correcta es seguro y simple. Te explicamos las claves.",
    category: "fintech",
    read_time: 5,
    author: AUTHOR,
    tags: ["pagos", "ecommerce", "integracion"],
    created_date: "2026-05-24T16:00:00-04:00",
    content: `Cobrar en tu propia web abre un mundo de posibilidades: ventas 24/7, suscripciones y menos fricción. Estas son las claves para hacerlo bien.

## Elige la pasarela según tu cliente

Webpay para Chile, MercadoPago para Latam, Stripe para internacional y suscripciones. (Lo vimos en detalle en otro artículo.)

## Seguridad primero

Nunca guardes datos de tarjetas en tu servidor: eso lo maneja la pasarela. Tú solo recibes la confirmación del pago.

## Automatiza lo que sigue

Cuando entra un pago: emite el comprobante, notifica al cliente y registra la venta en tu sistema. Todo automático.

## El detalle que importa

Una buena integración maneja también los casos de error: pagos rechazados, reintentos y reembolsos. Ahí se nota el trabajo bien hecho.${cta}`,
  },

  // ===== 25 de mayo =====
  {
    id: "checklist-seo-tecnico",
    title: "Checklist SEO técnico para tu nueva página web",
    excerpt: "Antes de lanzar, revisa estos puntos para que Google entienda y posicione tu sitio desde el día uno.",
    category: "tutoriales",
    read_time: 6,
    author: AUTHOR,
    tags: ["seo", "checklist", "web"],
    created_date: "2026-05-25T09:00:00-04:00",
    content: `El SEO técnico es la base sobre la que se construye todo lo demás. Revisa esta lista antes de publicar.

## Velocidad y mobile

- Carga en menos de 3 segundos.
- Se ve perfecto en el celular (mobile-first).

## Etiquetas y estructura

- Cada página con su \`title\` y \`meta description\` únicos.
- Un solo \`H1\` por página y jerarquía de encabezados clara.
- Datos estructurados (schema.org) para que Google entienda tu negocio.

## Indexación

- Sitemap.xml enviado a Google Search Console.
- URLs limpias y legibles.
- Imágenes con texto alternativo (alt).

## El resultado

Un sitio técnicamente sano posiciona más rápido y te ahorra dolores de cabeza después. Es trabajo invisible para el visitante, pero Google lo nota.${cta}`,
  },
  {
    id: "automatiza-seguimiento-de-leads-n8n-supabase",
    title: "Automatiza tu seguimiento de leads con n8n y Supabase",
    excerpt: "Cada lead que no respondes a tiempo es una venta que se enfría. Así se automatiza el seguimiento de punta a punta.",
    category: "automatizacion",
    read_time: 7,
    author: AUTHOR,
    tags: ["n8n", "supabase", "leads"],
    created_date: "2026-05-25T12:00:00-04:00",
    content: `Responder rápido a un lead multiplica tus probabilidades de cerrar. La buena noticia: ese seguimiento se puede automatizar.

## La arquitectura

1. El formulario de tu web guarda el lead en **Supabase** (tu base de datos).
2. **n8n** detecta el nuevo registro y dispara el flujo.
3. Se envía un correo o WhatsApp de bienvenida al instante.
4. Tú recibes una notificación con los datos del lead.

## Por qué Supabase

Es una base de datos moderna, segura y con reglas de acceso por fila. Tus datos quedan tuyos, no atrapados en una herramienta de marketing.

## Por qué n8n

Es una herramienta de automatización que conecta todo sin código complejo y puede correr en tu propia infraestructura.

## El impacto

Pasas de "responder cuando puedo" a "responder en segundos, siempre". Eso se traduce directamente en más ventas.${cta}`,
  },
  {
    id: "cuanto-cuesta-una-pagina-web-en-chile-2026",
    title: "Cuánto cuesta una página web en Chile en 2026",
    excerpt: "Rangos de precios reales según el tipo de proyecto, y por qué lo barato muchas veces sale caro.",
    category: "desarrollo",
    read_time: 6,
    author: AUTHOR,
    tags: ["precios", "web", "chile"],
    created_date: "2026-05-25T16:00:00-04:00",
    content: `"¿Cuánto cuesta una página web?" es como preguntar cuánto cuesta un auto: depende. Pero podemos darte rangos reales para Chile en 2026.

## Landing page

Desde aproximadamente **$390.000 CLP**. Una página enfocada en convertir, con SEO básico y formulario conectado.

## Sitio web corporativo

Varias páginas, blog y administrador de contenido. El precio sube según la cantidad de secciones y funciones.

## Software a medida

Dashboards, plataformas o sistemas internos: se cotiza por proyecto según el alcance del roadmap.

## Por qué lo barato sale caro

Una web de $50.000 suele venir sin SEO, lenta, sin soporte y sin que el código sea tuyo. Terminas pagando dos veces: la primera y la que arregla la primera.

## Cómo cotizar bien

Pide siempre una propuesta con alcance, plazos y **precio fijo** por escrito. En Maudev lo entregamos antes de empezar, sin sorpresas.${cta}`,
  },
];

export const getBlogPostById = (id) => blogPosts.find((p) => p.id === id);
