// Contenido EMPAREJADO: cada pieza lleva su propio video/carrusel + su
// descripción coherente con el tema + hashtags SEO. Esto reemplaza el modelo
// viejo (captions sueltas que rotaban aparte y no calzaban con el video).
//
// Cada item:
//   id      identificador
//   kind    "reel" | "carousel"
//   media   URL del .mp4 (reel)  o  array de URLs de imágenes (carrusel)
//   caption texto + hashtags (coherente con el video, optimizado para búsqueda)
//   blog    slug del post del que deriva (para enlazar en la bio)

const TAGS_BASE = "#desarrollodesoftware #softwareamedida #pymeschile";

export const CONTENT = [
  // ===================== DÍA 1 · "Cuánto cuesta software a medida" =====================
  {
    id: "d1-cotizan-rapido",
    kind: "reel",
    media: "https://maudev.cl/social/d1-cotizan-rapido.mp4",
    blog: "cuanto-cuesta-software-a-medida-2026",
    caption: `¿Te cotizaron un software a medida en 5 minutos? 🚩 Cuidado.

Un precio cerrado, sin entender antes tu negocio, suele significar una de dos: una plantilla genérica disfrazada de "a medida", o un número que va a subir apenas empiece el proyecto.

Antes de pagar por un desarrollo, exige que primero entiendan QUÉ problema resuelves. El costo no lo define "una app": lo definen las decisiones que hay detrás.

👉 Te explicamos cuánto cuesta DE VERDAD un software a medida en Chile (2026). Link en la bio.

${TAGS_BASE} #cotizacionsoftware #desarrolloweb #transformaciondigital #emprendedorchile #tecnologia #empresaschile`,
  },
  {
    id: "d1-barato-caro",
    kind: "reel",
    media: "https://maudev.cl/social/d1-barato-caro.mp4",
    blog: "cuanto-cuesta-software-a-medida-2026",
    caption: `💸 La cotización más barata casi nunca es la más conveniente.

El software barato no es barato: es incompleto. Suele venir sin pruebas, sin seguridad, sin soporte y —ojo— a veces sin que el código quede a tu nombre. Todo eso lo pagas después, más caro: se llama deuda técnica.

En desarrollo de software, pagar bien una vez sale más barato que pagar poco dos veces.

👉 Aprende a comparar cotizaciones de software sin que te pasen gato por liebre. Guía en la bio.

${TAGS_BASE} #deudatecnica #desarrolloweb #tecnologiaparapymes #emprendimientochile #softwarechile #precios`,
  },
  {
    id: "d1-checklist-cotizacion",
    kind: "carousel",
    media: [
      "https://maudev.cl/social/carousel-d1-1.png",
      "https://maudev.cl/social/carousel-d1-2.png",
      "https://maudev.cl/social/carousel-d1-3.png",
    ],
    blog: "cuanto-cuesta-software-a-medida-2026",
    caption: `📋 Antes de firmar por un software a medida, revisa que tu cotización incluya ESTO.

Lo que el desarrollo barato omite (y que después pagas caro): pruebas, seguridad, documentación y soporte. Y lo más importante: que el código quede a TU nombre, con precio y alcance por escrito.

Desliza para ver la checklist 👉 y guárdalo para tu próxima cotización de software.

${TAGS_BASE} #cotizacionsoftware #desarrolloweb #consejospymes #transformaciondigital #empresaschile #checklist`,
  },

  // ===================== DÍA 2 · "Software a medida vs SaaS" =====================
  {
    id: "d2-ocho-suscripciones", kind: "reel",
    media: "https://maudev.cl/social/d2-ocho-suscripciones.mp4",
    blog: "software-a-medida-vs-saas-2026",
    caption: `¿Pagas 8 suscripciones distintas y ninguna calza del todo con tu negocio? 🧩

Cada SaaS se siente barato, pero juntos son una mochila que crece cada año y, encima, no se hablan entre sí: tu equipo termina copiando y pegando datos entre apps.

Quizás ya no necesitas más herramientas de mercado. Necesitas un software a medida que unifique todo y sea TUYO.

👉 SaaS vs software a medida: cuándo conviene cada uno. Link en la bio.

${TAGS_BASE} #saas #softwareempresarial #transformaciondigital #automatizacion #empresaschile #productividad`,
  },
  {
    id: "d2-cinco-anios", kind: "reel",
    media: "https://maudev.cl/social/d2-cinco-anios.mp4",
    blog: "software-a-medida-vs-saas-2026",
    caption: `El software por suscripción es barato… hasta que sumas 5 años. ⏳

Una suscripción de $80.000 al mes son casi 5 millones en 5 años — pagados para siempre, sin que nada quede tuyo. Un software a medida que reemplaza varias de esas apps puede pagarse solo en 2 o 3 años y, de ahí en adelante, es ahorro puro.

La pregunta no es "¿cuánto pago al mes?", sino "¿cuánto habré pagado en 5 años, y qué me va a quedar?".

👉 Haz el cálculo con nuestra guía. Link en la bio.

${TAGS_BASE} #saas #costos #softwareempresarial #pyme #finanzas #empresaschile`,
  },
  {
    id: "d2-cuando-construir", kind: "reel",
    media: "https://maudev.cl/social/d2-cuando-construir.mp4",
    blog: "software-a-medida-vs-saas-2026",
    caption: `¿Cuándo conviene construir tu propio software en vez de seguir arrendando? 🛠️

Tres señales claras: cuando el proceso ES tu ventaja competitiva, cuando ya peleas con la herramienta en el plan más caro, y cuando terminas exportando a Excel para hacer lo que el SaaS no hace. Ahí dejó de calzar.

No es fanatismo: a veces gana el SaaS, a veces lo a medida. Lo importante es saber cuándo.

👉 Guía completa en la bio.

${TAGS_BASE} #softwareempresarial #saas #transformaciondigital #decisiones #empresaschile #tecnologia`,
  },

  // ===================== DÍA 3 · "Cómo elegir una empresa de desarrollo" =====================
  {
    id: "d3-mas-barata", kind: "reel",
    media: "https://maudev.cl/social/d3-mas-barata.mp4",
    blog: "como-elegir-empresa-desarrollo-software",
    caption: `Al elegir quién desarrolla tu software, la cotización más barata casi nunca es la más conveniente. 💸

Lo barato suele venir sin pruebas, sin seguridad, sin soporte y a veces sin que el código quede a tu nombre. Compara las propuestas por lo que INCLUYEN, no por el número final: la que cuesta 20% más pero trae todo eso es, de lejos, la barata.

👉 Cómo elegir una empresa de desarrollo (guía para no equivocarte). Link en la bio.

${TAGS_BASE} #comocontratar #desarrolloweb #agenciadesoftware #pymeschile #consejos #empresaschile`,
  },
  {
    id: "d3-tres-preguntas", kind: "reel",
    media: "https://maudev.cl/social/d3-tres-preguntas.mp4",
    blog: "como-elegir-empresa-desarrollo-software",
    caption: `3 preguntas que filtran a los buenos desarrolladores de software 👇

1️⃣ ¿De quién queda el código y el dominio? (Respuesta correcta: tuyo.)
2️⃣ ¿Voy a ver avances funcionando durante el proyecto?
3️⃣ ¿Hablo con quien va a programar, o solo con un vendedor?

Si responden claro y por escrito, vas bien. Si lo evaden, corre.

👉 La guía completa para elegir proveedor está en la bio.

${TAGS_BASE} #comocontratar #desarrolloweb #freelance #pymeschile #emprendedores #tecnologia`,
  },

  {
    id: "d3-senales-alerta", kind: "carousel",
    media: [
      "https://maudev.cl/social/carousel-d3-1.png",
      "https://maudev.cl/social/carousel-d3-2.png",
      "https://maudev.cl/social/carousel-d3-3.png",
    ],
    blog: "como-elegir-empresa-desarrollo-software",
    caption: `🚩 7 señales de alerta al contratar a quien va a desarrollar tu software.

Te cotizan sin entender tu negocio, no muestran avances hasta el final, no ponen el alcance por escrito, precio sospechosamente bajo, sin referencias, evaden de quién es el código y solo te atiende un vendedor.

Desliza para verlas todas 👉 y guárdalo para tu próxima contratación.

${TAGS_BASE} #comocontratar #desarrolloweb #agenciadesoftware #pymeschile #consejos #empresaschile`,
  },

  // ===================== DÍA 4 · "El ROI real de automatizar" =====================
  {
    id: "d4-manual-no-gratis", kind: "reel",
    media: "https://maudev.cl/social/d4-manual-no-gratis.mp4",
    blog: "roi-automatizacion-procesos-empresa",
    caption: `"Automatizar es caro" lo dice quien nunca calculó cuánto cuesta NO automatizar. 🧮

Lo manual se siente gratis, pero no lo es: cada tarea repetitiva son horas de un sueldo, más los errores que hay que corregir, más las ventas que se escapan por no responder a tiempo. Ese costo escondido suele superar al de automatizar.

👉 Aprende a calcular el ROI real de automatizar tu operación. Link en la bio.

#automatizacion #roi #productividad #pymeschile #transformaciondigital #procesos #empresaschile #emprendimiento`,
  },
  {
    id: "d4-empieza-repite", kind: "reel",
    media: "https://maudev.cl/social/d4-empieza-repite.mp4",
    blog: "roi-automatizacion-procesos-empresa",
    caption: `¿Por dónde empezar a automatizar tu empresa? Por lo que más se repite y más errores genera. 🔁

Los procesos con mejor retorno: responder y calificar leads al instante, generar cotizaciones y documentos, hacer seguimientos automáticos y armar reportes solos. Ahí está el retorno fácil.

Regla de oro: parte por 1 o 2 victorias claras, mide, y con eso financias las siguientes.

👉 Guía de ROI de automatización en la bio.

#automatizacion #productividad #leads #pymeschile #procesos #crm #empresaschile #ventas`,
  },
  {
    id: "d4-no-automatices-caos", kind: "reel",
    media: "https://maudev.cl/social/d4-no-automatices-caos.mp4",
    blog: "roi-automatizacion-procesos-empresa",
    caption: `El error más caro al automatizar: automatizar el caos. ⚠️

Si el proceso está malo y lo automatizas, lo único que logras es hacer el desastre… más rápido. Primero ordena el proceso (entiéndelo, elimina pasos inútiles) y recién ahí automatiza la versión buena.

Un buen proveedor te ayuda con esto, no solo "programa lo que ya haces".

👉 Cómo automatizar bien (con ROI) en la bio.

#automatizacion #procesos #productividad #pymeschile #transformaciondigital #gestion #empresaschile`,
  },

  // ===================== DÍA 5 · "De idea a sistema" =====================
  {
    id: "d5-caja-negra", kind: "reel",
    media: "https://maudev.cl/social/d5-caja-negra.mp4",
    blog: "de-idea-a-sistema-proceso-desarrollo",
    caption: `Encargar un software a medida no tiene por qué ser una caja negra. 📦➡️💡

Un proceso sano tiene etapas claras: descubrimiento (entender tu negocio), diseño y arquitectura, desarrollo por sprints, pruebas, despliegue seguro y soporte. Y lo mejor: no esperas meses para ver el resultado, lo ves crecer cada par de semanas.

Cuando entiendes el proceso, eliges mejor y exiges lo correcto.

👉 De idea a sistema: el proceso completo en la bio.

${TAGS_BASE} #procesodedesarrollo #softwareempresarial #pymeschile #transformaciondigital #tecnologia`,
  },
  {
    id: "d5-otra-semana", kind: "reel",
    media: "https://maudev.cl/social/d5-otra-semana.mp4",
    blog: "de-idea-a-sistema-proceso-desarrollo",
    caption: `¿Te prometen un sistema serio "para la otra semana"? Desconfía. ⏱️

El software bien hecho toma tiempo: un MVP, semanas; un sistema mediano, algunos meses. Los atajos (saltarse pruebas, seguridad o diseño) se pagan caro después. Pero ojo: tampoco confíes en quien no te da NINGÚN plazo.

Mejor bien hecho que rápido y mal.

👉 Plazos realistas y el proceso completo en la bio.

${TAGS_BASE} #plazos #procesodedesarrollo #pymeschile #softwareempresarial #emprendedores #tecnologia`,
  },

  // ===================== CARRUSEL día 5 =====================
  {
    id: "d5-etapas-proyecto", kind: "carousel",
    media: [
      "https://maudev.cl/social/carousel-d5-1.png",
      "https://maudev.cl/social/carousel-d5-2.png",
      "https://maudev.cl/social/carousel-d5-3.png",
    ],
    blog: "de-idea-a-sistema-proceso-desarrollo",
    caption: `🧭 Las 6 etapas de un proyecto de software a medida (para que sepas qué exigir).

Descubrimiento → diseño y arquitectura → desarrollo por sprints → pruebas (QA) → despliegue seguro → soporte y evolución. Si tu proveedor se salta etapas, mala señal.

Desliza para ver el proceso completo 👉 y guárdalo.

${TAGS_BASE} #procesodedesarrollo #softwareempresarial #pymeschile #transformaciondigital #consejos`,
  },
];
