import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Music2, Loader2, CheckCircle2, AlertCircle, LogIn, Send } from "lucide-react";

// Panel de TikTok del admin. Demuestra los dos productos de la app de TikTok:
//   1) Login Kit (Conectar con TikTok)  2) Content Posting API (Publicar reel)
// Esta interfaz es la que se graba para el video demo del App Review de TikTok.
const WORKER = "https://ig-autopost.maudevchile.workers.dev";

export default function AdminTikTok() {
  const [params, setParams] = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [profile, setProfile] = useState(null); // { displayName, openId, refreshToken }
  const [exchanging, setExchanging] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState(null); // { ok, msg }

  useEffect(() => { document.title = "TikTok · Maudev admin"; }, []);

  // Estado de conexión (si el worker ya tiene token para publicar).
  useEffect(() => {
    fetch(`${WORKER}/tiktok/status`).then((r) => r.json()).then((d) => setConnected(!!d.connected)).catch(() => {});
  }, []);

  // Si volvemos del login de TikTok con ?code=..., lo canjeamos.
  useEffect(() => {
    const code = params.get("code");
    if (!code) return;
    setExchanging(true);
    fetch(`${WORKER}/tiktok/exchange?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setProfile({ displayName: d.displayName, openId: d.openId, refreshToken: d.refreshToken });
          if (d.canPublish) setConnected(true);
        } else {
          setResult({ ok: false, msg: "No se pudo conectar: " + (d.error || "error") });
        }
      })
      .catch((e) => setResult({ ok: false, msg: e.message }))
      .finally(() => {
        setExchanging(false);
        params.delete("code"); params.delete("state");
        setParams(params, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = () => { window.location.href = `${WORKER}/tiktok/auth?t=${Date.now()}`; };

  const publish = async () => {
    setPublishing(true); setResult(null);
    try {
      const r = await fetch(`${WORKER}/tiktok/publish`, { method: "POST" });
      const d = await r.json();
      setResult(d.ok ? { ok: true, msg: "Reel enviado a TikTok ✅ (publish id: " + d.publishId + ")" } : { ok: false, msg: "Error: " + (d.error || "") });
    } catch (e) {
      setResult({ ok: false, msg: e.message });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <Music2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">TikTok</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Conecta la cuenta de TikTok de maudev y publica reels desde aquí.
      </p>

      {/* Paso 1 — Login Kit */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><LogIn className="h-4 w-4" /> 1. Conectar con TikTok</h2>
            <p className="text-sm text-muted-foreground mt-1">Inicia sesión con la cuenta de TikTok (Login Kit).</p>
          </div>
          <button
            onClick={connect}
            className="shrink-0 rounded-lg bg-primary text-primary-foreground font-semibold px-4 py-2 hover:bg-primary/90"
          >
            Conectar con TikTok
          </button>
        </div>

        {exchanging && (
          <p className="mt-4 text-sm flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Conectando…</p>
        )}
        {profile && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm flex items-center gap-2 text-primary font-medium"><CheckCircle2 className="h-4 w-4" /> Conectado como {profile.displayName}</p>
            {profile.refreshToken && (
              <p className="mt-2 text-xs text-muted-foreground break-all">
                Token de actualización (pásalo una vez para activar la publicación):<br />
                <code className="text-foreground">{profile.refreshToken}</code>
              </p>
            )}
          </div>
        )}
      </section>

      {/* Paso 2 — Content Posting API */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><Send className="h-4 w-4" /> 2. Publicar reel en TikTok</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sube un reel de maudev a TikTok (Content Posting API).
              {!connected && <span className="text-amber-500"> Conecta primero la cuenta.</span>}
            </p>
          </div>
          <button
            onClick={publish}
            disabled={publishing}
            className="shrink-0 rounded-lg bg-primary text-primary-foreground font-semibold px-4 py-2 hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {publishing && <Loader2 className="h-4 w-4 animate-spin" />}
            Publicar reel
          </button>
        </div>

        {result && (
          <div className={`mt-4 rounded-lg border p-4 text-sm flex items-start gap-2 ${result.ok ? "border-primary/30 bg-primary/5 text-primary" : "border-red-500/30 bg-red-500/5 text-red-400"}`}>
            {result.ok ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
            <span>{result.msg}</span>
          </div>
        )}
      </section>
    </div>
  );
}
