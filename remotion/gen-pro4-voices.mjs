import { writeFileSync } from "fs";
// Voces lote 4 (temas ATP frescos aprobados 7-jul) con GUSTAVO.
// El texto narrado = escenas de proScripts.ts + CTA (así el sync es exacto).
const KEY = process.env.ELEVENLABS_API_KEY, VOICE = "u1ajuyOsyYeV4hsCaYXs"; // Gustavo
if (!KEY) { console.error("falta ELEVENLABS_API_KEY"); process.exit(1); }
const items = {
  "pro-agenda": "Los chilenos agendan todo online. El Registro Civil, la revisión técnica, el médico. ¿Y tu negocio? Sigue agendando por WhatsApp. Las horas que te piden de noche, las pierdes. Una agenda online atiende veinticuatro siete por ti.",
  "pro-restaurante": "201 mil personas buscan restaurante cerca de mí, cada mes. ¿Tu restaurante aparece? Las apps de delivery te cobran hasta 30 por ciento. Con web propia: carta, reservas y pedidos directos. Cero comisión. Todo el margen para ti.",
  "pro-boleta": "¿Sigues haciendo las boletas a mano en la página del SII? Es obligatoria desde 2021. Y miles de pymes re-digitan todo cada noche. Un sistema a medida emite la boleta al vender, descuenta stock y ordena tu contabilidad.",
  "pro-inventario": "Tu Excel de inventario te está costando ventas. Vendes en tienda, Instagram y WhatsApp, pero el stock vive en una planilla. Vendes lo que no tienes. O acumulas de más. Un sistema lo sincroniza todo en tiempo real.",
  "pro-abogados": "Nadie contrata a un abogado sin googlearlo primero. Abogados, contadores, arquitectos: tu cliente te busca antes de llamar. Si no encuentra nada, elige a otro. Tu web es tu tarjeta, veinticuatro siete.",
  "pro-pasarela": "Hablemos por interno... está matando tus ventas. Cada paso extra antes de pagar, pierdes compradores. Con pasarela de pago en tu web, el cliente paga en un minuto, a cualquier hora. Vender mientras duermes es tener pasarela.",
  "pro-automatizar": "Dos horas al día en tareas repetidas son 500 horas al año. Copiar datos entre planillas, mandar los mismos correos, armar informes. Todo eso se puede automatizar. 500 horas: doce semanas recuperadas.",
  "pro-senales-ig": "Señales de que tu negocio ya necesita más que Instagram. Respondes lo mismo 20 veces al día. Pierdes ventas cuando no alcanzas a responder. Y en Google no apareces. ¿Dos o más? Te falta una web que trabaje por ti.",
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
