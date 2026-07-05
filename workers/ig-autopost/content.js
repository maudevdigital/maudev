// Contenido EMPAREJADO: cada pieza lleva su video/carrusel + su descripción
// coherente + hashtags SEO + CTA "Comenta GUÍA" (dispara el DM automático de
// Meta). liCaption = versión LinkedIn (sin comenta-GUÍA: ahí el CTA es link).
//
// REGLA: NUNCA se repite contenido. El worker consume estas piezas como COLAS
// (reels → Instagram 2/día; carruseles → FB+LinkedIn 1/día) marcando cada id
// como publicado en KV. Cola vacía = no publica + aviso por Telegram.
// Temas y keywords validados con AnswerThePublic (Google Chile).

const TAGS = "#desarrollodesoftware #softwareamedida #pymeschile";
const GUIA = "💬 Comenta GUÍA y te enviamos GRATIS al privado nuestra guía para decidir bien tu software 👇";
const LI_GUIA = "📘 Guía gratis para decidir bien tu software (precios reales, cómo elegir y qué exigir): https://maudev.cl/guia";
const S = "https://maudev.cl/social";

const cw2 = (id) => Array.from({ length: 7 }, (_, i) => `${S}/cw2-${id}-${i + 1}.png`);

export const CONTENT = [
  // 0 · reel (IG franja 0 — lunes 6)
  {
    id: "pro-plazos-semana", kind: "reel", media: `${S}/pro-plazos-semana.mp4`, blog: "metodologias-desarrollo-software-2026",
    caption: `🚩 ¿Te prometen un sistema serio "para la otra semana"? Desconfía.

El software bien hecho toma tiempo. Los atajos (saltarse pruebas, seguridad, diseño) se pagan caro después. Mejor bien hecho que rápido y mal.

${GUIA}

${TAGS} #plazos #consejospymes`,
    liCaption: `¿Te prometen un sistema serio "para la otra semana"? Desconfía.

El software bien hecho toma tiempo: un MVP, semanas; un sistema mediano, meses. Los atajos se pagan caro después.

${LI_GUIA}

${TAGS} #plazos`,
  },
  // 1 · CARRUSEL IA (franja 1 — lunes 6: FB + LinkedIn)
  {
    id: "cw2-ia", kind: "carousel", media: cw2("ia"), blog: "chatbot-ia-whatsapp-pymes-2026",
    caption: `🤖 Tu página web puede trabajar sola las 24 horas.

5 usos REALES de IA para un negocio (sin humo): chatbot que califica clientes, respuestas automáticas, agendamiento solo, seguimientos y bandeja ordenada. Y también lo que NO deberías esperar de la IA.

Desliza 👉

${GUIA}

${TAGS} #ia #chatbot #automatizacion #paginaweb`,
    liCaption: `Tu página web puede trabajar sola las 24 horas.

5 usos reales de IA para un negocio, sin humo: chatbot que responde y califica clientes, respuestas automáticas a preguntas frecuentes, agendamiento automático, seguimiento de leads fríos y clasificación de mensajes. En la última lámina: lo que NO deberías esperar de la IA (honestidad ante todo).

${LI_GUIA}

${TAGS} #inteligenciaartificial #chatbot #automatizacion`,
  },
  // 2 · reel (IG franja 2 — lunes 6)
  {
    id: "pro-valor-real", kind: "reel", media: `${S}/pro-valor-real.mp4`, blog: "integraciones-software-valor-2026",
    caption: `🔗 El valor de tu software NO está en las pantallas bonitas.

Está en que tus herramientas se hablen entre sí. Sin integraciones, tu equipo copia y pega todo el día; con integraciones, la información fluye sola.

${GUIA}

${TAGS} #integraciones #automatizacion`,
    liCaption: `El valor de tu software no está en las pantallas bonitas: está en que tus herramientas se hablen entre sí.

Sin integraciones, tu equipo copia y pega datos todo el día. Con integraciones, la información fluye sola y el equipo se dedica a vender.

${LI_GUIA}

${TAGS} #integraciones`,
  },
  // 3 · reel (IG franja 0 — martes 7)
  {
    id: "pro-3-preguntas", kind: "reel", media: `${S}/pro-3-preguntas.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `🔍 Antes de pagarle a alguien por tu software, pregunta 3 cosas:

1️⃣ ¿De quién queda el código?
2️⃣ ¿Hay precio y alcance por escrito?
3️⃣ ¿Voy a ver avances funcionando?

Si las evade, corre.

${GUIA}

${TAGS} #comocontratar #consejospymes`,
    liCaption: `Antes de pagar por un desarrollo de software, tres preguntas filtran a los buenos proveedores:

1. ¿De quién queda el código? (Respuesta correcta: tuyo.)
2. ¿Hay precio y alcance por escrito?
3. ¿Voy a ver avances funcionando durante el proyecto?

Si las evaden, sigue buscando.

${LI_GUIA}

${TAGS} #comocontratar`,
  },
  // 4 · CARRUSEL TIENDA ONLINE (franja 1 — martes 7)
  {
    id: "cw2-tienda", kind: "carousel", media: cw2("tienda"), blog: "cuanto-cuesta-pagina-web-carrito-compras-2026",
    caption: `🛒 ¿Cuánto cuesta una página web con carrito de compras en Chile?

Precios reales 2026: plantilla vs a medida, la comisión de la pasarela que paga cualquier opción, y los costos que nadie te cotiza (fotos, dominio, mantención).

Desliza 👉

${GUIA}

${TAGS} #ecommerce #tiendaonline #carritodecompras #webpay`,
    liCaption: `¿Cuánto cuesta una tienda online en Chile? Números reales (2026):

· Plantilla (Shopify y similares): $0-300.000 de configuración + suscripción mensual para siempre.
· A medida: desde $700.000 una vez, costo mensual mínimo y el código queda del cliente.
· Con cualquier opción: la pasarela (Webpay/MercadoPago) cobra 1,5-3,5% por venta.

El detalle que cambia la decisión: la cuenta a 3 años. En el carrusel está completa.

${LI_GUIA}

${TAGS} #ecommerce #tiendaonline`,
  },
  // 5 · reel (IG franja 2 — martes 7)
  {
    id: "pro-cuanto-demora", kind: "reel", media: `${S}/pro-cuanto-demora.mp4`, blog: "metodologias-desarrollo-software-2026",
    caption: `⏱️ ¿Cuánto DEBE demorar un software de verdad?

Un MVP: semanas. Un sistema mediano: meses. ¿Te prometen todo en días? O es una plantilla, o te van a cobrar de más después.

${GUIA}

${TAGS} #mvp #plazos #desarrolloweb`,
    liCaption: `¿Cuánto debe demorar un software de verdad?

Un MVP: semanas. Un sistema mediano: meses. Las promesas de "todo en días" suelen esconder una plantilla o cobros extra a mitad de camino.

${LI_GUIA}

${TAGS} #mvp #plazos`,
  },
  // 6 · reel (IG franja 0 — miércoles 8)
  {
    id: "pro-codigo-nombre", kind: "reel", media: `${S}/pro-codigo-nombre.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `🏃 La pregunta que espanta a los malos proveedores:

"¿El código queda a MI nombre?"

Si dudan, es tu señal para salir corriendo. El código es tuyo. Siempre.

${GUIA}

${TAGS} #comocontratar #software`,
    liCaption: `Hay una pregunta que espanta a los malos proveedores de software: "¿el código queda a mi nombre?".

Si la respuesta no es un sí inmediato y por escrito, no estás comprando un activo: estás arrendando una dependencia.

${LI_GUIA}

${TAGS} #comocontratar`,
  },
  // 7 · CARRUSEL WIX (franja 1 — miércoles 8)
  {
    id: "cw2-wix", kind: "carousel", media: cw2("wix"), blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `⚖️ ¿Wix o página web a medida? La comparación honesta.

590 personas buscan "página web wix" cada mes en Chile y casi nadie les cuenta esto: cuándo Wix ES la opción correcta, y cuándo te va a quedar chico (con la cuenta a 3 años).

Desliza 👉

${GUIA}

${TAGS} #wix #paginaweb #desarrolloweb`,
    liCaption: `¿Wix o página web a medida? Comparación sin caricaturas.

Wix es la opción CORRECTA para validar una idea o tener presencia esta semana. Pero hay una diferencia de fondo que pocos cuentan: con Wix arriendas tu página (si dejas de pagar, desaparece; si migras, partes de cero). A medida, el código y el dominio quedan a tu nombre.

La cuenta que importa es a 3 años: 36 meses de plan + apps vs un proyecto único. El detalle, en el carrusel.

${LI_GUIA}

${TAGS} #paginaweb #desarrolloweb`,
  },
  // 8 · reel (IG franja 2 — miércoles 8)
  {
    id: "pro-senales-estafa", kind: "reel", media: `${S}/pro-senales-estafa.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `⚠️ Señales de que te van a estafar con tu software:

Te cotizan sin entender tu negocio. No muestran avances hasta el final. Precio sospechosamente bajo.

Si ves esto, huye.

${GUIA}

${TAGS} #alerta #comocontratar`,
    liCaption: `Señales de alerta al contratar desarrollo de software:

· Te cotizan sin entender tu negocio.
· No muestran avances hasta el final.
· Precio sospechosamente bajo.
· Evaden decir de quién queda el código.

Con dos de estas, sigue buscando.

${LI_GUIA}

${TAGS} #comocontratar`,
  },
  // 9 · reel (IG franja 0 — jueves 9)
  {
    id: "pro-hechos", kind: "reel", media: `${S}/pro-hechos.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `✅ No creas en promesas. Cree en cosas funcionando.

Pide ver proyectos reales (no capturas). Habla con quien programa, no solo con un vendedor. Los hechos no mienten.

${GUIA}

${TAGS} #consejospymes #desarrolloweb`,
    liCaption: `Al evaluar un proveedor de software: no creas en promesas, cree en cosas funcionando.

Pide ver proyectos reales en producción (no capturas) y habla directamente con quien programa, no solo con un vendedor.

${LI_GUIA}

${TAGS} #consejospymes`,
  },
  // 10 · CARRUSEL METODOLOGÍA (franja 1 — jueves 9)
  {
    id: "cw2-metodo", kind: "carousel", media: cw2("metodo"), blog: "metodologias-desarrollo-software-2026",
    caption: `📋 ¿Cómo saber si tu proveedor de software trabaja bien?

La metodología importa más que el precio: qué exigir (avances funcionando cada 1-2 semanas, cambios por escrito) y las señales de que es "cascada disfrazada".

Desliza 👉

${GUIA}

${TAGS} #scrum #metodologias #gestiondeproyectos`,
    liCaption: `Los proyectos de software no mueren por código malo: mueren por proceso malo.

Qué exigirle a tu proveedor (se llama Scrum): avances FUNCIONANDO cada 1-2 semanas, cambios conversados por escrito y acceso a probar lo construido. Y las señales de alerta de que trabajan en "cascada disfrazada".

${LI_GUIA}

${TAGS} #scrum #metodologias`,
  },
  // 11 · reel (IG franja 2 — jueves 9)
  {
    id: "pro-rapido-caro", kind: "reel", media: `${S}/pro-rapido-caro.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `💸 Lo rápido y barato se paga dos veces.

Sin pruebas. Sin seguridad. Sin soporte. Lo que ahorras hoy lo gastas arreglando mañana.

${GUIA}

${TAGS} #precios #consejospymes`,
    liCaption: `Lo rápido y barato en software se paga dos veces: lo que falta (pruebas, seguridad, soporte) no se ve en la demo, pero se paga después, más caro.

Compara las cotizaciones por lo que INCLUYEN, no por el número final.

${LI_GUIA}

${TAGS} #precios`,
  },
  // reel · voz Gustavo (nativa)
  {
    id: "pro-copiar-pegar", kind: "reel", media: `${S}/pro-copiar-pegar.mp4`, blog: "automatizacion-ia-pymes-2026",
    caption: `🔁 ¿Copias y pegas datos entre apps todos los días?

Ese es tiempo y plata que pierdes. Cuando tus sistemas se conectan, la información fluye sola y tu equipo se dedica a vender.

${GUIA}

${TAGS} #automatizacion #integraciones`,
    liCaption: `¿Tu equipo copia y pega datos entre aplicaciones todos los días?

Ese es un costo invisible en horas y errores. Cuando los sistemas se conectan (integraciones), la información fluye sola y el equipo se dedica a vender.

${LI_GUIA}

${TAGS} #automatizacion`,
  },
  // reel · voz Gustavo (nativa)
  {
    id: "pro-saas-medida", kind: "reel", media: `${S}/pro-saas-medida.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `⚖️ ¿SaaS o software a medida?

El SaaS gana en lo estándar. Lo a medida gana cuando el proceso es TU ventaja, o cuando ya peleas con la herramienta. La jugada maestra: combinar.

${GUIA}

${TAGS} #saas #softwareamedida`,
    liCaption: `¿SaaS o software a medida? Falsa dicotomía.

El SaaS gana en lo estándar, rápido y barato de partir. Lo a medida gana cuando el proceso es tu ventaja competitiva o cuando ya peleas con la herramienta. La jugada madura: combinar ambos.

${LI_GUIA}

${TAGS} #saas #softwareamedida`,
  },
  // ── Lote 3 · temas ATP frescos · voz Gustavo ──
  {
    id: "pro-google", kind: "reel", media: `${S}/pro-google.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🔎 ¿Por qué tu negocio no aparece en Google?

No es mala suerte: tu página no está optimizada, tarda en cargar o ni siquiera está en Google Maps. Aparecer es técnica, no magia.

${GUIA}

${TAGS} #seo #google #posicionamiento`,
    liCaption: `¿Por qué tu negocio no aparece en Google?

No es mala suerte: es técnica. Optimización, velocidad de carga y presencia en Google Maps son los tres frentes donde se gana o se pierde la visibilidad local.

${LI_GUIA}

${TAGS} #seo #marketingdigital`,
  },
  {
    id: "pro-dominio", kind: "reel", media: `${S}/pro-dominio.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `🌐 Tu dominio cuesta $12.000 al año... y puede costarte el negocio.

Si queda a nombre de tu proveedor, tu negocio es rehén. Cómpralo tú, renuévalo tú. Es tuyo.

${GUIA}

${TAGS} #dominio #paginaweb`,
    liCaption: `El activo digital más barato y más olvidado: tu dominio (~$12.000/año).

Si queda a nombre del proveedor, tu presencia digital es rehén de un tercero. Regla simple: el dominio se compra y renueva a nombre del dueño del negocio, siempre.

${LI_GUIA}

${TAGS} #dominio #activosdigitales`,
  },
  {
    id: "pro-web-vende", kind: "reel", media: `${S}/pro-web-vende.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `✨ Una página bonita NO es una página que vende.

Las que venden tienen: mensaje claro en 3 segundos, un botón visible, prueba social y carga instantánea. Lo bonito atrae; lo claro convierte.

${GUIA}

${TAGS} #paginaweb #conversion #ventas`,
    liCaption: `Una página bonita no es lo mismo que una página que vende.

Las que venden comparten 4 rasgos: mensaje claro en 3 segundos, un llamado a la acción visible, prueba social y carga instantánea. El diseño atrae; la claridad convierte.

${LI_GUIA}

${TAGS} #conversion #paginaweb`,
  },
  {
    id: "pro-velocidad", kind: "reel", media: `${S}/pro-velocidad.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `⚡ Tu página tarda 5 segundos en cargar. Más de la mitad de tus visitas se fue antes de verla.

La velocidad no es un detalle técnico: es plata.

${GUIA}

${TAGS} #velocidadweb #paginaweb`,
    liCaption: `La velocidad de carga no es un detalle técnico: es facturación.

Más de la mitad de las visitas abandona una página lenta antes de verla. Cada segundo cuesta clientes, y Google también lo castiga en el ranking.

${LI_GUIA}

${TAGS} #rendimientoweb #seo`,
  },
  {
    id: "pro-corredores", kind: "reel", media: `${S}/pro-corredores.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🏠 Corredor de propiedades: los portales te ARRIENDAN visibilidad.

Una web propia con tus fichas, filtros y WhatsApp directo trabaja para ti, no para el portal. Tu cartera merece casa propia.

${GUIA}

${TAGS} #corredordepropiedades #inmobiliaria #propiedades`,
    liCaption: `Para corredores de propiedades: los portales cumplen un rol, pero te arriendan la visibilidad y comparten tus leads con la competencia.

Una web propia (fichas con filtros, WhatsApp directo, captación de propietarios y tu marca al frente) convierte tu cartera en un activo que trabaja para ti.

${LI_GUIA}

${TAGS} #inmobiliaria #corretaje`,
  },
  {
    id: "pro-maps", kind: "reel", media: `${S}/pro-maps.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `📍 Si tu negocio no está en Google Maps, para medio Chile NO EXISTE.

El perfil es gratis, sale en las búsquedas de tu comuna y junta reseñas que venden por ti. Hazlo hoy.

${GUIA}

${TAGS} #googlemaps #seolocal #negocioslocales`,
    liCaption: `El Perfil de Empresa en Google (Maps) es la herramienta gratuita más subutilizada por las PYMEs.

Aparece en las búsquedas de tu comuna, acumula reseñas que venden por ti y se configura en menos de una hora. Si tu negocio aún no está, es la primera tarea de la semana.

${LI_GUIA}

${TAGS} #seolocal #googlemaps`,
  },
  {
    id: "pro-cuando-no", kind: "reel", media: `${S}/pro-cuando-no.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `🚫 3 casos donde NO te conviene pagar una web todavía:

1. No tienes claro qué vendes.
2. Vives bien del boca a boca.
3. No vas a responder los mensajes.

Primero el proceso, después la tecnología.

${GUIA}

${TAGS} #honestidad #consejospymes`,
    liCaption: `Honestidad incómoda: hay casos donde NO conviene pagar una web todavía.

Si no está claro qué se vende, si el boca a boca aún da abasto, o si nadie va a responder los mensajes que lleguen. La tecnología amplifica un proceso que funciona; no arregla uno que no existe.

${LI_GUIA}

${TAGS} #estrategiadigital #pymes`,
  },
  {
    id: "pro-logo-web", kind: "reel", media: `${S}/pro-logo-web.mp4`, blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🎨 ¿Logo bonito o página que vende?

Si el presupuesto alcanza para uno, parte por la que vende. El logo se mejora después; los clientes que se van hoy no vuelven.

${GUIA}

${TAGS} #branding #paginaweb #prioridades`,
    liCaption: `¿Logo o página web? La pregunta clásica del presupuesto acotado.

Nuestra postura: parte por donde entra la plata. Un logo se puede mejorar en cualquier momento; los clientes que no encuentran cómo comprarte hoy, no vuelven mañana.

${LI_GUIA}

${TAGS} #branding #estrategia`,
  },
  // ── Carruseles lote 3 (cw3) ──
  {
    id: "cw3-seo", kind: "carousel", media: Array.from({ length: 7 }, (_, i) => `${S}/cw3-seo-${i + 1}.png`), blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🔎 ¿Por qué tu negocio NO aparece en Google?

No es suerte: es técnica. Lo primero es GRATIS (perfil de Google Maps + reseñas), y después tu página hace el resto. Anuncios vs orgánico adentro.

Desliza 👉

${GUIA}

${TAGS} #seo #google #seolocal`,
    liCaption: `¿Por qué un negocio no aparece en Google? Casi siempre por lo mismo:

1. No tiene Perfil de Empresa (Google Maps): gratis y sale en las búsquedas de la comuna.
2. Su página es lenta o no usa las palabras que el cliente busca.
3. No responde las preguntas que la gente googlea.

Y la decisión anuncios vs orgánico: los anuncios se arriendan, el SEO se construye.

${LI_GUIA}

${TAGS} #seo #marketingdigital`,
  },
  {
    id: "cw3-anatomia", kind: "carousel", media: Array.from({ length: 7 }, (_, i) => `${S}/cw3-anatomia-${i + 1}.png`), blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🧩 Una página que SÍ vende tiene estos 7 elementos.

Mensaje claro en 3 segundos, UN botón, prueba social, velocidad, celular perfecto, WhatsApp a un toque y medición. Revisa la tuya 👉

${GUIA}

${TAGS} #paginaweb #conversion #ventasonline`,
    liCaption: `Anatomía de una página que vende (los 7 elementos):

Mensaje claro en 3 segundos · un solo llamado a la acción · prueba social · carga instantánea · perfecta en el celular · WhatsApp a un toque · y medición instalada (el que casi nadie tiene: sin datos no hay mejora).

Lo bonito atrae. Lo claro convierte.

${LI_GUIA}

${TAGS} #conversion #ux`,
  },
  {
    id: "cw3-corredores", kind: "carousel", media: Array.from({ length: 7 }, (_, i) => `${S}/cw3-corredores-${i + 1}.png`), blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🏠 Corredores de propiedades: tu cartera merece CASA PROPIA.

Los portales te arriendan visibilidad y comparten tus leads con la competencia. Lo que tu web propia debe tener, adentro 👉

${GUIA}

${TAGS} #corredordepropiedades #inmobiliaria #corretaje`,
    liCaption: `Para corredores de propiedades: portal vs web propia.

El portal cobra por publicar y destacar, comparte los interesados con la competencia y hace crecer su marca (no la tuya). Una web propia con fichas filtrables, WhatsApp directo, captación de propietarios y autoadministración convierte tu cartera en un activo propio, desde $390.000.

${LI_GUIA}

${TAGS} #inmobiliaria #proptech`,
  },
  {
    id: "cw3-errores-web", kind: "carousel", media: Array.from({ length: 7 }, (_, i) => `${S}/cw3-errores-web-${i + 1}.png`), blog: "wix-vs-pagina-web-a-medida-2026",
    caption: `🚨 6 errores de páginas web que ESPANTAN clientes.

Lentitud, mal en el celular, sin candado, mensaje confuso, sin botón de contacto y fotos falsas. ¿Cuántos tiene la tuya? 👉

${GUIA}

${TAGS} #paginaweb #errores #conversion`,
    liCaption: `6 errores de páginas web que espantan clientes (y el orden correcto para arreglarlos):

Los que se ven al llegar: lentitud, mal en móvil, sin https. Los que matan la venta: mensaje confuso, sin llamado a la acción, fotos de stock.

El arreglo: velocidad y móvil primero, mensaje + botón después, confianza al final.

${LI_GUIA}

${TAGS} #ux #conversion`,
  },
  {
    id: "cw3-costos", kind: "carousel", media: Array.from({ length: 6 }, (_, i) => `${S}/cw3-costos-${i + 1}.png`), blog: "cuanto-cuesta-pagina-web-carrito-compras-2026",
    caption: `💰 ¿Cuánto cuesta MANTENER una página web al año?

Dominio ~$12.000/año, hosting puede ser $0, mantención opcional. Y los cobros que NO deberías aceptar 👉

${GUIA}

${TAGS} #paginaweb #costos #transparencia`,
    liCaption: `¿Cuánto cuesta mantener una página web al año? Números honestos:

· Dominio: ~$12.000/año (a nombre del dueño, siempre).
· Hosting: puede ser $0 con infraestructura moderna.
· Mantención: opcional, desde $49.000/mes si quieres despreocuparte.

Y tres cobros que no deberías aceptar: hosting inflado "de la agencia", renovaciones sin desglose y quedar rehén del proveedor.

${LI_GUIA}

${TAGS} #transparencia #costos`,
  },
];

