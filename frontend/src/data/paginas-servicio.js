// Textos de las páginas de servicio (IA, Desarrollo, Soporte). Precios, planes y
// fases NO van acá: salen de shared/oferta.js, que también usa el backend.
// /ley-21719 tiene página propia por el autodiagnóstico.
//
// Regla de siempre: nada de cifras de resultado inventadas ("-65 % de tiempo").
// Si no se puede respaldar con un proyecto propio, no se escribe.

export const paginasServicio = {
  ia: {
    eyebrow: "IA aplicada · Chile",
    titulo: "Inteligencia artificial que resuelve una tarea concreta.",
    intro: "Partimos por un caso que hoy te cuesta horas, lo probamos con tus datos reales y solo después hablamos de integrarlo. Sin promesas genéricas de transformación.",
    usosTitulo: "Dónde suele rendir primero.",
    usos: [
      { titulo: "Atención por WhatsApp", texto: "Un agente que responde lo frecuente, toma datos, agenda o cotiza, y deriva a una persona lo que no corresponde resolver solo." },
      { titulo: "Lectura de documentos", texto: "Facturas, órdenes de compra o formularios convertidos en datos ordenados, listos para tu planilla o sistema." },
      { titulo: "Búsqueda en tus documentos", texto: "Preguntas en lenguaje natural sobre manuales, contratos o políticas internas, con la fuente citada en cada respuesta." },
      { titulo: "Tareas repetitivas", texto: "Clasificar correos, resumir solicitudes o preparar borradores que alguien de tu equipo revisa antes de enviar." },
    ],
    planesTitulo: "Primero se prueba, después se integra.",
    planesNota: "Valores netos, más IVA. El consumo del modelo se cobra a costo, sin margen.",
    confianza: {
      titulo: "Tus datos, bajo la Ley 21.719.",
      texto: "Usamos modelos por API, que no entrenan con lo que les envías. Antes de conectar un agente revisamos qué datos personales toca, los minimizamos y dejamos documentado el tratamiento. Si el caso no conviene hacerlo con IA, te lo decimos.",
    },
    faqs: [
      { q: "¿Qué diferencia hay entre un agente y un chatbot?", a: "Un chatbot sigue un guion fijo. Un agente entiende la consulta, consulta tus datos o sistemas y actúa dentro de reglas que definimos contigo, y deriva a una persona cuando corresponde." },
      { q: "¿Mis datos quedan expuestos?", a: "Trabajamos con modelos por API que no entrenan con tus datos, enviamos solo lo necesario para cada tarea y documentamos el tratamiento según la Ley 21.719." },
      { q: "¿Por qué empezar con un prototipo?", a: "Porque la única forma honesta de saber si la IA sirve para tu caso es probarla con tus datos. El prototipo cuesta una fracción de la integración y te dice si vale la pena seguir." },
      { q: "¿Cuánto cuesta operarlo cada mes?", a: "El plan del agente incluye monitoreo y ajustes. El consumo del modelo depende del volumen y se cobra a costo; el prototipo te entrega una estimación con tus números." },
    ],
  },

  desarrollo: {
    eyebrow: "Desarrollo web y software · Chile",
    titulo: "Sitios y sistemas hechos para cómo trabaja tu negocio.",
    intro: "Una landing para una campaña, un sitio que explique lo que haces o un sistema que reemplace la planilla. Precio cerrado por escrito antes de empezar y el código a tu nombre.",
    usosTitulo: "Qué construimos.",
    usos: [
      { titulo: "Sitios que convierten", texto: "Páginas que explican lo que haces, cargan rápido y llevan a una sola acción clara." },
      { titulo: "Tiendas online", texto: "Catálogo, pagos con Webpay, Flow o Mercado Pago, despacho e inventario conectados." },
      { titulo: "Portales de clientes", texto: "Acceso seguro para que tus clientes vean avance, documentos o pagos, como el portal de Maudev." },
      { titulo: "Sistemas internos", texto: "Usuarios, permisos e historial para procesos que hoy viven en planillas y correos." },
    ],
    ejemplosTitulo: "Precios de referencia.",
    ejemplosNota: "Valores netos desde, más IVA. El precio final se fija por escrito después del diagnóstico.",
    confianza: {
      titulo: "Todo queda a tu nombre.",
      texto: "Dominio, hosting, repositorio y accesos se crean a nombre de tu empresa. Si mañana decides trabajar con otra persona, te llevas todo sin pedir permiso.",
    },
    faqs: [
      { q: "¿Por qué no hay planes cerrados?", a: "Porque cada proyecto es distinto y un paquete fijo termina prometiendo algo que después hay que renegociar. Publicamos el piso y cerramos el precio exacto por escrito tras el diagnóstico." },
      { q: "¿Cuánto demora un proyecto?", a: "Una landing, entre una y dos semanas. Un sitio o tienda, entre tres y ocho. Un sistema a medida se planifica por módulos que se entregan funcionando." },
      { q: "¿Queda cumpliendo la Ley 21.719?", a: "Sí. Formularios con finalidad informada, consentimiento de cookies y canal para ejercer derechos vienen incluidos desde el diseño." },
      { q: "¿Y después de publicar?", a: "Puedes contratar un plan de soporte mensual o quedarte con todo y operarlo tú. No hay mensualidad obligatoria." },
    ],
  },

  soporte: {
    eyebrow: "Soporte y mantención · Chile",
    titulo: "Tu sitio funcionando, respaldado y al día, todos los meses.",
    intro: "Actualizaciones de seguridad, respaldos, monitoreo y horas de cambios con tiempos de respuesta por escrito. Sirve también para sitios que no hicimos nosotros.",
    usosTitulo: "Qué cuidamos.",
    usos: [
      { titulo: "Seguridad", texto: "Actualizaciones de dependencias y parches aplicados antes de que se conviertan en un problema." },
      { titulo: "Respaldos", texto: "Copias periódicas y verificadas, para volver atrás si algo se rompe." },
      { titulo: "Disponibilidad", texto: "Monitoreo continuo: si el sitio se cae, lo sabemos antes que tus clientes." },
      { titulo: "Cambios", texto: "Textos, precios, fotos o secciones nuevas usando las horas del plan, sin cotizar cada ajuste." },
    ],
    planesTitulo: "Planes mensuales.",
    planesNota: "Valores netos, más IVA. Sin permanencia mínima: se cancela con aviso de 30 días.",
    confianza: {
      titulo: "Las horas se ven en tu portal.",
      texto: "Cada cambio queda registrado con su tiempo. En el portal de clientes ves las horas usadas frente a las incluidas en tu plan, mes a mes.",
    },
    faqs: [
      { q: "¿Atienden sitios que no hicieron ustedes?", a: "Sí. Primero revisamos el sitio y te decimos si hay algo que corregir antes de entrar al plan." },
      { q: "¿Qué pasa si no uso las horas del mes?", a: "Las horas no se acumulan de un mes a otro. Si necesitas más, se cotizan aparte al mismo valor por hora del plan." },
      { q: "¿Cómo se mide el tiempo de respuesta?", a: "Desde que llega tu mensaje en horario hábil hasta nuestra primera respuesta con diagnóstico, no solo un acuse de recibo." },
      { q: "¿Puedo cambiar de plan?", a: "Sí, en cualquier momento. El cambio rige desde el mes siguiente." },
    ],
  },
};
