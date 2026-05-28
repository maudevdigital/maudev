import { useState } from "react";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";

// Países habilitados. Cada uno define su prefijo, placeholder y rango de dígitos
// para validar el número (sin contar el prefijo).
const COUNTRIES = [
  { code: "CL", flag: "🇨🇱", label: "Chile", dial: "+56", placeholder: "9 1234 5678", min: 8, max: 9 },
  { code: "US", flag: "🇺🇸", label: "Estados Unidos", dial: "+1", placeholder: "(555) 123-4567", min: 10, max: 10 },
  { code: "MX", flag: "🇲🇽", label: "México", dial: "+52", placeholder: "55 1234 5678", min: 10, max: 10 },
  { code: "CO", flag: "🇨🇴", label: "Colombia", dial: "+57", placeholder: "300 123 4567", min: 10, max: 10 },
  { code: "PE", flag: "🇵🇪", label: "Perú", dial: "+51", placeholder: "987 654 321", min: 9, max: 9 },
  { code: "AR", flag: "🇦🇷", label: "Argentina", dial: "+54", placeholder: "11 1234 5678", min: 10, max: 11 },
];

const INTERESTS = [
  { value: "web_dev", label: t("Sitio o landing web", "Website or landing page") },
  { value: "web_app", label: t("Software a medida", "Custom software") },
  { value: "automation", label: t("Automatización", "Automation") },
  { value: "payments", label: t("Integración de pagos / APIs", "Payments / APIs integration") },
  { value: "general", label: t("Consulta general", "General inquiry") },
];

const inputClass =
  "w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors";

export default function LeadCaptureSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "CL",
    phone: "",
    interest: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const country = COUNTRIES.find((c) => c.code === form.country) || COUNTRIES[0];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Todos los campos son obligatorios.
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.interest || !form.message.trim()) {
      toast.error(t("Completa todos los campos para enviar tu solicitud.", "Please fill in all fields to send your request."));
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < country.min || digits.length > country.max) {
      toast.error(t(`El teléfono de ${country.label} no parece válido. Revisa el número.`, `The phone number for ${country.label} doesn't look valid. Please check it.`));
      return;
    }

    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: `${country.dial} ${form.phone.trim()}`,
        interest: form.interest,
        message: form.message.trim(),
        source: "contact_form",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email: form.email.trim(),
        phone: `${country.dial}${form.phone.trim()}`,
        params: { content_name: "Landing lead form", content_category: form.interest },
      });
      setSent(true);
      toast.success(t("Mensaje enviado. Te contactaremos pronto.", "Message sent. We'll get back to you soon."));
    } catch {
      toast.error(t("No pudimos enviar el mensaje. Intenta nuevamente.", "We couldn't send your message. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Columna izquierda */}
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("diagnóstico gratuito", "free consult")}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              {t("Cuéntanos tu proyecto,", "Tell us about your project,")} <span className="text-primary">{t("te respondemos en 24h", "we reply within 24h")}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {t(
                "Sin formularios complicados ni esperas. Describe lo que necesitas construir y te enviamos una propuesta con alcance, tiempos y precio fijo.",
                "No complicated forms or waiting. Describe what you need to build and we'll send a proposal with scope, timelines and a fixed price."
              )}
            </p>

            <div className="space-y-4 mb-8">
              {[
                { step: "01", text: t("Nos describes el proyecto por este formulario", "You describe the project through this form") },
                { step: "02", text: t("Analizamos tu caso y armamos el roadmap inicial", "We analyze your case and build the initial roadmap") },
                { step: "03", text: t("Recibes propuesta técnica y precio fijo en menos de 24h", "You get a technical proposal and fixed price within 24h") },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                    {s.step}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.text}</span>
                </div>
              ))}
            </div>

            {/* Medios de pago */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                {t("Aceptamos pagos en", "We accept payments in")}{" "}
                <strong className="text-foreground font-semibold">CLP</strong>,{" "}
                <strong className="text-foreground font-semibold">USD</strong> {t("y", "and")}{" "}
                <strong className="text-foreground font-semibold">USDT</strong> {t("según tu país.", "depending on your country.")}
              </span>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary border border-border flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("Mensaje enviado", "Message sent")}</h3>
                <p className="text-sm text-muted-foreground">{t("Registramos tu solicitud y te contactaremos dentro de las próximas 24 horas.", "We've logged your request and will contact you within the next 24 hours.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">{t("nombre", "name")} *</label>
                  <Input value={form.name} onChange={set("name")} placeholder={t("Tu nombre", "Your name")} className="bg-background border-border h-11" required />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">email *</label>
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" className="bg-background border-border h-11" required />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">{t("teléfono / whatsapp", "phone / whatsapp")} *</label>
                  <div className="flex gap-2">
                    <select
                      value={form.country}
                      onChange={set("country")}
                      className="h-11 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
                      aria-label="País"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.dial}
                        </option>
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

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">{t("objetivo", "goal")} *</label>
                  <select value={form.interest} onChange={set("interest")} className={inputClass} required>
                    <option value="" disabled>
                      {t("Selecciona un objetivo", "Select a goal")}
                    </option>
                    {INTERESTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">{t("mensaje", "message")} *</label>
                  <Textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder={t("Qué vendes, a quién vendes y qué quieres mejorar...", "What you sell, who you sell to and what you want to improve...")}
                    className="bg-background border-border min-h-[100px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  {loading ? t("Enviando...", "Sending...") : t("Solicitar diagnóstico", "Request a consult")}
                  <Send className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  {t("Todos los campos son obligatorios. No compartimos tus datos con terceros.", "All fields are required. We don't share your data with third parties.")}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
