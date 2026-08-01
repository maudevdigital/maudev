import { useRef, useState } from "react";
import { CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CTA_MESSAGE } from "@/data/site";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackAction } from "@/lib/MetaPixelTracker";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { useSeo } from "@/lib/useSeo";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contacto() {
  const [form, setForm] = useState({ name: "", business: "", process: "", contact: "" });
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const started = useRef(false);
  const { submit, loading, sent } = useLeadSubmit();

  useSeo({
    title: "Contacto · Cuéntanos qué quieres automatizar · Maudev",
    description: "Describe el proceso que quieres automatizar. Te diremos si es viable, qué necesitaríamos y cómo podría implementarse.",
    path: "/contacto",
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maudev.cl/" },
        { "@type": "ListItem", position: 2, name: "Contacto", item: "https://maudev.cl/contacto" },
      ],
    },
  });

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackAction("contacto_inicio", { origen: "formulario" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const contact = form.contact.trim();
    const email = emailPattern.test(contact) ? contact : "";
    const digits = contact.replace(/\D/g, "");
    const whatsapp = !email && digits.length >= 8 ? contact : "";

    if (!form.name.trim() || !form.business.trim() || !form.process.trim() || !contact) {
      setError("Completa los cuatro campos para que podamos evaluar tu proceso.");
      return;
    }
    if (!email && !whatsapp) {
      setError("Escribe un correo válido o un número de WhatsApp con código de país.");
      return;
    }

    trackAction("formulario_envio", { formulario: "contacto" });
    const ok = await submit({
      lead: {
        name: form.name.trim(),
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        interest: form.business.trim(),
        message: form.process.trim(),
        source: "contact_page",
        empresa_web: honeypot,
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      },
      track: {
        email: email || undefined,
        phone: whatsapp || undefined,
        params: { content_name: "Proceso a automatizar", content_category: form.business.trim(), source: "contact_page" },
      },
      successMessage: "Mensaje recibido. Revisaremos tu proceso y te responderemos pronto.",
    });
    if (ok) trackAction("contacto_completado", { origen: "formulario" });
  };

  return (
    <PageShell>
      <main>
        <section className="pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Contacto" }]} />
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
              <div>
                <span className="eyebrow">Contacto</span>
                <h1 className="mt-5 max-w-[12ch] text-5xl font-extrabold leading-[0.99] tracking-[-0.06em] sm:text-6xl">Cuéntanos qué proceso quieres dejar de hacer a mano.</h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  No necesitas preparar un documento técnico. Describe qué ocurre hoy, qué se repite y dónde se traba.
                </p>
                <div className="mt-10 space-y-4 border-t border-border pt-6">
                  <a href="mailto:contacto@maudev.cl" className="flex items-center gap-3 text-sm font-semibold hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> contacto@maudev.cl
                  </a>
                  <a href={getWhatsAppUrl(CTA_MESSAGE)} target="_blank" rel="noopener noreferrer" onClick={() => trackAction("whatsapp_click", { ubicacion: "contacto" })} className="flex items-center gap-3 text-sm font-semibold hover:text-primary">
                    <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" /> Escribir por WhatsApp
                  </a>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-card p-6 shadow-[0_24px_70px_hsl(var(--ink)/0.08)] sm:p-9">
                {sent ? (
                  <div className="flex min-h-[30rem] flex-col items-center justify-center text-center" aria-live="polite">
                    <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
                    <h2 className="mt-6 text-2xl font-extrabold">Mensaje recibido</h2>
                    <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">Revisaremos lo que nos contaste y responderemos por el medio que indicaste.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} onFocus={markStarted} noValidate>
                    <input type="text" name="empresa_web" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="form-label">Nombre</label>
                        <Input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={update("name")} className="mt-2 h-12 bg-background" placeholder="Tu nombre" required />
                      </div>
                      <div>
                        <label htmlFor="contact-business" className="form-label">Empresa o tipo de negocio</label>
                        <Input id="contact-business" name="business" autoComplete="organization" value={form.business} onChange={update("business")} className="mt-2 h-12 bg-background" placeholder="Ej. centro médico" required />
                      </div>
                    </div>
                    <div className="mt-5">
                      <label htmlFor="contact-process" className="form-label">Proceso que quieres automatizar</label>
                      <Textarea id="contact-process" name="process" value={form.process} onChange={update("process")} className="mt-2 min-h-36 bg-background" placeholder="Hoy recibimos pedidos por WhatsApp y luego..." required />
                    </div>
                    <div className="mt-5">
                      <label htmlFor="contact-method" className="form-label">Correo o WhatsApp</label>
                      <Input id="contact-method" name="contact" autoComplete="email" value={form.contact} onChange={update("contact")} className="mt-2 h-12 bg-background" placeholder="correo@empresa.cl o +56 9..." aria-describedby="contact-help" required />
                      <p id="contact-help" className="mt-2 text-xs text-muted-foreground">Usaremos este dato solo para responder tu consulta.</p>
                    </div>

                    {error && <p className="mt-5 rounded-lg border border-error/25 bg-error/8 p-3 text-sm text-error" role="alert">{error}</p>}

                    <button type="submit" disabled={loading} className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-65">
                      {loading ? "Enviando…" : "Enviar mi proceso"} <Send className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">Al enviar aceptas nuestra <a href="/privacidad" className="underline underline-offset-2 hover:text-primary">política de privacidad</a>.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
