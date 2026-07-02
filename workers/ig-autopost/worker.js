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

import { CONTENT, TIKTOK_QUEUE } from "./content.js";

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
    tt: franja === 0, // BORRADOR al inbox 1/día (franja 0); tú lo revisas y publicas
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
// Autor de las publicaciones: la PÁGINA de empresa (urn:li:organization:{id}) si
// está configurada; si no, el perfil personal como respaldo.
const liAuthor = (env) => env.LINKEDIN_ORG_URN || env.LINKEDIN_PERSON_URN;

// Sube UNA imagen a LinkedIn → devuelve su URN (urn:li:image:...).
async function uploadLinkedInImage(env, imageUrl) {
  const h = liHeaders(env);
  const initRes = await fetch(`${LI_API}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers: { ...h, "content-type": "application/json" },
    body: JSON.stringify({ initializeUploadRequest: { owner: liAuthor(env) } }),
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
      author: liAuthor(env),
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
  if (!env.LINKEDIN_ACCESS_TOKEN || !liAuthor(env)) return null;
  const urn = await uploadLinkedInImage(env, imageUrl);
  return createLinkedInPost(env, caption, { media: { altText: "maudev", id: urn } });
}

// Post NATIVO de varias imágenes (carrusel deslizable) → se ven TODAS las slides.
async function publishLinkedInCarousel(env, imageUrls, caption) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !liAuthor(env)) return null;
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
  if (!env.LINKEDIN_ACCESS_TOKEN || !liAuthor(env)) return null;
  const author = liAuthor(env);
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

// Sube el video como BORRADOR al inbox de TikTok (scope video.upload). El dueño
// abre TikTok, revisa, pega la descripción SEO (desde el admin) y publica. Esto
// funciona sin auditoría de la app (a diferencia de Direct Post) y no arriesga
// publicar algo sin querer. La descripción NO se envía por API (TikTok obliga a
// ponerla en la app al publicar el borrador).
async function publishTikTok(env, videoUrl) {
  if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET || !env.TIKTOK_REFRESH_TOKEN) return null;
  const accessToken = await refreshTikTokToken(env);
  // Descargamos el video (lo hospedamos nosotros) y lo subimos por FILE_UPLOAD.
  // Así evitamos verificar el dominio (requisito de PULL_FROM_URL, que fallaba
  // en silencio: TikTok devolvía un publish_id pero nunca llegaba el borrador).
  const vres = await fetch(videoUrl);
  if (!vres.ok) throw new Error(`no se pudo descargar el video: ${vres.status}`);
  const bytes = new Uint8Array(await vres.arrayBuffer());
  const size = bytes.length;
  const init = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 },
    }),
  });
  const j = await init.json();
  const pid = j?.data?.publish_id;
  const uploadUrl = j?.data?.upload_url;
  if (!init.ok || !pid || !uploadUrl) throw new Error(`TikTok inbox init: ${JSON.stringify(j)}`);
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${size - 1}/${size}` },
    body: bytes,
  });
  if (!put.ok) throw new Error(`TikTok upload PUT: ${put.status} ${(await put.text()).slice(0, 120)}`);
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

// Aviso interno a Lucas por Telegram (leads, comentarios, formularios).
// No-op silencioso si no están configurados los secrets del bot.
async function sendTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch { /* nunca romper el flujo por un aviso */ }
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
        // Aviso a Lucas: mientras el App Review no esté listo, el DM automático
        // rebota → este ping te permite responder a mano en segundos.
        const who = v.from?.username ? "@" + v.from.username : (v.from?.id || "?");
        await sendTelegram(env, `💬 <b>Comentario "${env.DM_KEYWORD || "guía"}" en Instagram</b>\nDe: ${who}\nTexto: ${v.text || ""}\n\n👉 Si el DM automático aún no está activo (App Review), mándale el PDF a mano.`);
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

  // TikTok (best-effort): contenido NUEVO exclusivo de TikTok (cola propia, no
  // lo que va a IG/FB/LinkedIn), como BORRADOR al inbox. 1/día (franja 0).
  let ttId = null, ttError = null;
  if (p.tt && TIKTOK_QUEUE.length) {
    try {
      const ttDay = Math.floor(Date.now() / 86400000) - BASE_DAY;
      const ttItem = TIKTOK_QUEUE[((ttDay % TIKTOK_QUEUE.length) + TIKTOK_QUEUE.length) % TIKTOK_QUEUE.length];
      ttId = await publishTikTok(env, ttItem.media);
      if (ttId) await sendTelegram(env, `🎵 <b>Borrador nuevo en TikTok</b>\nVideo: ${ttItem.id}\n\n👉 Abre TikTok, pega la descripción SEO (maudev.cl/admin/tiktok) y publica.`);
    } catch (e) { ttError = e.message; }
  }

  await logPost(env, { ig_post_id: postId, fb_post_id: fbId, li_post_id: liId, tt_publish_id: ttId, hook: preview, media_kind: kind, content_id: id, image_url: isReel ? videoUrl : (images && images[0]), caption, created_at: new Date().toISOString() });
  return { index, id, kind, platforms: p, postId, igError, fbId, fbError, liId, liError, ttId, ttError, preview };
}

