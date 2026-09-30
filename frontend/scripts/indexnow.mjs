import { rutasIndexables } from "./paginas.mjs";

// Avisa a Bing (y a los demás buscadores de IndexNow: Yandex, Seznam, Naver)
// qué páginas publicar o volver a rastrear. Corre en CI después de cada
// despliegue a producción, así que una guía nueva publicada desde el admin se
// avisa sola. La clave es pública a propósito: vive en public/19431b1aea63fa5a1ce9861d31d86092.txt y
// solo demuestra que el sitio es nuestro.
const CLAVE = "19431b1aea63fa5a1ce9861d31d86092";
const host = "maudev.cl";
const urlList = rutasIndexables.map((ruta) => `https://${host}${ruta}`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: CLAVE, keyLocation: `https://${host}/${CLAVE}.txt`, urlList }),
  signal: AbortSignal.timeout(15000),
});
// 200 y 202 son éxito. Un error acá no debe tumbar un despliegue que ya salió.
console.log(`IndexNow: ${urlList.length} URLs enviadas, respuesta ${res.status}.`);
if (![200, 202].includes(res.status)) console.log(await res.text().catch(() => ""));
