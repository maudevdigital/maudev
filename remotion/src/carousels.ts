import type { Tip } from "./tips";

// Carruseles (20% del contenido). Cada uno es una secuencia de tarjetas
// (ValueCard) que se publican como carrusel en IG/LinkedIn. Derivados del blog.
export type Carousel = { id: string; label: string; slides: Tip[] };

export const carousels: Carousel[] = [
  // Día 1 — del post "Cuánto cuesta software a medida".
  {
    id: "d1-cotizacion",
    label: "D1 · Qué debe incluir tu cotización",
    slides: [
      { category: "Software a medida", title: "5 cosas que tu cotización de software DEBE incluir", bullets: [], outro: "Desliza →" },
      { category: "Software a medida", title: "Lo que el software barato omite", bullets: ["Pruebas (testing)", "Seguridad y control de acceso", "Documentación", "Soporte post-entrega"], outro: "2 / 3" },
      { category: "Software a medida", title: "…y lo más importante", bullets: ["El código queda a TU nombre", "Precio y alcance por escrito"], outro: "maudev.cl · 3 / 3" },
    ],
  },

  // Día 3 — del post "Cómo elegir una empresa de desarrollo".
  {
    id: "d3-senales-alerta",
    label: "D3 · 7 señales de alerta al contratar",
    slides: [
      { category: "Confianza", title: "7 señales de alerta al contratar un desarrollador de software", bullets: [], outro: "Desliza →" },
      { category: "Confianza", title: "🚩 Señales de alerta", bullets: ["Te cotizan sin entender tu negocio", "No muestran avances hasta el final", "No ponen el alcance por escrito", "Precio sospechosamente bajo"], outro: "2 / 3" },
      { category: "Confianza", title: "🚩 …y estas tres", bullets: ["No muestran trabajos ni referencias", "Evaden de quién es el código", "Solo te atiende un vendedor"], outro: "maudev.cl · 3 / 3" },
    ],
  },

  // Día 5 — del post "De idea a sistema".
  {
    id: "d5-etapas-proyecto",
    label: "D5 · Las 6 etapas de un proyecto",
    slides: [
      { category: "Desarrollo", title: "Las 6 etapas de un proyecto de software a medida", bullets: [], outro: "Desliza →" },
      { category: "Desarrollo", title: "De la idea al sistema", bullets: ["Descubrimiento: entender tu negocio", "Diseño y arquitectura", "Desarrollo por sprints"], outro: "2 / 3" },
      { category: "Desarrollo", title: "…hasta que lo usas", bullets: ["Pruebas (QA)", "Despliegue seguro", "Soporte y evolución"], outro: "maudev.cl · 3 / 3" },
    ],
  },
];
