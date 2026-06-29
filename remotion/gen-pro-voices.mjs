import { writeFileSync } from "fs";
const KEY = process.env.ELEVENLABS_API_KEY, VOICE = "nPczCjzI2devNBz1zQrb";
if (!KEY) { console.error("falta key"); process.exit(1); }
const items = {
  "pro-errores": "Hay un error que te hace pagar dos veces: elegir por precio. El software barato no es barato, es incompleto. Lo que falta lo pagas después, más caro. Compara por lo que incluye, no por el número final. maudev.",
  "pro-precio": "¿Cuánto cuesta un software? Depende, y mucho. El mismo proyecto puede costar diez veces distinto según el alcance, la lógica, las integraciones y quién lo construye. Por eso un número instantáneo es mala señal. maudev.",
  "pro-integraciones": "El verdadero valor de tu software no está en las pantallas. Está en que tus herramientas se hablen entre sí. Sin integraciones, tu equipo copia y pega todo el día. Con integraciones, la información fluye sola. maudev.",
  "pro-mvp": "No necesitas la app completa para empezar. Necesitas un MVP: lo mínimo que ya aporta valor. Construye poco, aprende rápido, y crece con lo que aprendes y facturas. maudev.",
  "pro-mantencion": "Presupuestas construir el software, pero olvidas la mantención. El software, como un auto, tiene costo de uso: un quince a veinte por ciento al año. Lo que no se mantiene envejece y se vuelve un riesgo. maudev.",
  "pro-ia": "En 2026 todos te ofrecen inteligencia artificial. ¿Pero qué sirve de verdad para tu PYME? Sí: responder leads, resumir, atender veinticuatro siete. No: decisiones críticas sin supervisión. La inteligencia artificial es una herramienta del equipo, no el equipo. maudev.",
  "pro-seguridad": "La seguridad de tu software es invisible, hasta que falla. Una filtración de datos cuesta clientes, multas y reputación. Control de acceso, cifrado y respaldos automáticos no son un lujo: exígelos desde el día uno. maudev.",
  "pro-checklist": "Antes de pagar por un software, exige esto: que el código quede a tu nombre, precio y alcance por escrito, y avances que ves funcionando. Si tu proveedor lo evade, corre. maudev.",
};
const CTA = " Comenta la palabra guía, y te enviamos gratis el PDF al privado.";
for (const [out, base] of Object.entries(items)) {
  const text = base + CTA;
  let r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: "eleven_v3", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true } }) });
  if (!r.ok) r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true } }) });
  if (!r.ok) { console.log(out, "ERROR", r.status); continue; }
  writeFileSync(`public/${out}.mp3`, Buffer.from(await r.arrayBuffer())); console.log(out + ".mp3 OK");
}
