import { useEffect, useState } from "react";
import { Mail, MessageCircle, Calendar, CheckCircle, Send } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { toast } from "sonner";

// Reemplaza con tu link real de Google Calendar appointment scheduling.
// Ej: https://calendar.google.com/calendar/appointments/schedules/AcZssZ.....
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/maudev";
const CONTACT_EMAIL = "maudevchile@gmail.com";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", interest: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contacto · Maudev";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        interest: form.interest || "general",
        message: form.message,
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
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Agendar reunión</h3>
              <p className="text-sm text-muted-foreground">Bloque de 20 min en Google Calendar.</p>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Correo</h3>
              <p className="text-sm text-muted-foreground break-all">{CONTACT_EMAIL}</p>
            </a>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 text-primary" />
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
                Te respondemos por correo y, si dejas tu WhatsApp, también por ahí.
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mensaje recibido</h3>
                  <p className="text-sm text-muted-foreground mb-6">Te respondemos en menos de 24h hábiles.</p>
                  <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mientras tanto, agenda una reunión
                    </Button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">nombre *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="bg-background border-border h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">email *</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="bg-background border-border h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">whatsapp (opcional)</label>
                    <Input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+56 9 ..."
                      className="bg-background border-border h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">qué necesitas</label>
                    <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                      <SelectTrigger className="bg-background border-border h-11">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web_dev">Sitio o landing web</SelectItem>
                        <SelectItem value="web_app">Software a medida</SelectItem>
                        <SelectItem value="automation">Automatización</SelectItem>
                        <SelectItem value="consulting">Consultoría TI</SelectItem>
                        <SelectItem value="general">Consulta general</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">mensaje</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Cuéntanos brevemente sobre tu proyecto..."
                      className="bg-background border-border min-h-[120px]"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Al enviar aceptas nuestra <a href="/privacidad" className="text-primary hover:underline">política de privacidad</a>.
                  </p>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {loading ? "Enviando..." : "Enviar mensaje"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-2">Agenda directo</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Reserva un bloque de 20 minutos en nuestro Google Calendar. Sin compromiso.
              </p>
              <div className="flex-1 rounded-xl border border-border overflow-hidden bg-background min-h-[500px]">
                <iframe
                  src={GOOGLE_CALENDAR_URL}
                  title="Agendar reunión con Maudev"
                  className="w-full h-full min-h-[500px]"
                  frameBorder="0"
                />
              </div>
              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                Abrir calendario en pestaña nueva →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
