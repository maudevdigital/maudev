import { useRef, useState } from "react";
import { CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";
import LangShell from "@/components/landing/LangShell";
import TurnstileGate from "@/components/landing/TurnstileGate";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EN, PT, RUTAS_CONTACTO } from "@/data/i18n";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { useSeo } from "@/lib/useSeo";

const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Los textos del formulario viven acá y no en i18n.js porque solo los usa esta
// página: sacarlos allá obligaría a leer dos archivos para cambiar una etiqueta.
const FORMULARIO = {
  en: {
    eyebrow: "Contact",
    titulo: "Tell us what you sell and to whom.",
    intro: "No technical brief needed. Describe what happens today and where it breaks.",
    nombre: "Name",
    nombrePh: "Your name",
    empresa: "Company or type of business",
    empresaPh: "e.g. law firm, online store, workshop",
    necesita: "What you need",
    necesitaPh: "e.g. we sell auto parts and today we only have Instagram...",
    contacto: "Email or WhatsApp",
    contactoPh: "you@company.com",
    ayuda: "We use this only to reply to your enquiry.",
    enviar: "Send",
    enviando: "Sending…",
    errorCampos: "Please fill in all four fields so we can review your case.",
    errorContacto: "Enter a valid email or a WhatsApp number with country code.",
    exitoTitulo: "Message received",
    exitoTexto: "We reply the same business day, through the channel you gave us, with what you need and what it would cost.",
    privacidad: "By sending this you accept our",
    privacidadEnlace: "privacy policy",
    meta: {
      title: "Contact · Get a quote for your web project · Maudev",
      description: "Tell us what you sell and to whom. We reply the same business day with what you need, what it would cost and how long it would take.",
    },
    otras: "Prefer not to fill in a form?",
    porWhatsapp: "Message us on WhatsApp",
  },
  pt: {
    eyebrow: "Contato",
    titulo: "Conte o que você vende e para quem.",
    intro: "Não precisa preparar um documento técnico. Descreva o que acontece hoje e onde trava.",
    nombre: "Nome",
    nombrePh: "Seu nome",
    empresa: "Empresa ou tipo de negócio",
    empresaPh: "ex.: escritório, loja online, oficina",
    necesita: "O que você precisa",
    necesitaPh: "ex.: vendemos peças e hoje só temos Instagram...",
    contacto: "E-mail ou WhatsApp",
    contactoPh: "voce@empresa.com",
    ayuda: "Usamos esse dado apenas para responder você.",
    enviar: "Enviar",
    enviando: "Enviando…",
    errorCampos: "Preencha os quatro campos para podermos avaliar o seu caso.",
    errorContacto: "Informe um e-mail válido ou um WhatsApp com código do país.",
    exitoTitulo: "Mensagem recebida",
    exitoTexto: "Respondemos no mesmo dia útil, pelo canal que você indicou, com o que precisa e quanto custaria.",
    privacidad: "Ao enviar você aceita nossa",
    privacidadEnlace: "política de privacidade",
    meta: {
      title: "Contato · Orçamento para o seu projeto web · Maudev",
      description: "Conte o que você vende e para quem. Respondemos no mesmo dia útil com o que precisa, quanto custaria e em quanto tempo estaria no ar.",
    },
    otras: "Prefere não preencher um formulário?",
    porWhatsapp: "Falar pelo WhatsApp",
  },
};

const CONTENIDO = { en: EN, pt: PT };

