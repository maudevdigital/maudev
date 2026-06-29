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

import { CONTENT } from "./content.js";

const GRAPH = "https://graph.facebook.com/v21.0";

// El contenido (videos/carruseles + captions coherentes) vive en content.js.

// Índice DETERMINÍSTICO: 3 publicaciones/día, recorriendo CONTENT en orden
// (cada pieza con su caption coherente). Anclado al 24-jun-2026: ese día en la
// franja 0 = item 0. Recorre los 15 ítems en 5 días y luego cicla.
const BASE_DAY = Math.floor(Date.UTC(2026, 5, 24) / 86400000);
function slotInfo() {
  const now = new Date();
  const dayNum = Math.floor(now.getTime() / 86400000); // día UTC
  const h = now.getUTCHours();
  const franja = h < 15 ? 0 : h < 19 ? 1 : 2; // crons 13/17/21 UTC ≈ 09/13/17 Chile
  const weekday = now.getUTCDay(); // 0=Dom..6=Sáb
  const seq = (dayNum - BASE_DAY) * 3 + franja;
  const index = ((seq % CONTENT.length) + CONTENT.length) % CONTENT.length;
  return { index, franja, weekday };
}

// CADENCIA POR PLATAFORMA (cada red en su ritmo óptimo, no el mismo volumen a todas).
// franja: 0=09:00, 1=13:00, 2=17:00 (Chile).
//   Instagram/TikTok: 2/día (reels escalan)  → franjas 0 y 2.
//   Facebook: 1/día                          → franja 1.
//   LinkedIn: 1/día y SOLO días hábiles (Lun-Vie) → franja 1. (LinkedIn penaliza postear de más.)
function platformsForSlot(franja, weekday) {
  const habil = weekday >= 1 && weekday <= 5;
  return {
    ig: franja === 0 || franja === 2,
    tt: false, // DESACTIVADO hasta que TikTok apruebe la API (reactivar: franja===0||franja===2)
    fb: franja === 1,
    li: franja === 1 && habil,
  };
}

