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

// Reels (video vertical 9:16) hechos con Remotion. Sube el .mp4 a public/social
// del sitio y agrega su URL aquí. Render del lote: `Reel-tip-0..8` en /remotion.
// 9 reels temáticos (tip+skin+música variados) + 1 cinematográfico = 10.
const VIDEO_POOL = [
  "https://maudev.cl/social/reel-0.mp4", // Automatización
  "https://maudev.cl/social/reel-1.mp4", // Antes de pagar
  "https://maudev.cl/social/reel-2.mp4", // SEO
  "https://maudev.cl/social/reel-3.mp4", // Pagos online
  "https://maudev.cl/social/reel-4.mp4", // Conversión
  "https://maudev.cl/social/reel-5.mp4", // WhatsApp
  "https://maudev.cl/social/reel-6.mp4", // Software a medida
  "https://maudev.cl/social/reel-7.mp4", // Velocidad
  "https://maudev.cl/social/reel-8.mp4", // Confianza/contrato
  "https://maudev.cl/social/cinematic.mp4", // Cinematográfico (voz en off)
];

// Plan semanal DETERMINÍSTICO: 21 slots (7 días × 3 franjas). Cada caption se usa
// una vez por semana → contenido variado y planificado (no aleatorio). El orden
// mezcla temas para que cada día tenga ángulos distintos.
// slot = díaSemana(0=Dom..6=Sáb) * 3 + franja(0=mañana,1=mediodía,2=tarde).
// MODO SOLO-REELS: cada slot publica un REEL (los reels disparan mucho más
// alcance). El video rota por slot (slot % VIDEO_POOL.length) para no repetir el
// mismo el mismo día. El `c` de cada slot define el CAPTION (texto de apoyo),
// manteniendo variedad temática semanal. El `img` quedó como respaldo histórico.
const PLAN = [
  { c: 0, img: 8 }, { c: 14, img: 6 }, { c: 9, img: 9 },   // Dom: web/conversión, automatización, pagos
  { c: 1, img: 6 }, { c: 6, img: 8 }, { c: 16, img: 1 },   // Lun: leads/auto, SEO, software IA
  { c: 12, img: 7 }, { c: 4, vid: 0 }, { c: 19, img: 8 },  // Mar: a medida, [REEL], SEO
  { c: 2, img: 7 }, { c: 8, img: 8 }, { c: 5, img: 4 },    // Mié: IA/app, IG→landing, precios
  { c: 15, img: 0 }, { c: 3, img: 8 }, { c: 17, img: 2 },  // Jue: agentes IA, dashboard, pagos
  { c: 7, img: 7 }, { c: 10, vid: 0 }, { c: 20, img: 6 },  // Vie: código tuyo, [REEL], leads n8n
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
  // Solo-reels: el video rota por slot; el caption viene del plan (variedad).
  const videoUrl = VIDEO_POOL[slot % VIDEO_POOL.length];
  return {
    kind: "reel",
    caption: `${item.caption}\n\n${tags}`,
    preview: item.caption.split("\n")[0],
    imageUrl: null,
    videoUrl,
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

// ─── Instagram Reels: crear contenedor de video y publicar ────────────────────
async function publishReel(env, videoUrl, caption) {
  const createRes = await fetch(`${GRAPH}/${env.IG_USER_ID}/media`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ media_type: "REELS", video_url: videoUrl, caption, share_to_feed: true, access_token: env.IG_ACCESS_TOKEN }),
  });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) throw new Error(`IG reel create: ${JSON.stringify(created)}`);

  // El video tarda más en procesarse: esperar hasta ~2.5 min.
  for (let i = 0; i < 60; i++) {
    const st = await (await fetch(`${GRAPH}/${created.id}?fields=status_code&access_token=${env.IG_ACCESS_TOKEN}`)).json();
    if (st.status_code === "FINISHED") break;
    if (st.status_code === "ERROR") throw new Error(`IG reel container ERROR: ${JSON.stringify(st)}`);
    await new Promise((r) => setTimeout(r, 2500));
  }

  const pubRes = await fetch(`${GRAPH}/${env.IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ creation_id: created.id, access_token: env.IG_ACCESS_TOKEN }),
  });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) throw new Error(`IG reel publish: ${JSON.stringify(published)}`);
  return published.id;
}

// ─── Facebook Page: publicar video (feed). best-effort, como las fotos. ────────
async function publishFacebookVideo(env, videoUrl, caption) {
  if (!env.FB_PAGE_ID) return null;
  const res = await fetch(`${GRAPH}/${env.FB_PAGE_ID}/videos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ file_url: videoUrl, description: caption, access_token: env.IG_ACCESS_TOKEN }),
  });
  const j = await res.json();
  if (!res.ok || !j.id) throw new Error(`FB video: ${JSON.stringify(j)}`);
  return j.id;
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

