import { Blocks, Boxes, CalendarClock, CreditCard, Layers, LayoutTemplate,
  MonitorSmartphone, Palette, PenTool, RefreshCw, Share2, ShoppingCart,
  Smartphone, Sparkles, Store, Tablet, Users, Wrench } from "lucide-react";

// Catálogo del mega-menú.
//
// Cuatro familias, porque son cuatro decisiones distintas del cliente: publicar
// una web, ordenar la operación con software, estar en el teléfono o resolver
// la identidad visual. Dentro de cada una, los ítems van del encargo más chico
// al más comprometido, que es como la gente evalúa.
//
// Cada ítem apunta a una página que existe. Cuando un servicio todavía no tiene
// página propia, cae en la de su familia con el ancla correspondiente: es
// preferible a un enlace muerto o a una ruta vacía que responda 200.
export const catalog = [
  {
    id: "sitios",
    label: "Sitios web",
    accent: "text-primary",
    items: [
      { icon: LayoutTemplate, title: "Landing page", text: "Una sola página, una sola acción: pensada para campañas.", href: "/desarrollo-web" },
      { icon: MonitorSmartphone, title: "Sitio corporativo", text: "Varias páginas de servicio con la arquitectura que las ordena.", href: "/desarrollo-web" },
      { icon: ShoppingCart, title: "Tienda online", text: "Catálogo, pagos y despacho conectados de punta a punta.", href: "/ecommerce" },
      { icon: RefreshCw, title: "Rediseño", text: "Tu sitio actual, más rápido y más claro, sin partir de cero.", href: "/desarrollo-web" },
      { icon: Wrench, title: "Mantención", text: "Respaldos, seguridad y cambios del mes, todos los meses.", href: "/mantencion" },
    ],
  },
  {
    id: "software",
    label: "Software",
    accent: "text-primary",
    items: [
      { icon: Blocks, title: "Software a medida", text: "Cuando ninguna herramienta del mercado calza con tu operación.", href: "/software-a-medida" },
      { icon: Boxes, title: "Inventario y pedidos", text: "Stock, órdenes y documentos en una sola fuente de verdad.", href: "/software-a-medida" },
      { icon: Users, title: "Gestión de clientes", text: "Historial, seguimiento y estado de cada conversación.", href: "/software-a-medida" },
      { icon: Layers, title: "Portales y dashboards", text: "Acceso propio para tu equipo o para tus clientes.", href: "/software-a-medida" },
      { icon: CreditCard, title: "Facturación y cobros", text: "Documentos y pagos que dejan de depender de alguien.", href: "/automatizacion" },
    ],
  },
  {
    id: "apps",
    label: "Apps móviles",
    accent: "text-primary",
    items: [
      { icon: Smartphone, title: "App para Android", text: "Publicada en Google Play, con tu cuenta de desarrollador.", href: "/software-a-medida" },
      { icon: Tablet, title: "App para iPhone", text: "Publicada en la App Store, a nombre de tu empresa.", href: "/software-a-medida" },
      { icon: Layers, title: "App multiplataforma", text: "Un solo desarrollo que corre en ambos sistemas.", href: "/software-a-medida" },
      { icon: Sparkles, title: "App web instalable", text: "Se instala desde el navegador y funciona sin señal.", href: "/software-a-medida" },
    ],
  },
  {
    id: "diseno",
    label: "Diseño",
    accent: "text-primary",
    items: [
      { icon: PenTool, title: "Logo e identidad", text: "La marca resuelta, con sus versiones y sus reglas de uso.", href: "/contacto" },
      { icon: Palette, title: "Manual de marca", text: "Colores, tipografías y ejemplos para que nadie improvise.", href: "/contacto" },
      { icon: Share2, title: "Piezas para redes", text: "Plantillas editables para publicar sin pedir ayuda.", href: "/contacto" },
      { icon: Store, title: "Material impreso", text: "Tarjetas, folletos y señalética con la misma línea.", href: "/contacto" },
    ],
  },
];

// Acciones del header que no son navegación: agendar una hora y pedir precio.
//
// Agendar sale del sitio hacia Cal.com, así que va con target y rel propios.
// CONFIRMAR el usuario de Cal: si la cuenta no es "maudev", este enlace lleva a
// una página inexistente. Es lo único de esta pantalla que no se pudo verificar
// sin acceso a la cuenta.
export const CAL_URL = "https://cal.com/maudev";

export const headerActions = {
  agendar: { label: "Agendar", href: CAL_URL, externo: true, icon: CalendarClock },
  cotizar: { label: "Cotizar proyecto", href: "/contacto?intencion=cotizar" },
};