function buildContent(index) {
  const item = CONTENT[index % CONTENT.length];
  return {
    id: item.id,
    kind: item.kind, // "reel" | "carousel"
    media: item.media, // string (reel) | array de strings (carrusel)
    caption: item.caption,
    liCaption: item.liCaption || item.caption, // LinkedIn: 1 imagen (sin "desliza")
    preview: (item.caption || "").split("\n")[0],
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
const LI_VERSION = "202601"; // versión vigente de la LinkedIn API (formato YYYYMM)
function liHeaders(env) {
  return {
    Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
    "LinkedIn-Version": LI_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

// Sube UNA imagen a LinkedIn → devuelve su URN (urn:li:image:...).
async function uploadLinkedInImage(env, imageUrl) {
  const h = liHeaders(env);
  const initRes = await fetch(`${LI_API}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({ initializeUploadRequest: { owner: env.LINKEDIN_PERSON_URN } }),
  });
  const init = await initRes.json();
  const uploadUrl = init?.value?.uploadUrl;
  const imageUrn = init?.value?.image;
  if (!initRes.ok || !uploadUrl || !imageUrn) throw new Error(`LI img init: ${JSON.stringify(init)}`);
  const imgBytes = await (await fetch(imageUrl)).arrayBuffer();
  const upRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}` },
    body: imgBytes,
  });
  if (!upRes.ok) throw new Error(`LI img upload: ${upRes.status} ${await upRes.text()}`);
  return imageUrn;
}

// Crea un post en LinkedIn con un `content` dado (imagen, multiImage o video).
async function createLinkedInPost(env, caption, content) {
  const postRes = await fetch(`${LI_API}/rest/posts`, {
    method: "POST",
    headers: { ...liHeaders(env), "content-type": "application/json" },
    body: JSON.stringify({
      author: env.LINKEDIN_PERSON_URN,
      commentary: caption,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content,
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  const postId = postRes.headers.get("x-restli-id");
  if (!postRes.ok || !postId) throw new Error(`LI post: ${postRes.status} ${await postRes.text()}`);
  return postId;
}

// Post con UNA imagen.
async function publishLinkedIn(env, imageUrl, caption) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_PERSON_URN) return null;
  const urn = await uploadLinkedInImage(env, imageUrl);
  return createLinkedInPost(env, caption, { media: { altText: "maudev", id: urn } });
}

// Post NATIVO de varias imágenes (carrusel deslizable) → se ven TODAS las slides.
async function publishLinkedInCarousel(env, imageUrls, caption) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_PERSON_URN) return null;
  const images = [];
  for (const url of imageUrls) {
    images.push({ id: await uploadLinkedInImage(env, url), altText: "maudev" });
  }
  return createLinkedInPost(env, caption, { multiImage: { images } });
}

// ─── LinkedIn: subir VIDEO (reel) y publicar ─────────────────────────────────
// Flujo Videos API: initializeUpload → PUT de los bytes (1+ partes con ETag) →
// finalizeUpload → POST /rest/posts con la URN del video.
async function publishLinkedInVideo(env, videoUrl, caption) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_PERSON_URN) return null;
  const author = env.LINKEDIN_PERSON_URN;
  const h = {
    Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
    "LinkedIn-Version": LI_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
  const bytes = await (await fetch(videoUrl)).arrayBuffer();
  const size = bytes.byteLength;

  // 1) init
  const initRes = await fetch(`${LI_API}/rest/videos?action=initializeUpload`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({ initializeUploadRequest: { owner: author, fileSizeBytes: size, uploadCaptions: false, uploadThumbnail: false } }),
  });
  const init = await initRes.json();
  const video = init?.value?.video;
  const instructions = init?.value?.uploadInstructions || [];
  const uploadToken = init?.value?.uploadToken ?? "";
  if (!initRes.ok || !video || !instructions.length) throw new Error(`LI video init: ${JSON.stringify(init)}`);

  // 2) subir bytes (cada parte) y juntar ETags
  const parts = [];
  for (const ins of instructions) {
    const chunk = bytes.slice(ins.firstByte, ins.lastByte + 1);
    const up = await fetch(ins.uploadUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`, "content-type": "application/octet-stream" },
      body: chunk,
    });
    if (!up.ok) throw new Error(`LI video upload: ${up.status} ${await up.text()}`);
    parts.push(up.headers.get("etag") || up.headers.get("ETag") || "");
  }

  // 3) finalize
  const fin = await fetch(`${LI_API}/rest/videos?action=finalizeUpload`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({ finalizeUploadRequest: { video, uploadToken, uploadedPartIds: parts } }),
  });
  if (!fin.ok) throw new Error(`LI video finalize: ${fin.status} ${await fin.text()}`);

  // 4) publicar (el video puede tardar en procesar; LinkedIn lo muestra al terminar)
  const postRes = await fetch(`${LI_API}/rest/posts`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({
      author,
      commentary: caption,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { media: { title: "maudev", id: video } },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  const postId = postRes.headers.get("x-restli-id");
  if (!postRes.ok || !postId) throw new Error(`LI video post: ${postRes.status} ${await postRes.text()}`);
  return postId;
}

// ─── TikTok (Content Posting API): subir el reel ──────────────────────────────
// Requiere secrets:
//   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN
// El access_token dura 24h, así que lo renovamos con el refresh_token en cada run.
// Con scope video.upload → el video llega como BORRADOR al inbox de TikTok (el
// dueño lo publica con un toque). Con video.publish + auditoría aprobada se puede
// cambiar a Direct Post (ver nota abajo). pull_by_url exige dominio verificado.
async function refreshTikTokToken(env) {
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: env.TIKTOK_REFRESH_TOKEN,
    }),
  });
  const j = await res.json();
  if (!res.ok || !j.access_token) throw new Error(`TikTok refresh: ${JSON.stringify(j)}`);
  return j.access_token;
}

async function publishTikTok(env, videoUrl, caption) {
  if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET || !env.TIKTOK_REFRESH_TOKEN) return null;
  const accessToken = await refreshTikTokToken(env);
  // Direct Post: publica el video CON su descripción (title incluye caption + hashtags).
  // En sandbox / app no auditada la privacidad debe ser SELF_ONLY; en producción
  // aprobada se cambia a PUBLIC_TO_EVERYONE con el secret TIKTOK_PRIVACY.
  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      post_info: {
        title: (caption || "").slice(0, 2150),
        privacy_level: env.TIKTOK_PRIVACY || "SELF_ONLY",
        disable_comment: false,
        disable_duet: false,
        disable_stitch: false,
      },
      source_info: { source: "PULL_FROM_URL", video_url: videoUrl },
    }),
  });
  const j = await res.json();
  const pid = j?.data?.publish_id;
  if (!res.ok || !pid) throw new Error(`TikTok direct post: ${JSON.stringify(j)}`);
  return pid;
}

// ─── Instagram Carrusel: imágenes hijas → contenedor CAROUSEL → publicar ──────
async function publishCarousel(env, imageUrls, caption) {
  const childIds = [];
  for (const url of imageUrls) {
    const r = await fetch(`${GRAPH}/${env.IG_USER_ID}/media`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: env.IG_ACCESS_TOKEN }),
    });
    const j = await r.json();
    if (!r.ok || !j.id) throw new Error(`IG carousel child: ${JSON.stringify(j)}`);
    childIds.push(j.id);
  }
  const cr = await fetch(`${GRAPH}/${env.IG_USER_ID}/media`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ media_type: "CAROUSEL", children: childIds.join(","), caption, access_token: env.IG_ACCESS_TOKEN }),
  });
  const cj = await cr.json();
  if (!cr.ok || !cj.id) throw new Error(`IG carousel container: ${JSON.stringify(cj)}`);
  for (let i = 0; i < 20; i++) {
    const st = await (await fetch(`${GRAPH}/${cj.id}?fields=status_code&access_token=${env.IG_ACCESS_TOKEN}`)).json();
    if (st.status_code === "FINISHED") break;
    if (st.status_code === "ERROR") throw new Error(`IG carousel ERROR: ${JSON.stringify(st)}`);
    await new Promise((r) => setTimeout(r, 2500));
  }
  const pub = await fetch(`${GRAPH}/${env.IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ creation_id: cj.id, access_token: env.IG_ACCESS_TOKEN }),
  });
  const pj = await pub.json();
  if (!pub.ok || !pj.id) throw new Error(`IG carousel publish: ${JSON.stringify(pj)}`);
  return pj.id;
}

