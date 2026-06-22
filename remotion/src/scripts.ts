// Guiones de video por código. Cada video = una secuencia de ESCENAS.
// El motor (ScriptedVideo) las reproduce en orden y calcula la duración solo.
// Tipos de escena: intro · point (paso) · code (snippet) · outro.

export type Scene =
  | { type: "intro"; title: string; subtitle?: string; seconds: number }
  | { type: "point"; n: number; heading: string; body: string; seconds: number }
  | { type: "code"; caption: string; lines: string[]; seconds: number }
  | { type: "outro"; text: string; seconds: number };

export type VideoScript = {
  id: string;
  category: string;
  scenes: Scene[];
  music?: string;
};

export const scripts: VideoScript[] = [
  {
    id: "automatiza-leads",
    category: "Automatización",
    music: "music.wav",
    scenes: [
      { type: "intro", title: "Automatiza tus leads", subtitle: "en 4 pasos", seconds: 3 },
      { type: "point", n: 1, heading: "Captura", body: "Un formulario que cae en tu base, no en el olvido.", seconds: 3.5 },
      { type: "point", n: 2, heading: "Responde al instante", body: "Un bot saluda y califica en segundos, 24/7.", seconds: 3.5 },
      { type: "point", n: 3, heading: "Hace seguimiento", body: "Mensajes a los 3, 7 y 14 días, automáticos.", seconds: 3.5 },
      { type: "code", caption: "La idea, simplificada", lines: ["nuevo_lead →", "  guardar en base", "  responder al instante", "  agendar seguimiento"], seconds: 4 },
      { type: "outro", text: "Te lo montamos con precio fijo", seconds: 3 },
    ],
  },
  {
    id: "necesitas-software",
    category: "Software a medida",
    music: "music.wav",
    scenes: [
      { type: "intro", title: "¿Necesitas software a medida?", subtitle: "3 señales", seconds: 3 },
      { type: "point", n: 1, heading: "Apps que no se hablan", body: "Pagas 5 suscripciones y copias datos a mano.", seconds: 3.5 },
      { type: "point", n: 2, heading: "Excel que se rompe", body: "Tu operación vive en planillas duplicadas.", seconds: 3.5 },
      { type: "point", n: 3, heading: "Trabajo repetitivo", body: "Haces lo mismo cada semana, a mano.", seconds: 3.5 },
      { type: "outro", text: "Si te pasa, conversemos · maudev.cl", seconds: 3 },
    ],
  },
];
