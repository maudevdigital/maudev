import type { VoiceReelProps } from "./VoiceReel";

// Guiones de reels NARRADOS con voz en off. Cada uno usa un gatillo psicológico
// distinto (honesto, sin promesas falsas) + voz, música y acento propios para
// variar. El texto en pantalla acompaña a la narración (mismo guion).
export type VoiceScriptDef = VoiceReelProps & { id: string; label: string };

export const voiceScripts: VoiceScriptDef[] = [
  {
    id: "perdida",
    label: "Aversión a la pérdida",
    voice: "voice-perdida.mp3",
    music: "music-tension.wav",
    accent: "#38b6ff",
    tagline: "Automatización que trabaja por ti",
    scenes: [
      { text: "¿Cuántos clientes te escribieron…", frames: 85 },
      { text: "…y no alcanzaste a responder?", frames: 70, accent: true, size: 76 },
      { text: "Cada mensaje sin contestar\nes una venta para tu competencia.", frames: 115 },
      { text: "Mientras tú duermes,\nun sistema responde por ti.", frames: 110 },
      { text: "No es gastar.", frames: 55, size: 78 },
      { text: "Es dejar de perder.", frames: 80, accent: true, size: 84 },
    ],
  },
  {
    id: "web",
    label: "Autoridad / primera impresión",
    voice: "voice-web.mp3",
    music: "music-uplift.wav",
    accent: "#2ee6a6",
    tagline: "Software que vende por ti",
    scenes: [
      { text: "En 3 segundos tu web decide\nsi te toman en serio.", frames: 115 },
      { text: "Si carga lento,\nsi se ve del año pasado…", frames: 90 },
      { text: "…ya perdiste al cliente.", frames: 70, accent: true, size: 78 },
      { text: "Tu trabajo es excelente.\nTu sitio debería gritarlo.", frames: 115 },
      { text: "Rápido. Claro.\nHecho a tu medida.", frames: 90, accent: true },
    ],
  },
  {
    id: "primero",
    label: "Urgencia / ventaja del primero",
    voice: "voice-primero.mp3",
    music: "music-focus.wav",
    accent: "#8b9cff",
    tagline: "Tecnología para crecer sin fricción",
    scenes: [
      { text: "El negocio que automatiza primero…", frames: 90 },
      { text: "…gana primero.", frames: 60, accent: true, size: 84 },
      { text: "Responde antes.\nCotiza antes.\nCierra antes.", frames: 115 },
      { text: "No necesitas trabajar más.\nNecesitas mejores sistemas.", frames: 115 },
      { text: "Empieza hoy.", frames: 55, size: 80 },
      { text: "Mañana, tu competencia\nya empezó.", frames: 85, accent: true },
    ],
  },

  // ===== Serie semanal · social derivado del blog (voz "Brian", música viral) =====
  // Día 1 — del post "Cuánto cuesta software a medida".
  {
    id: "d1-cotizan-rapido",
    label: "D1 · Cotización al tiro = alerta",
    voice: "social-d1r1.mp3",
    music: "music-viral1.wav",
    accent: "#19d4d4",
    tagline: "Precios claros, sin sorpresas",
    scenes: [
      { text: "¿Te cotizaron un software\nen 5 minutos?", frames: 95 },
      { text: "Cuidado.", frames: 50, accent: true, size: 92 },
      { text: "O es una plantilla\ndisfrazada de “a medida”…", frames: 100 },
      { text: "…o el precio va a subir\napenas empiece.", frames: 95, accent: true },
      { text: "Lo serio: primero\nentender tu negocio.", frames: 105 },
    ],
  },
  {
    id: "d1-barato-caro",
    label: "D1 · Lo barato sale caro",
    voice: "social-d1r2.mp3",
    music: "music-viral3.wav",
    accent: "#38b6ff",
    tagline: "Hecho bien a la primera",
    scenes: [
      { text: "¿La cotización\nmás barata?", frames: 80 },
      { text: "Casi nunca conviene.", frames: 65, accent: true, size: 78 },
      { text: "El software barato\nno es barato:", frames: 90 },
      { text: "es incompleto.", frames: 60, accent: true, size: 88 },
      { text: "Sin pruebas, sin seguridad,\nsin soporte.", frames: 95 },
      { text: "Pagar bien una vez\nsale más barato\nque pagar dos.", frames: 110, accent: true },
    ],
  },

  // Día 2 — del post "Software a medida vs SaaS".
  {
    id: "d2-ocho-suscripciones", label: "D2 · 8 suscripciones que no calzan",
    voice: "social-d2r1.mp3", music: "music-viral2.wav", accent: "#2ee6a6", tagline: "Una sola herramienta, hecha para ti",
    scenes: [
      { text: "¿Pagas 8 suscripciones…", frames: 85 },
      { text: "…y ninguna calza\ndel todo?", frames: 85, accent: true },
      { text: "Cada una se siente barata.", frames: 80 },
      { text: "Juntas, una mochila\nque crece cada año.", frames: 100, accent: true },
      { text: "Quizás ya no necesitas\nmás apps.", frames: 90 },
      { text: "Necesitas algo\nque sea TUYO.", frames: 95, accent: true },
    ],
  },
  {
    id: "d2-cinco-anios", label: "D2 · Barato hasta que sumas 5 años",
    voice: "social-d2r2.mp3", music: "music-viral4.wav", accent: "#8b9cff", tagline: "Lo tuyo queda como activo",
    scenes: [
      { text: "El SaaS es barato…", frames: 70 },
      { text: "…hasta que sumas\n5 años.", frames: 80, accent: true },
      { text: "$80.000 al mes", frames: 70, size: 84 },
      { text: "son 5 millones\nen 5 años.", frames: 90, accent: true },
      { text: "Y no te queda nada.", frames: 75 },
      { text: "Lo a medida, al menos,\nes tuyo.", frames: 95, accent: true },
    ],
  },
  {
    id: "d2-cuando-construir", label: "D2 · Cuándo construir lo tuyo",
    voice: "social-d2r3.mp3", music: "music-viral5.wav", accent: "#19d4d4", tagline: "Construye donde te da ventaja",
    scenes: [
      { text: "¿Cuándo construir\nlo tuyo?", frames: 80 },
      { text: "Cuando el proceso\nES tu ventaja.", frames: 95, accent: true },
      { text: "Cuando ya peleas\ncon la herramienta.", frames: 90 },
      { text: "Cuando exportas a Excel", frames: 80 },
      { text: "para hacer lo que no hace.", frames: 85, accent: true },
      { text: "Ahí dejó de calzar.", frames: 75, accent: true, size: 80 },
    ],
  },

  // Día 3 — del post "Cómo elegir una empresa de desarrollo".
  {
    id: "d3-mas-barata", label: "D3 · La más barata casi nunca conviene",
    voice: "social-d3r1.mp3", music: "music-uplift.wav", accent: "#38b6ff", tagline: "Compara por lo que incluye",
    scenes: [
      { text: "La cotización más barata…", frames: 80 },
      { text: "…casi nunca conviene.", frames: 70, accent: true },
      { text: "Lo barato viene sin pruebas,", frames: 85 },
      { text: "sin soporte, sin tu código.", frames: 85, accent: true },
      { text: "Compara por lo que INCLUYE,", frames: 90 },
      { text: "no por el número final.", frames: 85, accent: true },
    ],
  },
  {
    id: "d3-tres-preguntas", label: "D3 · 3 preguntas antes de contratar",
    voice: "social-d3r2.mp3", music: "music-focus.wav", accent: "#2ee6a6", tagline: "Pregunta antes de firmar",
    scenes: [
      { text: "Antes de contratar\nun desarrollador,", frames: 90 },
      { text: "haz 3 preguntas:", frames: 60, accent: true, size: 80 },
      { text: "¿De quién queda el código?", frames: 85 },
      { text: "¿Veo avances funcionando?", frames: 85 },
      { text: "¿Hablo con quien programa?", frames: 85 },
      { text: "Si dudan, corre.", frames: 70, accent: true, size: 84 },
    ],
  },

  // Día 4 — del post "El ROI real de automatizar".
  {
    id: "d4-manual-no-gratis", label: "D4 · Lo manual no es gratis",
    voice: "social-d4r1.mp3", music: "music-tension.wav", accent: "#8b9cff", tagline: "Deja de pagar lo invisible",
    scenes: [
      { text: "Lo manual se siente gratis.", frames: 85 },
      { text: "No lo es.", frames: 50, accent: true, size: 92 },
      { text: "Cada tarea repetida a mano", frames: 85 },
      { text: "son horas de un sueldo.", frames: 80, accent: true },
      { text: "Más los errores. Más las ventas\nque no alcanzaste.", frames: 105, accent: true },
    ],
  },
  {
    id: "d4-empieza-repite", label: "D4 · Empieza por lo que más se repite",
    voice: "social-d4r2.mp3", music: "music-night.wav", accent: "#19d4d4", tagline: "El retorno fácil está ahí",
    scenes: [
      { text: "¿Por dónde empezar\na automatizar?", frames: 90 },
      { text: "Por lo que más se repite", frames: 80 },
      { text: "y más errores genera.", frames: 80, accent: true },
      { text: "Responder leads. Cotizar.", frames: 80 },
      { text: "Seguimientos. Reportes.", frames: 80 },
      { text: "Ahí está el retorno fácil.", frames: 85, accent: true },
    ],
  },
  {
    id: "d4-no-automatices-caos", label: "D4 · No automatices el caos",
    voice: "social-d4r3.mp3", music: "music-energetico.wav", accent: "#38b6ff", tagline: "Ordena, luego automatiza",
    scenes: [
      { text: "Un error caro:", frames: 60, size: 84 },
      { text: "automatizar el caos.", frames: 70, accent: true },
      { text: "Si el proceso es malo,", frames: 80 },
      { text: "lo único que logras", frames: 75 },
      { text: "es hacer el desastre\nmás rápido.", frames: 95, accent: true },
      { text: "Ordena. Después automatiza.", frames: 90, accent: true },
    ],
  },

  // Día 5 — del post "De idea a sistema".
  {
    id: "d5-caja-negra", label: "D5 · No es una caja negra",
    voice: "social-d5r1.mp3", music: "music.wav", accent: "#2ee6a6", tagline: "Tú lo ves crecer",
    scenes: [
      { text: "Encargar software", frames: 70 },
      { text: "no es una caja negra.", frames: 80, accent: true },
      { text: "Descubrimiento. Diseño.", frames: 80 },
      { text: "Desarrollo por etapas.", frames: 80 },
      { text: "Pruebas. Despliegue. Soporte.", frames: 85 },
      { text: "Y tú lo ves crecer.", frames: 80, accent: true },
    ],
  },
  {
    id: "d5-otra-semana", label: "D5 · Desconfía del 'para la otra semana'",
    voice: "social-d5r2.mp3", music: "music-chill.wav", accent: "#8b9cff", tagline: "Mejor bien que rápido",
    scenes: [
      { text: "¿Te prometen un sistema serio", frames: 85 },
      { text: "“para la otra semana”?", frames: 80, accent: true },
      { text: "Desconfía.", frames: 55, size: 92 },
      { text: "El software bien hecho\ntoma tiempo.", frames: 95 },
      { text: "Los atajos se pagan caro.", frames: 85, accent: true },
      { text: "Mejor bien que rápido.", frames: 80, accent: true },
    ],
  },
];
