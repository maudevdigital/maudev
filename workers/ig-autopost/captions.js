// Librería de captions on-brand para maudev (rotación automática del Worker).
// Cada entrada: { caption: hook + cuerpo + CTA, tags: hashtags }.
// ¿Se están agotando o quieres más variedad? Pídele a Claude que genere otro lote.

const CTA = "📩 Pedir diagnóstico gratis en maudev.cl";

export const CAPTIONS = [
  {
    caption:
      "Tu web bonita no sirve si no captura clientes.\n\n" +
      "El error #1 de las PYMEs: una página que se ve linda pero no tiene un formulario conectado a ninguna parte. La visita entra, mira y se va… y nunca te enteras de que existió.\n\n" +
      "Una web que vende hace 3 cosas: carga rápido, dice claro qué ofreces, y captura el contacto en tu base. Lo demás es decoración.\n\n" + CTA,
    tags: ["desarrollowebchile", "pymeschile", "landingpage", "marketingdigital", "emprenderchile", "negociosonline", "conversion", "seo", "paginaweb", "transformaciondigital", "emprendimiento", "maudev"],
  },
  {
    caption:
      "Si respondes los mensajes \"cuando puedo\", estás perdiendo ventas.\n\n" +
      "La mayoría de las ventas no se pierden por precio: se pierden por silencio. Un cliente que escribe a las 23:00 y le respondes al otro día ya le escribió a tu competencia.\n\n" +
      "Una automatización simple responde en segundos, califica al lead y te avisa solo cuando vale la pena. Trabaja 24/7 sin sueldo.\n\n" + CTA,
    tags: ["automatizacion", "pymeschile", "whatsappbusiness", "leadgeneration", "ventas", "emprenderchile", "chatbot", "negociosonline", "productividad", "n8n", "emprendimiento", "maudev"],
  },
  {
    caption:
      "\"La IA me hace la app sola\". No.\n\n" +
      "Mito: pides \"hazme una app como Uber\" y aparece lista. Realidad: la IA acelera la construcción, pero la arquitectura, la seguridad y las decisiones de negocio siguen necesitando criterio humano.\n\n" +
      "Una app sin esos cimientos colapsa con el primer cliente real. Por eso un MVP bien hecho es una inversión; mal hecho, es una deuda.\n\n" + CTA,
    tags: ["softwareamedida", "inteligenciaartificial", "desarrollodeapps", "mvp", "startupchile", "tecnologia", "programacion", "emprenderchile", "desarrollodesoftware", "ia", "techchile", "maudev"],
  },
  {
    caption:
      "Si tu negocio vive en planillas de Excel, esto es para ti.\n\n" +
      "Excel es genial para partir. Pero llega un punto en que tienes 5 planillas que deberían ser una, armas el mismo reporte cada mes y decides \"a ojo\".\n\n" +
      "Un dashboard a medida te da una sola fuente de verdad, tus indicadores clave a la vista y acceso por roles. De caos a claridad.\n\n" + CTA,
    tags: ["dashboard", "datos", "pymeschile", "gestionempresarial", "excel", "automatizacion", "negociosonline", "productividad", "businessintelligence", "emprenderchile", "softwareamedida", "maudev"],
  },
  {
    caption:
      "Antes de pagarle a alguien por tu web o software, pregunta esto:\n\n" +
      "1) ¿De quién queda el código? (debe ser tuyo)\n" +
      "2) ¿Hay precio fijo por escrito?\n" +
      "3) ¿Veo avances funcionando o desaparecen 2 meses?\n" +
      "4) ¿Hay soporte después de entregar?\n\n" +
      "Si no te responden claro las 4, cuidado. La transparencia es parte del producto.\n\n" + CTA,
    tags: ["desarrollowebchile", "softwareamedida", "emprenderchile", "pymeschile", "consejos", "negociosonline", "freelance", "tecnologia", "emprendimiento", "transparencia", "programacion", "maudev"],
  },
  {
    caption:
      "Lo barato sale caro (sobre todo en webs).\n\n" +
      "Una web de $50.000 suele venir sin SEO, lenta, y con el código que NO es tuyo. Cuando quieres crecer o cambiar de proveedor, descubres que estás amarrado.\n\n" +
      "Publicamos nuestros precios: landing desde $390.000, automatización desde $290.000. Sin cotizaciones misteriosas, sin letra chica.\n\n" + CTA,
    tags: ["preciosjustos", "desarrollowebchile", "pymeschile", "emprenderchile", "transparencia", "paginaweb", "negociosonline", "marketingdigital", "emprendimiento", "seo", "softwareamedida", "maudev"],
  },
  {
    caption:
      "Tu web tarda 5 segundos en cargar. Ya perdiste la mitad de las visitas.\n\n" +
      "La velocidad no es un lujo técnico: es plata. Cada segundo de carga te cuesta clientes y posiciones en Google.\n\n" +
      "Web rápida = mejor SEO + más conversiones + mejor imagen. Se logra con un stack moderno y código limpio, no con plantillas pesadas llenas de plugins.\n\n" + CTA,
    tags: ["seo", "desarrollowebchile", "velocidadweb", "paginaweb", "marketingdigital", "pymeschile", "google", "conversion", "emprenderchile", "rendimiento", "negociosonline", "maudev"],
  },
  {
    caption:
      "¿El código de tu web es tuyo? Si dudas, probablemente no.\n\n" +
      "Muchos proveedores te \"entregan\" un sitio pero se quedan con el repositorio, el dominio o las credenciales. Resultado: no puedes moverte sin pagarles.\n\n" +
      "En cada proyecto traspasamos repositorio, dominio, hosting y credenciales a tu nombre. Sin lock-in. Es tuyo de verdad.\n\n" + CTA,
    tags: ["softwareamedida", "desarrollowebchile", "emprenderchile", "pymeschile", "tecnologia", "propiedadintelectual", "negociosonline", "programacion", "emprendimiento", "github", "transparencia", "maudev"],
  },
  {
    caption:
      "Vendes en Instagram, pero no tienes dónde convertir. Ahí se cae todo.\n\n" +
      "Las redes te dan visibilidad, pero el algoritmo decide quién te ve. Una landing propia trabaja para ti 24/7 con un solo objetivo: convertir esa atención en clientes.\n\n" +
      "Instagram atrae. La landing cierra. Necesitas las dos.\n\n" + CTA,
    tags: ["landingpage", "instagrammarketing", "marketingdigital", "pymeschile", "emprenderchile", "redessociales", "conversion", "negociosonline", "ventas", "emprendimiento", "desarrollowebchile", "maudev"],
  },
  {
    caption:
      "Cobrar online en Chile ya no es solo Webpay.\n\n" +
      "Hoy puedes recibir pagos con Webpay y Mercado Pago (local), Stripe (tarjetas del mundo) o USDT (clientes en el extranjero, en minutos y con comisiones bajas).\n\n" +
      "La clave no es la moda, es integrar bien: confirmar el pago en el servidor, manejar cada estado y dejar registro. Con plata de por medio, los detalles importan.\n\n" + CTA,
    tags: ["pagosonline", "fintech", "webpay", "stripe", "usdt", "ecommerce", "pymeschile", "emprenderchile", "negociosonline", "stablecoins", "tecnologia", "maudev"],
  },
  {
    caption:
      "No necesitas \"la app completa\". Necesitas un MVP.\n\n" +
      "El error caro: gastar meses y millones en funciones que nadie usa. El MVP es la versión más pequeña que entrega valor real y que puedes hacer crecer.\n\n" +
      "Validas con usuarios reales, aprendes y construyes sobre lo que sí funciona. Empezar chico no es conformarse: es avanzar inteligente.\n\n" + CTA,
    tags: ["mvp", "startupchile", "softwareamedida", "emprenderchile", "desarrollodeapps", "producto", "tecnologia", "emprendimiento", "innovacion", "negociosonline", "programacion", "maudev"],
  },
  {
    caption:
      "Firmar un contrato no es desconfianza. Es profesionalismo.\n\n" +
      "Precio fijo por escrito, hitos con entregas que ves funcionando, código a tu nombre y soporte post-entrega. Todo claro antes de que pagues un peso.\n\n" +
      "Publicamos nuestro modelo de contrato completo en la web, para que lo leas antes de escribirnos. Esa es la idea de trabajar tranquilo.\n\n" + CTA,
    tags: ["emprenderchile", "pymeschile", "softwareamedida", "desarrollowebchile", "transparencia", "negociosonline", "contrato", "confianza", "emprendimiento", "freelance", "tecnologia", "maudev"],
  },
  {
    caption:
      "Plantilla vs software a medida: ¿cuándo conviene cada uno?\n\n" +
      "Si una herramienta existente cubre el 90% de lo que haces, úsala. Pero cuando tu proceso es tu ventaja y ninguna app lo refleja —o pagas 5 suscripciones que no se hablan entre sí— el desarrollo a medida se paga solo.\n\n" +
      "La regla: ordena el proceso primero, automatiza/desarrolla después.\n\n" + CTA,
    tags: ["softwareamedida", "automatizacion", "pymeschile", "emprenderchile", "productividad", "negociosonline", "gestionempresarial", "tecnologia", "emprendimiento", "saas", "programacion", "maudev"],
  },
  {
    caption:
      "Cuando contratas desarrollo, ¿hablas con quien programa o con un intermediario?\n\n" +
      "El teléfono descompuesto cuesta tiempo y errores: tú le explicas a un ejecutivo, el ejecutivo le explica a un dev, y lo que llega no es lo que pediste.\n\n" +
      "Acá hablas directo con quien escribe el código. Menos malentendidos, decisiones más rápidas, mejor resultado.\n\n" + CTA,
    tags: ["desarrollowebchile", "softwareamedida", "emprenderchile", "pymeschile", "freelance", "programacion", "tecnologia", "negociosonline", "emprendimiento", "developer", "techchile", "maudev"],
  },
  {
    caption:
      "5 procesos que casi cualquier PYME puede automatizar hoy:\n\n" +
      "1) Responder y calificar leads\n" +
      "2) Agendar reuniones sin el ida y vuelta\n" +
      "3) Seguimiento post-venta automático\n" +
      "4) Emitir cotizaciones/contratos\n" +
      "5) Reportes que se arman solos\n\n" +
      "No automatices todo: empieza por lo que más se repite y más te duele. Casi siempre es responder leads.\n\n" + CTA,
    tags: ["automatizacion", "pymeschile", "productividad", "emprenderchile", "n8n", "negociosonline", "workflow", "tecnologia", "emprendimiento", "leadgeneration", "ia", "maudev"],
  },

  // ===== Captions enlazados al blog (dirigen al link de la bio → maudev.cl/ig) =====
  {
    caption:
      "La automatización dejó de ser \"si esto, entonces aquello\". En 2026 son agentes de IA que entienden, deciden y ejecutan.\n\n" +
      "En la guía te contamos qué procesos automatizar primero, con qué herramientas y cómo calcular el retorno — con ejemplos para PYMEs en Chile.\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["automatizacion", "inteligenciaartificial", "pymeschile", "ia", "emprenderchile", "n8n", "negociosonline", "transformaciondigital", "productividad", "tecnologia", "agentesdeia", "maudev"],
  },
  {
    caption:
      "\"La IA me hace el software solo\". Sí y no.\n\n" +
      "La IA acelera la construcción, pero la arquitectura y la seguridad siguen necesitando criterio humano. En la guía explicamos cómo se hace software a medida hoy, cuánto cuesta de verdad y cómo evitar el \"software desechable\".\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["softwareamedida", "inteligenciaartificial", "desarrollodesoftware", "mvp", "startupchile", "ia", "tecnologia", "emprenderchile", "programacion", "techchile", "pymeschile", "maudev"],
  },
  {
    caption:
      "Cobrar online en Chile en 2026: pasarelas locales, tarjetas internacionales y stablecoins (USDT) para clientes en el extranjero.\n\n" +
      "¿Cuál te conviene según a quién le vendes? Lo desglosamos en la guía, con la verdad sobre impuestos y cómo integrarlo seguro.\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["pagosonline", "fintech", "webpay", "stripe", "usdt", "stablecoins", "ecommerce", "pymeschile", "emprenderchile", "negociosonline", "chile", "maudev"],
  },
  {
    caption:
      "¿Cuánto cuesta de verdad una página web en Chile en 2026?\n\n" +
      "Publicamos rangos reales y te explicamos por qué lo barato sale caro: sin SEO, lento y con el código que no es tuyo. Decide con información, no con marketing.\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["preciosweb", "desarrollowebchile", "pymeschile", "emprenderchile", "paginaweb", "transparencia", "marketingdigital", "negociosonline", "emprendimiento", "seo", "chile", "maudev"],
  },
  {
    caption:
      "Tu web puede verse linda y aun así ser invisible para Google.\n\n" +
      "Armamos un checklist de SEO técnico (velocidad, indexación, datos estructurados) para que aparezcas cuando te buscan. Práctico y al grano.\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["seo", "seotecnico", "desarrollowebchile", "marketingdigital", "google", "pymeschile", "posicionamientoweb", "emprenderchile", "paginaweb", "negociosonline", "chile", "maudev"],
  },
  {
    caption:
      "Los leads no se pierden por precio: se pierden por silencio.\n\n" +
      "Te mostramos cómo automatizar el seguimiento de leads con n8n + Supabase para responder al instante y no dejar a nadie esperando. Paso a paso.\n\n" +
      "Guía completa en el link de la bio → Blog.\n\n" + CTA,
    tags: ["automatizacion", "n8n", "leadgeneration", "pymeschile", "ventas", "crm", "emprenderchile", "productividad", "negociosonline", "supabase", "nocode", "maudev"],
  },
];
