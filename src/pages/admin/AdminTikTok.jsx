import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Music2, Loader2, CheckCircle2, AlertCircle, LogIn, Send, Copy, Check, UploadCloud } from "lucide-react";

// Panel de TikTok del admin. Demuestra los dos productos de la app de TikTok:
//   1) Login Kit (Conectar con TikTok)  2) Content Posting API (Publicar reel)
// Esta interfaz es la que se graba para el video demo del App Review de TikTok.
const WORKER = "https://ig-autopost.maudevchile.workers.dev";

export default function AdminTikTok() {
  const [params, setParams] = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [profile, setProfile] = useState(null); // { displayName, openId, refreshToken }
  const [exchanging, setExchanging] = useState(false);
  const [publishing, setPublishing] = useState(null); // id en curso
  const [result, setResult] = useState(null); // { ok, msg }
  const [queue, setQueue] = useState([]);
  const [copied, setCopied] = useState(null); // id copiado
  const [uploaded, setUploaded] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("tt_uploaded") || "[]")); } catch { return new Set(); }
  });

  const markUploaded = (id) => {
    setUploaded((prev) => {
      const next = new Set(prev); next.add(id);
      try { localStorage.setItem("tt_uploaded", JSON.stringify([...next])); } catch { /* noop */ }
      return next;
    });
  };
  const resetUploaded = () => { setUploaded(new Set()); try { localStorage.removeItem("tt_uploaded"); } catch { /* noop */ } };

  useEffect(() => { document.title = "TikTok · Maudev admin"; }, []);

  // Estado de conexión (si el worker ya tiene token para publicar).
  useEffect(() => {
    fetch(`${WORKER}/tiktok/status`).then((r) => r.json()).then((d) => setConnected(!!d.connected)).catch(() => {});
  }, []);

  // Cola de contenido (reels + descripción SEO para copiar al publicar el borrador).
  useEffect(() => {
    fetch(`${WORKER}/tiktok/queue`).then((r) => r.json()).then((d) => setQueue(d.reels || [])).catch(() => {});
  }, []);

  const copy = async (id, text) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1800); } catch { /* noop */ }
  };

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

  const draft = async (id) => {
    setPublishing(id); setResult(null);
    try {
      const r = await fetch(`${WORKER}/tiktok/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const d = await r.json();
      if (d.ok) markUploaded(id);
      setResult(d.ok ? { ok: true, msg: "Borrador subido a TikTok ✅ — ábrelo en la app, pega la descripción y publica." } : { ok: false, msg: "Error: " + (d.error || "") });
    } catch (e) {
      setResult({ ok: false, msg: e.message });
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <Music2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">TikTok</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Conecta la cuenta de TikTok de maudev y publica reels desde aquí.
      </p>

      {/* Paso 1 — Login Kit */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

      {/* Paso 2 — Cómo funciona */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-2"><Send className="h-4 w-4" /> 2. Cómo funciona (borradores)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cada día, el sistema sube automáticamente un reel como <strong className="text-foreground">borrador</strong> a tu TikTok
          (y te avisa por Telegram). Tú lo abres en la app, <strong className="text-foreground">pegas la descripción SEO</strong> de
          abajo y publicas. Así revisas antes de que salga y vas viendo qué funciona.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          La API de TikTok no permite escribir la descripción en el borrador, por eso la copias aquí. Las métricas se sumarán cuando tengas videos publicados.
        </p>
        {result && (
          <div className={`mt-4 rounded-lg border p-4 text-sm flex items-start gap-2 ${result.ok ? "border-primary/30 bg-primary/5 text-primary" : "border-red-500/30 bg-red-500/5 text-red-400"}`}>
            {result.ok ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
            <span>{result.msg}</span>
          </div>
        )}
      </section>

      {/* Cola de contenido: reels + descripción SEO para copiar */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Cola de contenido ({queue.filter((r) => !uploaded.has(r.id)).length})</h2>
          {uploaded.size > 0 && (
            <button onClick={resetUploaded} className="text-xs text-muted-foreground hover:text-foreground underline">
              {uploaded.size} subido(s) oculto(s) · restablecer
            </button>
          )}
        </div>
        <div className="space-y-3">
          {queue.length === 0 && <p className="text-sm text-muted-foreground">Cargando cola…</p>}
          {queue.length > 0 && queue.every((r) => uploaded.has(r.id)) && (
            <p className="text-sm text-muted-foreground">Todos subidos ✅. Usa "restablecer" para volver a mostrarlos.</p>
          )}
          {queue.filter((r) => !uploaded.has(r.id)).map((r) => (
            <div key={r.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-foreground truncate min-w-0">{r.id}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copy(r.id, r.caption)}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary hover:bg-secondary/70 border border-border"
                  >
                    {copied === r.id ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar descripción</>}
                  </button>
                  <button
                    onClick={() => draft(r.id)}
                    disabled={publishing === r.id || !connected}
                    title={!connected ? "Conecta primero la cuenta de TikTok" : "Subir como borrador ahora"}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {publishing === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                    Subir borrador
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3 leading-relaxed">{r.caption}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
