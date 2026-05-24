// Cloudflare Worker: authenticated upload endpoint backed by R2.
//
// POST /upload  (multipart/form-data, field "file")
//   Headers: Authorization: Bearer <Firebase ID token>
//   Returns: { file_url: "https://<PUBLIC_BASE_URL>/<key>" }
//
// GET /<key>    -> serves the object from R2 (public read).
//
// Env bindings:
//   BUCKET              R2 bucket
//   PUBLIC_BASE_URL     e.g. https://uploads.maudev.cl
//   ALLOWED_ORIGINS     comma-separated CORS allowlist
//   FIREBASE_PROJECT_ID e.g. "maudev"            (secret)
//   ADMIN_EMAILS        e.g. "maudevchile@gmail.com" (secret, optional override)

const corsHeaders = (origin, allowed) => {
  const ok = allowed.split(',').map(s => s.trim()).includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};

// --- Firebase ID token verification ---------------------------------------
// Verifies an RS256 JWT issued by Google Identity for the given project.
// Caches the public certs in memory across requests within the same isolate.
let certCache = { keys: null, expiresAt: 0 };

async function getGoogleCerts() {
  const now = Date.now();
  if (certCache.keys && now < certCache.expiresAt) return certCache.keys;
  const res = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  const cacheControl = res.headers.get('cache-control') || '';
  const maxAge = parseInt((cacheControl.match(/max-age=(\d+)/) || [])[1] || '3600', 10);
  const keys = await res.json();
  certCache = { keys, expiresAt: now + maxAge * 1000 };
  return keys;
}

function b64urlToUint8(str) {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function pemToArrayBuffer(pem) {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return b64urlToUint8(body.replace(/\+/g, '-').replace(/\//g, '_')).buffer;
}

async function verifyFirebaseIdToken(token, projectId) {
  const [headerB64, payloadB64, sigB64] = token.split('.');
  if (!headerB64 || !payloadB64 || !sigB64) throw new Error('malformed token');
  const header = JSON.parse(new TextDecoder().decode(b64urlToUint8(headerB64)));
  const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8(payloadB64)));

  const certs = await getGoogleCerts();
  const pem = certs[header.kid];
  if (!pem) throw new Error('unknown kid');

  const key = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8(sigB64), data);
  if (!ok) throw new Error('bad signature');

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) throw new Error('token expired');
  if (payload.aud !== projectId) throw new Error('bad audience');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('bad issuer');
  if (!payload.sub) throw new Error('no sub');
  return payload;
}

// --- handlers --------------------------------------------------------------

async function handleUpload(request, env) {
  const auth = request.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return new Response('missing bearer token', { status: 401 });

  let claims;
  try {
    claims = await verifyFirebaseIdToken(m[1], env.FIREBASE_PROJECT_ID);
  } catch (e) {
    return new Response(`invalid token: ${e.message}`, { status: 401 });
  }

  const adminList = (env.ADMIN_EMAILS || 'maudevchile@gmail.com').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!adminList.includes((claims.email || '').toLowerCase())) {
    return new Response('forbidden', { status: 403 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return new Response('no file', { status: 400 });

  const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}_${safeName}`;
  await env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  return Response.json({ file_url: `${env.PUBLIC_BASE_URL}/${key}` });
}

async function handleServe(key, env) {
  const obj = await env.BUCKET.get(key);
  if (!obj) return new Response('not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(obj.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || '');

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (url.pathname === '/upload' && request.method === 'POST') {
      const res = await handleUpload(request, env);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
    if (request.method === 'GET' && url.pathname.length > 1) {
      return handleServe(decodeURIComponent(url.pathname.slice(1)), env);
    }
    return new Response('maudev-uploads', { status: 200, headers: cors });
  },
};
