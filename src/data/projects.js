// Datos estáticos del portafolio. Para editar, modificar este archivo.
// Si en el futuro se requiere CRUD desde admin, los proyectos se administran
// desde la tabla 'projects' de Supabase (ver supabase/schema.sql).
//
// Las imágenes son de Unsplash (banco gratuito, uso libre). Si alguna no carga,
// el componente muestra automáticamente un placeholder monocromo (onError).

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
    stack: ["React", "Vite", "Supabase", "Cloudflare Workers"],
    industry: "SaaS / Marketing",
    industry_en: "SaaS / Marketing",
    role: "Producto propio · diseño, desarrollo, infraestructura",
    role_en: "Own product · design, development, infrastructure",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=70",
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
    stack: ["React", "Node.js", "Supabase", "Stripe"],
    industry: "Retail / Automotriz",
    industry_en: "Retail / Automotive",
    role: "Desarrollo full stack",
    role_en: "Full-stack development",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=70",
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
    stack: ["React", "Vite", "Supabase", "Tailwind"],
    industry: "Servicios / Migración",
    industry_en: "Services / Migration",
    role: "Desarrollo y diseño",
    role_en: "Development and design",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=70",
    url: "https://paraguayaccess.com",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
