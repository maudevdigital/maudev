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
    description:
      "Plataforma propia que capta leads, los dispara a embudos automatizados y mide conversiones end-to-end. Integra Meta Pixel y GA4 en un mismo dashboard para optimizar campañas en tiempo real.",
    stack: ["React", "Vite", "Supabase", "Cloudflare Workers"],
    industry: "SaaS / Marketing",
    role: "Producto propio · diseño, desarrollo, infraestructura",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=70",
    url: "https://systempro.app",
    featured: true,
  },
  {
    id: "partsmr",
    title: "PartsMr",
    tagline: "E-commerce de repuestos automotrices",
    description:
      "Tienda en línea con catálogo de repuestos, búsqueda por modelo de vehículo, integración con pasarela de pago y panel de administración para gestionar inventario y órdenes.",
    stack: ["React", "Node.js", "Supabase", "Stripe"],
    industry: "Retail / Automotriz",
    role: "Desarrollo full stack",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=70",
    url: "https://partsmr.com",
    featured: true,
  },
  {
    id: "paraguayaccess",
    title: "ParaguayAccess",
    tagline: "Portal de servicios para residentes y turistas",
    description:
      "Plataforma web orientada a facilitar trámites y servicios para residentes extranjeros y turistas en Paraguay. Captura de leads, contenido SEO y formularios de contacto multi-servicio.",
    stack: ["React", "Vite", "Supabase", "Tailwind"],
    industry: "Servicios / Migración",
    role: "Desarrollo y diseño",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=70",
    url: "https://paraguayaccess.com",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
