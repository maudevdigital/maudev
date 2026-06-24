// Helper OAuth de TikTok — obtiene el refresh_token + open_id para el worker.
// No necesita servidor: copias el "code" que aparece en la URL tras autorizar.
//
// REQUISITOS en https://developers.tiktok.com (tu app "maudev"):
//  - Login Kit → agrega un Redirect URI:  https://maudev.cl/
//  - Content Posting API → "Verify domains" (el DNS TXT ya está puesto) → Verify
//  - Scopes: video.upload  (borrador/inbox)  — y video.publish si pasas la auditoría
//
// PASO 1 — genera la URL de login:
//   TIKTOK_CLIENT_KEY=xxx TIKTOK_REDIRECT_URI=https://maudev.cl/ node tiktok-auth.mjs
//   Ábrela, autoriza, y copia el ?code=... de la redirección (quítale lo que venga tras '*').
//
// PASO 2 — canjea el code:
//   TIKTOK_CLIENT_KEY=xxx TIKTOK_CLIENT_SECRET=yyy \
//   TIKTOK_REDIRECT_URI=https://maudev.cl/ TIKTOK_CODE=elcode node tiktok-auth.mjs
//   → imprime TIKTOK_REFRESH_TOKEN y TIKTOK_OPEN_ID para los secrets del worker.

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "https://maudev.cl/";
const CODE = process.env.TIKTOK_CODE;
const SCOPE = process.env.TIKTOK_SCOPE || "user.info.basic,video.upload";

if (!CLIENT_KEY) {
  console.error("Falta TIKTOK_CLIENT_KEY.");
  process.exit(1);
}

if (!CODE) {
  const url =
    "https://www.tiktok.com/v2/auth/authorize/?" +
    `client_key=${encodeURIComponent(CLIENT_KEY)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=maudev${Math.random().toString(36).slice(2, 8)}`;
  console.log("\n1) Abre esta URL, autoriza, y copia el ?code=... de la redirección:\n");
  console.log(url + "\n");
  console.log("OJO: el code de TikTok a veces trae '*' al final; bórralo antes de usarlo.\n");
  process.exit(0);
}

if (!CLIENT_SECRET) {
  console.error("Falta TIKTOK_CLIENT_SECRET para canjear el code.");
  process.exit(1);
}

const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_key: CLIENT_KEY,
    client_secret: CLIENT_SECRET,
    code: CODE.replace(/\*$/, ""),
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
  }),
});
const j = await res.json();
if (!res.ok || !j.refresh_token) {
  console.error("Error al canjear el code:", JSON.stringify(j));
  process.exit(1);
}

console.log("\n✅ Listo. Configura estos secrets en el worker:\n");
console.log(`TIKTOK_REFRESH_TOKEN = ${j.refresh_token}`);
console.log(`TIKTOK_OPEN_ID       = ${j.open_id}`);
console.log(`\n(scope: ${j.scope} · refresh dura ~${Math.round((j.refresh_expires_in || 0) / 86400)} días)\n`);
