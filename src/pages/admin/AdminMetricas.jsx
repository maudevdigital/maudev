import { useState, useEffect, useCallback } from "react";
import {
  Heart, MessageCircle, Users, Music2, Eye,
  RefreshCw, TrendingUp, ExternalLink, Trophy, AlertCircle,
} from "lucide-react";

const WORKER = "https://ig-autopost.maudevchile.workers.dev";

// Íconos de marca (lucide dejó de exportarlos): SVGs propios que aceptan className.
const IgIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const FbIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8.2V14h2.3v7z" />
  </svg>
);
const LiIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.5 8.5h-3V21h3zM5 3.8A1.7 1.7 0 1 0 5 7.2a1.7 1.7 0 0 0 0-3.4M21 21h-3v-6.1c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.5-.1.8V21h-3V8.5h3v1.4c.4-.6 1.1-1.5 2.8-1.5 2 0 3.7 1.3 3.7 4.2z" />
  </svg>
);

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short" }) : "";

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`h-5 w-5 ${accent || "text-foreground"}`} />
        <TrendingUp className="h-3 w-3 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold font-mono">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </div>
  );
}

// Delta entre el snapshot más nuevo y el de hace `days` (o el más antiguo disponible).
function trendDelta(history, field, days = 7) {
  if (!history || history.length < 2) return null;
  const last = history[history.length - 1];
  const target = history.length > days ? history[history.length - 1 - days] : history[0];
  if (last?.[field] == null || target?.[field] == null) return null;
  return last[field] - target[field];
}

const DeltaBadge = ({ value, suffix = "" }) => {
  if (value == null) return <span className="text-muted-foreground/60">—</span>;
  const up = value > 0;
  return (
    <span className={`font-mono text-xs ${up ? "text-primary" : value < 0 ? "text-destructive" : "text-muted-foreground"}`}>
      {up ? "+" : ""}{value}{suffix}
    </span>
  );
};