// ── Cola SÓLO para TikTok — contenido NUEVO, distinto al que va a IG/FB/LI.
// La descripción (con emojis) se copia al publicar el borrador.
const T = "https://maudev.cl/social";
const TT = "💬 Comenta GUÍA y te enviamos GRATIS la guía para decidir bien tu software 👇";
const TH = "#software #pymeschile #desarrollodesoftware #emprendimiento";
export const TIKTOK_QUEUE = [
  { id: "pro-plazos-semana", media: `${T}/pro-plazos-semana.mp4`, caption: `🚩 ¿Te prometen un sistema serio "para la otra semana"? Desconfía. El buen software toma tiempo; los atajos se pagan caro.\n\n${TT}\n\n${TH} #plazos` },
  { id: "pro-cuanto-demora", media: `${T}/pro-cuanto-demora.mp4`, caption: `⏱️ ¿Cuánto DEBE demorar un software? Un MVP: semanas. Un sistema mediano: meses. Si te prometen todo en días, ojo.\n\n${TT}\n\n${TH} #mvp` },
  { id: "pro-rapido-caro", media: `${T}/pro-rapido-caro.mp4`, caption: `💸 Lo rápido y barato se paga dos veces: sin pruebas, sin seguridad, sin soporte. Lo que ahorras hoy lo gastas mañana.\n\n${TT}\n\n${TH} #precios` },
  { id: "pro-3-preguntas", media: `${T}/pro-3-preguntas.mp4`, caption: `🔍 Antes de pagar por tu software, pregunta 3 cosas: ¿de quién queda el código? ¿precio y alcance por escrito? ¿avances funcionando?\n\n${TT}\n\n${TH} #consejos` },
  { id: "pro-codigo-nombre", media: `${T}/pro-codigo-nombre.mp4`, caption: `🏃 La pregunta que espanta a los malos proveedores: ¿el código queda a MI nombre? Si dudan, corre. El código es tuyo, siempre.\n\n${TT}\n\n${TH} #software` },
  { id: "pro-senales-estafa", media: `${T}/pro-senales-estafa.mp4`, caption: `⚠️ Señales de que te van a estafar con tu software: te cotizan sin entender tu negocio, no muestran avances, precio muy bajo.\n\n${TT}\n\n${TH} #alerta` },
  { id: "pro-hechos", media: `${T}/pro-hechos.mp4`, caption: `✅ No creas en promesas, cree en cosas funcionando. Pide ver proyectos reales, no capturas. Habla con quien programa.\n\n${TT}\n\n${TH} #consejos` },
  { id: "pro-valor-real", media: `${T}/pro-valor-real.mp4`, caption: `🔗 El valor de tu software no está en las pantallas bonitas: está en que tus herramientas se hablen. Sin integración, copias y pegas todo el día.\n\n${TT}\n\n${TH} #integraciones` },
  { id: "pro-copiar-pegar", media: `${T}/pro-copiar-pegar.mp4`, caption: `🔁 ¿Copias y pegas datos entre apps todos los días? Es tiempo y plata que pierdes. Con sistemas conectados, la info fluye sola.\n\n${TT}\n\n${TH} #automatizacion` },
  { id: "pro-saas-medida", media: `${T}/pro-saas-medida.mp4`, caption: `⚖️ ¿SaaS o software a medida? El SaaS gana en lo estándar; lo a medida cuando el proceso es tu ventaja. La jugada maestra: combinar.\n\n${TT}\n\n${TH} #saas` },
  { id: "pro-google", media: `${T}/pro-google.mp4`, caption: `🔎 ¿Por qué tu negocio no aparece en Google? No es mala suerte: es técnica. Optimización, velocidad y Google Maps.\n\n${TT}\n\n${TH} #seo` },
  { id: "pro-dominio", media: `${T}/pro-dominio.mp4`, caption: `🌐 Tu dominio cuesta $12.000 al año y puede costarte el negocio: si queda a nombre del proveedor, eres rehén. Cómpralo TÚ.\n\n${TT}\n\n${TH} #dominio` },
  { id: "pro-web-vende", media: `${T}/pro-web-vende.mp4`, caption: `✨ Página bonita no es página que vende. Mensaje claro en 3 seg, UN botón, prueba social y velocidad. Lo claro convierte.\n\n${TT}\n\n${TH} #conversion` },
  { id: "pro-velocidad", media: `${T}/pro-velocidad.mp4`, caption: `⚡ Tu página tarda 5 segundos en cargar: más de la mitad de tus visitas ya se fue. La velocidad es plata.\n\n${TT}\n\n${TH} #velocidad` },
  { id: "pro-corredores", media: `${T}/pro-corredores.mp4`, caption: `🏠 Corredor de propiedades: los portales te ARRIENDAN visibilidad y comparten tus leads. Tu cartera merece web propia.\n\n${TT}\n\n${TH} #propiedades` },
  { id: "pro-maps", media: `${T}/pro-maps.mp4`, caption: `📍 Si no estás en Google Maps, para medio Chile no existes. Es gratis y junta reseñas que venden por ti. Hazlo hoy.\n\n${TT}\n\n${TH} #seolocal` },
  { id: "pro-cuando-no", media: `${T}/pro-cuando-no.mp4`, caption: `🚫 3 casos donde NO te conviene pagar una web todavía. Honestidad: primero el proceso, después la tecnología.\n\n${TT}\n\n${TH} #honesto` },
  { id: "pro-logo-web", media: `${T}/pro-logo-web.mp4`, caption: `🎨 ¿Logo bonito o página que vende? Parte por donde entra la plata. El logo se mejora después; los clientes de hoy no vuelven.\n\n${TT}\n\n${TH} #prioridades` },
];
