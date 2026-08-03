import { subservicios } from "@/data/subservices";
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
// Los destinos ya no se escriben acá: cada ítem se enlaza con su servicio del
// catálogo por nombre, así el menú y el footer siempre llevan a la página que
// existe. Antes trece de los diecinueve caían en la página de su familia.
const conRuta = (items) =>
  items.map((item) => ({
    ...item,
    href: subservicios.find((s) => s.nombre === item.title)?.path || "/contacto",
  }));

export const catalog = [
  {
    id: "sitios",
    label: "Sitios web",
    accent: "text-primary",
    items: conRuta([
      { icon: LayoutTemplate, title: "Landing page", text: "Una sola página, una sola acción: pensada para campañas." },
      { icon: MonitorSmartphone, title: "Sitio corporativo", text: "Varias páginas de servicio con la arquitectura que las ordena." },
      { icon: ShoppingCart, title: "Tienda online", text: "Catálogo, pagos y despacho conectados de punta a punta." },
      { icon: RefreshCw, title: "Rediseño", text: "Tu sitio actual, más rápido y más claro, sin partir de cero." },
      { icon: Wrench, title: "Mantención", text: "Respaldos, seguridad y cambios del mes, todos los meses." },
    ]),
  },
  {
    id: "software",
    label: "Software",
    accent: "text-primary",
    items: conRuta([
      { icon: Blocks, title: "Software a medida", text: "Cuando ninguna herramienta del mercado calza con tu operación." },
      { icon: Boxes, title: "Inventario y pedidos", text: "Stock, órdenes y documentos en una sola fuente de verdad." },
      { icon: Users, title: "Gestión de clientes", text: "Historial, seguimiento y estado de cada conversación." },
      { icon: Layers, title: "Portales y dashboards", text: "Acceso propio para tu equipo o para tus clientes." },
      { icon: CreditCard, title: "Facturación y cobros", text: "Documentos y pagos que dejan de depender de alguien." },
    ]),
  },
  {
    id: "apps",
    label: "Apps móviles",
    accent: "text-primary",
    items: conRuta([
      { icon: Smartphone, title: "App para Android", text: "Publicada en Google Play, con tu cuenta de desarrollador." },
      { icon: Tablet, title: "App para iPhone", text: "Publicada en la App Store, a nombre de tu empresa." },
      { icon: Layers, title: "App multiplataforma", text: "Un solo desarrollo que corre en ambos sistemas." },
      { icon: Sparkles, title: "App web instalable", text: "Se instala desde el navegador y funciona sin señal." },
    ]),
  },
  {
    id: "diseno",
    label: "Diseño",
    accent: "text-primary",
    items: conRuta([
      { icon: PenTool, title: "Logo e identidad", text: "La marca resuelta, con sus versiones y sus reglas de uso." },
      { icon: Palette, title: "Manual de marca", text: "Colores, tipografías y ejemplos para que nadie improvise." },
      { icon: Share2, title: "Piezas para redes", text: "Plantillas editables para publicar sin pedir ayuda." },
      { icon: Store, title: "Material impreso", text: "Tarjetas, folletos y señalética con la misma línea." },
    ]),
  },
];

// Acciones del header que no son navegación: agendar una hora y pedir precio.
//
// Agendar sale del sitio hacia Cal.com, así que va con target y rel propios.
//
// Se enlaza el evento sin parámetros de fecha. El enlace que se compartió traía
// `?month=2026-08&date=2026-08-03`, que son el estado de navegación de quien lo
// copió: dejarlos fijos abriría el calendario anclado a ese día para siempre y,
// pasada la fecha, el visitante caería en un mes vacío. Sin parámetros, Cal
// abre en el primer día con disponibilidad real.
export const CAL_URL = "https://cal.com/maudev/30min";

export const headerActions = {
  agendar: { label: "Agendar", href: CAL_URL, externo: true, icon: CalendarClock },
  cotizar: { label: "Cotizar proyecto", href: "/contacto?intencion=cotizar" },
};
