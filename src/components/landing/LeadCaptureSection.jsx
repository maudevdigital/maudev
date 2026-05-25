import { useState } from "react";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, Video, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// ⚙️ Reemplaza por tu enlace de agenda (Google Calendar Appointment Schedule
//    o Google Meet). Mientras esté vacío, el botón muestra un aviso.
const MEET_URL = "";

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
  { value: "web_dev", label: "Sitio o landing web" },
  { value: "web_app", label: "Software a medida" },
  { value: "automation", label: "Automatización" },
  { value: "payments", label: "Integración de pagos / APIs" },
  { value: "general", label: "Consulta general" },
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
      toast.error("Completa todos los campos para enviar tu solicitud.");
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
        source: "contact_form",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      setSent(true);
      toast.success("Mensaje enviado. Te contactaremos pronto.");
    } catch {
      toast.error("No pudimos enviar el mensaje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleMeet = () => {
    if (!MEET_URL) {
      toast.message("Agenda en configuración", {
        description: "Define tu enlace de Google Meet/Calendar en MEET_URL para activar el botón.",
      });
      return;
    }
    window.open(MEET_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contacto" className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Columna izquierda */}
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// diagnóstico gratuito</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              Cuéntanos tu proyecto, <span className="text-primary">te respondemos en 24h</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Sin formularios complicados ni esperas. Describe lo que necesitas construir y te enviamos una propuesta con alcance, tiempos y precio fijo.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { step: "01", text: "Nos describes el proyecto por este formulario" },
                { step: "02", text: "Analizamos tu caso y armamos el roadmap inicial" },
                { step: "03", text: "Recibes propuesta técnica y precio fijo en menos de 24h" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                    {s.step}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.text}</span>
                </div>
              ))}
            </div>

            {/* Agendar videollamada */}
            <div className="rounded-xl border border-border bg-card p-5 mb-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Video className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">¿Prefieres hablarlo en vivo?</p>
                  <p className="text-xs text-muted-foreground">Agenda una videollamada por Google Meet.</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleMeet}
                variant="outline"
                className="w-full h-11 mt-2 border-border hover:bg-secondary/60"
              >
                Agendar videollamada
                <Video className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Medios de pago */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                Aceptamos pagos en <strong className="text-foreground font-semibold">CLP</strong>,{" "}
                <strong className="text-foreground font-semibold">USD</strong> y{" "}
                <strong className="text-foreground font-semibold">USDT</strong> según tu país.
              </span>
            </div>
          </div>

          {/* Formulario */}
          <div