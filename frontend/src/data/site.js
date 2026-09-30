// Configuración central del sitio: identidad, disponibilidad y CTA.
// Un solo lugar para editar lo que se repite en navbar, hero, footer, etc.

export const founder = {
  name: "Lucas Maulén",
  firstName: "Lucas",
  role: "Ingeniero Civil Informático · Fundador de Maudev",
  github: null,
  linkedin: null,
};

// Agendar sale del sitio hacia Cal.com. Sin parámetros de fecha: dejarían el
// calendario anclado a un día que ya pasó.
export const CAL_URL = "https://cal.com/maudev/30min";

export const headerActions = {
  agendar: { label: "Agendar", href: CAL_URL },
  cotizar: { label: "Cotizar proyecto" },
};

export const CTA_LABEL = "Cotiza tu proyecto";
export const CTA_MESSAGE =
  "Hola, vengo de maudev.cl y quiero cotizar un proyecto.";
