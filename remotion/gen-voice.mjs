// Genera la voz en off CINEMATOGRÁFICA (narración) con ElevenLabs → public/<out>.mp3.
// Uso:  ELEVENLABS_API_KEY=xxx node gen-voice.mjs
// Opcionales:
//   ELEVENLABS_VOICE_ID=...   (def. Brian, voz grave/resonante)
//   ELEVENLABS_MODEL=...      (def. eleven_v3; cae a eleven_multilingual_v2 si falla)
//   VOICE_TEXT="..."          (def. narración del CinematicReel)
//   VOICE_OUT=cinematic-voice (nombre de salida, sin extensión)
import { writeFileSync } from "fs";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "nPczCjzI2devNBz1zQrb"; // Brian - Deep, Resonant
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_v3";
const OUT = process.env.VOICE_OUT || "cinematic-voice";

// El texto sigue el guion del CinematicReel. Las pausas ("...") dan ritmo cine.
const TEXT =
  process.env.VOICE_TEXT ||
  "Cada día, clientes buscan lo que tú haces. La pregunta no es si te encuentran... es qué sienten cuando lo hacen. Una web que carga rápido. Un sistema que responde solo. Procesos que no se caen. maudev. Software y automatización para crecer sin fricción. Cuando quieras, conversamos.";

if (!KEY) {
  console.error("Falta ELEVENLABS_API_KEY. Uso: ELEVENLABS_API_KEY=tu_key node gen-voice.mjs");
  process.exit(1);
}

async function tts(model) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({
      text: TEXT,
      model_id: model,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true },
    }),
  });
}

let res = await tts(MODEL);
if (!res.ok && MODEL !== "eleven_multilingual_v2") {
  console.warn(`Modelo ${MODEL} falló (${res.status}); reintento con eleven_multilingual_v2…`);
  res = await tts("eleven_multilingual_v2");
}
if (!res.ok) {
  console.error("ElevenLabs error:", res.status, await res.text());
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(`public/${OUT}.mp3`, buf);
console.log(`public/${OUT}.mp3 generado: ${(buf.length / 1024).toFixed(0)} KB (voz ${VOICE_ID}, modelo ${MODEL})`);
