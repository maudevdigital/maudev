// Helper OAuth de LinkedIn (perfil personal) — obtiene el access token + tu URN.
// No necesita servidor: copias el "code" que aparece en la URL tras autorizar.
//
// PASOS
// 1) Crea una app en https://www.linkedin.com/developers/apps (asóciala a una
//    Company Page tuya; si no tienes, crea una gratis para maudev).
// 2) En la pestaña "Products" agrega: "Sign In with LinkedIn using OpenID Connect"
//    y "Share on LinkedIn".
// 3) En "Auth" copia el Client ID y Client Secret, y agrega un Redirect URL.
//    Usa exactamente:  https://maudev.cl/   (o http://localhost:3000/ si prefieres)
//
// 4) Genera la URL de autorización:
//      LINKEDIN_CLIENT_ID=xxx LINKEDIN_REDIRECT_URI=https://maudev.cl/ node linkedin-auth.mjs
//    Ábrela, autoriza, y cuando te redirija copia el valor de ?code=... de la URL.
//
// 5) Canjea el code por el token + tu URN:
//      LINKEDIN_CLIENT_ID=xxx LINKEDIN_CLIENT_SECRET=yyy \
//      LINKEDIN_REDIRECT_URI=https://maudev.cl/ LINKEDIN_CODE=elcode node linkedin-auth.mjs
//
//    Te imprime LINKEDIN_ACCESS_TOKEN y LINKEDIN_PERSON_URN para los secrets.

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const CODE = process.env.LINKEDIN_CODE;
const SCOPE = "openid profile w_member_social";

if (!CLIENT_ID || !REDIRECT_URI) {
  console.error("Falta LINKEDIN_CLIENT_ID y/o LINKEDIN_REDIRECT_URI.");
  process.exit(1);
}

if (!CODE) {
  const url =
    "https://www.linkedin.com/oauth/v2/authorization?response_type=code" +
    `&client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&state=maudev${Math.random().toString(36).slice(2, 8)}`;
  console.log("\n1) Abre esta URL, autoriza, y copia el ?code=... de la redirección:\n");
  console.log(url + "\n");
  process.exit(0);
}

if (!CLIENT_SECRET) {
  console.error("Falta LINKEDIN_CLIENT_SECRET para canjear el code.");
  process.exit(1);
}

const tokRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: CODE,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
});
const tok = await tokRes.json();
if (!tokRes.ok || !tok.access_token) {
  console.error("Error al canjear el code:", JSON.stringify(tok));
  process.exit(1);
}

const me = await (
  await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  })
).json();

if (!me.sub) {
  console.error("No se pudo leer userinfo:", JSON.stringify(me));
  process.exit(1);
}

console.log("\n✅ Listo. Configura estos secrets en el worker:\n");
console.log(`LINKEDIN_ACCESS_TOKEN = ${tok.access_token}`);
console.log(`LINKEDIN_PERSON_URN   = urn:li:person:${me.sub}`);
console.log(`\n(Usuario: ${me.name || "?"} — token válido ~${Math.round((tok.expires_in || 0) / 86400)} días)\n`);
