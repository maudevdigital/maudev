// Genera las voces en off (Brian, eleven_v3) de los reels sociales días 2-5.
import { writeFileSync } from "fs";
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = "nPczCjzI2devNBz1zQrb"; // Brian (primera voz)
if (!KEY) { console.error("Falta ELEVENLABS_API_KEY"); process.exit(1); }
const items = {
  "social-d2r1": "¿Pagas ocho suscripciones distintas y ninguna calza del todo con lo que haces? Cada una se siente barata, pero juntas son una mochila que crece cada año. Quizás ya no necesitas más apps: necesitas algo que sea tuyo. maudev.",
  "social-d2r2": "El software por suscripción es barato hasta que sumas cinco años. Ochenta mil al mes son casi cinco millones en cinco años, y al final no te queda nada. Un software a medida, al menos, queda como tuyo. maudev.",
  "social-d2r3": "¿Cuándo conviene construir tu propio software? Cuando el proceso es tu ventaja. Cuando ya peleas con la herramienta. Cuando terminas exportando a Excel para hacer lo que ella no hace. Ahí dejó de calzar. maudev.",
  "social-d3r1": "La cotización más barata casi nunca conviene. Lo barato viene sin pruebas, sin soporte, y a veces sin que el código sea tuyo. Compara por lo que incluye, no por el número final. maudev.",
  "social-d3r2": "Antes de contratar a quien va a programar tu software, haz tres preguntas. ¿De quién queda el código? ¿Voy a ver avances funcionando? ¿Hablo con quien programa, o solo con un vendedor? Si dudan, corre. maudev.",
  "social-d4r1": "Lo manual se siente gratis. No lo es. Cada tarea repetida a mano son horas de un sueldo, más los errores, más las ventas que no alcanzaste a cerrar. Eso es lo que cuesta no automatizar. maudev.",
  "social-d4r2": "¿Por dónde empezar a automatizar? Por lo que más se repite y más errores genera. Responder leads, cotizar, hacer seguimientos, armar reportes. Ahí está el retorno fácil. maudev.",
  "social-d4r3": "Cuidado con un error caro: automatizar el caos. Si el proceso es malo, lo único que logras es hacer el desastre más rápido. Primero ordena, después automatiza. maudev.",
  "social-d5r1": "Encargar software no tiene por qué ser una caja negra. Descubrimiento, diseño, desarrollo por etapas, pruebas, despliegue y soporte. En un proceso sano, tú lo ves crecer cada par de semanas. maudev.",
  "social-d5r2": "¿Te prometen un sistema serio para la otra semana? Desconfía. El software bien hecho toma tiempo, y los atajos se pagan caro. Mejor bien hecho que rápido y mal. maudev.",
};
for (const [out, text] of Object.entries(items)) {
  let r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_v3", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true } }),
  });
  if (!r.ok) { console.log(out, "fallo", r.status, "-> reintento multilingual_v2"); r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true } }) }); }
  if (!r.ok) { console.log(out, "ERROR", r.status, await r.text()); continue; }
  writeFileSync(`public/${out}.mp3`, Buffer.from(await r.arrayBuffer()));
  console.log(out + ".mp3 OK");
}
