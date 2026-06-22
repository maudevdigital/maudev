// Genera la voz en off (narración) con ElevenLabs → public/voice.mp3.
// Uso:  ELEVENLABS_API_KEY=xxx node gen-voice.mjs
// Opcionales:  ELEVENLABS_VOICE_ID=...  VOICE_TEXT="..."
//
// 1) Crea tu API key en https://elevenlabs.io (Profile → API Keys).
// 2) (Opcional) Elige una voz en https://elevenlabs.io/app/voice-library
//    (hay voces en español/latino) y copia su Voice ID.
// 3) Ejecuta: ELEVENLABS_API_KEY=tu_key node gen-voice.mjs
// 4) En el Studio, en los props del AvatarReel pon  voice: "voice.mp3".
import { writeFileSync } from "fs";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "ErXwobaYiN019PkySvjV"; // voz por defecto; cámbiala
// El texto DEBE corresponder a lo que muestra el AvatarReel (tips[0] por defecto).
const TEXT =
  process.env.VOICE_TEXT ||
  "Cinco procesos que tu pyme puede automatizar hoy. Uno: responder y calificar leads al instante. Dos: agendar reuniones sin tanto ida y vuelta. Tres: seguimiento posventa automático. Cuatro: emitir cotizaciones y contratos. Cinco: reportes que se arman solos. Empieza por lo que más se repite.";

if (!KEY) {
  console.error("Falta ELEVENLABS_API_KEY. Uso: ELEVENLABS_API_KEY=tu_key node gen-voice.mjs");
  process.exit(1);
}

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({
      text: TEXT,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  },
);

if (!res.ok) {
  console.error("ElevenLabs error:", res.status, await res.text());
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
writeFileSync("public/voice.mp3", buf);
console.log(`voice.mp3 generado: ${(buf.length / 1024).toFixed(0)} KB`);
