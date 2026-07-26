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
import { t } from "@/lib/i18n";

// IMÁGENES: cada automatización tiene `image` (tarjeta del home, 16:9) y
// `video` (reel vertical en la landing). Si la imagen no existe todavía, la
// tarjeta cae al ícono — no se rompe nada. Prompts: docs/prompts-imagenes.md §7

export const AUTOMATIONS = [
  {
    slug: "agenda-automatica",
    priceCLP: "$149.000", priceUSD: "$159 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Calendar,
    name: t("Agenda automática", "Automated Booking"),
    tagline: t("Tu hora, a un clic — 24/7", "Your appointment, one click away — 24/7"),
    badges: [t("Más pedido", "Most requested"), t("WhatsApp + Calendar", "WhatsApp + Calendar")],
    video: "/social/pro-agenda.mp4",
    image: "/img/auto/agenda-automatica.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "chatbot-ia-whatsapp-pymes-2026",
    metaDescription: t(
      "Deja que tus clientes agenden solos, 24/7. Confirmación automática por WhatsApp y evento en Google Calendar, sin idas y vueltas.",
      "Let clients book themselves, 24/7. Automatic WhatsApp confirmation and Google Calendar events, no back-and-forth."
    ),
    problem: {
      pain: t(
        "Los chilenos agendan todo online… menos contigo. Las horas que te piden de noche o mientras atiendes, las pierdes.",
        "People book everything online… except with you. The slots they request at night or while you're busy get lost."
      ),
      cost: t(
        "Cada 'te confirmo mañana' es una venta que se enfría. Coordinar por WhatsApp a mano te quita horas y clientes.",
        "Every 'I'll confirm tomorrow' is a sale going cold. Coordinating by hand costs you hours and clients."
      ),
    },
    outcomes: [
      { title: t("Agenda que nunca duerme", "A calendar that never sleeps"), desc: t("El cliente reserva a las 2 AM y tú te enteras con el café.", "Clients book at 2 AM; you find out over coffee.") },
      { title: t("Cero doble-reserva", "No double-booking"), desc: t("Se sincroniza con tu Google Calendar en tiempo real.", "Syncs with your Google Calendar in real time.") },
      { title: t("Menos inasistencias", "Fewer no-shows"), desc: t("Recordatorios automáticos por WhatsApp 24 h y 2 h antes.", "Automatic WhatsApp reminders 24 h and 2 h before.") },
    ],
    howItWorks: [
      { title: t("El cliente elige su hora", "Client picks a slot"), desc: t("En una página simple, sin apps ni registro.", "On a simple page — no app, no signup.") },
      { title: t("Se agenda solo", "It books itself"), desc: t("Crea el evento en tu calendario y bloquea el cupo.", "Creates the calendar event and blocks the slot.") },
      { title: t("Confirma y recuerda", "Confirms and reminds"), desc: t("WhatsApp de confirmación y recordatorios automáticos.", "WhatsApp confirmation and automatic reminders.") },
    ],
    integrations: ["WhatsApp Business", "Google Calendar", "n8n"],
    stats: [
      { value: "24/7", label: t("Reservas sin ti", "Bookings without you") },
      { value: "0", label: t("Doble-reservas", "Double-bookings") },
    ],
    faqs: [
      { q: t("¿Necesito una app?", "Do I need an app?"), a: t("No. El cliente agenda desde un link; tú lo ves en tu Google Calendar de siempre.", "No. Clients book from a link; you see it in your usual Google Calendar.") },
      { q: t("¿Funciona con mi WhatsApp actual?", "Does it work with my current WhatsApp?"), a: t("Sí, usamos WhatsApp Business API para enviar confirmaciones y recordatorios.", "Yes, we use the WhatsApp Business API for confirmations and reminders.") },
    ],
  },
  {
    slug: "boleta-electronica",
    priceCLP: "$190.000", priceUSD: "$199 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Receipt,
    name: t("Boleta electrónica automática", "Automated E-Invoicing"),
    tagline: t("Vende y factura solo", "Sell and invoice on autopilot"),
    badges: [t("SII listo", "Tax-ready"), t("Ahorra horas", "Saves hours")],
    video: "/social/pro-boleta.mp4",
    image: "/img/auto/boleta-electronica.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "integraciones-software-valor-2026",
    metaDescription: t(
      "Deja de emitir boletas a mano en el SII. Al vender, se emite la boleta electrónica, se envía al cliente y queda registrada. Sin re-digitar.",
      "Stop issuing receipts by hand. On each sale, the e-invoice is issued, sent to the client, and logged. No re-typing."
    ),
    problem: {
      pain: t(
        "¿Sigues emitiendo boletas a mano en la página del SII? Vendes, y después re-digitas todo: el doble de trabajo.",
        "Still issuing receipts by hand on the tax portal? You sell, then re-type everything: double the work."
      ),
      cost: t(
        "La boleta electrónica es obligatoria desde 2021 y aún así miles de pymes pierden horas cada semana en esto.",
        "E-invoicing has been mandatory since 2021, yet thousands of SMBs still waste hours on it every week."
      ),
    },
    outcomes: [
      { title: t("Boleta al vender", "Invoice on sale"), desc: t("Cada venta emite su boleta electrónica sola.", "Every sale issues its own e-invoice automatically.") },
      { title: t("Contabilidad ordenada", "Clean books"), desc: t("Todo queda registrado y listo para tu contador.", "Everything is logged and ready for your accountant.") },
      { title: t("Cero re-digitar", "Zero re-typing"), desc: t("Se acabó copiar ventas a la web del SII una por una.", "No more copying sales into the tax portal one by one.") },
    ],
    howItWorks: [
      { title: t("Registras la venta", "You log the sale"), desc: t("Desde tu sistema, pasarela o formulario.", "From your system, payment gateway, or form.") },
      { title: t("Se emite la boleta", "Invoice is issued"), desc: t("Vía emisor autorizado por el SII, al instante.", "Via an SII-authorized issuer, instantly.") },
      { title: t("Llega al cliente", "Reaches the client"), desc: t("Por WhatsApp o email, y queda en tu registro.", "By WhatsApp or email, and stored in your records.") },
    ],
    integrations: ["SII", "WhatsApp Business", "Google Sheets", "n8n"],
    stats: [
      { value: "0", label: t("Boletas a mano", "Manual receipts") },
      { value: "100%", label: t("Registrado", "Logged") },
    ],
    faqs: [
      { q: t("¿Emiten boleta real del SII?", "Are these real tax receipts?"), a: t("Sí, mediante un emisor electrónico autorizado por el SII, conforme a la ley chilena.", "Yes, through an SII-authorized electronic issuer, compliant with Chilean law.") },
      { q: t("¿Se conecta con mi pasarela de pago?", "Does it connect to my payment gateway?"), a: t("Sí: cuando entra un pago (Webpay, MercadoPago, Flow), dispara la boleta.", "Yes: when a payment arrives (Webpay, MercadoPago, Flow), it triggers the invoice.") },
    ],
  },
  {
    slug: "pasarela-de-pago",
    priceCLP: "$129.000", priceUSD: "$139 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: CreditCard,
    name: t("Cobros y pasarela de pago", "Payments & Checkout"),
    tagline: t("Cobra mientras duermes", "Get paid while you sleep"),
    badges: [t("Webpay · Flow · MercadoPago", "Webpay · Flow · MercadoPago"), t("Menos fricción", "Less friction")],
    video: "/social/pro-pasarela.mp4",
    image: "/img/auto/pasarela-de-pago.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "cuanto-cuesta-pagina-web-carrito-compras-2026",
    metaDescription: t(
      "'Hablemos por interno' mata ventas. Con un link de pago el cliente paga en 1 minuto, a cualquier hora, y tú recibes la confirmación al instante.",
      "'DM me' kills sales. With a payment link clients pay in 1 minute, any time, and you get instant confirmation."
    ),
    problem: {
      pain: t(
        "'Hablemos por interno' es fricción, y la fricción mata ventas. Cada paso extra pierde clientes decididos.",
        "'DM me' is friction, and friction kills sales. Every extra step loses ready buyers."
      ),
      cost: t(
        "El cliente quiere pagar ahora, no mañana por transferencia. Sin pasarela, esa venta se enfría.",
        "Clients want to pay now, not tomorrow by transfer. Without checkout, that sale goes cold."
      ),
    },
    outcomes: [
      { title: t("Paga en 1 minuto", "Pay in 1 minute"), desc: t("Link de pago con Webpay, Flow o MercadoPago.", "Payment link with Webpay, Flow, or MercadoPago.") },
      { title: t("Confirmación al instante", "Instant confirmation"), desc: t("Sabes que pagó sin revisar la cuenta a mano.", "You know they paid without checking the account by hand.") },
      { title: t("Encadena todo", "Chains everything"), desc: t("El pago dispara la boleta y el registro solos.", "The payment triggers the invoice and logging automatically.") },
    ],
    howItWorks: [
      { title: t("Generas el link", "Generate the link"), desc: t("Con el monto y el detalle, en segundos.", "With amount and details, in seconds.") },
      { title: t("El cliente paga", "Client pays"), desc: t("A cualquier hora, desde su teléfono.", "Any time, from their phone.") },
      { title: t("Se confirma solo", "Auto-confirmed"), desc: t("Te avisa, emite boleta y lo deja registrado.", "Notifies you, issues the invoice, logs it.") },
    ],
    integrations: ["Webpay", "Flow", "MercadoPago", "n8n"],
    stats: [
      { value: "1 min", label: t("Para pagar", "To pay") },
      { value: "24/7", label: t("Cobrando", "Charging") },
    ],
    faqs: [
      { q: t("¿Con qué medios de pago funciona?", "Which payment methods work?"), a: t("Webpay, Flow y MercadoPago — los que ya usan tus clientes en Chile.", "Webpay, Flow, and MercadoPago — the ones your Chilean clients already use.") },
      { q: t("¿Emite boleta al pagar?", "Does it invoice on payment?"), a: t("Sí, se puede encadenar con la boleta electrónica automática.", "Yes, it can be chained with automated e-invoicing.") },
    ],
  },
  {
    slug: "control-inventario",
    priceCLP: "$220.000", priceUSD: "$235 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Package,
    name: t("Control de inventario", "Inventory Control"),
    tagline: t("Stock bajo control, sin Excel", "Stock under control, no spreadsheets"),
    badges: [t("Tiempo real", "Real-time"), t("Alertas WhatsApp", "WhatsApp alerts")],
    video: "/social/pro-inventario.mp4",
    image: "/img/auto/control-inventario.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "integraciones-software-valor-2026",
    metaDescription: t(
      "Tu Excel de inventario te cuesta ventas: vendes lo que no tienes o inmovilizas capital. Sincronización en tiempo real y alertas de stock bajo.",
      "Your inventory spreadsheet costs you sales: overselling or dead capital. Real-time sync and low-stock alerts."
    ),
    problem: {
      pain: t(
        "Tu Excel de inventario te está costando ventas: vendes lo que no tienes, o acumulas de más 'por si acaso'.",
        "Your inventory spreadsheet is costing you sales: overselling, or stockpiling 'just in case'."
      ),
      cost: t(
        "El costo oculto de manejar stock a mano: capital inmovilizado y clientes que se van con las manos vacías.",
        "The hidden cost of manual stock: frozen capital and clients leaving empty-handed."
      ),
    },
    outcomes: [
      { title: t("Stock en tiempo real", "Real-time stock"), desc: t("Cada venta descuenta; siempre sabes qué tienes.", "Each sale deducts; you always know what you have.") },
      { title: t("Alertas antes de quebrar", "Alerts before you run out"), desc: t("Aviso por WhatsApp cuando algo baja del mínimo.", "WhatsApp alert when an item drops below its minimum.") },
      { title: t("Reposición sugerida", "Suggested reordering"), desc: t("Arma la orden al proveedor por ti.", "Drafts the supplier order for you.") },
    ],
    howItWorks: [
      { title: t("Conectamos tu stock", "Connect your stock"), desc: t("Desde tu sistema, planilla o punto de venta.", "From your system, spreadsheet, or POS.") },
      { title: t("Se actualiza solo", "Updates itself"), desc: t("Cada venta y entrada ajusta el inventario.", "Every sale and restock adjusts inventory.") },
      { title: t("Te avisa a tiempo", "Warns you in time"), desc: t("Alertas de stock bajo y sugerencia de compra.", "Low-stock alerts and purchase suggestions.") },
    ],
    integrations: ["Google Sheets", "WhatsApp Business", "n8n"],
    stats: [
      { value: t("Tiempo real", "Real-time"), label: t("Actualización", "Updates") },
      { value: "0", label: t("Ventas fantasma", "Phantom sales") },
    ],
    faqs: [
      { q: t("¿Sirve si uso Excel hoy?", "Works if I use Excel today?"), a: t("Sí, podemos partir desde tu planilla y sincronizarla en tiempo real.", "Yes, we can start from your spreadsheet and sync it in real time.") },
      { q: t("¿Y si vendo en varios canales?", "What about multiple channels?"), a: t("Se puede centralizar el stock de web, local y redes en un solo lugar.", "Stock from web, store, and social can be centralized in one place.") },
    ],
  },
  {
    slug: "pedidos-restaurante",
    priceCLP: "$190.000", priceUSD: "$199 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: ShoppingBag,
    name: t("Pedidos para restaurantes", "Restaurant Ordering"),
    tagline: t("Pedidos sin comisión", "Orders with zero commission"),
    badges: [t("0% comisión", "0% commission"), t("WhatsApp a cocina", "WhatsApp to kitchen")],
    video: "/social/pro-restaurante.mp4",
    image: "/img/auto/pedidos-restaurante.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "cuanto-cuesta-pagina-web-carrito-compras-2026",
    metaDescription: t(
      "201.000 personas buscan 'restaurante cerca de mí' cada mes en Chile. Las apps cobran hasta 30%. Con pedidos propios: 0% de comisión.",
      "201,000 people search 'restaurant near me' monthly in Chile. Apps charge up to 30%. With your own ordering: 0% commission."
    ),
    problem: {
      pain: t(
        "201.000 personas buscan 'restaurante cerca de mí' cada mes en Chile. Las apps de delivery se llevan hasta un 30%.",
        "201,000 people search 'restaurant near me' monthly in Chile. Delivery apps take up to 30%."
      ),
      cost: t(
        "Cada pedido por app es margen que regalas. Y el cliente termina siendo de la app, no tuyo.",
        "Every app order is margin you give away. And the customer becomes the app's, not yours."
      ),
    },
    outcomes: [
      { title: t("0% de comisión", "0% commission"), desc: t("El pedido llega directo a ti, no a una app.", "The order comes straight to you, not to an app.") },
      { title: t("Directo a cocina", "Straight to the kitchen"), desc: t("Llega ordenado por WhatsApp, listo para preparar.", "Arrives organized via WhatsApp, ready to cook.") },
      { title: t("El cliente es tuyo", "The customer is yours"), desc: t("Su contacto queda contigo para volver a venderle.", "Their contact stays with you to sell again.") },
    ],
    howItWorks: [
      { title: t("El cliente pide", "Client orders"), desc: t("Desde tu menú online, sin instalar nada.", "From your online menu, nothing to install.") },
      { title: t("Llega a cocina", "Reaches the kitchen"), desc: t("Ordenado y confirmado, con tiempo estimado.", "Organized and confirmed, with an ETA.") },
      { title: t("Avisas el despacho", "Notify dispatch"), desc: t("El cliente sabe cuándo sale su pedido.", "The client knows when their order ships.") },
    ],
    integrations: ["WhatsApp Business", "Webpay", "n8n"],
    stats: [
      { value: "0%", label: t("Comisión", "Commission") },
      { value: "201k", label: t("Búsquedas/mes CL", "Searches/mo CL") },
    ],
    faqs: [
      { q: t("¿Reemplaza a las apps de delivery?", "Does it replace delivery apps?"), a: t("Para pedidos directos, sí: sin comisión y con el cliente de tu lado.", "For direct orders, yes: no commission and the customer on your side.") },
      { q: t("¿Cobra el pedido online?", "Does it charge online?"), a: t("Sí, se integra con pasarela de pago para cobrar al confirmar.", "Yes, it integrates with a payment gateway to charge on confirmation.") },
    ],
  },
  {
    slug: "presencia-profesionales",
    priceCLP: "$250.000", priceUSD: "$265 USD", period: t("Instalación única", "One-time setup"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Briefcase,
    name: t("Presencia para profesionales", "Presence for Professionals"),
    tagline: t("Que te encuentren primero", "Be the one they find first"),
    badges: [t("Abogados · Contadores", "Lawyers · Accountants"), t("Intake automático", "Automated intake")],
    video: "/social/pro-abogados.mp4",
    image: "/img/auto/presencia-profesionales.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "wix-vs-pagina-web-a-medida-2026",
    metaDescription: t(
      "Nadie contrata a un abogado sin googlearlo primero. Si no te encuentra, elige a otro. Presencia + intake automático de nuevos clientes.",
      "Nobody hires a lawyer without googling first. If they can't find you, they pick someone else. Presence + automated client intake."
    ),
    problem: {
      pain: t(
        "Nadie contrata a un abogado —o contador— sin googlearlo antes. Si no encuentra nada, elige a otro.",
        "Nobody hires a lawyer — or accountant — without googling first. If they find nothing, they pick someone else."
      ),
      cost: t(
        "Sin presencia y sin un intake ordenado, pierdes clientes que ya estaban listos para contratarte.",
        "Without presence and a clean intake, you lose clients who were already ready to hire you."
      ),
    },
    outcomes: [
      { title: t("Te encuentran", "They find you"), desc: t("Presencia profesional que da confianza al buscarte.", "Professional presence that builds trust when searched.") },
      { title: t("Intake ordenado", "Clean intake"), desc: t("El cliente nuevo llena sus datos y queda registrado.", "New clients submit their details and get logged.") },
      { title: t("Nada se pierde", "Nothing slips"), desc: t("Recordatorios de plazos y seguimiento automático.", "Deadline reminders and automatic follow-up.") },
    ],
    howItWorks: [
      { title: t("Cliente potencial llega", "Prospect arrives"), desc: t("Desde Google o tu tarjeta digital.", "From Google or your digital card.") },
      { title: t("Completa su intake", "Fills the intake"), desc: t("Un formulario simple crea su ficha.", "A simple form creates their record.") },
      { title: t("Seguimiento solo", "Auto follow-up"), desc: t("Recordatorios y avisos de plazos automáticos.", "Automatic reminders and deadline alerts.") },
    ],
    integrations: ["WhatsApp Business", "Google Calendar", "Email", "n8n"],
    stats: [
      { value: "24/7", label: t("Captando", "Capturing") },
      { value: "0", label: t("Fichas perdidas", "Lost records") },
    ],
    faqs: [
      { q: t("¿Sirve para mi rubro?", "Does it fit my field?"), a: t("Sí: abogados, contadores, consultores y cualquier servicio profesional.", "Yes: lawyers, accountants, consultants, and any professional service.") },
      { q: t("¿Reemplaza mi web?", "Does it replace my website?"), a: t("Puede ser tu web completa o sumarse a la que ya tienes.", "It can be your full site or add to your current one.") },
    ],
  },
  {
    slug: "automatiza-tareas",
    priceCLP: t("Desde $150.000", "From $150.000"), priceUSD: "$159 USD", period: t("Proyecto a medida", "Custom project"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Zap,
    name: t("Automatización de tareas", "Task Automation"),
    tagline: t("Recupera tus horas", "Get your hours back"),
    badges: [t("A medida", "Custom-built"), t("ROI claro", "Clear ROI")],
    video: "/social/pro-automatizar.mp4",
    image: "/img/auto/automatiza-tareas.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "integraciones-software-valor-2026",
    metaDescription: t(
      "2 horas al día en tareas repetidas son 500 horas al año: más de 12 semanas laborales. Automatizamos lo repetitivo y recuperas ese tiempo.",
      "2 hours a day on repetitive tasks is 500 hours a year: over 12 work weeks. We automate the repetitive and give that time back."
    ),
    problem: {
      pain: t(
        "2 horas al día en tareas repetidas son 500 horas al año: más de 12 semanas laborales tiradas.",
        "2 hours a day on repetitive tasks is 500 hours a year: over 12 work weeks gone."
      ),
      cost: t(
        "Copiar y pegar entre sistemas, responder lo mismo, digitar dos veces: trabajo que no deja valor.",
        "Copy-pasting between systems, repeating the same replies, double data entry: work that adds no value."
      ),
    },
    outcomes: [
      { title: t("Menos trabajo manual", "Less manual work"), desc: t("Lo repetitivo lo hace un flujo, no tú.", "The repetitive runs on a workflow, not on you.") },
      { title: t("Tus sistemas se hablan", "Your systems talk"), desc: t("Sin copiar y pegar: los datos fluyen solos.", "No copy-paste: data flows on its own.") },
      { title: t("ROI que se mide", "Measurable ROI"), desc: t("Horas ahorradas que puedes contar cada mes.", "Saved hours you can count every month.") },
    ],
    howItWorks: [
      { title: t("Mapeamos lo repetitivo", "Map the repetitive"), desc: t("Detectamos qué tarea te come más tiempo.", "We find which task eats the most time.") },
      { title: t("Construimos el flujo", "Build the workflow"), desc: t("Un workflow a medida en n8n que lo hace por ti.", "A custom n8n workflow that does it for you.") },
      { title: t("Recuperas el tiempo", "Reclaim the time"), desc: t("Tú te dedicas a lo que sí genera plata.", "You focus on what actually makes money.") },
    ],
    integrations: ["n8n", "Google Workspace", "WhatsApp Business", "APIs"],
    stats: [
      { value: "500 h", label: t("Al año, aprox.", "Per year, approx.") },
      { value: "12+", label: t("Semanas recuperadas", "Weeks reclaimed") },
    ],
    faqs: [
      { q: t("¿Qué se puede automatizar?", "What can be automated?"), a: t("Casi cualquier tarea repetitiva entre apps: correos, planillas, avisos, reportes.", "Almost any repetitive task between apps: emails, sheets, alerts, reports.") },
      { q: t("¿El flujo queda mío?", "Do I own the workflow?"), a: t("Sí, corre en tu n8n y es 100% tuyo, igual que tu código.", "Yes, it runs on your n8n and is 100% yours, like your code.") },
    ],
  },
  {
    slug: "mas-que-instagram",
    priceCLP: t("Desde $290.000", "From $290.000"), priceUSD: "$309 USD", period: t("Proyecto a medida", "Custom project"),
    checkoutUrlCLP: null, checkoutUrlUSD: null,
    icon: Share2,
    name: t("Más que Instagram", "Beyond Instagram"),
    tagline: t("Cuando la red social queda chica", "When social media outgrows you"),
    badges: [t("Señales de crecer", "Growth signals"), t("Web propia", "Own your platform")],
    video: "/social/pro-senales-ig.mp4",
    image: "/img/auto/mas-que-instagram.webp", // ver docs/prompts-imagenes.md §7
    relatedBlog: "wix-vs-pagina-web-a-medida-2026",
    metaDescription: t(
      "Instagram es una gran vitrina, hasta que queda chica. Si vendes por DM, pierdes historial y dependes del algoritmo, ya necesitas más.",
      "Instagram is a great storefront, until it isn't. If you sell by DM, lose history, and depend on the algorithm, you need more."
    ),
    problem: {
      pain: t(
        "Instagram es una gran vitrina, hasta que queda chica: vendes por DM, pierdes el historial y dependes del algoritmo.",
        "Instagram is a great storefront, until it isn't: you sell by DM, lose history, and depend on the algorithm."
      ),
      cost: t(
        "Todo tu negocio prestado en una red que no controlas. Un cambio de algoritmo y tus ventas caen.",
        "Your whole business rented on a platform you don't control. One algorithm change and sales drop."
      ),
    },
    outcomes: [
      { title: t("Plataforma propia", "Your own platform"), desc: t("Web y ventas que no dependen del algoritmo.", "Web and sales that don't depend on the algorithm.") },
      { title: t("Ventas ordenadas", "Organized sales"), desc: t("Pedidos, pagos e historial en un solo lugar.", "Orders, payments, and history in one place.") },
      { title: t("Automatiza lo demás", "Automate the rest"), desc: t("Conecta agenda, cobros y seguimiento.", "Connect booking, payments, and follow-up.") },
    ],
    howItWorks: [
      { title: t("Detectamos las señales", "Spot the signals"), desc: t("Si vendes por DM y pierdes pedidos, es hora.", "If you sell by DM and lose orders, it's time.") },
      { title: t("Montamos tu base", "Set up your base"), desc: t("Web propia con ventas y automatización.", "Your own site with sales and automation.") },
      { title: t("Instagram te alimenta", "Instagram feeds it"), desc: t("La red pasa a traer clientes a tu plataforma.", "Social starts driving clients to your platform.") },
    ],
    integrations: ["Instagram", "WhatsApp Business", "Webpay", "n8n"],
    stats: [
      { value: "100%", label: t("Tu plataforma", "Yours") },
      { value: "0", label: t("Ventas por DM perdidas", "Lost DM sales") },
    ],
    faqs: [
      { q: t("¿Dejo de usar Instagram?", "Do I stop using Instagram?"), a: t("No: Instagram sigue como vitrina, pero la venta ocurre en tu plataforma.", "No: Instagram stays as a storefront, but the sale happens on your platform.") },
      { q: t("¿Es mucho trabajo migrar?", "Is migrating a lot of work?"), a: t("Empezamos con lo mínimo que ya vende y crecemos desde ahí.", "We start with the minimum that already sells and grow from there.") },
    ],
  },
];

export const getAutomationBySlug = (slug) =>
  AUTOMATIONS.find((a) => a.slug === slug) || null;
