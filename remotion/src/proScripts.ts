import type { ProReelProps } from "./ProReel";

// Reels ProReel (animaciones/luces/transiciones) de la semana 29 jun–5 jul,
// derivados de la serie 2 del blog. Voz Brian, música y acento variados.
export type ProScriptDef = ProReelProps & { id: string; label: string };

export const proScripts: ProScriptDef[] = [
  {
    id: "pro-errores", label: "Errores caros", voice: "pro-errores.mp3", music: "music-viral1.wav", accent: "#19d4d4", tagline: "Hecho bien a la primera",
    scenes: [
      { text: "Hay un error que te hace pagar 2 veces.", fx: "slideU", frames: 95 },
      { text: "Elegir por precio.", fx: "scale", frames: 60, accent: true, size: 84 },
      { text: "El software barato no es barato:", fx: "slideL", frames: 90 },
      { text: "es incompleto.", fx: "scale", frames: 60, accent: true, size: 88 },
      { text: "Lo que falta lo pagas después.", fx: "slideR", frames: 90 },
      { text: "Compara por lo que incluye.", fx: "slideU", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-precio", label: "Precio software", voice: "pro-precio.mp3", music: "music-viral2.wav", accent: "#38b6ff", tagline: "Precios claros, sin humo",
    scenes: [
      { text: "¿Cuánto cuesta un software?", fx: "slideU", frames: 80 },
      { text: "Depende. Y mucho.", fx: "scale", frames: 60, accent: true, size: 84 },
      { text: "El mismo proyecto", fx: "slideL", frames: 65 },
      { text: "puede costar 10 veces distinto.", fx: "slideR", frames: 95, accent: true },
      { text: "Alcance, lógica, integraciones,", fx: "slideU", frames: 85 },
      { text: "y quién lo construye.", fx: "wipe", frames: 80, accent: true },
    ],
  },
  {
    id: "pro-integraciones", label: "Integraciones", voice: "pro-integraciones.mp3", music: "music-viral3.wav", accent: "#2ee6a6", tagline: "Que tus sistemas se hablen",
    scenes: [
      { text: "El valor de tu software", fx: "slideU", frames: 80 },
      { text: "no está en las pantallas.", fx: "slideL", frames: 85, accent: true },
      { text: "Está en que tus herramientas", fx: "slideR", frames: 85 },
      { text: "se hablen entre sí.", fx: "scale", frames: 75, accent: true },
      { text: "Sin integraciones: copiar y pegar.", fx: "slideU", frames: 95 },
      { text: "Con integraciones: todo fluye solo.", fx: "wipe", frames: 95, accent: true },
    ],
  },
  {
    id: "pro-mvp", label: "MVP", voice: "pro-mvp.mp3", music: "music-viral4.wav", accent: "#8b9cff", tagline: "Empieza con lo mínimo viable",
    scenes: [
      { text: "No necesitas", fx: "slideU", frames: 60 },
      { text: "la app completa.", fx: "scale", frames: 70, accent: true, size: 84 },
      { text: "Necesitas un MVP:", fx: "slideL", frames: 65 },
      { text: "lo mínimo que ya aporta valor.", fx: "slideR", frames: 95, accent: true },
      { text: "Construye poco. Aprende rápido.", fx: "slideU", frames: 90 },
      { text: "Crece con lo que facturas.", fx: "wipe", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-mantencion", label: "Mantención", voice: "pro-mantencion.mp3", music: "music-tension.wav", accent: "#19d4d4", tagline: "Cuida tu inversión",
    scenes: [
      { text: "Presupuestas el software.", fx: "slideU", frames: 80 },
      { text: "¿Y la mantención?", fx: "scale", frames: 65, accent: true },
      { text: "El software, como un auto,", fx: "slideL", frames: 80 },
      { text: "tiene costo de uso.", fx: "slideR", frames: 75, accent: true },
      { text: "15 a 20% al año.", fx: "scale", frames: 70, size: 84 },
      { text: "Lo que no se mantiene, envejece.", fx: "slideU", frames: 90, accent: true },
    ],
  },
  {
    id: "pro-ia", label: "IA para PYMEs", voice: "pro-ia.mp3", music: "music-focus.wav", accent: "#38b6ff", tagline: "IA con criterio",
    scenes: [
      { text: "Todos te ofrecen IA.", fx: "slideU", frames: 75 },
      { text: "¿Pero qué sirve de verdad?", fx: "slideL", frames: 80, accent: true },
      { text: "Sí: responder leads, resumir, 24/7.", fx: "slideR", frames: 100 },
      { text: "No: decisiones críticas sin supervisión.", fx: "wipe", frames: 100, accent: true },
      { text: "La IA es una herramienta,", fx: "slideU", frames: 80 },
      { text: "no reemplaza tu criterio.", fx: "scale", frames: 80, accent: true },
    ],
  },
  {
    id: "pro-seguridad", label: "Seguridad", voice: "pro-seguridad.mp3", music: "music-night.wav", accent: "#8b9cff", tagline: "Protege a tus clientes",
    scenes: [
      { text: "La seguridad de tu software", fx: "slideU", frames: 80 },
      { text: "es invisible.", fx: "scale", frames: 60, accent: true },
      { text: "Hasta que falla.", fx: "scale", frames: 60, size: 84 },
      { text: "Una filtración cuesta clientes,", fx: "slideL", frames: 85 },
      { text: "multas y reputación.", fx: "slideR", frames: 75, accent: true },
      { text: "Exígela desde el día uno.", fx: "slideU", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-checklist", label: "Antes de pagar", voice: "pro-checklist.mp3", music: "music-uplift.wav", accent: "#2ee6a6", tagline: "Exige lo correcto",
    scenes: [
      { text: "Antes de pagar por software,", fx: "slideU", frames: 85 },
      { text: "exige esto:", fx: "scale", frames: 55, accent: true, size: 84 },
      { text: "El código a TU nombre.", fx: "slideL", frames: 80 },
      { text: "Precio y alcance por escrito.", fx: "slideR", frames: 80 },
      { text: "Avances que ves funcionando.", fx: "slideU", frames: 80 },
      { text: "Si lo evaden, corre.", fx: "scale", frames: 75, accent: true },
    ],
  },
];