// ─── Facebook: álbum (subir fotos sin publicar → post con attached_media) ──────
async function publishFacebookCarousel(env, imageUrls, caption) {
  if (!env.FB_PAGE_ID) return null;
  const attached = [];
  for (const url of imageUrls) {
    const r = await fetch(`${GRAPH}/${env.FB_PAGE_ID}/photos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, published: false, access_token: env.IG_ACCESS_TOKEN }),
    });
    const j = await r.json();
    if (!r.ok || !j.id) throw new Error(`FB carousel photo: ${JSON.stringify(j)}`);
    attached.push({ media_fbid: j.id });
  }
  const res = await fetch(`${GRAPH}/${env.FB_PAGE_ID}/feed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: caption, attached_media: attached, access_token: env.IG_ACCESS_TOKEN }),
  });
  const j = await res.json();
  if (!res.ok || !j.id) throw new Error(`FB carousel post: ${JSON.stringify(j)}`);
  return j.id;
}

// ─── Automatización comentario → DM (lead magnet) ─────────────────────────────
// Cuando alguien comenta la palabra clave en un reel/post, le respondemos en
// PRIVADO con el PDF de la guía. Requiere:
//   - Webhook de Meta suscrito al campo "comments" (callback /webhook + verify token)
//   - Permiso instagram_manage_messages en el token (pasa por App Review de Meta)
const GUIA_PDF = "https://maudev.cl/guia-software-a-medida.pdf";
const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const DM_TEXT = `¡Gracias por comentar! 🚀 Aquí tienes tu guía gratis para decidir bien tu software —precios reales, cómo elegir proveedor y qué exigir—: ${GUIA_PDF}

Cualquier duda, escríbenos por aquí. — maudev`;

