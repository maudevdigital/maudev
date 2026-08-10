// Datos estáticos del portafolio: esta es la única fuente de verdad.
// Para editar un proyecto, modifica este archivo y despliega. No hay panel
// admin ni base de datos (se eliminaron a propósito: menos superficie que
// mantener y carga más rápida).
//
// ⚠️ IMÁGENES: capturas REALES de cada sitio (nada de stock). Van en
// /public/portfolio/<id>.webp (WebP: ~10x más liviano que PNG y lo soporta
// el 97% de los navegadores). Cómo generarlas: docs/prompts-imagenes.md §5.
// Si falta una, SitePreview muestra un placeholder monocromo — no se rompe nada.
//
// Cada proyecto incluye su caso de estudio (problem / solution / outcome),
// usado por /portafolio/:id. Los campos *_en son la versión en inglés.
// El orden del array manda: el primero aparece primero en la home.

export const projects = [
  {
    id: "scissorhands",
    title: "Scissorhands",
    tagline: "Barbería de 25 años que agenda por WhatsApp",
    tagline_en: "A 25-year-old barbershop that books over WhatsApp",
    description:
      "Sitio de una barbería tradicional de Quilpué, funcionando desde 2001. Muestra servicios con precio, galería de cortes reales, trayectoria y opiniones de clientes — y canaliza todo hacia una sola acción: escribir por WhatsApp para tomar hora.",
    description_en:
      "Website for a traditional barbershop in Quilpué, running since 2001. It shows services with prices, a gallery of real haircuts, its history and customer reviews — and funnels everything into a single action: message on WhatsApp to book.",
    problem:
      "Veinticinco años de oficio y cero presencia en internet. Quien buscaba \"barbería en Quilpué\" simplemente no lo encontraba, y toda la reputación construida a punta de boca a boca no existía para un cliente nuevo. Las horas se coordinaban una por una, interrumpiendo el corte que estaba en curso.",
    summaryProblem: "La barbería no tenía presencia digital y coordinaba las horas una por una.",
    problem_en:
      "Twenty-five years of craft and zero presence online. Anyone searching for \"barbershop in Quilpué\" simply wouldn't find it, and a reputation built entirely on word of mouth didn't exist for a new customer. Appointments were coordinated one by one, interrupting the haircut in progress.",
    solution:
      "Una sola página, optimizada para búsqueda local, con los servicios y el precio a la vista, galería de cortes propios y las opiniones de clientes de años. Cada sección termina en el mismo botón de WhatsApp con el mensaje ya escrito: sin formularios, sin registro, sin app que descargar. Estática sobre Cloudflare Pages, así que carga instantáneo y no tiene costo de servidor.",
    summarySolution: "Sitio orientado a búsqueda local y contacto por WhatsApp, con servicios, precios y trabajo real.",
    solution_en:
      "A single page, optimised for local search, with services and pricing up front, a gallery of the barber's own work and reviews from long-time customers. Every section ends in the same WhatsApp button with the message pre-written: no forms, no sign-up, no app to download. Static on Cloudflare Pages, so it loads instantly and costs nothing to run.",
    outcome:
      "Sitio en producción, posicionado para búsquedas de barbería en Quilpué, con un canal de agendamiento abierto 24/7 aunque el local esté cerrado. Es también la prueba de la automatización de agenda que ofrecemos: el mismo patrón, funcionando en un negocio real.",
    summaryOutcome: "Canal de reserva disponible incluso fuera del horario del local.",
    outcome_en:
      "Live site, positioned for barbershop searches in Quilpué, with a booking channel open 24/7 even when the shop is closed. It's also proof of the booking automation we sell: the same pattern, running in a real business.",
    stack: ["React", "Vite", "Tailwind", "Cloudflare Pages"],
    industry: "Barbería / Servicio local",
    industry_en: "Barbershop / Local service",
    role: "Diseño, desarrollo y SEO local",
    role_en: "Design, development and local SEO",
    image: "/portfolio/scissorhands.webp",
    url: "https://scissorhand.pages.dev",
    featured: true,
  },
  {
    id: "systempro",
    title: "SystemePro",
    tagline: "Portal de recursos y gestión para negocios en Systeme.io",
    tagline_en: "Resources and management portal for Systeme.io businesses",
    description:
      "Plataforma que guía el acceso a Systeme.io, reúne recursos para construir embudos y separa con claridad la experiencia del cliente del panel administrativo.",
    description_en:
      "Our own platform that captures leads, pushes them into automated funnels and measures conversions end-to-end. It integrates Meta Pixel and GA4 in a single dashboard to optimize campaigns in real time.",
    problem:
      "Quien comienza a trabajar con Systeme.io necesita entender dónde crear su cuenta, dónde administrar su embudo y qué recursos usar para no partir desde cero. Mezclar el acceso del cliente con la administración del portal hacía ese recorrido más confuso.",
    summaryProblem: "Los usuarios necesitaban distinguir el acceso a Systeme.io de la administración de SystemePro.",
    problem_en:
      "SMBs that invest in ads tend to lose leads along the way: they arrive through different channels, nobody replies in time and there's no way to know which campaign brought them. Existing tools are expensive or too complex for a small team.",
    solution:
      "Construimos un portal que explica el acceso correcto, entrega recursos para landing pages, email y automatización, y separa el flujo del cliente del panel privado que gestiona contenido, leads, atribución, webhooks y clics de afiliados.",
    summarySolution: "Un portal de onboarding y recursos, con el flujo del cliente separado del panel privado.",
    solution_en:
      "We built a platform that centralizes lead capture, routes leads into automated follow-up funnels and attributes every conversion to its source campaign (Meta Pixel + GA4) in a single dashboard. Serverless architecture on Cloudflare Workers with Supabase as the database.",
    outcome:
      "Una experiencia pública en producción que centraliza onboarding y recursos, con el acceso administrativo claramente separado para reducir confusiones.",
    summaryOutcome: "Onboarding, recursos y administración centralizados en una experiencia clara.",
    outcome_en:
      "Our own product in production, used to manage real lead-gen campaigns. It's also our lab: what we test and validate there, we apply to client projects.",
    stack: ["React", "Vite", "Supabase", "Cloudflare Workers"],
    industry: "SaaS / Marketing",
    industry_en: "SaaS / Marketing",
    role: "Producto propio · diseño, desarrollo, infraestructura",
    role_en: "Own product · design, development, infrastructure",
    image: "/portfolio/systempro.webp",
    url: "https://systemepro.com",
    featured: true,
  },
  {
    id: "partsmr",
    title: "PartsMr",
    tagline: "Portal de cotización de repuestos para Latinoamérica",
    tagline_en: "Auto-parts quote portal for Latin America",
    description:
      "Sitio comercial de repuestos para autos, camiones y maquinaria con cobertura internacional, cotización guiada, medios de pago y contacto directo.",
    description_en:
      "Online store with a parts catalog, search by vehicle model, payment gateway integration and an admin panel to manage inventory and orders.",
    problem:
      "Cotizar repuestos para autos, camiones y maquinaria requiere identificar el tipo de equipo, país y necesidad. Sin una entrada ordenada, esas solicitudes llegan incompletas y se dispersan entre canales.",
    summaryProblem: "Las solicitudes de repuestos llegaban incompletas y dispersas entre distintos canales.",
    problem_en:
      "Selling auto parts online has one key problem: the customer needs to find the exact part for their vehicle model, and a generic catalog generates returns and endless WhatsApp inquiries.",
    solution:
      "Desarrollamos un sitio que presenta la cobertura y los tipos de repuesto, guía la solicitud mediante un formulario y reúne asistencia por WhatsApp y opciones de pago en una sola experiencia.",
    summarySolution: "Un sitio que guía la cotización y reúne cobertura, asistencia y opciones de pago.",
    solution_en:
      "We built a store with search by vehicle model, a manageable catalog, a Stripe-integrated payment gateway and an internal panel to manage inventory and orders without spreadsheets.",
    outcome:
      "Portal en producción que centraliza la cotización y hace visible la cobertura internacional, los medios de contacto y los siguientes pasos para comprar.",
    summaryOutcome: "Cotización centralizada y próximos pasos visibles para clientes de distintos países.",
    outcome_en:
      "An end-to-end working store: the client manages inventory and charges online without middlemen, with the code and infrastructure in their name.",
    stack: ["React", "Node.js", "Supabase", "Stripe"],
    industry: "Retail / Automotriz",
    industry_en: "Retail / Automotive",
    role: "Desarrollo full stack",
    role_en: "Full-stack development",
    image: "/portfolio/partsmr.webp",
    url: "https://partsmr.com",
    featured: true,
  },
  {
    id: "paraguayaccess",
    title: "ParaguayAccess",
    tagline: "Portal de servicios para residentes y turistas",
    tagline_en: "Services portal for residents and tourists",
    description:
      "Plataforma web orientada a facilitar trámites y servicios para residentes extranjeros y turistas en Paraguay. Captura de leads, contenido SEO y formularios de contacto multi-servicio.",
    description_en:
      "Web platform that simplifies paperwork and services for foreign residents and tourists in Paraguay. Lead capture, SEO content and multi-service contact forms.",
    problem:
      "Los extranjeros que llegan a Paraguay enfrentan trámites confusos y dispersos, y el negocio detrás del portal necesitaba captar esas consultas de forma ordenada en vez de perderlas entre redes sociales y correos.",
    summaryProblem: "Las consultas sobre trámites llegaban dispersas y sin una clasificación consistente.",
    problem_en:
      "Foreigners arriving in Paraguay face confusing, scattered paperwork, and the business behind the portal needed to capture those inquiries in an orderly way instead of losing them across social media and email.",
    solution:
      "Construimos un portal con contenido SEO por tipo de trámite, formularios de contacto multi-servicio y captura de leads centralizada, para que cada consulta llegue clasificada y lista para responder.",
    summarySolution: "Portal con contenido por trámite y formularios que clasifican cada consulta.",
    solution_en:
      "We built a portal with SEO content per service type, multi-service contact forms and centralized lead capture, so every inquiry arrives classified and ready to answer.",
    outcome:
      "Portal en producción captando consultas orgánicas por SEO, con una base de leads ordenada por tipo de servicio.",
    summaryOutcome: "Consultas centralizadas y organizadas por tipo de servicio.",
    outcome_en:
      "Portal in production capturing organic SEO inquiries, with a lead base organized by service type.",
    stack: ["React", "Vite", "Supabase", "Tailwind"],
    industry: "Servicios / Migración",
    industry_en: "Services / Migration",
    role: "Desarrollo y diseño",
    role_en: "Development and design",
    image: "/portfolio/paraguayaccess.webp",
    url: "https://paraguayaccess.com",
    featured: true,
  },
];

const displayOrder = ["partsmr", "scissorhands", "paraguayaccess", "systempro"];

export const getProjectsInDisplayOrder = () =>
  displayOrder.map((id) => projects.find((project) => project.id === id)).filter(Boolean);

export const getFeaturedProjects = () => getProjectsInDisplayOrder().filter((project) => project.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
