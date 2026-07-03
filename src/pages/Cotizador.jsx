import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, Calculator, Globe, Zap, Bot, CreditCard, Package, Clock, Send } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/i18n";

// Rangos base en CLP, coherentes con /precios y la FAQ. "quote" = se cotiza.
const PROJECT_TYPES = [
  { value: "web_dev", icon: Globe, label: t("Landing o sitio web", "Landing or website"), desc: t("Página de conversión con SEO", "Conversion page with SEO"), min: 390000, max: 690000 },
  { value: "web_app", icon: Zap, label: t("Software a medida", "Custom software"), desc: t("App, dashboard o plataforma", "App, dashboard or platform"), min: 900000, max: null },
  { value: "automation", icon: Bot, label: t("Automatización", "Automation"), desc: t("Bots, workflows, integraciones", "Bots, workflows, integrations"), min: 290000, max: 600000 },
  { value: "payments", icon: CreditCard, label: t("Integración de pagos / APIs", "Payments / APIs"), desc: t("Stripe, MercadoPago, USDT", "Stripe, MercadoPago, USDT"), min: 350000, max: 700000 },
];

const ASSETS = [
  { value: "all", label: t("Sí, tengo marca, dominio y contenido", "Yes, I have brand, domain and content"), factor: 1 },
  { value: "partial", label: t("Tengo algo, me falta el resto", "I have some, missing the rest"), factor: 1.08 },
  { value: "none", label: t("Parto de cero", "Starting from scratch"), factor: 1.15 },
];

const TIMELINES = [
  { value: "urgent", label: t("Urgente (menos de 2 semanas)", "Urgent (under 2 weeks)"), factor: 1.2 },
  { value: "normal", label: t("Normal (este mes)", "Normal (this month)"), factor: 1 },
  { value: "flexible", label: t("Flexible (sin apuro)", "Flexible (no rush)"), factor: 1 },
];

const fmtCLP = (n) =>
  "$" + (Math.round(n / 10000) * 10000).toLocaleString("es-CL");

export default function Cotizador() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(null);
  const [assets, setAssets] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = t("Cotizador · Maudev", "Project estimator · Maudev");
  }, []);

  const factor = (assets?.factor || 1) * (timeline?.factor || 1);
  const estimate = type
    ? type.max
      ? { min: type.min * factor, max: type.max * factor, open: false }
      : { min: type.min * factor, max: null, open: true }
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(t("Completa tu nombre y email.", "Please fill in your name and email."));
      return;
    }
    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name.trim(),
        email: form.email.trim(),
        interest: type.value,
        message: [
          `[Cotizador] Tipo: ${type.label}`,
          `Activos: ${assets.label}`,
          `Plazo: ${timeline.label}`,
          estimate.open
            ? `Estimación mostrada: desde ${fmtCLP(estimate.min)} CLP (a cotizar)`
            : `Estimación mostrada: ${fmtCLP(estimate.min)} – ${fmtCLP(estimate.max)} CLP`,
        ].join(" · "),
        source: "cotizador",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email: form.email.trim(),
        params: { content_name: "Cotizador", content_category: type.value, name: form.name.trim(), source: "cotizador" },
      });
      setSent(true);
    } catch {
      toast.error(t("No pudimos enviar. Intenta nuevamente.", "Couldn't send. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    t("¿Qué necesitas construir?", "What do you need to build?"),
    t("¿Tienes marca, dominio y contenido?", "Do you have brand, domain and content?"),
    t("¿Para cuándo lo necesitas?", "When do you need it?"),
    t("Tu estimación", "Your estimate"),
  ];

  const OptionButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
        active ? "border-primary bg-primary/8" : "border-border hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-32 pb-24 lg:pt-40 overflow-hidden min-h-screen">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="kicker">{t("cotizador", "estimator")}</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              {t("Estima tu proyecto", "Estimate your project")} <span className="text-primary">{t("en 1 minuto", "in 1 minute")}</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t(
                "Tres preguntas y te mostramos un rango de inversión al instante. Sin email de por medio para ver el número.",
                "Three questions and we show you an investment range instantly. No email required to see the number."
              )}
            </p>
          </div>

          {/* Progreso */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 glow-cyan">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-foreground/20" />
              <div className="h-3 w-3 rounded-full bg-foreground/30" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_cotizador · {step + 1}/4</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg font-semibold mb-5">{steps[step]}</h2>

                {step === 0 && (
                  <div className="space-y-3">
                    {PROJECT_TYPES.map((p) => (
                      <OptionButton key={p.value} active={type?.value === p.value} onClick={() => { setType(p); setStep(1); }}>
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <p.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{p.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </OptionButton>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    {ASSETS.map((a) => (
                      <OptionButton key={a.value} active={assets?.value === a.value} onClick={() => { setAssets(a); setStep(2); }}>
                        <Package className="h-4 w-4 text-primary shrink-0" />
                        <span className="flex-1 text-sm">{a.label}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </OptionButton>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {TIMELINES.map((tl) => (
                      <OptionButton key={tl.value} active={timeline?.value === tl.value} onClick={() => { setTimeline(tl); setStep(3); }}>
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span className="flex-1 text-sm">{tl.label}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </OptionButton>
                    ))}
                  </div>
                )}

                {step === 3 && estimate && !sent && (
                  <div>
                    <div className="bg-background border border-primary/25 rounded-xl p-6 text-center mb-6">
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                        {t("Inversión estimada", "Estimated investment")}
                      </p>
                      {estimate.open ? (
                        <>
                          <p className="text-3xl font-black font-mono text-primary tracking-tight">
                            {t("desde", "from")} {fmtCLP(estimate.min)} <span className="text-sm">CLP</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("El precio exacto se define en el roadmap según el alcance.", "The exact price is defined in the roadmap based on scope.")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-black font-mono text-primary tracking-tight">
                            {fmtCLP(estimate.min)} – {fmtCLP(estimate.max)} <span className="text-sm">CLP</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("Rango referencial. El precio fijo exacto te llega por escrito en el diagnóstico.", "Reference range. The exact fixed price arrives in writing in the assessment.")}
                          </p>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {t(
                        "¿Quieres el precio fijo exacto para tu caso? Déjanos tu contacto y en menos de 24h recibes la propuesta con alcance, hitos y precio cerrado.",
                        "Want the exact fixed price for your case? Leave your contact details and within 24h you'll get a proposal with scope, milestones and a closed price."
                      )}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("Tu nombre", "Your name")}
                        className="bg-background border-border h-11"
                        required
                      />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="bg-background border-border h-11"
                        required
                      />
                      <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                        {loading ? t("Enviando...", "Sending...") : t("Recibir precio fijo en 24h", "Get my fixed price in 24h")}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                )}

                {step === 3 && sent && (
                  <div className="text-center py-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t("¡Listo!", "Done!")}</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t(
                        "Recibimos tu estimación. Te contactamos en menos de 24h con la propuesta y el precio fijo por escrito.",
                        "We received your estimate. We'll contact you within 24h with the proposal and fixed price in writing."
                      )}
                    </p>
                    <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      ← {t("Volver al inicio", "Back to home")}
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {step > 0 && !sent && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t("Volver", "Back")}
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
            <Calculator className="h-3.5 w-3.5" />
            {t("Rangos basados en los precios publicados en", "Ranges based on the prices published at")}{" "}
            <Link to="/precios" className="text-primary hover:underline">/precios</Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