async function sendIgPrivateReply(env, commentId, text) {
  // Respuesta privada a un comentario de Instagram (DM).
  const r = await fetch(`${GRAPH}/${env.IG_USER_ID}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ recipient: { comment_id: commentId }, message: { text }, access_token: env.IG_ACCESS_TOKEN }),
  });
  return r.json();
}

async function handleCommentWebhook(env, body) {
  const keyword = norm(env.DM_KEYWORD || "guia");
  for (const entry of body?.entry || []) {
    for (const ch of entry.changes || []) {
      if (ch.field !== "comments") continue;
      const v = ch.value || {};
      if (!v.id) continue;
      // No respondernos a nosotros mismos.
      if (v.from && (v.from.id === env.IG_USER_ID)) continue;
      if (norm(v.text).includes(keyword)) {
        await sendIgPrivateReply(env, v.id, DM_TEXT).catch(() => {});
      }
    }
  }
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

async function runOnce(env, forcedIndex) {
  if (!CONTENT.length) throw new Error("CONTENT vacío.");
  const forced = Number.isInteger(forcedIndex);
  const info = slotInfo();
  const index = forced ? (((forcedIndex % CONTENT.length) + CONTENT.length) % CONTENT.length) : info.index;
  // Disparo manual → publica en TODAS. Cron → cadencia por plataforma.
  const p = forced ? { ig: true, fb: true, li: true, tt: true } : platformsForSlot(info.franja, info.weekday);

  const { id, kind, media, caption, liCaption, preview } = buildContent(index);
  const isReel = kind === "reel";
  const videoUrl = isReel ? media : null;
  const images = isReel ? null : media; // array de URLs

  // Instagram
  let postId = null, igError = null;
  if (p.ig) {
    try {
      postId = isReel ? await publishReel(env, videoUrl, caption) : await publishCarousel(env, images, caption);
    } catch (e) { igError = e.message; }
  }

  // Facebook (best-effort)
  let fbId = null, fbError = null;
  if (p.fb) {
    try {
      fbId = isReel ? await publishFacebookVideo(env, videoUrl, caption) : await publishFacebookCarousel(env, images, caption);
    } catch (e) { fbError = e.message; }
  }

  // LinkedIn (best-effort): video si reel; carrusel multi-imagen nativo si carrusel.
  let liId = null, liError = null;
  if (p.li) {
    try {
      liId = isReel ? await publishLinkedInVideo(env, videoUrl, caption) : await publishLinkedInCarousel(env, images, liCaption);
    } catch (e) { liError = e.message; }
  }

  // TikTok (best-effort): solo reels.
  let ttId = null, ttError = null;
  if (p.tt && isReel) {
    try { ttId = await publishTikTok(env, videoUrl, caption); } catch (e) { ttError = e.message; }
  }

  await logPost(env, { ig_post_id: postId, fb_post_id: fbId, li_post_id: liId, tt_publish_id: ttId, hook: preview, media_kind: kind, content_id: id, image_url: isReel ? videoUrl : (images && images[0]), caption, created_at: new Date().toISOString() });
  return { index, id, kind, platforms: p, postId, igError, fbId, fbError, liId, liError, ttId, ttError, preview };
}

// ─── Flujo TikTok para /admin (Login Kit + Content Posting API, demo de review) ─
const ADMIN_ORIGIN = "https://maudev.cl";
const TIKTOK_REDIRECT = "https://maudev.cl/admin/tiktok";
const CORS = {
  "Access-Control-Allow-Origin": ADMIN_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Cache-Control": "no-store",
};
const jsonCors = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...CORS } });

function tiktokAuthUrl(env) {
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.searchParams.set("client_key", env.TIKTOK_CLIENT_KEY);
  u.searchParams.set("scope", "user.info.basic,video.publish");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", TIKTOK_REDIRECT);
  u.searchParams.set("state", "maudev" + Math.random().toString(36).slice(2, 8));
  return u.toString();
}
async function tiktokExchange(env, code) {
  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      code: code.replace(/\*$/, ""),
      grant_type: "authorization_code",
      redirect_uri: TIKTOK_REDIRECT,
    }),
  });
  return r.json();
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      runOnce(env)
        .then((r) => console.log("Publicado:", r.postId, "—", r.preview))
        .catch((err) => console.error("Error ig-autopost:", err.message)),
    );
  },
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

    // 0) Webhook de Meta (comentario → DM con el PDF).
    if (path === "/webhook") {
      if (req.method === "GET") {
        if (url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === env.META_VERIFY_TOKEN) {
          return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
        }
        return new Response("forbidden", { status: 403 });
      }
      if (req.method === "POST") {
        try { await handleCommentWebhook(env, await req.json()); } catch (e) { /* no romper la respuesta */ }
        return new Response("EVENT_RECEIVED", { status: 200 });
      }
    }

    // 1) Iniciar login de TikTok (Login Kit) → redirige a la pantalla de TikTok.
    if (path === "/tiktok/auth") {
      if (!env.TIKTOK_CLIENT_KEY) return new Response("TikTok no configurado", { status: 400 });
      return new Response(null, { status: 302, headers: { Location: tiktokAuthUrl(env), "Cache-Control": "no-store" } });
    }
    // 2) Estado de conexión (si hay refresh token guardado para publicar).
    if (path === "/tiktok/status") return jsonCors({ connected: !!env.TIKTOK_REFRESH_TOKEN });
    // 3) Canjear el code del login y leer el perfil (demuestra user.info.basic).
    if (path === "/tiktok/exchange") {
      const code = url.searchParams.get("code");
      if (!code) return jsonCors({ ok: false, error: "falta code" }, 400);
      try {
        const tok = await tiktokExchange(env, code);
        if (!tok.access_token) return jsonCors({ ok: false, error: JSON.stringify(tok) }, 400);
        const me = await (await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name", {
          headers: { Authorization: `Bearer ${tok.access_token}` },
        })).json();
        return jsonCors({
          ok: true,
          openId: tok.open_id,
          displayName: me?.data?.user?.display_name || "TikTok",
          refreshToken: tok.refresh_token, // para configurar el secret la 1ª vez
          canPublish: !!env.TIKTOK_REFRESH_TOKEN,
        });
      } catch (e) {
        return jsonCors({ ok: false, error: e.message }, 500);
      }
    }
    // 4) Publicar un reel en TikTok (demuestra Content Posting API).
    if (path === "/tiktok/publish" && req.method === "POST") {
      if (req.headers.get("origin") !== ADMIN_ORIGIN) return jsonCors({ ok: false, error: "origin" }, 403);
      try {
        const demo = CONTENT.find((c) => c.kind === "reel") || {};
        const videoUrl = env.TIKTOK_DEMO_VIDEO || demo.media || "https://maudev.cl/social/d1-cotizan-rapido.mp4";
        const pid = await publishTikTok(env, videoUrl, demo.caption || "maudev · software a medida");
        return jsonCors({ ok: !!pid, publishId: pid });
      } catch (e) {
        return jsonCors({ ok: false, error: e.message }, 500);
      }
    }

    // 5) Disparo manual de la publicación a todos los canales (uso interno).
    if (req.headers.get("x-trigger") === env.TRIGGER_SECRET) {
      try {
        const forced = url.searchParams.get("index");
        const r = await runOnce(env, forced != null ? parseInt(forced, 10) : undefined);
        return Response.json({ ok: true, ...r });
      } catch (err) {
        return Response.json({ ok: false, error: err.message }, { status: 500 });
      }
    }
    return new Response("forbidden", { status: 403 });
  },
};
