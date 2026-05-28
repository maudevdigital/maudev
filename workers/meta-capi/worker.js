const PIXEL_ID = "3002561230082800";
const CAPI_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

const ALLOWED_ORIGINS = [
  "https://maudev.cl",
  "https://www.maudev.cl",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5180",
];

async function sha256(value) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized)
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const {
      event_name = "Lead",
      event_id,
      email,
      phone,
      source_url,
      fbc,
      fbp,
    } = body;

    const user_data = {};

    const emHash = await sha256(email);
    if (emHash) user_data.em = [emHash];

    if (phone) {
      const digits = phone.replace(/\D/g, "");
      const phHash = await sha256(digits);
      if (phHash) user_data.ph = [phHash];
    }

    if (fbc) user_data.fbc = fbc;
    if (fbp) user_data.fbp = fbp;

    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) user_data.client_ip_address = ip;

    const ua = request.headers.get("User-Agent");
    if (ua) user_data.client_user_agent = ua;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id || crypto.randomUUID(),
          event_source_url: source_url || "https://maudev.cl",
          action_source: "website",
          user_data,
        },
      ],
      access_token: env.META_ACCESS_TOKEN,
    };

    let result;
    try {
      const res = await fetch(CAPI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      result = await res.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "CAPI request failed", detail: String(err) }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  },
};
