import { useState } from "react";
import { useAuth } from "@clerk/react";
import { Send, Eye, X, CheckCircle2, Loader2, Mail, Sparkles, AlertTriangle, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const apiBase = import.meta.env.BASE_URL || "/";

const TEMPLATES = [
  {
    id: "promo",
    name: "Promocion",
    subject: "Oferta especial para ti",
    body: `<div style="font-family:'Courier New',monospace;color:#e4e4e7;">
<h2 style="color:#06b6d4;font-size:20px;margin:0 0 16px;">Oferta Especial</h2>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 16px;">Hola,</p>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">Tenemos una oferta exclusiva para ti. Por tiempo limitado, accede a nuestros servicios con un descuento especial.</p>
<table cellpadding="0" cellspacing="0"><tr><td style="background:#06b6d4;padding:12px 28px;"><a href="#" style="color:#000;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;">VER OFERTA</a></td></tr></table>
</div>`,
  },
  {
    id: "update",
    name: "Actualizacion",
    subject: "Novedades de tu proyecto",
    body: `<div style="font-family:'Courier New',monospace;color:#e4e4e7;">
<h2 style="color:#06b6d4;font-size:20px;margin:0 0 16px;">Actualizacion de Proyecto</h2>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 16px;">Hola,</p>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 16px;">Queremos compartir las ultimas novedades y mejoras de tu proyecto:</p>
<ul style="color:#a1a1aa;line-height:2;margin:0 0 24px;">
<li>Mejora 1: descripcion aqui</li>
<li>Mejora 2: descripcion aqui</li>
<li>Mejora 3: descripcion aqui</li>
</ul>
<p style="color:#a1a1aa;line-height:1.7;">Saludos,<br><span style="color:#06b6d4;">Tu equipo</span></p>
</div>`,
  },
  {
    id: "newsletter",
    name: "Newsletter",
    subject: "Noticias de la semana",
    body: `<div style="font-family:'Courier New',monospace;color:#e4e4e7;">
<p style="font-size:10px;color:#06b6d4;letter-spacing:2px;margin:0 0 8px;">NEWSLETTER</p>
<h2 style="color:#fff;font-size:22px;margin:0 0 24px;">Noticias de la Semana</h2>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 16px;">Hola,</p>
<p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">Aqui tienes un resumen de lo mas importante de esta semana.</p>
<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;">
<p style="color:#a1a1aa;line-height:1.7;margin:0;">Tienes preguntas? Responde a este correo.</p>
</div>`,
  },
];

export default function AdminCampaigns() {
  const { getToken } = useAuth();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("");
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const applyTemplate = (templateId: string) => {
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
      setSelectedTemplate(templateId);
    }
  };

  const recipientList = recipients
    .split(/[,;\n]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || recipientList.length === 0) return;
    if (!confirm(`Enviar campana a ${recipientList.length} destinatario(s)?`)) return;

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const res = await fetch(`${apiBase}api/admin/campaigns/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ subject, html: body, recipients: recipientList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const emailHtmlPreview = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid rgba(6,182,212,0.2);background:#111111;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid rgba(6,182,212,0.15);">
          <span style="font-size:22px;font-weight:bold;letter-spacing:-1px;">
            <span style="color:#06b6d4;">MAU</span><span style="color:#a1a1aa;">DEV</span>
          </span>
        </td></tr>
        <tr><td style="padding:40px;">
          ${body || '<p style="color:#52525b;">Vista previa del contenido...</p>'}
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(6,182,212,0.1);">
          <p style="margin:0;font-size:10px;color:#3f3f46;">&copy; ${new Date().getFullYear()} MAUDEV. Santiago, Chile.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campanas</h1>
          <p className="text-sm text-muted-foreground mt-1">Crea y envia campanas de email a tus contactos</p>
        </div>
      </div>

      {result && (
        <div className="flex items-center gap-3 p-4 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Campana enviada: {result.sent} enviados{result.failed > 0 ? `, ${result.failed} fallidos` : ""}.</span>
          <button onClick={() => setResult(null)} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="border border-border/40 bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">PLANTILLAS</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                className={`p-4 border text-left transition-colors ${
                  selectedTemplate === t.id
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/40 hover:border-border/60"
                }`}
              >
                <p className="font-mono text-xs font-medium mb-1">{t.name.toUpperCase()}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{t.subject}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-border/40 bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">DESTINATARIOS</span>
        </div>
        <div className="p-5">
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            rows={3}
            placeholder={"cliente1@email.com\ncliente2@email.com, cliente3@email.com"}
            className="w-full border border-border/60 bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/60 transition-colors resize-y"
          />
          <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">
            Separa los emails con coma, punto y coma, o nueva linea. {recipientList.length > 0 && (
              <span className="text-primary/70">{recipientList.length} destinatario(s) detectados.</span>
            )}
          </p>
        </div>
      </div>

      <div className="border border-border/40 bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
          <Send className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">CONTENIDO</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">ASUNTO</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del email..."
              className="w-full border border-border/60 bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs text-muted-foreground">CUERPO (HTML)</label>
              <button
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs font-mono text-primary/70 hover:text-primary transition-colors"
              >
                {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {preview ? "EDITAR" : "PREVIEW"}
              </button>
            </div>

            {preview ? (
              <div className="border border-border/40 bg-[#0a0a0a] overflow-hidden">
                <iframe
                  srcDoc={emailHtmlPreview}
                  className="w-full border-0"
                  style={{ minHeight: "400px" }}
                  title="Email Preview"
                />
              </div>
            ) : (
              <textarea
                value={body}
                onChange={(e) => { setBody(e.target.value); setSelectedTemplate(null); }}
                rows={12}
                placeholder={`<h2>Tu contenido aqui</h2>\n<p>Escribe el cuerpo del email en HTML...</p>`}
                className="w-full border border-border/60 bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/60 transition-colors resize-y"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          disabled={sending || !subject.trim() || !body.trim() || recipientList.length === 0}
          className="rounded-none font-mono text-xs gap-2"
          size="lg"
        >
          {sending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> ENVIANDO CAMPANA...</>
          ) : (
            <><Send className="h-4 w-4" /> ENVIAR A {recipientList.length} DESTINATARIO(S)</>
          )}
        </Button>
      </div>
    </div>
  );
}