/**
 * /lp/diagnostico — Landing page dedicada para tráfico de anuncios Meta.
 * Sin navbar ni footer: zero distracciones. Solo propuesta de valor + formulario.
 * Para retargeting: URL base para audiencia personalizada en Meta Ads Manager.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Clock, Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import Logo from "@/components/landing/Logo";
import { COUNTRIES, INTERESTS as ALL_INTERESTS } from "@/data/leadOptions";
import { availability, CTA_LABEL } from "@/data/site";

const INTERESTS = ALL_INTERESTS.filter((i) => ["web_dev", "web_app", "automation"].includes(i.value));

const benefits = [
  { icon: CheckCircle, text: t("Propuesta técnica y precio fijo en menos de 24h", "Technical proposal and fixed price in under 24h") },
  { icon: Code2,       text: t("Código 100% tuyo — sin licencias ni lock-in", "100% your code — no licenses, no lock-in") },
  { icon: Shield,      text: t("Sin compromiso hasta que apruebes la propuesta", "No commitment until you approve the proposal") },
  { icon: Clock,       text: t("Respuesta garantizada el mismo día hábil", "Guaranteed same-business-day reply") },
];

export default function LpDiagnostico() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "CL", interest: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const country = COUNTRIES.find((c) => c.code === form.country) || COUNTRIES[0];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.interest) {
      toast.error(t("Completa todos los campos.", "Please fill in all fields."));
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < country.min || digits.length > country.max) {
      toast.error(t("Revisa el número de teléfono.", "Please check your phone number."));
      return;
    }
    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: `${country.dial} ${form.phone.trim()}`,
        interest: form.interest,
        source: "lp_diagnostico",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email: form.email.trim(),
        phone: `${country.dial}${form.phone.trim()}`,
        params: { content_name: "LP Diagnostico", content_category: form.interest },
      });
      setSent(true);
    } catch {
      toast.error(t("No pudimos enviar. Intenta nuevamente.", "Couldn't send. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Brand mark mínimo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-primary">
            <Logo size={28} />
            <span className="text-lg font-bold tracking-tight text-foreground">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">
            {t("Diagnóstico gratuito · Sin compromiso", "Free consult · No commitment")}
          </span>
        </div>
      </header>

      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Columna izquierda: propuesta de valor */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono text-primary tracking-wider uppercase">
                  {availability.label} · {availability.period}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5">
                {t("Tu proyecto web o de software,", "Your web or software project,")}
                <br />
                <span className="text-primary">{t("con propuesta en 24h.", "with a proposal in 24h.")}</span>
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                {t(
                  "Cuéntanos qué necesitas construir. Te enviamos una propuesta técnica detallada con alcance, tiempos y precio fijo — sin rodeos y sin costo.",
                  "Tell us what you need to build. We send you a detailed technical proposal with scope, timeline and fixed price — straightforward and free."
                )}
              </p>

              {/* Tipo de proyecto */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {t("¿Qué necesitas?", "What do you need?")}
                </p>
                {INTERESTS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setForm({ ...form, interest: item.value })}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left text-sm ${
                      form.interest === item.value
                        ? "border-primary bg-primary/8 text-foreground"
                        : "border-border hover:border-primary/40 hover:bg-primary/3 text-muted-foreground"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${form.interest === item.value ? "text-primary" : "text-muted-foreground"}`} />
                    {item.label}
                    {form.interest === item.value && <CheckCircle className="h-3.5 w-3.5 text-primary ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Beneficios */}
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <b.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {b.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Columna derecha: formulario */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:sticky lg:top-28"
            >
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 glow-cyan">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-3 rounded-full bg-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-primary/60" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">diagnostico_gratis</span>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("¡Solicitud recibida!", "Request received!")}</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                      {t(
                        "Te enviamos la propuesta inicial en menos de 24 horas hábiles.",
                        "We'll send your initial proposal within 24 business hours."
                      )}
                    </p>
                    <Link
                      to="/"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← {t("Volver al sitio", "Back to site")}
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        {t("nombre completo", "full name")} *
                      </label>
                      <Input
                        value={form.name}
                        onChange={set("name")}
                        placeholder={t("Tu nombre", "Your name")}
                        className="bg-background border-border h-11"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="tu@email.com"
                        className="bg-background border-border h-11"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        {t("teléfono / whatsapp", "phone / whatsapp")} *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={form.country}
                          onChange={set("country")}
                          className="h-11 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                          ))}
                        </select>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder={country.placeholder}
                          className="bg-background border-border h-11 flex-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Objetivo inline si no fue seleccionado en la izquierda */}
                    {!form.interest && (
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          {t("objetivo", "goal")} *
                        </label>
                        <select
                          value={form.interest}
                          onChange={set("interest")}
                          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="" disabled>{t("Selecciona un objetivo", "Select a goal")}</option>
                          {INTERESTS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
                    >
                      {loading ? t("Enviando...", "Sending...") : CTA_LABEL}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 shrink-0" />
                      {t(
                        "Sin spam. Sin compromiso. Respuesta en menos de 24h.",
                        "No spam. No commitment. Response in under 24h."
                      )}
                    </div>

                    {/* Medios de pago */}
                    <div className="pt-3 border-t border-border/40 text-center text-[10px] font-mono text-muted-foreground/60 tracking-wider uppercase">
                      {t("Aceptamos", "We accept")} CLP · USD · USDT
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-border/40 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Maudev · contacto@maudev.cl</span>
          <div className="flex items-center gap-4">
            <Link to="/privacidad" className="hover:text-primary transition-colors">
              {t("Privacidad", "Privacy")}
            </Link>
            <Link to="/terminos" className="hover:text-primary transition-colors">
              {t("Términos", "Terms")}
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              {t("Ir al sitio principal →", "Go to main site →")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
