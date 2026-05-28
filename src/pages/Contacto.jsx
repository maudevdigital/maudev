import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, MessageCircle, CheckCircle, Send, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackEvent } from "@/lib/MetaPixelTracker";
import { toast } from "sonner";
import { t } from "@/lib/i18n";

const CONTACT_EMAIL = "contacto@maudev.cl";

const COUNTRIES = [
  { code: "CL", flag: "🇨🇱", label: "Chile", dial: "+56", placeholder: "9 1234 5678", min: 8, max: 9 },
  { code: "US", flag: "🇺🇸", label: t("Estados Unidos", "United States"), dial: "+1", placeholder: "(555) 123-4567", min: 10, max: 10 },
  { code: "MX", flag: "🇲🇽", label: t("México", "Mexico"), dial: "+52", placeholder: "55 1234 5678", min: 10, max: 10 },
  { code: "CO", flag: "🇨🇴", label: "Colombia", dial: "+57", placeholder: "300 123 4567", min: 10, max: 10 },
  { code: "PE", flag: "🇵🇪", label: t("Perú", "Peru"), dial: "+51", placeholder: "987 654 321", min: 9, max: 9 },
  { code: "AR", flag: "🇦🇷", label: "Argentina", dial: "+54", placeholder: "11 1234 5678", min: 10, max: 11 },
];

const INTERESTS = [
  { value: "web_dev", label: t("Sitio o landing web", "Website or landing page") },
  { value: "web_app", label: t("Software a medida", "Custom software") },
  { value: "automation", label: t("Automatización", "Automation") },
  { value: "payments", label: t("Integración de pagos / APIs", "Payments / APIs integration") },
  { value: "support", label: t("Mantención y soporte", "Maintenance & support") },
  { value: "general", label: t("Consulta general", "General inquiry") },
];
const VALID_INTERESTS = INTERESTS.map((i) => i.value);

const inputClass =
  "w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors";

export default function Contacto() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("servicio");
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "CL",
    phone: "",
    interest: VALID_INTERESTS.includes(preselected) ? preselected : "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = t("Contacto · Maudev", "Contact · Maudev");
  }, []);

  // Si el usuario llega con ?servicio=... preselecciona el objetivo.
  useEffect(() => {
    if (preselected && VALID_INTERESTS.includes(preselected)) {
      setForm((f) => ({ ...f, interest: preselected }));
    }
  }, [preselected]);

  const country = COUNTRIES.find((c) => c.code === form.country) || COUNTRIES[0];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.interest || !form.message.trim()) {
      toast.error(t("Completa todos los campos para enviar tu mensaje.", "Please fill in all fields to send your message."));
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
        source: "contact_page",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      trackEvent("Lead", { content_name: "Formulario contacto", content_category: form.interest });
      setSent(true);
      toast.success(t("Mensaje recibido. Te respondemos pronto.", "Message received. We'll reply soon."));
    } catch {
      toast.error(t("No pudimos enviar el mensaje. Intenta nuevamente.", "We couldn't send your message. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("contacto", "contact")}</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
            {t("Hablemos de tu", "Let's talk about your")} <span className="text-primary">{t("proyecto", "project")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t(
              "Cuéntanos qué necesitas y te respondemos en menos de 24h con una propuesta concreta.",
              "Tell us what you need and we'll reply within 24h with a concrete proposal."
            )}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-12">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/30 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">{t("Correo", "Email")}</h3>
              <p className="text-sm text-muted-foreground break-all">{CONTACT_EMAIL}</p>
            </a>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">{t("Déjanos tu número en el formulario y te escribimos.", "Leave your number in the form and we'll message you.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-2">{t("Envíanos un mensaje", "Send us a message")}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t("Te respondemos por correo y, con tu número, también por WhatsApp.", "We reply by email and, with your number, also via WhatsApp.")}
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary border border-border flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("Mensaje recibido", "Message received")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Te respondemos en menos de 24h hábiles.", "We'll reply within 24 business hours.")}</p>
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
                        aria-label={t("País", "Country")}
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
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">{t("qué necesitas", "what you need")} *</label>
                    <select value={form.interest} onChange={set("interest")} className={inputClass} required>
                      <option value="" disabled>
                        {t("Selecciona una opción", "Select an option")}
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
                      placeholder={t("Cuéntanos brevemente sobre tu proyecto...", "Tell us briefly about your project...")}
                      className="bg-background border-border min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>
                      {t("Aceptamos pagos en", "We accept payments in")}{" "}
                      <strong className="text-foreground font-semibold">CLP</strong>,{" "}
                      <strong className="text-foreground font-semibold">USD</strong> {t("y", "and")}{" "}
                      <strong className="text-foreground font-semibold">USDT</strong> {t("según tu país.", "depending on your country.")}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {t("Todos los campos son obligatorios. Al enviar aceptas nuestra", "All fields are required. By submitting you accept our")}{" "}
                    <a href="/privacidad" className="text-primary hover:underline">{t("política de privacidad", "privacy policy")}</a>.
                  </p>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {loading ? t("Enviando...", "Sending...") : t("Enviar mensaje", "Send message")}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
