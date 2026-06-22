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
  // Imágenes cuadradas (1:1) hechas para feed de Instagram:
  "https://maudev.cl/social/automatizacion.png",
  "https://maudev.cl/social/software.png",
  "https://maudev.cl/social/crecimiento.png",
  "https://maudev.cl/social/pagos.png",
];

// Plan semanal DETERMINÍSTICO: 21 slots (7 días × 3 franjas). Cada caption se usa
// una vez por semana → contenido variado y planificado (no aleatorio). El orden
// mezcla temas para que cada día tenga ángulos distintos.
// slot = díaSemana(0=Dom..6=Sáb) * 3 + franja(0=mañana,1=mediodía,2=tarde).
// Cada slot → { c: índice de caption (captions.js), img: índice de imagen (IMAGE_POOL) }.
// La imagen está elegida para que CALCE con el tema del caption.
const PLAN = [
  { c: 0, img: 8 }, { c: 14, img: 6 }, { c: 9, img: 9 },   // Dom: web/conversión, automatización, pagos
  { c: 1, img: 6 }, { c: 6, img: 8 }, { c: 16, img: 1 },   // Lun: leads/auto, SEO, software IA
  { c: 12, img: 7 }, { c: 4, img: 3 }, { c: 19, img: 8 },  // Mar: a medida, antes de pagar, SEO
  { c: 2, img: 7 }, { c: 8, img: 8 }, { c: 5, img: 4 },    // Mié: IA/app, IG→landing, precios
  { c: 15, img: 0 }, { c: 3, img: 8 }, { c: 17, img: 2 },  // Jue: agentes IA, dashboard, pagos
  { c: 7, img: 7 }, { c: 10, img: 7 }, { c: 20, img: 6 },  // Vie: código tuyo, MVP, leads n8n
  { c: 13, img: 7 }, { c: 11, img: 5 }, { c: 18, img: 4 }, // Sáb: hablas con dev, contrato, precios
];

function currentSlot() {
  const now = new Date();
  const dow = now.getUTCDay();
  const h = now.getUTCHours();
  const franja = h < 15 ? 0 : h < 19 ? 1 : 2; // crons 13/17/21 UTC ≈ 09/13/17 Chile
  return (dow * 3 + franja) % PLAN.length;
}

function buildContent(slot) {
  const e = PLAN[slot % PLAN.length];
  const item = CAPTIONS[e.c] || CAPTIONS[0];
  const tags = (item.tags || []).map((t) => (t.startsWith("#") ? t : "#" + t)).join(" ");
  return {
    caption: `${item.caption}\n\n${tags}`,
    preview: item.caption.split("\n")[0],
    imageUrl: IMAGE_POOL[e.img % IMAGE_POOL.length],
  };
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

  // Esperar a que IG termine de procesar la imagen (si no, "Media ID is not available").
  for (let i = 0; i < 20; i++) {
    const st = await (await fetch(`${GRAPH}/${created.id}?fields=status_code&access_token=${env.IG_ACCESS_TOKEN}`)).json();
    if (st.status_code === "FINISHED") break;
    if (st.status_code === "ERROR") throw new Error(`IG container ERROR: ${JSON.stringify(st)}`);
    await new Promise((r) => setTimeout(r, 2500));
  }

  const pubRes = await fetch(`${GRAPH}/${env.IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ creation_id: created.id, access_token: env.IG_ACCESS_TOKEN }),
  });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) throw new Error(`IG publish: ${JSON.stringify(published)}`);
  return published.id;
}

// ─── Facebook Page: publicar foto (requiere permiso pages_manage_posts) ───────
async function publishFacebook(env, imageUrl, caption) {
  if (!env.FB_PAGE_ID) return null;
  const res = await fetch(`${GRAPH}/${env.FB_PAGE_ID}/photos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: imageUrl, caption, access_token: env.IG_ACCESS_TOKEN }),
  });
  const j = await res.json();
  if (!res.ok || !(j.post_id || j.id)) throw new Error(`FB publish: ${JSON.stringify(j)}`);
  return j.post_id || j.id;
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
  const slot = currentSlot();
  const { caption, preview, imageUrl } = buildContent(slot);
  const postId = await publishImage(env, imageUrl, caption); // Instagram (requerido)
  let fbId = null, fbError = null;
  try {
    fbId = await publishFacebook(env, imageUrl, caption); // Facebook (best-effort)
  } catch (e) {
    fbError = e.message;
  }
  await logPost(env, { ig_post_id: postId, fb_post_id: fbId, hook: preview, image_url: imageUrl, caption, created_at: new Date().toISOString() });
  return { slot, postId, fbId, fbError, preview };
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
