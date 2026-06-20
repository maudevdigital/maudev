// Datos estáticos del portafolio. Para editar, modificar este archivo.
// Si en el futuro se requiere CRUD desde admin, los proyectos se administran
// desde la tabla 'projects' de Supabase (ver supabase/schema.sql).
//
// ⚠️ IMÁGENES: usar screenshots REALES de cada proyecto (nada de stock).
// Captura cada sitio (1280x720 aprox) y guarda los archivos en /public/portfolio/:
//   /public/portfolio/systempro.png
//   /public/portfolio/partsmr.png
//   /public/portfolio/paraguayaccess.png
// Mientras no existan, el componente muestra automáticamente un placeholder
// monocromo (onError), así que el sitio no se rompe.
//
// Cada proyecto incluye su caso de estudio (problem / solution / outcome),
// usado por la página /portafolio/:id. Campos *_en para inglés.
// ⚠️ Revisa que los textos de los casos reflejen fielmente cada proyecto.

export const projects = [
  {
    id: "systempro",
    title: "SystemePro",
    tagline: "SaaS de captación y automatización de leads",
    tagline_en: "Lead capture and automation SaaS",
    description:
      "Plataforma propia que capta leads, los dispara a embudos automatizados y mide conversiones end-to-end. Integra Meta Pixel y GA4 en un mismo dashboard para optimizar campañas en tiempo real.",
    description_en:
      "Our own platform that captures leads, pushes them into automated funnels and measures conversions end-to-end. It integrates Meta Pixel and GA4 in a single dashboard to optimize campaigns in real time.",
    problem:
      "Las PYMEs que invierten en anuncios suelen perder leads en el camino: llegan por distintos canales, nadie los responde a tiempo y no hay forma de saber qué campaña los trajo. Las herramientas existentes son caras o demasiado complejas para un equipo chico.",
    problem_en:
      "SMBs that invest in ads tend to lose leads along the way: they arrive through different channels, nobody replies in time and there's no way to know which campaign brought them. Existing tools are expensive or too complex for a small team.",
    solution:
      "Construimos una plataforma que centraliza la captura de leads, los enruta a embudos automatizados de seguimiento y atribuye cada conversión a su campaña de origen (Meta Pixel + GA4) en un solo dashboard. Arquitectura serverless en Cloudflare Workers con Supabase como base de datos.",
    solution_en:
      "We built a platform that centralizes lead capture, routes leads into automated follow-up funnels and attributes every conversion to its source campaign (Meta Pixel + GA4) in a single dashboard. Serverless architecture on Cloudflare Workers with Supabase as the database.",
    outcome:
      "Producto propio en producción, usado para gestionar campañas reales de captación. Es también nuestro laboratorio: lo que probamos y funciona ahí, lo aplicamos en los proyectos de clientes.",
    outcome_en:
      "Our own product in production, used to manage real lead-gen campaigns. It's also our lab: what we test and validate there, we apply to client projects.",
    stack: ["React", "Vite", "Supabase", "Cloudflare Workers"],
    industry: "SaaS / Marketing",
    industry_en: "SaaS / Marketing",
    role: "Producto propio · diseño, desarrollo, infraestructura",
    role_en: "Own product · design, development, infrastructure",
    image: "/portfolio/systempro.png",
    url: "https://systemepro.com",
    featured: true,
  },
  {
    id: "partsmr",
    title: "PartsMr",
    tagline: "E-commerce de repuestos automotrices",
    tagline_en: "Auto-parts e-commerce",
    description:
      "Tienda en línea con catálogo de repuestos, búsqueda por modelo de vehículo, integración con pasarela de pago y panel de administración para gestionar inventario y órdenes.",
    description_en:
      "Online store with a parts catalog, search by vehicle model, payment gateway integration and an admin panel to manage inventory and orders.",
    problem:
      "Vender repuestos online tiene un problema clave: el cliente necesita encontrar la pieza exacta para su modelo de vehículo, y un catálogo genérico genera devoluciones y consultas infinitas por WhatsApp.",
    problem_en:
      "Selling auto parts online has one key problem: the customer needs to find the exact part for their vehicle model, and a generic catalog generates returns and endless WhatsApp inquiries.",
    solution:
      "Desarrollamos una tienda con búsqueda por modelo de vehículo, catálogo administrable, pasarela de pago integrada con Stripe y un panel interno para gestionar inventario y órdenes sin depender de planillas.",
    solution_en:
      "We built a store with search by vehicle model, a manageable catalog, a Stripe-integrated payment gateway and an internal panel to manage inventory and orders without spreadsheets.",
    outcome:
      "Tienda operativa de punta a punta: el cliente gestiona su inventario y cobra online sin intermediarios, con el código y la infraestructura a su nombre.",
    outcome_en:
      "An end-to-end working store: the client manages inventory and charges online without middlemen, with the code and infrastructure in their name.",
    stack: ["React", "Node.js", "Supabase", "Stripe"],
    industry: "Retail / Automotriz",
    industry_en: "Retail / Automotive",
    role: "Desarrollo full stack",
    role_en: "Full-stack development",
    image: "/portfolio/partsmr.png",
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
    problem_en:
      "Foreigners arriving in Paraguay face confusing, scattered paperwork, and the business behind the portal needed to capture those inquiries in an orderly way instead of losing them across social media and email.",
    solution:
      "Construimos un portal con contenido SEO por tipo de trámite, formularios de contacto multi-servicio y captura de leads centralizada, para que cada consulta llegue clasificada y lista para responder.",
    solution_en:
      "We built a portal with SEO content per service type, multi-service contact forms and centralized lead capture, so every inquiry arrives classified and ready to answer.",
    outcome:
      "Portal en producción captando consultas orgánicas por SEO, con una base de leads ordenada por tipo de servicio.",
    outcome_en:
      "Portal in production capturing organic SEO inquiries, with a lead base organized by service type.",
    stack: ["React", "Vite", "Supabase", "Tailwind"],
    industry: "Servicios / Migración",
    industry_en: "Services / Migration",
    role: "Desarrollo y diseño",
    role_en: "Development and design",
    image: "/portfolio/paraguayaccess.png",
    url: "https://paraguayaccess.com",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
