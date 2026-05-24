import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListSubscribers } from "@workspace/api-client-react";
import { Users, Send, Eye, X, CheckCircle2, UserMinus, Loader2 } from "lucide-react";
import { useState } from "react";

function CampaignComposer({ activeCount }: { activeCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    if (!confirm(`¿Enviar campaña a ${activeCount} suscriptores activos?`)) return;

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/email/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html: body.replace(/\n/g, "<br>") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setResult(data);
      setSubject("");
      setBody("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-border/40 bg-card">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
        <Send className="h-4 w-4 text-primary" />
        <span className="font-mono text-xs text-muted-foreground">COMPOSITOR DE CAMPAÑA</span>
        <span className="ml-auto font-mono text-xs text-primary/70 border border-primary/20 bg-primary/5 px-2 py-0.5">
          {activeCount} suscriptores activos
        </span>
      </div>

      <div className="p-5 space-y-4">
        {result && (
          <div className="flex items-center gap-3 p-4 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Campaña enviada: {result.sent} enviados{result.failed > 0 ? `, ${result.failed} fallidos` : ""} de {result.total} total.</span>
            <button onClick={() => setResult(null)} className="ml-auto"><X className="h-4 w-4" /></button>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm">
            <X className="h-4 w-4 shrink-0" />
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1.5">ASUNTO</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Nuevo indicador Pine Script disponible..."
            className="w-full border border-border/60 bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-xs text-muted-foreground">CUERPO (HTML o texto)</label>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs font-mono text-primary/70 hover:text-primary transition-colors"
            >
              <Eye className="h-3 w-3" />
              {preview ? "EDITAR" : "PREVIEW"}
            </button>
          </div>

          {preview ? (
            <div
              className="min-h-[200px] border border-border/40 bg-background/60 p-4 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br>") }}
            />
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder={`<h2>Nuevo indicador disponible</h2>\n<p>Hola,</p>\n<p>Tenemos novedades para traders de BTC, XAU y más...</p>`}
              className="w-full border border-border/60 bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/60 transition-colors resize-y"
            />
          )}
          <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">
            El pie de email con link de baja se agrega automáticamente.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim() || activeCount === 0}
            className="rounded-none font-mono text-xs gap-2"
          >
            {sending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> ENVIANDO...</>
            ) : (
              <><Send className="h-4 w-4" /> ENVIAR A {activeCount} SUSCRIPTORES</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminSubscribersContent() {
  const { data: subscribers = [], isLoading } = useListSubscribers();

  const active = subscribers.filter((s: any) => s.status !== "unsubscribed");
  const unsubscribed = subscribers.filter((s: any) => s.status === "unsubscribed");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <p className="font-mono text-xs text-primary mb-1">EMAIL MARKETING</p>
        <h1 className="text-2xl font-bold tracking-tight">Suscriptores</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {active.length} activos · {unsubscribed.length} dados de baja
        </p>
      </div>

      {/* Composer */}
      <CampaignComposer activeCount={active.length} />

      {/* Subscriber list */}
      <div className="border border-border/40 bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">LISTA DE SUSCRIPTORES</span>
        </div>
        <div className="divide-y divide-border/40">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : subscribers.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-muted-foreground" data-testid="text-no-subscribers">
              SIN SUSCRIPTORES AÚN
            </div>
          ) : (
            subscribers.map((sub: any) => (
              <div
                key={sub.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
                data-testid={`row-subscriber-${sub.id}`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium" data-testid={`text-email-${sub.id}`}>{sub.email}</p>
                    {sub.name && <p className="text-xs text-muted-foreground">{sub.name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sub.status === "unsubscribed" ? (
                    <Badge className="font-mono text-[10px] rounded-none border border-border/40 bg-transparent text-muted-foreground/60 gap-1">
                      <UserMinus className="h-3 w-3" /> BAJA
                    </Badge>
                  ) : (
                    <Badge className="font-mono text-[10px] rounded-none border border-green-500/30 bg-green-500/10 text-green-400 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVO
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(sub.subscribedAt).toLocaleDateString("es-CL")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSubscribers() {
  return (
    <>
      <Show when="signed-in">
        <AdminSubscribersContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
