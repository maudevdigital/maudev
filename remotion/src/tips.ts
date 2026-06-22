// Contenido educativo (siempre aporta valor). Cada "tip" sirve para un reel
// (TipReel) y/o una tarjeta de carrusel/post (ValueCard).
// Mantén los textos CORTOS para que entren bien en pantalla.

export type Tip = {
  category: string;
  title: string;
  bullets: string[];
  outro: string;
};

export const tips: Tip[] = [
  {
    category: "Automatización",
    title: "5 procesos que tu PYME puede automatizar hoy",
    bullets: [
      "Responder y calificar leads al instante",
      "Agendar reuniones sin ir y volver",
      "Seguimiento posventa automático",
      "Emitir cotizaciones y contratos",
      "Reportes que se arman solos",
    ],
    outro: "Empieza por lo que más se repite",
  },
  {
    category: "Antes de pagar",
    title: "Pregunta esto antes de pagar por tu web",
    bullets: [
      "¿De quién queda el código? (debe ser tuyo)",
      "¿Hay precio fijo por escrito?",
      "¿Veo avances funcionando?",
      "¿Hay soporte después de entregar?",
    ],
    outro: "La transparencia es parte del producto",
  },
  {
    category: "SEO",
    title: "Tu web es invisible para Google si...",
    bullets: [
      "Tarda más de 2-3 segundos en cargar",
      "No tiene títulos ni metadatos claros",
      "No es usable en el celular",
      "No tiene contenido que respondan dudas",
    ],
    outro: "Rápida + clara = más visitas",
  },
  {
    category: "Pagos online",
    title: "Cobrar online en Chile en 2026",
    bullets: [
      "Webpay / Mercado Pago: clientes locales",
      "Stripe: tarjetas del mundo",
      "USDT: extranjero, rápido y barato",
      "Confirma el pago SIEMPRE en el servidor",
    ],
    outro: "Elige según a quién le vendes",
  },
];
