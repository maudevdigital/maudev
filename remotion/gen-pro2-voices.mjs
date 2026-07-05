import { writeFileSync } from "fs";
// Voces semana 6–12 jul con la voz CHRIS (multilingüe, español natural).
const KEY = process.env.ELEVENLABS_API_KEY, VOICE = "u1ajuyOsyYeV4hsCaYXs"; // Gustavo (narrador nativo es, plan Starter)
if (!KEY) { console.error("falta ELEVENLABS_API_KEY"); process.exit(1); }
const items = {
  "pro-plazos-semana": "¿Te prometen un sistema serio para la otra semana? Desconfía. El software bien hecho toma tiempo. Los atajos se pagan caro después. Mejor bien hecho que rápido y mal.",
  "pro-cuanto-demora": "¿Cuánto demora un software de verdad? Un MVP, semanas. Un sistema mediano, meses. Si te prometen todo en días, o es una plantilla, o te van a cobrar de más después.",
  "pro-rapido-caro": "Lo rápido y barato se paga dos veces. Sin pruebas, sin seguridad, sin soporte. Lo que ahorras hoy lo gastas arreglando mañana.",
  "pro-3-preguntas": "Antes de pagarle a alguien por tu software, pregunta tres cosas. ¿De quién queda el código? ¿Hay precio y alcance por escrito? ¿Voy a ver avances funcionando? Si las evade, corre.",
  "pro-codigo-nombre": "Hay una pregunta que espanta a los malos proveedores. ¿El código queda a mi nombre? Si dudan, es tu señal para salir corriendo. El código es tuyo, siempre.",
  "pro-senales-estafa": "Señales de que te van a estafar con tu software. Te cotizan sin entender tu negocio. No muestran avances hasta el final. Precio sospechosamente bajo. Si ves esto, huye.",
  "pro-hechos": "No creas en promesas, cree en cosas funcionando. Pide ver proyectos reales, no capturas. Habla con quien programa, no solo con un vendedor. Los hechos no mienten.",
  "pro-valor-real": "El verdadero valor de tu software no está en las pantallas bonitas. Está en que tus herramientas se hablen entre sí. Sin integraciones, tu equipo copia y pega todo el día.",
  "pro-copiar-pegar": "¿Copias y pegas datos entre apps todos los días? Ese es tiempo y plata que pierdes. Cuando tus sistemas se conectan, la información fluye sola, y tu equipo se dedica a vender.",
  "pro-saas-medida": "¿SaaS o software a medida? El SaaS gana en lo estándar. Lo a medida gana cuando el proceso es tu ventaja o cuando ya peleas con la herramienta. La jugada maestra es combinar.",
};
const CTA = " Comenta la palabra guía, y te enviamos gratis el PDF al privado.";
for (const [out, base] of Object.entries(items)) {
  const text = base + CTA;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.42, similarity_boost: 0.78, style: 0.4, use_speaker_boost: true } }),
  });
  if (!r.ok) { console.log(out, "ERROR", r.status, (await r.text()).slice(0, 100)); continue; }
  writeFileSync(`public/${out}.mp3`, Buffer.from(await r.arrayBuffer())); console.log(out + ".mp3 OK");
}
