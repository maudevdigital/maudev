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
  {
    category: "Conversión",
    title: "Por qué tu landing no convierte",
    bullets: [
      "Tarda demasiado en cargar",
      "El mensaje no se entiende en 5 segundos",
      "Tiene 5 botones en vez de 1 claro",
      "El formulario no llega a ningún lado",
    ],
    outro: "Un mensaje, un botón, una acción",
  },
  {
    category: "WhatsApp",
    title: "Tu WhatsApp puede vender mientras duermes",
    bullets: [
      "Responde horarios, precios y stock al instante",
      "Califica al cliente con 2-3 preguntas",
      "Te avisa solo cuando el lead vale la pena",
      "Deriva a un humano cuando hace falta",
    ],
    outro: "Atención 24/7 sin contratar a nadie",
  },
  {
    category: "Software a medida",
    title: "3 señales de que ya necesitas software propio",
    bullets: [
      "Pagas 5 apps que no se hablan entre sí",
      "Tu operación vive en planillas que se rompen",
      "Haces a mano lo mismo cada semana",
    ],
    outro: "Cuando el proceso es tu ventaja",
  },
  {
    category: "Velocidad",
    title: "Cada segundo de carga te cuesta clientes",
    bullets: [
      "53% se va si tarda más de 3 segundos",
      "Google posiciona mejor lo rápido",
      "Plantillas pesadas = más plugins, más lento",
      "Stack moderno + código limpio = veloz",
    ],
    outro: "Rápido también es más barato de mantener",
  },
  {
    category: "Confianza",
    title: "Qué debe decir tu contrato de desarrollo",
    bullets: [
      "Precio fijo por escrito",
      "Hitos con entregas que ves funcionando",
      "El código y el dominio quedan a tu nombre",
      "Soporte después de entregar",
    ],
    outro: "Sin esto, no firmes",
  },
];