export default function AdminMetricas() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${WORKER}/metrics`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    fetch(`${WORKER}/metrics/history`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history || []))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const ig = data?.ig || {};
  const fb = data?.fb || {};
  const li = data?.li || {};
  const tt = data?.tt || {};
  const igTop = [...(ig.posts || [])].sort((a, b) => b.eng - a.eng).slice(0, 10);
  const ttTop = [...(tt.posts || [])].sort((a, b) => (b.views - a.views) || (b.eng - a.eng)).slice(0, 10);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Métricas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Engagement por red para decidir qué contenido funciona.
            {data?.generatedAt && (
              <span className="ml-1 text-muted-foreground/60">
                · Actualizado {new Date(data.generatedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/70 border border-border text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>No se pudieron cargar las métricas: {error}</span>
        </div>
      )}

      {loading && !data ? (
        <p className="text-sm text-muted-foreground py-10">Cargando métricas…</p>
      ) : (
        <>
          {/* Resumen por red */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <StatCard icon={IgIcon} accent="text-pink-500" label={`Seguidores IG${ig.username ? ` · @${ig.username}` : ""}`} value={ig.followers ?? "—"} sub={`${ig.mediaCount ?? 0} publicaciones`} />
            <StatCard icon={Heart} accent="text-pink-500" label="Engagement IG (últimos posts)" value={ig.totals ? ig.totals.likes + ig.totals.comments : "—"} sub={ig.totals ? `${ig.totals.likes} likes · ${ig.totals.comments} coment.` : ""} />
            <StatCard icon={TrendingUp} accent="text-pink-500" label="Promedio engagement / post" value={ig.avgEng ?? "—"} sub={`sobre ${ig.totals?.posts ?? 0} posts`} />
            <StatCard icon={FbIcon} accent="text-blue-600" label="Seguidores FB" value={fb.followers ?? "—"} sub={`${fb.totals?.posts ?? 0} posts publicados`} />
            <StatCard icon={Eye} accent="text-foreground" label="Vistas TikTok" value={tt.available ? tt.totals?.views ?? 0 : "—"} sub={tt.available ? `${tt.totals?.posts ?? 0} videos` : (tt.connected ? "sin datos aún" : "no conectado")} />
          </div>

          {/* Tendencia (snapshots diarios) */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Tendencia (últimos 7 días)</h3>
            </div>
            {history.length < 2 ? (
              <p className="text-sm text-muted-foreground py-3">
                Recolectando datos: se guarda un registro diario automático. Desde mañana verás la evolución
                (seguidores, engagement y vistas, día a día).
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 mb-4">
                  {[
                    { label: "Seguidores IG", field: "igFollowers" },
                    { label: "Likes IG", field: "igLikes" },
                    { label: "Vistas TikTok", field: "ttViews" },
                    { label: "Seguidores FB", field: "fbFollowers" },
                  ].map(({ label, field }) => (
                    <div key={field} className="rounded-lg bg-secondary/40 border border-border/60 px-3 py-2.5">
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="text-lg font-bold font-mono">{history[history.length - 1]?.[field] ?? "—"}</p>
                      <DeltaBadge value={trendDelta(history, field)} />
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border/60">
                        <th className="text-left py-1.5 pr-3">Día</th>
                        <th className="text-right py-1.5 px-3">Seg. IG</th>
                        <th className="text-right py-1.5 px-3">Likes IG</th>
                        <th className="text-right py-1.5 px-3">Coment. IG</th>
                        <th className="text-right py-1.5 px-3">Vistas TT</th>
                        <th className="text-right py-1.5 pl-3">Seg. FB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(-14).reverse().map((s) => (
                        <tr key={s.date} className="border-b border-border/30 last:border-0">
                          <td className="py-1.5 pr-3 text-muted-foreground">{s.date.slice(5)}</td>
                          <td className="text-right py-1.5 px-3">{s.igFollowers ?? "—"}</td>
                          <td className="text-right py-1.5 px-3">{s.igLikes ?? "—"}</td>
                          <td className="text-right py-1.5 px-3">{s.igComments ?? "—"}</td>
                          <td className="text-right py-1.5 px-3">{s.ttViews ?? "—"}</td>
                          <td className="text-right py-1.5 pl-3">{s.fbFollowers ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Ranking IG */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Top posts de Instagram por engagement</h3>
            </div>
            {ig.error ? (
              <p className="text-sm text-muted-foreground py-4">IG no disponible: {ig.error}</p>
            ) : igTop.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Sin publicaciones aún.</p>
            ) : (
              <div className="space-y-1">
                {igTop.map((p, i) => (
                  <a
                    key={p.id}
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-0"
                  >
                    <span className={`w-6 text-center text-xs font-mono font-bold shrink-0 ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}</span>
                    {p.thumb ? (
                      <img src={p.thumb} alt="" className="h-11 w-11 rounded-md object-cover shrink-0 bg-secondary" loading="lazy" />
                    ) : (
                      <div className="h-11 w-11 rounded-md bg-secondary shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{p.caption || "(sin texto)"}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{p.type === "VIDEO" ? "Reel" : p.type === "CAROUSEL_ALBUM" ? "Carrusel" : "Imagen"} · {fmtDate(p.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                      <span className="inline-flex items-center gap-1 text-pink-500"><Heart className="h-3.5 w-3.5" />{p.likes}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><MessageCircle className="h-3.5 w-3.5" />{p.comments}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Ranking TikTok — los "ganadores" para promover a IG/FB/LinkedIn */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Music2 className="h-4 w-4 text-foreground" />
              <h3 className="font-semibold text-sm">Top TikTok — ganadores de la semana</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">Los de más vistas/interacción son los que conviene promover a IG, FB y LinkedIn.</p>
            {tt.error ? (
              <p className="text-sm text-muted-foreground py-4">TikTok: {tt.error} — reconecta en <a className="text-primary hover:underline" href="/admin/tiktok">/admin/tiktok</a>.</p>
            ) : !tt.connected ? (
              <p className="text-sm text-muted-foreground py-4">TikTok no conectado. Conéctalo en <a className="text-primary hover:underline" href="/admin/tiktok">/admin/tiktok</a>.</p>
            ) : ttTop.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Aún no hay videos publicados en TikTok (los borradores no cuentan hasta publicarlos).</p>
            ) : (
              <div className="space-y-1">
                {ttTop.map((p, i) => (
                  <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-0">
                    <span className={`w-6 text-center text-xs font-mono font-bold shrink-0 ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}</span>
                    {p.thumb ? (
                      <img src={p.thumb} alt="" className="h-11 w-11 rounded-md object-cover shrink-0 bg-secondary" loading="lazy" />
                    ) : (
                      <div className="h-11 w-11 rounded-md bg-secondary shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{p.caption || "(sin texto)"}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{fmtDate(p.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                      <span className="inline-flex items-center gap-1 text-foreground"><Eye className="h-3.5 w-3.5" />{p.views}</span>
                      <span className="inline-flex items-center gap-1 text-pink-500"><Heart className="h-3.5 w-3.5" />{p.likes}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><MessageCircle className="h-3.5 w-3.5" />{p.comments}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* FB + LinkedIn */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Facebook */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FbIcon className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm">Facebook · {fb.name?.trim() || "Página"}</h3>
              </div>
              {fb.error ? (
                <p className="text-sm text-muted-foreground py-2">FB no disponible: {fb.error}</p>
              ) : (
                <>
                  {fb.note && (
                    <p className="text-[11px] text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 mb-3">{fb.note}</p>
                  )}
                  <div className="space-y-1">
                    {(fb.posts || []).slice(0, 6).map((p) => (
                      <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0 hover:bg-secondary/60 rounded px-1.5">
                        <p className="text-xs text-foreground truncate flex-1">{p.caption || "(sin texto)"}</p>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">{fmtDate(p.timestamp)}</span>
                      </a>
                    ))}
                    {(!fb.posts || fb.posts.length === 0) && <p className="text-sm text-muted-foreground py-2">Sin posts.</p>}
                  </div>
                </>
              )}
            </div>

            {/* LinkedIn */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <LiIcon className="h-4 w-4 text-sky-700" />
                <h3 className="font-semibold text-sm">LinkedIn</h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2 w-2 rounded-full ${li.connected ? "bg-green-500" : "bg-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">{li.connected ? "Conectado y publicando" : "No conectado"}</span>
              </div>
              <p className="text-[11px] text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 leading-relaxed">{li.note}</p>
              <a href="https://www.linkedin.com/company/maudev/admin/analytics/updates/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                Ver estadísticas en LinkedIn <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/60 mt-6">
            <Users className="h-3 w-3 inline mr-1" />
            Alcance e impresiones se agregan cuando Meta apruebe <span className="font-mono">instagram_manage_insights</span>. Por ahora: likes y comentarios (engagement real).
          </p>
        </>
      )}
    </div>
  );
}