// ─── LinkedIn (perfil personal): subir imagen + publicar post ────────────────
// Requiere secrets:
//   LINKEDIN_ACCESS_TOKEN   token OAuth con scope w_member_social (60 días)
//   LINKEDIN_PERSON_URN     "urn:li:person:{id}"  (el {id} = "sub" de /v2/userinfo)
// Doc: Posts API + Images API (versionada). Flujo: initializeUpload → PUT bytes → POST /rest/posts.
const LI_API = "https://api.linkedin.com";
const LI_VERSION = "202405";
async function publishLinkedIn(env, imageUrl, caption) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_PERSON_URN) return null;
  const author = env.LINKEDIN_PERSON_URN;
  const h = {
    Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
    "LinkedIn-Version": LI_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };

  // 1) Inicializar la subida de imagen → obtener uploadUrl + urn de imagen.
  const initRes = await fetch(`${LI_API}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
  });
  const init = await initRes.json();
  const uploadUrl = init?.value?.uploadUrl;
  const imageUrn = init?.value?.image;
  if (!initRes.ok || !uploadUrl || !imageUrn) throw new Error(`LI init: ${JSON.stringify(init)}`);

  // 2) Descargar la imagen y subir los bytes a uploadUrl.
  const imgBytes = await (await fetch(imageUrl)).arrayBuffer();
  const upRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}` },
    body: imgBytes,
  });
  if (!upRes.ok) throw new Error(`LI upload: ${upRes.status} ${await upRes.text()}`);

  // 3) Crear el post referenciando la imagen.
  const postRes = await fetch(`${LI_API}/rest/posts`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({
      author,
      commentary: caption,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { media: { altText: "maudev", id: imageUrn } },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  const postId = postRes.headers.get("x-restli-id");
  if (!postRes.ok || !postId) throw new Error(`LI post: ${postRes.status} ${await postRes.text()}`);
  return postId;
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
  const { kind, caption, preview, imageUrl, videoUrl } = buildContent(slot);
  const mediaUrl = kind === "reel" ? videoUrl : imageUrl;

  // Instagram (requerido): reel o imagen según el slot.
  const postId = kind === "reel"
    ? await publishReel(env, videoUrl, caption)
    : await publishImage(env, imageUrl, caption);

  // Facebook (best-effort): video o foto.
  let fbId = null, fbError = null;
  try {
    fbId = kind === "reel"
      ? await publishFacebookVideo(env, videoUrl, caption)
      : await publishFacebook(env, imageUrl, caption);
  } catch (e) {
    fbError = e.message;
  }

  // LinkedIn (best-effort): solo imágenes por ahora (el video usa otra API).
  let liId = null, liError = null;
  if (kind !== "reel") {
    try {
      liId = await publishLinkedIn(env, imageUrl, caption);
    } catch (e) {
      liError = e.message;
    }
  }

  await logPost(env, { ig_post_id: postId, fb_post_id: fbId, li_post_id: liId, hook: preview, media_kind: kind, image_url: mediaUrl, caption, created_at: new Date().toISOString() });
  return { slot, kind, postId, fbId, fbError, liId, liError, preview };
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
