// Datos estáticos del portafolio. Para editar, modificar este archivo.
// Si en el futuro se requiere CRUD desde admin, migrar a Firestore (collection 'projects').

export const projects = [
  {
    id: "systempro",
    title: "SystemePro",
    tagline: "SaaS de captación y automatización de leads",
    description:
      "Plataforma propia que conecta systeme.io, Cloudflare Workers, Firebase y Resend para captar leads, dispararlos a embudos y medir conversiones end-to-end. Integra Meta Pixel, Pinterest CAPI y GA4 en un mismo dashboard.",
    stack: ["React", "Vite", "Firebase", "Cloudflare Workers", "Resend", "Pinterest CAPI"],
    industry: "SaaS / Marketing",
    role: "Producto propio · diseño, desarrollo, infraestructura",
    image: null,
    url: "https://systempro.app",
    featured: true,
  },
  {
    id: "partsmr",
    title: "PartsMr",
    tagline: "E-commerce de repuestos automotrices",
    description:
      "Tienda en línea con catálogo de repuestos, búsqueda por modelo de vehículo, integración con pasarela de pago y panel de administración para gestionar inventario y órdenes.",
    stack: ["React", "Node.js", "Firebase", "Stripe"],
    industry: "Retail / Automotriz",
    role: "Desarrollo full stack",
    image: null,
    url: "https://partsmr.com",
    featured: true,
  },
  {
    id: "paraguayaccess",
    title: "ParaguayAccess",
    tagline: "Portal de servicios para residentes y turistas",
    description:
      "Plataforma web orientada a facilitar trámites y servicios para residentes extranjeros y turistas en Paraguay. Captura de leads, contenido SEO y formularios de contacto multi-servicio.",
    stack: ["React", "Vite", "Firebase", "Tailwind"],
    industry: "Servicios / Migración",
    role: "Desarrollo y diseño",
    image: null,
    url: "https://paraguayaccess.com",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