// ─── Flujo TikTok para /admin (Login Kit + Content Posting API, demo de review) ─
const ADMIN_ORIGIN = "https://maudev.cl";
const TIKTOK_REDIRECT = "https://maudev.cl/admin/tiktok";
// Orígenes permitidos para el admin (prod + dev local con Vite).
const ADMIN_ORIGINS = [ADMIN_ORIGIN, "http://localhost:5173", "http://localhost:4173"];
const isAdminOrigin = (o) => ADMIN_ORIGINS.includes(o);
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": isAdminOrigin(origin) ? origin : ADMIN_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Cache-Control": "no-store",
  };
}
const CORS = corsHeaders(ADMIN_ORIGIN);
const jsonCors = (data, status = 200, origin) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...corsHeaders(origin) } });

function tiktokAuthUrl(env) {
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.searchParams.set("client_key", env.TIKTOK_CLIENT_KEY);
  // video.upload = borradores al inbox · video.list = leer métricas de videos publicados.
  u.searchParams.set("scope", "user.info.basic,video.publish,video.upload,video.list");
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

// ─── Métricas para el dashboard del admin (IG + FB engagement; LinkedIn limitado) ─
// Usa el token de Página (IG_ACCESS_TOKEN) que ya sirve para IG (enlazado a la
// página) y para el feed de la página. Solo lectura de engagement público
// (likes/comentarios). El alcance/impresiones requieren instagram_manage_insights
// (App Review) y se suman cuando Meta apruebe.
async function getMetrics(env) {
  const out = { generatedAt: new Date().toISOString(), ig: null, fb: null, li: null };
  const T = env.IG_ACCESS_TOKEN;

  // Instagram
  try {
    const acc = await (await fetch(`${GRAPH}/${env.IG_USER_ID}?fields=username,followers_count,media_count&access_token=${T}`)).json();
    if (acc.error) throw new Error(acc.error.message);
    const media = await (await fetch(`${GRAPH}/${env.IG_USER_ID}/media?fields=id,caption,like_count,comments_count,timestamp,media_type,permalink,thumbnail_url,media_url&limit=25&access_token=${T}`)).json();
    const posts = (media.data || []).map((m) => ({
      id: m.id,
      caption: (m.caption || "").replace(/\s+/g, " ").slice(0, 100),
      likes: m.like_count || 0,
      comments: m.comments_count || 0,
      eng: (m.like_count || 0) + (m.comments_count || 0),
      type: m.media_type,
      permalink: m.permalink,
      thumb: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
      timestamp: m.timestamp,
    }));
    const likes = posts.reduce((a, p) => a + p.likes, 0);
    const comments = posts.reduce((a, p) => a + p.comments, 0);
    out.ig = {
      username: acc.username,
      followers: acc.followers_count || 0,
      mediaCount: acc.media_count || 0,
      totals: { likes, comments, posts: posts.length },
      avgEng: posts.length ? Math.round(((likes + comments) / posts.length) * 10) / 10 : 0,
      posts,
    };
  } catch (e) { out.ig = { error: e.message }; }

  // Facebook (página). El engagement por post (reactions/comments) requiere
  // pages_read_user_content (App Review); mientras tanto mostramos seguidores +
  // conteo + últimos posts, e intentamos el engagement de forma tolerante.
  try {
    const page = await (await fetch(`${GRAPH}/${env.FB_PAGE_ID}?fields=name,fan_count,followers_count&access_token=${T}`)).json();
    if (page.error) throw new Error(page.error.message);
    // 1º intento: con engagement. Si Meta lo bloquea, caemos al feed simple.
    let feed = await (await fetch(`${GRAPH}/${env.FB_PAGE_ID}/published_posts?fields=id,message,created_time,permalink_url,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0),shares&limit=20&access_token=${T}`)).json();
    let engagementOk = !feed.error;
    if (feed.error) {
      feed = await (await fetch(`${GRAPH}/${env.FB_PAGE_ID}/published_posts?fields=id,message,created_time,permalink_url&limit=20&access_token=${T}`)).json();
    }
    const posts = (feed.data || []).map((p) => ({
      id: p.id,
      caption: (p.message || "").replace(/\s+/g, " ").slice(0, 100),
      likes: p.reactions?.summary?.total_count ?? null,
      comments: p.comments?.summary?.total_count ?? null,
      shares: p.shares?.count ?? null,
      eng: engagementOk ? (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0) : null,
      permalink: p.permalink_url,
      timestamp: p.created_time,
    }));
    out.fb = {
      name: page.name,
      followers: page.followers_count || page.fan_count || 0,
      engagementAvailable: engagementOk,
      totals: {
        likes: engagementOk ? posts.reduce((a, p) => a + (p.likes || 0), 0) : null,
        comments: engagementOk ? posts.reduce((a, p) => a + (p.comments || 0), 0) : null,
        posts: posts.length,
      },
      note: engagementOk ? null : "Likes/comentarios por post requieren el permiso pages_read_user_content (App Review).",
      posts,
    };
  } catch (e) { out.fb = { error: e.message }; }

  // LinkedIn — la API orgánica de miembro no expone métricas sin acceso de
  // organización; se informa honestamente en vez de inventar datos.
  out.li = {
    available: false,
    connected: !!(env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_PERSON_URN),
    note: "LinkedIn no expone métricas orgánicas por API sin acceso de organización (partner). Se publica correctamente, pero las estadísticas se ven en LinkedIn.",
  };

  // TikTok
  out.tt = await getTikTokMetrics(env);

  return out;
}

// Métricas de TikTok (scope video.list). Devuelve videos publicados con sus
// vistas/likes/comentarios/compartidos → sirve para detectar los ganadores.
async function getTikTokMetrics(env) {
  if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_REFRESH_TOKEN) return { available: false, connected: false, note: "TikTok no conectado." };
  try {
    const token = await refreshTikTokToken(env);
    const fields = "id,title,video_description,view_count,like_count,comment_count,share_count,cover_image_url,share_url,create_time";
    const r = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${fields}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ max_count: 20 }),
    });
    const j = await r.json();
    if (j.error && j.error.code && j.error.code !== "ok") throw new Error(j.error.message || j.error.code);
    const vids = (j.data?.videos || []).map((v) => ({
      id: v.id,
      caption: (v.title || v.video_description || "").replace(/\s+/g, " ").slice(0, 100),
      views: v.view_count || 0,
      likes: v.like_count || 0,
      comments: v.comment_count || 0,
      shares: v.share_count || 0,
      eng: (v.like_count || 0) + (v.comment_count || 0) + (v.share_count || 0),
      thumb: v.cover_image_url,
      permalink: v.share_url,
      timestamp: v.create_time ? new Date(v.create_time * 1000).toISOString() : null,
    }));
    return {
      available: true,
      connected: true,
      totals: {
        views: vids.reduce((a, p) => a + p.views, 0),
        likes: vids.reduce((a, p) => a + p.likes, 0),
        comments: vids.reduce((a, p) => a + p.comments, 0),
        posts: vids.length,
      },
      posts: vids,
    };
  } catch (e) {
    return { available: false, connected: true, error: e.message };
  }
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
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req.headers.get("origin")) });

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
    // 4) Cola de contenido TikTok: videos NUEVOS (solo TikTok) + descripción SEO.
    if (path === "/tiktok/queue") {
      const origin = req.headers.get("origin");
      if (!isAdminOrigin(origin)) return jsonCors({ error: "origin" }, 403, origin);
      return jsonCors({ reels: TIKTOK_QUEUE, connected: !!env.TIKTOK_REFRESH_TOKEN }, 200, origin);
    }
    // 4b) Subir un video como BORRADOR al inbox de TikTok (manual desde el admin).
    if (path === "/tiktok/publish" && req.method === "POST") {
      const origin = req.headers.get("origin");
      if (!isAdminOrigin(origin)) return jsonCors({ ok: false, error: "origin" }, 403, origin);
      try {
        const body = await req.json().catch(() => ({}));
        const item = (body.id && TIKTOK_QUEUE.find((r) => r.id === body.id)) || TIKTOK_QUEUE[0] || {};
        const videoUrl = item.media || env.TIKTOK_DEMO_VIDEO || "https://maudev.cl/social/pro-errores.mp4";
        const pid = await publishTikTok(env, videoUrl);
        if (pid) await sendTelegram(env, `🎵 <b>Borrador subido a TikTok</b>\nVideo: ${item.id || "?"}\n\n👉 Ábrelo en TikTok, pega la descripción y publica.`);
        return jsonCors({ ok: !!pid, publishId: pid }, 200, origin);
      } catch (e) {
        return jsonCors({ ok: false, error: e.message }, 500, origin);
      }
    }

    // 4a) Aviso de lead nuevo → Telegram (desde el sitio, tras Lead.create).
    if (path === "/notify-lead" && req.method === "POST") {
      const origin = req.headers.get("origin");
      if (!isAdminOrigin(origin)) return jsonCors({ ok: false, error: "origin" }, 403, origin);
      try {
        const b = await req.json();
        const line = (k, v) => (v ? `\n${k}: ${v}` : "");
        await sendTelegram(env,
          `🎯 <b>Nuevo lead</b> (${b.source || "sitio"})` +
          line("Nombre", b.name) + line("Email", b.email) +
          line("WhatsApp", b.whatsapp) + line("Interés", b.interest || b.content_name) +
          `\n\n👉 Detalle en maudev.cl/admin/leads`);
        return jsonCors({ ok: true }, 200, origin);
      } catch (e) { return jsonCors({ ok: false, error: e.message }, 500, origin); }
    }

    // 4b) Métricas para el dashboard del admin (maudev.cl + localhost dev).
    if (path === "/metrics") {
      const origin = req.headers.get("origin");
      if (!isAdminOrigin(origin)) return jsonCors({ error: "origin" }, 403, origin);
      try { return jsonCors(await getMetrics(env), 200, origin); }
      catch (e) { return jsonCors({ error: e.message }, 500, origin); }
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
