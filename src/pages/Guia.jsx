import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Download, CheckCircle, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { COUNTRIES } from "@/data/leadOptions";

const PDF = "/guia-software-a-medida.pdf";
const inputClass =
  "w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

const inside = [
  t("Rangos reales de precios de software en Chile (2026)", "Real software price ranges in Chile (2026)"),
  t("Cuándo conviene software a medida vs. una herramienta de mercado", "When custom software beats off-the-shelf"),
  t("Cómo elegir proveedor (y las señales de alerta)", "How to choose a provider (and the red flags)"),
  t("El ROI real de automatizar tus procesos", "The real ROI of automating your processes"),
  t("Checklist de preguntas antes de firmar", "A checklist of questions before you sign"),
];

export default function Guia() {
  const [form, setForm] = useState({ name: "", email: "", country: "CL", phone: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const country = COUNTRIES.find((c) => c.code === form.country) || COUNTRIES[0];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    document.title = t("Guía gratis: Software a medida sin perder plata · Maudev", "Free guide: Custom software without wasting money · Maudev");
  }, []);

  const download = () => {
    const a = document.createElement("a");
    a.href = PDF; a.download = "guia-software-a-medida-maudev.pdf";
    document.body.appendChild(a); a.click(); a.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error(t("Completa tus datos para recibir la guía.", "Fill in your details to get the guide."));
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < country.min || digits.length > country.max) {
      toast.error(t("El teléfono no parece válido. Revísalo.", "The phone number doesn't look valid."));
      return;
    }
    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: `${country.dial} ${form.phone.trim()}`,
        interest: "guia",
        message: t("Descargó la guía: Software a medida sin perder plata", "Downloaded guide: Custom software without wasting money"),
        source: "lead_magnet_guia",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email: form.email.trim(),
        phone: `${country.dial}${form.phone.trim()}`,
        params: { content_name: "Guía software a medida", content_category: "lead_magnet" },
      });
      setDone(true);
      download();
    } catch {
      toast.error(t("No pudimos procesar tu solicitud. Intenta de nuevo.", "We couldn't process your request. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative pt-28 pb-20 lg:pt-36">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Izquierda: la oferta */}
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("guía gratuita", "free guide")}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 mb-5 leading-tight">
              {t("Software a medida ", "Custom software ")}
              <span className="text-primary">{t("sin perder plata", "without wasting money")}</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              {t(
                "La guía honesta para decidir bien antes de invertir: precios reales, cuándo conviene, con quién construir y qué exigir. Sin tecnicismos.",
                "The honest guide to deciding well before you invest: real prices, when it's worth it, who to build with and what to demand. No jargon."
              )}
            </p>
            <ul className="space-y-3 mb-2">
              {inside.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: el formulario / éxito */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {done ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{t("¡Listo! Tu guía está descargando.", "Done! Your guide is downloading.")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("Si no empezó, descárgala aquí:", "If it didn't start, download it here:")}</p>
                <Button onClick={download} className="bg-primary text-primary-foreground font-semibold">
                  <Download className="h-4 w-4 mr-2" /> {t("Descargar la guía (PDF)", "Download the guide (PDF)")}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">{t("Descarga gratis", "Free download")}</p>
                    <p className="text-xs text-muted-foreground">{t("PDF · 5 min de lectura", "PDF · 5 min read")}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input value={form.name} onChange={set("name")} placeholder={t("Nombre", "Name")} className="h-11" required />
                  <Input type="email" value={form.email} onChange={set("email")} placeholder={t("Email", "Email")} className="h-11" required />
                  <div className="flex gap-2">
                    <select value={form.country} onChange={set("country")} aria-label={t("País", "Country")} className="h-11 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring shrink-0">
                      {COUNTRIES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.dial}</option>))}
                    </select>
                    <Input type="tel" value={form.phone} onChange={set("phone")} placeholder={t("WhatsApp", "WhatsApp")} className="h-11 flex-1" required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold h-11">
                    {loading ? t("Enviando…", "Sending…") : <>{t("Recibir la guía gratis", "Get the free guide")} <Download className="h-4 w-4 ml-2" /></>}
                  </Button>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 justify-center pt-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t("Sin spam. Tus datos están seguros.", "No spam. Your data is safe.")}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
