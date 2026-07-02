import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle, XCircle, ArrowRight, Send, Gauge, ShieldCheck, Smartphone, FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

// Diagnóstico automático usando la API pública de PageSpeed Insights (Lighthouse).
// Sin API key la cuota es MUY baja (devuelve 429 rápido). Para uso real:
//   1. Google Cloud Console → habilitar "PageSpeed Insights API" (gratis).
//   2. Crear una API key y agregarla en .env.local: VITE_PSI_API_KEY=...
// Con key, la cuota sube a 25.000 consultas/día.
const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const PSI_KEY = import.meta.env.VITE_PSI_API_KEY;

const normalizeUrl = (raw) => {
  let u = raw.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    return new URL(u).href;
  } catch {
    return null;
  }
};

const scoreColor = (s) =>
  s >= 90 ? "text-green-500" : s >= 50 ? "text-amber-500" : "text-red-500";
const barColor = (s) =>
  s >= 90 ? "bg-green-500" : s >= 50 ? "bg-amber-500" : "bg-red-500";

function ScoreCard({ icon: Icon, label, score, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="bg-card border border-border rounded-2xl p-5 text-center"
    >
      <div className="flex justify-center mb-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className={`text-3xl font-black font-mono tracking-tight ${scoreColor(score)}`}>{score}</p>
      <p className="text-xs text-muted-foreground mt-1 mb-3">{label}</p>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor(score)}`}
        />
      </div>
    </motion.div>
  );
}

export default function DiagnosticoWeb() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | running | done | error
  const [errorType, setErrorType] = useState(null); // rate | blocked | generic
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = t("Diagnóstico web gratis · Maudev", "Free website audit · Maudev");
  }, []);

  const runAudit = async (e) => {
    e.preventDefault();
    const target = normalizeUrl(url);
    if (!target) {
      toast.error(t("Ingresa una URL válida, ej: tunegocio.cl", "Enter a valid URL, e.g. yourbusiness.com"));
      return;
    }
    setPhase("running");
    setErrorType(null);
    setResult(null);
    setSent(false);
    try {
      const params = new URLSearchParams({ url: target, strategy: "mobile" });
      ["PERFORMANCE", "SEO", "BEST_PRACTICES"].forEach((c) => params.append("category", c));
      if (PSI_KEY) params.set("key", PSI_KEY);
      const res = await fetch(`${PSI_ENDPOINT}?${params}`);
      if (res.status === 429) {
        setErrorType("rate");
        setPhase("error");
        return;
      }
      if (!res.ok) throw new Error(`PSI ${res.status}`);
      const data = await res.json();
      const lh = data.lighthouseResult;
      if (!lh?.categories) throw new Error("no-categories");

      const pct = (cat) => Math.round((lh.categories[cat]?.score ?? 0) * 100);
      const audit = (id) => lh.audits?.[id]?.score === 1;

      const scores = {
        performance: pct("performance"),
        seo: pct("seo"),
        practices: pct("best-practices"),
      };
      setResult({
        url: target,
        scores,
        overall: Math.round((scores.performance + scores.seo + scores.practices) / 3),
        checks: [
          { label: t("Conexión segura (HTTPS)", "Secure connection (HTTPS)"), pass: audit("is-on-https") },
          { label: t("Adaptada a celulares (viewport)", "Mobile-friendly (viewport)"), pass: audit("viewport") },
          { label: t("Título visible en Google", "Title visible on Google"), pass: audit("document-title") },
          { label: t("Meta descripción para buscadores", "Meta description for search engines"), pass: audit("meta-description") },
        ],
      });
      setPhase("done");
    } catch (err) {
      // TypeError en fetch = la petición ni siquiera salió: típicamente un
      // bloqueador de anuncios (ERR_BLOCKED_BY_CLIENT) o falta de conexión.
      setErrorType(err instanceof TypeError ? "blocked" : "generic");
      setPhase("error");
    }
  };

  const errorMessages = {
    rate: t(
      "Google limita la cantidad de análisis por minuto y alcanzamos el tope. Espera 1 o 2 minutos e inténtalo de nuevo.",
      "Google limits the number of analyses per minute and we hit the cap. Wait a minute or two and try again."
    ),
    blocked: t(
      "Tu navegador o una extensión (bloqueador de anuncios) impidió la consulta a Google. Desactívalo para este sitio o prueba en una ventana de incógnito.",
      "Your browser or an extension (ad blocker) blocked the request to Google. Disable it for this site or try an incognito window."
    ),
    generic: t(
      "No pudimos analizar esa URL. Verifica que el sitio esté en línea e intenta de nuevo en unos minutos.",
      "We couldn't analyze that URL. Check the site is online and try again in a few minutes."
    ),
  };

  const handleLead = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    try {
      await api.entities.Lead.create({
        email: email.trim(),
        interest: "web_dev",
        message: `[Diagnóstico web] URL: ${result.url} · Nota general: ${result.overall}/100 · Performance: ${result.scores.performance} · SEO: ${result.scores.seo} · Buenas prácticas: ${result.scores.practices}`,
        source: "diagnostico_web",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email: email.trim(),
        params: { content_name: "Diagnostico web", content_category: "web_dev", source: "diagnostico_web" },
      });
      setSent(true);
      toast.success(t("Listo. Te enviamos el análisis detallado en menos de 24h.", "Done. We'll send the detailed analysis within 24h."));
    } catch {
      toast.error(t("No pudimos registrar tu email. Intenta nuevamente.", "We couldn't register your email. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-32 pb-24 lg:pt-40 overflow-hidden min-h-screen">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("diagnóstico en vivo", "live audit")}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 mb-4">
              {t("¿Tu web está", "Is your website")} <span className="text-primary glow-text">{t("perdiendo clientes?", "losing you customers?")}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                "Ingresa tu URL y en menos de un minuto te mostramos la nota real de tu sitio: velocidad, SEO y buenas prácticas, medidas con la misma herramienta que usa Google.",
                "Enter your URL and in under a minute we show you your site's real score: speed, SEO and best practices, measured with the same tool Google uses."
              )}
            </p>
          </div>

          {/* Input */}
          <form onSubmit={runAudit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 glow-cyan mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-foreground/20" />
              <div className="h-3 w-3 rounded-full bg-foreground/30" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_audit</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("tunegocio.cl", "yourbusiness.com")}
                className="bg-background border-border h-12 flex-1 font-mono"
                disabled={phase === "running"}
              />
              <Button
                type="submit"
                disabled={phase === "running"}
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {phase === "running" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("Analizando...", "Analyzing...")}</>
                ) : (
                  <><Search className="mr-2 h-4 w-4" /> {t("Analizar gratis", "Analyze for free")}</>
                )}
              </Button>
            </div>
            {phase === "running" && (
              <p className="mt-4 text-xs text-muted-foreground font-mono flex items-center gap-2">
                <span className="text-primary">$</span> lighthouse --mobile · {t("esto toma entre 20 y 60 segundos, no cierres la pestaña", "this takes 20–60 seconds, don't close the tab")}
              </p>
            )}
            {phase === "error" && (
              <p className="mt-4 text-xs text-red-500">
                {errorMessages[errorType] || errorMessages.generic}
              </p>
            )}
          </form>

          {/* Resultado */}
          {phase === "done" && result && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  {t("Nota general de", "Overall score for")} <span className="text-primary">{result.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                </p>
                <p className={`text-6xl font-black font-mono tracking-tight ${scoreColor(result.overall)}`}>
                  {result.overall}<span className="text-2xl text-muted-foreground">/100</span>
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <ScoreCard icon={Gauge} label={t("Velocidad (móvil)", "Speed (mobile)")} score={result.scores.performance} delay={0.1} />
                <ScoreCard icon={Search} label="SEO" score={result.scores.seo} delay={0.2} />
                <ScoreCard icon={ShieldCheck} label={t("Buenas prácticas", "Best practices")} score={result.scores.practices} delay={0.3} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6 mb-6"
              >
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5" /> {t("Chequeos básicos", "Basic checks")}
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {result.checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-2.5 text-sm">
                      {c.pass ? (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                      <span className={c.pass ? "text-muted-foreground" : "text-foreground font-medium"}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Captura: informe detallado */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8"
              >
                {sent ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-1">{t("¡Listo!", "Done!")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("En menos de 24h recibes el análisis detallado con las mejoras priorizadas.", "Within 24h you'll get the detailed analysis with prioritized improvements.")}
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {t("Recibe el análisis detallado, gratis", "Get the detailed analysis, free")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      {t(
                        "Estos números son el síntoma. Te enviamos el diagnóstico completo: qué está fallando, cuánto te cuesta en clientes perdidos y qué arreglar primero.",
                        "These numbers are the symptom. We'll send the full diagnosis: what's failing, what it costs you in lost customers and what to fix first."
                      )}
                    </p>
                    <form onSubmit={handleLead} className="flex flex-col sm:flex-row gap-3" noValidate>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="bg-background border-border h-12 flex-1"
                        required
                      />
                      <Button type="submit" disabled={sending} className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                        {sending ? t("Enviando...", "Sending...") : t("Recibir análisis", "Get analysis")}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      {t("Sin spam: solo el análisis de tu sitio. Nada más.", "No spam: just your site's analysis. Nothing else.")}
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          )}

          {/* Estado inicial: qué mide */}
          {phase === "idle" && (
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Gauge, label: t("Velocidad real", "Real speed"), desc: t("Cuánto tarda tu web en el celular de tu cliente.", "How long your site takes on your customer's phone.") },
                { icon: Search, label: "SEO", desc: t("Si Google puede encontrarte y entenderte.", "Whether Google can find and understand you.") },
                { icon: ShieldCheck, label: t("Buenas prácticas", "Best practices"), desc: t("Seguridad, errores y estándares modernos.", "Security, errors and modern standards.") },
              ].map((f) => (
                <div key={f.label} className="bg-card border border-border rounded-2xl p-5 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-bold mb-1">{f.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              {t("Medido con Google Lighthouse (PageSpeed Insights), el estándar de la industria.", "Measured with Google Lighthouse (PageSpeed Insights), the industry standard.")}
            </p>
            <Link to="/contacto" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              {t("¿Prefieres hablar directo con nosotros?", "Prefer to talk to us directly?")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
