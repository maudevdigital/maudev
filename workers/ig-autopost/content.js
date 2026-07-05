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
];
