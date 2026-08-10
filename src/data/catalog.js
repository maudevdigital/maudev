import {
  Blocks, Boxes, CalendarClock, CreditCard, FileCheck2, Layers, LayoutTemplate,
  MonitorSmartphone, Palette, PenTool, RefreshCw, Share2, ShoppingCart,
  Smartphone, Sparkles, Store, Users, Wrench,
} from "lucide-react";
import { familias, subservicios } from "@/data/subservices";

// Catálogo del mega-menú y del footer.
//
// Se DERIVA de subservices.js en vez de tener lista propia. Antes eran dos
// listas escritas por separado y emparejadas por el nombre visible, y se
// desincronizaron en silencio: el menú decía "Rediseño" y el servicio se
// llamaba "Rediseño web", así que once de dieciocho enlaces no encontraban su
// página y caían en /contacto. Nadie se entera de algo así hasta que un
// visitante pincha y aterriza en el formulario.
//
// Con esta forma no puede repetirse: si el servicio existe, su enlace existe y
// apunta a su ruta; si no existe, no aparece en el menú.

// Lo único propio de esta capa es el ícono: es decisión visual, no dato del
// servicio. Si falta alguno, cae en el de su familia.
const iconos = {
  landing: LayoutTemplate,
  sitio: MonitorSmartphone,
  rediseno: RefreshCw,
  ecommerce: ShoppingCart,
  plataforma: Layers,
  crm: Users,
  pos: Store,
  integracion: Blocks,
  automatizacion: Sparkles,
  erp: Boxes,
  pwa: Sparkles,
  "app-interna": Wrench,
  "app-multi": Layers,
  "app-nativa": Smartphone,
  logo: PenTool,
  redes: Share2,
  ux: FileCheck2,
  branding: Palette,
  "design-system": CreditCard,
};

const iconoFamilia = {
  web: MonitorSmartphone,
  software: Blocks,
  apps: Smartphone,
  branding: Palette,
};

export const catalog = familias.map((familia) => ({
  id: familia.id,
  label: familia.label,
  accent: "text-primary",
  items: subservicios
    .filter((servicio) => servicio.familia === familia.id)
    .map((servicio) => ({
      icon: iconos[servicio.id] || iconoFamilia[familia.id],
      title: servicio.nombre,
      text: servicio.resumen,
      href: servicio.path,
    })),
}));

// Acciones del header que no son navegación: agendar una hora y pedir precio.
//
// Agendar sale del sitio hacia Cal.com, así que va con target y rel propios.
// Se enlaza el evento sin parámetros de fecha: los del enlace compartido eran
// el estado de navegación de quien lo copió, y fijarlos dejaría el calendario
// anclado a un día que ya pasó.
export const CAL_URL = "https://cal.com/maudev/30min";

export const headerActions = {
  agendar: { label: "Agendar", href: CAL_URL, externo: true, icon: CalendarClock },
  cotizar: { label: "Cotizar proyecto", href: "/contacto?intencion=cotizar" },
};
