import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, MessageCircle, Calendar, CheckCircle, Send, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { toast } from "sonner";

// ⚙️ Reemplaza con tu link real de Google Calendar appointment scheduling.
// Ej: https://calendar.google.com/calendar/appointments/schedules/AcZssZ.....
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/maudev";
const CONTACT_EMAIL = "contacto@maudev.cl";

const COUNTRIES = [
  { code: "CL", flag: "🇨🇱", label: "Chile", dial: "+56", placeholder: "9 1234 5678", min: 8, max: 9 },
  { code: "US", flag: "🇺🇸", label: "Estados Unidos", dial: "+1", placeholder: "(555) 123-4567", min: 10, max: 10 },
  { code: "MX", flag: "🇲🇽", label: "México", dial: "+52", placeholder: "55 1234 5678", min: 10, max: 10 },
  { code: "CO", flag: "🇨🇴", label: "Colombia", dial: "+57", placeholder: "300 123 4567", min: 10, max: 10 },
  { code: "PE", flag: "🇵🇪", label: "Perú", dial: "+51", placeholder: "987 654 321", min: 9, max: 9 },
  { code: "AR", flag: "🇦🇷", label: "Argentina", dial: "+54", placeholder: "11 1234 5678", min: 10, max: 11 },
];

const INTERESTS = [
  { value: "web_dev", label: "Sitio o landing web" },
  { value: "web_app", label: "Software a medida" },
  { value: "automation", label: "Automatización" },
  { value: "payments", label: "Integración de pagos / APIs" },
  { value: "support", label: "Mantención y soporte" },
  { value: "general", label: "Consulta general" },
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
    document.title = "Contacto · Maudev";
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
      toast.error("Completa todos los campos para enviar tu mensaje.");
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < country.min || digits.length > country.max) {
      toast.error(`El teléfono de ${country.label} no parece válido. Revisa el número.`);
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
      setSent(true);
      toast.success("Mensaje recibido. Te respondemos pronto.");
    } catch {
      toast.error("No pudimos enviar el mensaje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// contacto</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
            Hablemos de tu <span className="text-primary">proyecto</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Cuéntanos qué necesitas y te respondemos en menos de 24h. Si prefieres, agenda directo
            en nuestro calendario o escríbenos por correo.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mb-12">
            <a
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/30 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                <Calendar className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">Agendar videollamada</h3>
              <p className="text-sm text-muted-foreground">Bloque de 20 min por Google Meet.</p>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/30 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">Correo</h3>
              <p className="text-sm text-muted-foreground break-all">{CONTACT_EMAIL}</p>
            </a>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Déjanos tu número en el formulario y te escribimos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-2">Envíanos un mensaje</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Te respondemos por correo y, con tu número, también por WhatsApp.
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary border border-border flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mensaje recibido</h3>
                  <p className="text-sm text-muted-foreground mb-6">Te respondemos en menos de 24h hábiles.</p>
                  <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mientras tanto, agenda una videollamada
                    </Button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">nombre *</label>
                    <Input value={form.name} onChange={set("name")} placeholder="Tu nombre" className="bg-background border-border h-11" required />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">email *</label>
                    <Input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" className="bg-background border-border h-11" required />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">teléfono / whatsapp *</label>
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
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">qué necesitas *</label>
                    <select value={form.interest} onChange={set("interest")} className={inputClass} required>
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      {INTERESTS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-mute