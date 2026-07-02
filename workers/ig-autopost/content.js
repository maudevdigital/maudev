// Contenido EMPAREJADO: cada pieza lleva su video/carrusel + su descripción
// coherente con el tema + hashtags SEO + CTA al lead magnet (/guia) o diagnóstico.
// Reels = ProReel (animaciones/luces/voz). Carruseles en posiciones franja-1
// (índices 1 y 4) para que en LinkedIn salgan multi-imagen.
//
//   id · kind ("reel"|"carousel") · media (url | array) · caption · liCaption (LinkedIn) · blog

const TAGS = "#desarrollodesoftware #softwareamedida #pymeschile";
// CTA = incitar comentario (la palabra clave dispara el DM con el PDF). El link
// NO va en la descripción: el CTA sale al final del video.
const GUIA = "💬 Comenta GUÍA y te enviamos GRATIS al privado nuestra guía para decidir bien tu software 👇";
const DIAG = "💬 Comenta GUÍA y te enviamos GRATIS al privado nuestra guía (precios, cómo elegir y qué exigir) 👇";
const S = "https://maudev.cl/social";

export const CONTENT = [
  {
    id: "pro-errores", kind: "reel", media: `${S}/pro-errores.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `🚩 Hay un error que te hace pagar 2 veces por tu software: elegir por precio.

El software barato no es barato: es incompleto. Suele venir sin pruebas, sin seguridad, sin soporte. Lo que falta lo pagas después, más caro.

${GUIA}

${TAGS} #cotizacionsoftware #desarrolloweb #empresaschile`,
  },
  {
    id: "carrusel-cotizacion", kind: "carousel",
    media: [`${S}/carousel-d1-1.png`, `${S}/carousel-d1-2.png`, `${S}/carousel-d1-3.png`],
    blog: "errores-caros-al-pedir-software-2026",
    caption: `📋 Lo que tu cotización de software DEBE incluir (y que lo barato omite).

Pruebas, seguridad, documentación, soporte. Y lo más importante: que el código quede a TU nombre, con precio y alcance por escrito. Desliza 👉

${GUIA}

${TAGS} #cotizacionsoftware #consejospymes #empresaschile`,
    liCaption: `📋 Lo que tu cotización de software DEBE incluir (y que lo barato omite).

Pruebas, seguridad, documentación y soporte. Y lo más importante: que el código quede a TU nombre, con precio y alcance por escrito.

${GUIA}

${TAGS} #cotizacionsoftware #consejospymes #empresaschile`,
  },
  {
    id: "pro-precio", kind: "reel", media: `${S}/pro-precio.mp4`, blog: "como-se-calcula-precio-software-2026",
    caption: `💸 ¿Por qué el mismo software puede costar 10 veces distinto?

Porque el precio no es un número fijo: lo definen el alcance, la lógica, las integraciones y quién lo construye. Por eso un número instantáneo (sin entender tu negocio) es mala señal.

${GUIA}

${TAGS} #precios #cotizacionsoftware #desarrolloweb`,
  },
  {
    id: "pro-integraciones", kind: "reel", media: `${S}/pro-integraciones.mp4`, blog: "integraciones-software-valor-2026",
    caption: `🔗 El verdadero valor de tu software NO está en las pantallas.

Está en que tus herramientas se hablen entre sí. Sin integraciones, tu equipo copia y pega todo el día. Con integraciones, la información fluye sola.

${GUIA}

${TAGS} #integraciones #automatizacion #softwareempresarial`,
  },
  {
    id: "carrusel-senales", kind: "carousel",
    media: [`${S}/carousel-d3-1.png`, `${S}/carousel-d3-2.png`, `${S}/carousel-d3-3.png`],
    blog: "errores-caros-al-pedir-software-2026",
    caption: `🚩 7 señales de alerta al contratar a quien va a desarrollar tu software.

Te cotizan sin entender tu negocio, no muestran avances hasta el final, precio sospechosamente bajo, evaden de quién es el código… Desliza para verlas todas 👉

${GUIA}

${TAGS} #comocontratar #agenciadesoftware #consejospymes`,
    liCaption: `🚩 7 señales de alerta al contratar a quien va a desarrollar tu software.

Te cotizan sin entender tu negocio, no muestran avances hasta el final, precio sospechosamente bajo, sin referencias, evaden de quién es el código y solo te atiende un vendedor.

${GUIA}

${TAGS} #comocontratar #agenciadesoftware #consejospymes`,
  },
  {
    id: "pro-mvp", kind: "reel", media: `${S}/pro-mvp.mp4`, blog: "mvp-lanzar-producto-minimo-2026",
    caption: `🚀 No necesitas "la app completa" para empezar.

Necesitas un MVP: lo mínimo que ya aporta valor, sale al mercado y crece con lo que aprendes (y facturas). Construir todo de una es más caro y más riesgoso.

${DIAG}

${TAGS} #mvp #producto #emprendimientochile`,
  },
  {
    id: "pro-mantencion", kind: "reel", media: `${S}/pro-mantencion.mp4`, blog: "mantencion-software-costo-2026",
    caption: `⚙️ El costo que nadie te cuenta al pedir software: la mantención.

El software, como un auto, tiene costo de uso (≈15-20% al año). Lo que no se mantiene envejece y se vuelve un riesgo. Presupuéstalo desde el día uno.

${GUIA}

${TAGS} #mantencion #soporte #softwareempresarial`,
  },
  {
    id: "pro-ia", kind: "reel", media: `${S}/pro-ia.mp4`, blog: "automatizacion-ia-pymes-2026",
    caption: `🤖 Todos te ofrecen "IA". ¿Pero qué sirve de verdad para tu PYME?

SÍ: responder leads, resumir, atender 24/7. NO: decisiones críticas sin supervisión. La IA es una herramienta del equipo, no el equipo.

${DIAG}

#automatizacion #ia #pymeschile #transformaciondigital #empresaschile`,
  },
  {
    id: "pro-seguridad", kind: "reel", media: `${S}/pro-seguridad.mp4`, blog: "seguridad-respaldos-software-2026",
    caption: `🔒 La seguridad de tu software es invisible… hasta que falla.

Una filtración cuesta clientes, multas y reputación. Control de acceso, cifrado y respaldos automáticos no son un lujo: exígelos desde el día uno.

${GUIA}

${TAGS} #seguridad #respaldos #datos`,
  },
  {
    id: "pro-checklist", kind: "reel", media: `${S}/pro-checklist.mp4`, blog: "errores-caros-al-pedir-software-2026",
    caption: `📋 Antes de pagar por un software, exige esto:

✅ El código a TU nombre
✅ Precio y alcance por escrito
✅ Avances que ves funcionando

Si tu proveedor lo evade, corre.

${GUIA}

${TAGS} #comocontratar #consejospymes #empresaschile`,
  },
];

// ── Cola SÓLO para TikTok (semana 6–12 jul) — contenido NUEVO, distinto al que
// va a IG/FB/LinkedIn. Alto volumen para testear qué funciona. La descripción
// (con emojis) se copia al publicar el borrador; el video NO lleva emojis.
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