export default function LangContact({ lang }) {
  const t = CONTENIDO[lang];
  const f = FORMULARIO[lang];
  const rutas = RUTAS_CONTACTO[lang];

  const [form, setForm] = useState({ name: "", business: "", process: "", contact: "" });
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const empezado = useRef(false);
  const { submit, loading, sent } = useLeadSubmit();

  useSeo({
    title: f.meta.title,
    description: f.meta.description,
    path: rutas[lang],
    lang: lang === "en" ? "en" : "pt-BR",
    alternates: { es: "/contacto", en: "/en/contact", pt: "/pt/contato" },
  });

  const update = (key) => (event) => setForm((actual) => ({ ...actual, [key]: event.target.value }));
  const marcarInicio = () => {
    if (empezado.current) return;
    empezado.current = true;
    trackAction("contacto_inicio", { origen: `formulario-${lang}` });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const contacto = form.contact.trim();
    const email = patronEmail.test(contacto) ? contacto : "";
    const digitos = contacto.replace(/\D/g, "");
    const whatsapp = !email && digitos.length >= 8 ? contacto : "";

    if (!form.name.trim() || !form.business.trim() || !form.process.trim() || !contacto) {
      setError(f.errorCampos);
      return;
    }
    if (!email && !whatsapp) {
      setError(f.errorContacto);
      return;
    }

    trackAction("formulario_envio", { formulario: `contacto-${lang}` });
    await submit({
      lead: {
        name: form.name.trim(),
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        interest: form.business.trim(),
        message: form.process.trim(),
        // El idioma va en `source`: es lo que permite saber si estas páginas
        // traen algo sin cruzar informes con Analytics.
        source: `contact_page_${lang}`,
        empresa_web: honeypot,
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      },
      successMessage: null,
    });
  };

  return (
    <LangShell lang={lang} rutas={rutas} textos={t}>
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="site-container relative grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="eyebrow">{f.eyebrow}</span>
            <h1 className="mt-5 max-w-[13ch] font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
              {f.titulo}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{f.intro}</p>

            <div className="mt-10 space-y-4 border-t border-border pt-6">
              <p className="text-sm font-semibold text-foreground">{f.otras}</p>
              <a
                href="mailto:contacto@maudev.cl"
                className="flex items-center gap-3 text-sm font-semibold hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> contacto@maudev.cl
              </a>
              <a
                href={getWhatsAppUrl(t.whatsappMensaje)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction("whatsapp_click", { ubicacion: `contacto-${lang}` })}
                className="flex items-center gap-3 text-sm font-semibold hover:text-primary"
              >
                <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" /> {f.porWhatsapp}
              </a>
            </div>
          </div>

          <div className="panel panel-solid p-6 sm:p-9">
            {sent ? (
              <div className="flex min-h-[26rem] flex-col items-center justify-center text-center" aria-live="polite">
                <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
                <h2 className="mt-6 font-display text-2xl font-bold">{f.exitoTitulo}</h2>
                <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">{f.exitoTexto}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={marcarInicio} noValidate>
                <input
                  type="text"
                  name="empresa_web"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lang-name" className="form-label">{f.nombre}</label>
                    <Input id="lang-name" name="name" autoComplete="name" value={form.name} onChange={update("name")} className="mt-2 h-12 bg-background" placeholder={f.nombrePh} required />
                  </div>
                  <div>
                    <label htmlFor="lang-business" className="form-label">{f.empresa}</label>
                    <Input id="lang-business" name="business" autoComplete="organization" value={form.business} onChange={update("business")} className="mt-2 h-12 bg-background" placeholder={f.empresaPh} required />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="lang-process" className="form-label">{f.necesita}</label>
                  <Textarea id="lang-process" name="process" value={form.process} onChange={update("process")} className="mt-2 min-h-36 bg-background" placeholder={f.necesitaPh} required />
                </div>
                <div className="mt-5">
                  <label htmlFor="lang-contact" className="form-label">{f.contacto}</label>
                  <Input id="lang-contact" name="contact" value={form.contact} onChange={update("contact")} className="mt-2 h-12 bg-background" placeholder={f.contactoPh} aria-describedby="lang-help" required />
                  <p id="lang-help" className="mt-2 text-xs text-muted-foreground">{f.ayuda}</p>
                </div>

                {error && (
                  <p className="mt-5 rounded-lg border border-error/25 bg-error/8 p-3 text-sm text-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn btn-primary mt-6 h-13 w-full px-6 text-sm font-bold disabled:cursor-wait disabled:opacity-65">
                  {loading ? f.enviando : f.enviar} <Send className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
                  {f.privacidad}{" "}
                  <a href="/privacidad" className="underline underline-offset-2 hover:text-primary">
                    {f.privacidadEnlace}
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <TurnstileGate />
    </LangShell>
  );
}
