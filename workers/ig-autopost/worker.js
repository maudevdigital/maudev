// Cloudflare Worker: ig-autopost
// ─────────────────────────────────────────────────────────────────────────────
// Publica automáticamente en Instagram (cuenta Business/Creator) en un horario
// fijo (cron). En cada corrida elige un caption de la librería (captions.js) y
// una imagen on-brand de IMAGE_POOL, y publica vía la Instagram Graph API.
// NO usa ninguna IA de pago: los captions los escribe Claude en el chat y se
// guardan en captions.js (gratis). Cuando se agoten, pide otro lote.
//
// Secrets (configurar con `wrangler secret put <NOMBRE>`):
//   IG_USER_ID          ID de la cuenta de Instagram Business (numérico)
//   IG_ACCESS_TOKEN     token de larga duración (60 días) con permiso de publicación
//   TRIGGER_SECRET      string a tu elección, para el disparo manual de prueba
//   SUPABASE_URL        (opcional) para registrar el log
//   SUPABASE_SERVICE_KEY(opcional) service role, solo para insertar el log
//
// Cron: se define en wrangler.toml.

import { CAPTIONS } from "./captions.js";

const GRAPH = "https://graph.facebook.com/v21.0";

// Imágenes on-brand públicas para rotar (sube las tuyas y pega las URLs aquí).
// Pueden ser las que ya generamos y están en producción:
const IMAGE_POOL = [
  "https://maudev.cl/blog/ia-automatizacion-pymes-2026.png",
  "https://maudev.cl/blog/software-medida-ia-2026.png",
  "https://maudev.cl/blog/pagos-stablecoins-chile-2026.png",
  "https://maudev.cl/portfolio/systempro.png",
  "https://maudev.cl/portfolio/partsmr.png",
  "https://maudev.cl/portfolio/paraguayaccess.png",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildCaption() {
  const item = pick(CAPTIONS);
  const tags = (item.tags || []).map((t) => (t.startsWith("#") ? t : "#" + t)).join(" ");
  return { caption: `${item.caption}\n\n${tags}`, preview: item.caption.split("\n")[0] };
}

// ─── Instagram Graph API: crear y publicar ──────────────────────────────────
async function publishImage(env, imageUrl, caption) {
  const createRes = await fetch(`${GRAPH}/${env.IG_USER_ID}/media`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: env.IG_ACCESS_TOKEN }),
  });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) throw new Error(`IG create: ${JSON.stringify(created)}`);

  const pubRes = await fetch(`${GRAPH}/${env.IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ creation_id: created.id, access_token: env.IG_ACCESS_TOKEN }),
  });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) throw new Error(`IG publish: ${JSON.stringify(published)}`);
  return published.id;
}

async function logPost(env, row) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return;
  await fetch(`${env.SUPABASE_URL}/rest/v1/ig_posts`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      "content-type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  }).catch(() => {});
}

async function runOnce(env) {
  if (!IMAGE_POOL.length) throw new Error("IMAGE_POOL vacío: agrega URLs de imágenes.");
  const imageUrl = pick(IMAGE_POOL);
  const { caption, preview } = buildCaption();
  const postId = await publishImage(env, imageUrl, caption);
  await logPost(env, { ig_post_id: postId, hook: preview, image_url: imageUrl, caption, created_at: new Date().toISOString() });
  return { postId, preview };
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      runOnce(env)
        .then((r) => console.log("Publicado:", r.postId, "—", r.preview))
        .catch((err) => console.error("Error ig-autopost:", err.message)),
    );
  },
  // Prueba manual:  curl -H "x-trigger: <TRIGGER_SECRET>" https://ig-autopost.<sub>.workers.dev
  async fetch(req, env) {
    if (req.headers.get("x-trigger") !== env.TRIGGER_SECRET) return new Response("forbidden", { status: 403 });
    try {
      const r = await runOnce(env);
      return Response.json({ ok: true, ...r });
    } catch (err) {
      return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
  },
};
