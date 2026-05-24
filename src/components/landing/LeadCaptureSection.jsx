import { useState } from "react";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function LeadCaptureSection() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", interest: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setLoading(true);
    try {
      await api.entities.Lead.create({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        interest: form.interest || "general",
        message: form.message,
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

  return (
    <section id="contacto" className="relative py-24 lg:py-32 border-t border-border/30">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// diagnóstico gratuito</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              Cuéntanos tu proyecto, <span className="text-primary">te respondemos en 24h</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Sin formularios complicados ni esperas. Describe lo que necesitas construir y te enviamos una propuesta con alcance, tiempos y precio fijo.
            </p>

            <div className="space-y-4">
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
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mensaje enviado</h3>
                <p className="text-sm text-muted-foreground">El embudo registró tu lead y notificó al equipo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">nombre</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="bg-background border-border h-11"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">email</label>
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
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">objetivo</label>
                  <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                    <SelectTrigger className="bg-background border-border h-11">
                      <SelectValue placeholder="Selecciona un objetivo" />
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
                    placeholder="Qué vendes, a quién vendes y qué quieres mejorar..."
                    className="bg-background border-border min-h-[100px]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  {loading ? "Enviando..." : "Solicitar diagnóstico"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
