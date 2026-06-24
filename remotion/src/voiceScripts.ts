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
];
