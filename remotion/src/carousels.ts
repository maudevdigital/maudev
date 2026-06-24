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
];
