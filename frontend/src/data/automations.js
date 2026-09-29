// Catálogo de automatizaciones (productos) con páginas propias por slug.
// Cada entrada alimenta:
//   • /automatizaciones            → grid índice (AutomatizacionesIndex)
//   • /automatizaciones/:slug      → landing de conversión (AutomatizacionDetail)
//
// Reutiliza los reels ya renderizados (/social/pro-*.mp4) como hero de cada
// página. El CTA es ÚNICO en todo el sitio (CTA_LABEL → /contacto): aquí solo
// se define el CONTENIDO que convierte (problema, resultados, cómo funciona,
// integraciones, prueba social y FAQ). Nada de claims que no se puedan cumplir.
//
// Para agregar una automatización: copia un objeto, cambia el slug y el copy.
// Los 8 verticales calzan con los reels/carruseles de contenido ya publicados.

import {
  Calendar, Receipt, Package, Briefcase, CreditCard, Zap, Share2, ShoppingBag,
} from "lucide-react";

// IMÁGENES: cada automatización tiene `image` (tarjeta del home, 16:9) y
// `video` (reel vertical en la landing). Si la imagen no existe todavía, la
// tarjeta cae al ícono — no se rompe nada. Prompts: docs/prompts-imagenes.md §7

export const AUTOMATIONS = [
  {
    slug: "agenda-automatica",
    priceCLP: "$149.000", priceUSD: "$159 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Calendar,
    name: "Agenda automática",
    tagline: "Tu hora, a un clic — 24/7",
    badges: ["Más pedido", "WhatsApp + Calendar"],
    video: "/social/pro-agenda.mp4",
    image: "/img/auto/agenda-automatica.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "Deja que tus clientes agenden solos, 24/7. Confirmación automática por WhatsApp y evento en Google Calendar, sin idas y vueltas.",
    problem: {
      pain: "Los chilenos agendan todo online… menos contigo. Las horas que te piden de noche o mientras atiendes, las pierdes.",
      cost: "Cada 'te confirmo mañana' es una venta que se enfría. Coordinar por WhatsApp a mano te quita horas y clientes.",
    },
    outcomes: [
      { title: "Agenda que nunca duerme", desc: "El cliente reserva a las 2 AM y tú te enteras con el café." },
      { title: "Cero doble-reserva", desc: "Se sincroniza con tu Google Calendar en tiempo real." },
      { title: "Menos inasistencias", desc: "Recordatorios automáticos por WhatsApp 24 h y 2 h antes." },
    ],
    howItWorks: [
      { title: "El cliente elige su hora", desc: "En una página simple, sin apps ni registro." },
      { title: "Se agenda solo", desc: "Crea el evento en tu calendario y bloquea el cupo." },
      { title: "Confirma y recuerda", desc: "WhatsApp de confirmación y recordatorios automáticos." },
    ],
    integrations: ["WhatsApp Business", "Google Calendar", "n8n"],
    stats: [
      { value: "24/7", label: "Reservas sin ti" },
      { value: "0", label: "Doble-reservas" },
    ],
    faqs: [
      { q: "¿Necesito una app?", a: "No. El cliente agenda desde un link; tú lo ves en tu Google Calendar de siempre." },
      { q: "¿Funciona con mi WhatsApp actual?", a: "Sí, usamos WhatsApp Business API para enviar confirmaciones y recordatorios." },
    ],
  },
  {
    slug: "boleta-electronica",
    priceCLP: "$190.000", priceUSD: "$199 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Receipt,
    name: "Boleta electrónica automática",
    tagline: "Vende y factura solo",
    badges: ["SII listo", "Ahorra horas"],
    video: "/social/pro-boleta.mp4",
    image: "/img/auto/boleta-electronica.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "Deja de emitir boletas a mano en el SII. Al vender, se emite la boleta electrónica, se envía al cliente y queda registrada. Sin re-digitar.",
    problem: {
      pain: "¿Sigues emitiendo boletas a mano en la página del SII? Vendes, y después re-digitas todo: el doble de trabajo.",
      cost: "La boleta electrónica es obligatoria desde 2021 y aún así miles de pymes pierden horas cada semana en esto.",
    },
    outcomes: [
      { title: "Boleta al vender", desc: "Cada venta emite su boleta electrónica sola." },
      { title: "Contabilidad ordenada", desc: "Todo queda registrado y listo para tu contador." },
      { title: "Cero re-digitar", desc: "Se acabó copiar ventas a la web del SII una por una." },
    ],
    howItWorks: [
      { title: "Registras la venta", desc: "Desde tu sistema, pasarela o formulario." },
      { title: "Se emite la boleta", desc: "Vía emisor autorizado por el SII, al instante." },
      { title: "Llega al cliente", desc: "Por WhatsApp o email, y queda en tu registro." },
    ],
    integrations: ["SII", "WhatsApp Business", "Google Sheets", "n8n"],
    stats: [
      { value: "0", label: "Boletas a mano" },
      { value: "100%", label: "Registrado" },
    ],
    faqs: [
      { q: "¿Emiten boleta real del SII?", a: "Sí, mediante un emisor electrónico autorizado por el SII, conforme a la ley chilena." },
      { q: "¿Se conecta con mi pasarela de pago?", a: "Sí: cuando entra un pago (Webpay, MercadoPago, Flow), dispara la boleta." },
    ],
  },
  {
    slug: "pasarela-de-pago",
    priceCLP: "$129.000", priceUSD: "$139 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: CreditCard,
    name: "Cobros y pasarela de pago",
    tagline: "Cobra mientras duermes",
    badges: ["Webpay · Flow · MercadoPago", "Menos fricción"],
    video: "/social/pro-pasarela.mp4",
    image: "/img/auto/pasarela-de-pago.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "'Hablemos por interno' mata ventas. Con un link de pago el cliente paga en 1 minuto, a cualquier hora, y tú recibes la confirmación al instante.",
    problem: {
      pain: "'Hablemos por interno' es fricción, y la fricción mata ventas. Cada paso extra pierde clientes decididos.",
      cost: "El cliente quiere pagar ahora, no mañana por transferencia. Sin pasarela, esa venta se enfría.",
    },
    outcomes: [
      { title: "Paga en 1 minuto", desc: "Link de pago con Webpay, Flow o MercadoPago." },
      { title: "Confirmación al instante", desc: "Sabes que pagó sin revisar la cuenta a mano." },
      { title: "Encadena todo", desc: "El pago dispara la boleta y el registro solos." },
    ],
    howItWorks: [
      { title: "Generas el link", desc: "Con el monto y el detalle, en segundos." },
      { title: "El cliente paga", desc: "A cualquier hora, desde su teléfono." },
      { title: "Se confirma solo", desc: "Te avisa, emite boleta y lo deja registrado." },
    ],
    integrations: ["Webpay", "Flow", "MercadoPago", "n8n"],
    stats: [
      { value: "1 min", label: "Para pagar" },
      { value: "24/7", label: "Cobrando" },
    ],
    faqs: [
      { q: "¿Con qué medios de pago funciona?", a: "Webpay, Flow y MercadoPago — los que ya usan tus clientes en Chile." },
      { q: "¿Emite boleta al pagar?", a: "Sí, se puede encadenar con la boleta electrónica automática." },
    ],
  },
  {
    slug: "control-inventario",
    priceCLP: "$220.000", priceUSD: "$235 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Package,
    name: "Control de inventario",
    tagline: "Stock bajo control, sin Excel",
    badges: ["Tiempo real", "Alertas WhatsApp"],
    video: "/social/pro-inventario.mp4",
    image: "/img/auto/control-inventario.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "Tu Excel de inventario te cuesta ventas: vendes lo que no tienes o inmovilizas capital. Sincronización en tiempo real y alertas de stock bajo.",
    problem: {
      pain: "Tu Excel de inventario te está costando ventas: vendes lo que no tienes, o acumulas de más 'por si acaso'.",
      cost: "El costo oculto de manejar stock a mano: capital inmovilizado y clientes que se van con las manos vacías.",
    },
    outcomes: [
      { title: "Stock en tiempo real", desc: "Cada venta descuenta; siempre sabes qué tienes." },
      { title: "Alertas antes de quebrar", desc: "Aviso por WhatsApp cuando algo baja del mínimo." },
      { title: "Reposición sugerida", desc: "Arma la orden al proveedor por ti." },
    ],
    howItWorks: [
      { title: "Conectamos tu stock", desc: "Desde tu sistema, planilla o punto de venta." },
      { title: "Se actualiza solo", desc: "Cada venta y entrada ajusta el inventario." },
      { title: "Te avisa a tiempo", desc: "Alertas de stock bajo y sugerencia de compra." },
    ],
    integrations: ["Google Sheets", "WhatsApp Business", "n8n"],
    stats: [
      { value: "Tiempo real", label: "Actualización" },
      { value: "0", label: "Ventas fantasma" },
    ],
    faqs: [
      { q: "¿Sirve si uso Excel hoy?", a: "Sí, podemos partir desde tu planilla y sincronizarla en tiempo real." },
      { q: "¿Y si vendo en varios canales?", a: "Se puede centralizar el stock de web, local y redes en un solo lugar." },
    ],
  },
  {
    slug: "pedidos-restaurante",
    priceCLP: "$190.000", priceUSD: "$199 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: ShoppingBag,
    name: "Pedidos para restaurantes",
    tagline: "Pedidos sin comisión",
    badges: ["0% comisión", "WhatsApp a cocina"],
    video: "/social/pro-restaurante.mp4",
    image: "/img/auto/pedidos-restaurante.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "201.000 personas buscan 'restaurante cerca de mí' cada mes en Chile. Las apps cobran hasta 30%. Con pedidos propios: 0% de comisión.",
    problem: {
      pain: "201.000 personas buscan 'restaurante cerca de mí' cada mes en Chile. Las apps de delivery se llevan hasta un 30%.",
      cost: "Cada pedido por app es margen que regalas. Y el cliente termina siendo de la app, no tuyo.",
    },
    outcomes: [
      { title: "0% de comisión", desc: "El pedido llega directo a ti, no a una app." },
      { title: "Directo a cocina", desc: "Llega ordenado por WhatsApp, listo para preparar." },
      { title: "El cliente es tuyo", desc: "Su contacto queda contigo para volver a venderle." },
    ],
    howItWorks: [
      { title: "El cliente pide", desc: "Desde tu menú online, sin instalar nada." },
      { title: "Llega a cocina", desc: "Ordenado y confirmado, con tiempo estimado." },
      { title: "Avisas el despacho", desc: "El cliente sabe cuándo sale su pedido." },
    ],
    integrations: ["WhatsApp Business", "Webpay", "n8n"],
    stats: [
      { value: "0%", label: "Comisión" },
      { value: "201k", label: "Búsquedas/mes CL" },
    ],
    faqs: [
      { q: "¿Reemplaza a las apps de delivery?", a: "Para pedidos directos, sí: sin comisión y con el cliente de tu lado." },
      { q: "¿Cobra el pedido online?", a: "Sí, se integra con pasarela de pago para cobrar al confirmar." },
    ],
  },
  {
    slug: "presencia-profesionales",
    priceCLP: "$250.000", priceUSD: "$265 USD", period: "Instalación única",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Briefcase,
    name: "Presencia para profesionales",
    tagline: "Que te encuentren primero",
    badges: ["Abogados · Contadores", "Intake automático"],
    video: "/social/pro-abogados.mp4",
    image: "/img/auto/presencia-profesionales.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "Nadie contrata a un abogado sin googlearlo primero. Si no te encuentra, elige a otro. Presencia + intake automático de nuevos clientes.",
    problem: {
      pain: "Nadie contrata a un abogado —o contador— sin googlearlo antes. Si no encuentra nada, elige a otro.",
      cost: "Sin presencia y sin un intake ordenado, pierdes clientes que ya estaban listos para contratarte.",
    },
    outcomes: [
      { title: "Te encuentran", desc: "Presencia profesional que da confianza al buscarte." },
      { title: "Intake ordenado", desc: "El cliente nuevo llena sus datos y queda registrado." },
      { title: "Nada se pierde", desc: "Recordatorios de plazos y seguimiento automático." },
    ],
    howItWorks: [
      { title: "Cliente potencial llega", desc: "Desde Google o tu tarjeta digital." },
      { title: "Completa su intake", desc: "Un formulario simple crea su ficha." },
      { title: "Seguimiento solo", desc: "Recordatorios y avisos de plazos automáticos." },
    ],
    integrations: ["WhatsApp Business", "Google Calendar", "Email", "n8n"],
    stats: [
      { value: "24/7", label: "Captando" },
      { value: "0", label: "Fichas perdidas" },
    ],
    faqs: [
      { q: "¿Sirve para mi rubro?", a: "Sí: abogados, contadores, consultores y cualquier servicio profesional." },
      { q: "¿Reemplaza mi web?", a: "Puede ser tu web completa o sumarse a la que ya tienes." },
    ],
  },
  {
    slug: "automatiza-tareas",
    priceCLP: "Desde $150.000", priceUSD: "$159 USD", period: "Proyecto a medida",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Zap,
    name: "Automatización de tareas",
    tagline: "Recupera tus horas",
    badges: ["A medida", "ROI claro"],
    video: "/social/pro-automatizar.mp4",
    image: "/img/auto/automatiza-tareas.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "2 horas al día en tareas repetidas son 500 horas al año: más de 12 semanas laborales. Automatizamos lo repetitivo y recuperas ese tiempo.",
    problem: {
      pain: "2 horas al día en tareas repetidas son 500 horas al año: más de 12 semanas laborales tiradas.",
      cost: "Copiar y pegar entre sistemas, responder lo mismo, digitar dos veces: trabajo que no deja valor.",
    },
    outcomes: [
      { title: "Menos trabajo manual", desc: "Lo repetitivo lo hace un flujo, no tú." },
      { title: "Tus sistemas se hablan", desc: "Sin copiar y pegar: los datos fluyen solos." },
      { title: "ROI que se mide", desc: "Horas ahorradas que puedes contar cada mes." },
    ],
    howItWorks: [
      { title: "Mapeamos lo repetitivo", desc: "Detectamos qué tarea te come más tiempo." },
      { title: "Construimos el flujo", desc: "Un workflow a medida en n8n que lo hace por ti." },
      { title: "Recuperas el tiempo", desc: "Tú te dedicas a lo que sí genera plata." },
    ],
    integrations: ["n8n", "Google Workspace", "WhatsApp Business", "APIs"],
    stats: [
      { value: "500 h", label: "Al año, aprox." },
      { value: "12+", label: "Semanas recuperadas" },
    ],
    faqs: [
      { q: "¿Qué se puede automatizar?", a: "Casi cualquier tarea repetitiva entre apps: correos, planillas, avisos, reportes." },
      { q: "¿El flujo queda mío?", a: "Sí, corre en tu n8n y es 100% tuyo, igual que tu código." },
    ],
  },
  {
    slug: "mas-que-instagram",
    priceCLP: "Desde $290.000", priceUSD: "$309 USD", period: "Proyecto a medida",
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Share2,
    name: "Más que Instagram",
    tagline: "Cuando la red social queda chica",
    badges: ["Señales de crecer", "Web propia"],
    video: "/social/pro-senales-ig.mp4",
    image: "/img/auto/mas-que-instagram.webp", // ver docs/prompts-imagenes.md §7
    metaDescription: "Instagram es una gran vitrina, hasta que queda chica. Si vendes por DM, pierdes historial y dependes del algoritmo, ya necesitas más.",
    problem: {
      pain: "Instagram es una gran vitrina, hasta que queda chica: vendes por DM, pierdes el historial y dependes del algoritmo.",
      cost: "Todo tu negocio prestado en una red que no controlas. Un cambio de algoritmo y tus ventas caen.",
    },
    outcomes: [
      { title: "Plataforma propia", desc: "Web y ventas que no dependen del algoritmo." },
      { title: "Ventas ordenadas", desc: "Pedidos, pagos e historial en un solo lugar." },
      { title: "Automatiza lo demás", desc: "Conecta agenda, cobros y seguimiento." },
    ],
    howItWorks: [
      { title: "Detectamos las señales", desc: "Si vendes por DM y pierdes pedidos, es hora." },
      { title: "Montamos tu base", desc: "Web propia con ventas y automatización." },
      { title: "Instagram te alimenta", desc: "La red pasa a traer clientes a tu plataforma." },
    ],
    integrations: ["Instagram", "WhatsApp Business", "Webpay", "n8n"],
    stats: [
      { value: "100%", label: "Tu plataforma" },
      { value: "0", label: "Ventas por DM perdidas" },
    ],
    faqs: [
      { q: "¿Dejo de usar Instagram?", a: "No: Instagram sigue como vitrina, pero la venta ocurre en tu plataforma." },
      { q: "¿Es mucho trabajo migrar?", a: "Empezamos con lo mínimo que ya vende y crecemos desde ahí." },
    ],
  },
];

export const getAutomationBySlug = (slug) =>
  AUTOMATIONS.find((a) => a.slug === slug) || null;
