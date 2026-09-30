import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import TurnstileGate from "@/components/landing/TurnstileGate";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CTA_MESSAGE } from "@/data/site";
import { describeQuoteIntent, readQuoteIntent } from "@/data/quote";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackAction } from "@/lib/MetaPixelTracker";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { useSeo } from "@/lib/useSeo";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// El orden importa: al enviar con errores se enfoca el primero de la lista,
// que es el que el visitante encuentra antes al recorrer el formulario.
const CAMPOS = ["name", "business", "process", "contact"];
const ETIQUETAS = {
  name: "tu nombre",
  business: "tu empresa o tipo de negocio",
  process: "qué necesitas",
  contact: "un correo o WhatsApp",
};

export default function Contacto() {
  const [searchParams] = useSearchParams();
  // Lo que el visitante ya eligió en el cotizador de la portada. Antes llegaba
  // en la URL y se descartaba: el formulario partía en blanco y volvía a
  // preguntar lo que la persona acababa de responder, que es donde se abandona.
  const intencion = useMemo(() => readQuoteIntent(searchParams), [searchParams]);

  const [form, setForm] = useState(() => ({
    name: "",
    business: "",
    process: describeQuoteIntent(intencion),
    contact: "",
  }));
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const started = useRef(false);
  // Uno por campo y no un objeto de refs: agrupar obliga a leer una propiedad
  // del objeto durante el render, que es justo lo que la regla de refs prohíbe.
  const nameRef = useRef(null);
  const businessRef = useRef(null);
  const processRef = useRef(null);
  const contactRef = useRef(null);
  const { submit, loading, sent } = useLeadSubmit();

  // Llegar con una intención ya declarada es la señal de compra más fuerte del
  // sitio, y hasta ahora no quedaba registrada en ninguna parte.
  useEffect(() => {
    if (!intencion) return;
    trackAction("contacto_intencion", {
      tipo: intencion.tipo?.id || intencion.plan?.id || "sin-tipo",
      tamano: intencion.tamano?.id || "sin-tamano",
    });
  }, [intencion]);

  // El mensaje precargado de WhatsApp arrastra lo elegido. Sin esto, quien
  // viene del cotizador abre el chat y tiene que explicar de nuevo, a mano, lo
  // que acaba de responder con dos botones.
  const mensajeWhatsApp = intencion?.plan
    ? `Hola, vengo de maudev.cl. Me interesa el plan ${intencion.plan.nombre} de ${intencion.plan.capacidad}.`
    : intencion?.tipo
    ? `Hola, vengo de maudev.cl. Estuve viendo ${intencion.tipo.necesidad}${intencion.tamano ? ` de ${intencion.tamano.secciones}` : ""} y quiero cotizarlo.`
    : CTA_MESSAGE;

  useSeo({
    // El título y la descripción decían "automatizar", del posicionamiento
    // anterior, y además contradecían al HTML estático, que ya hablaba de
    // sitios web: el rastreador leía una cosa antes de ejecutar JavaScript y
    // otra después. Ahora coinciden con scripts/prerender-meta.mjs.
    title: "Contacto · Cotiza tu sitio web · Maudev",
    description: "Cuéntanos qué vendes y a quién. Te decimos qué tipo de sitio necesitas, cuánto costaría y en cuánto tiempo estaría publicado. Respuesta el mismo día hábil.",
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

  // Al corregir un campo su error desaparece de inmediato. Dejarlo hasta el
  // siguiente envío hace que el formulario parezca seguir rechazando algo que
  // la persona ya arregló.
  const update = (key) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const { [key]: _corregido, ...resto } = current;
      return resto;
    });
  };

  // Un solo mensaje genérico ("completa los cuatro campos") obliga a revisar
  // los cuatro para dar con el que falta. Acá cada campo dice lo suyo, y el
  // resumen enfoca el primero que falte.
  const validar = () => {
    const errores = {};
    if (!form.name.trim()) errores.name = "Escribe tu nombre para saber cómo dirigirnos a ti.";
    if (!form.business.trim()) errores.business = "Dinos a qué se dedica tu negocio; con el rubro basta.";
    if (!form.process.trim()) errores.process = "Cuéntanos en una línea qué necesitas.";

    const contacto = form.contact.trim();
    if (!contacto) errores.contact = "Déjanos un correo o un WhatsApp para poder responderte.";
    else if (!emailPattern.test(contacto) && contacto.replace(/\D/g, "").length < 8) {
      errores.contact = "Revisa el dato: debe ser un correo válido o un número de al menos 8 dígitos.";
    }
    return errores;
  };
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackAction("contacto_inicio", { origen: "formulario" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar();
    const faltantes = CAMPOS.filter((campo) => errores[campo]);

    if (faltantes.length) {
      setFieldErrors(errores);
      setError(
        faltantes.length === 1
          ? `Falta ${ETIQUETAS[faltantes[0]]}.`
          : `Faltan ${faltantes.length} datos: ${faltantes.map((campo) => ETIQUETAS[campo]).join(", ")}.`
      );
      // El mapa se arma acá dentro, ya fuera del render.
      const campos = { name: nameRef, business: businessRef, process: processRef, contact: contactRef };
      campos[faltantes[0]].current?.focus();
      // Qué campo frena el envío, nunca lo que la persona escribió. Sin esto no
      // hay manera de saber en qué punto se abandona el formulario.
      trackAction("formulario_error", { formulario: "contacto", campos: faltantes.join("|") });
      return;
    }

    setError("");
    setFieldErrors({});
    const contact = form.contact.trim();
    const email = emailPattern.test(contact) ? contact : "";
    const whatsapp = email ? "" : contact;

    trackAction("formulario_envio", { formulario: "contacto" });
    const ok = await submit({
      lead: {
        name: form.name.trim(),
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        interest: form.business.trim(),
        message: form.process.trim(),
        source: "contact_page",
        // Lo que eligió en el cotizador viaja con el lead y llega a la bandeja
        // de entrada junto al mensaje, en vez de quedarse en la URL.
        quote_type: intencion?.tipo?.id || intencion?.plan?.id,
        quote_size: intencion?.tamano?.id,
        empresa_web: honeypot,
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      },
      track: {
        email: email || undefined,
        phone: whatsapp || undefined,
        // content_category es un id del catálogo, no el texto que escribió el
        // visitante: permite segmentar sin mandarle a Meta lo que redactó.
        params: {
          content_name: "Consulta de proyecto",
          content_category: intencion?.tipo?.id || "sin-cotizador",
          source: "contact_page",
        },
      },
      successMessage: "Mensaje recibido. Te respondemos hoy mismo.",
      whatsappFallback: mensajeWhatsApp,
    });
    if (ok) trackAction("contacto_completado", { origen: "formulario" });
  };

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Contacto" }]} />
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
              <div>
                <span className="eyebrow">Contacto</span>
                <h1 className="display-title mt-5">Cuéntanos tu idea.</h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Cuéntanos qué hace tu negocio y qué te gustaría mejorar. Te ayudamos a definir el siguiente paso.
                </p>
                <div className="mt-10 space-y-4 border-t border-border pt-6">
                  {/* El correo era el único camino de contacto sin medir: si es
                      el que prefiere la mitad de la gente, no había forma de
                      saberlo. Se registra el clic, no la dirección. */}
                  <a href="mailto:contacto@maudev.cl" onClick={() => trackAction("correo_click", { ubicacion: "contacto" })} className="flex items-center gap-3 text-sm font-semibold hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> contacto@maudev.cl
                  </a>
                  <a href={getWhatsAppUrl(mensajeWhatsApp)} target="_blank" rel="noopener noreferrer" onClick={() => trackAction("whatsapp_click", { ubicacion: "contacto" })} className="flex items-center gap-3 text-sm font-semibold hover:text-primary">
                    <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" /> Escribir por WhatsApp
                  </a>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-card p-6 shadow-[0_24px_70px_hsl(var(--ink)/0.08)] sm:p-9">
                {sent ? (
                  <div className="flex min-h-[30rem] flex-col items-center justify-center text-center" aria-live="polite">
                    <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
                    <h2 className="mt-6 text-2xl font-extrabold">Mensaje recibido</h2>
                    <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">Te respondo el mismo día por el medio que indicaste, con qué necesitas y cuánto costaría.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} onFocus={markStarted} noValidate>
                    <input type="text" name="empresa_web" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                    {/* Confirma que lo elegido en el cotizador llegó hasta acá.
                        Sin esta línea, el visitante ve un formulario vacío y no
                        tiene cómo saber que su elección no se perdió. */}
                    {intencion?.tipo && (
                      <p className="mb-6 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm">
                        <strong className="font-semibold">Vienes del cotizador:</strong>{" "}
                        <span className="text-muted-foreground">
                          {intencion.tipo.label}
                          {intencion.tamano ? ` · ${intencion.tamano.label} secciones` : ""}. Ajusta el mensaje si quieres.
                        </span>
                      </p>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="form-label">Nombre</label>
                        <Input ref={nameRef} id="contact-name" name="name" autoComplete="name" value={form.name} onChange={update("name")} className="mt-2 h-12 bg-background" placeholder="Tu nombre" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "error-name" : undefined} required />
                        {fieldErrors.name && <p id="error-name" className="mt-2 text-xs font-medium text-error">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-business" className="form-label">Empresa o tipo de negocio</label>
                        <Input ref={businessRef} id="contact-business" name="business" autoComplete="organization" value={form.business} onChange={update("business")} className="mt-2 h-12 bg-background" placeholder="Ej. barbería, taller, consultora" aria-invalid={Boolean(fieldErrors.business)} aria-describedby={fieldErrors.business ? "error-business" : undefined} required />
                        {fieldErrors.business && <p id="error-business" className="mt-2 text-xs font-medium text-error">{fieldErrors.business}</p>}
                      </div>
                    </div>
                    <div className="mt-5">
                      <label htmlFor="contact-process" className="form-label">Qué necesitas</label>
                      <Textarea ref={processRef} id="contact-process" name="process" value={form.process} onChange={update("process")} className="mt-2 min-h-36 bg-background" placeholder="Ej. vendo repuestos y hoy solo tengo Instagram..." aria-invalid={Boolean(fieldErrors.process)} aria-describedby={fieldErrors.process ? "error-process" : undefined} required />
                      {fieldErrors.process && <p id="error-process" className="mt-2 text-xs font-medium text-error">{fieldErrors.process}</p>}
                    </div>
                    <div className="mt-5">
                      <label htmlFor="contact-method" className="form-label">Correo o WhatsApp</label>
                      <Input ref={contactRef} id="contact-method" name="contact" autoComplete="email" value={form.contact} onChange={update("contact")} className="mt-2 h-12 bg-background" placeholder="correo@empresa.cl o +56 9..." aria-invalid={Boolean(fieldErrors.contact)} aria-describedby={fieldErrors.contact ? "error-contact contact-help" : "contact-help"} required />
                      {fieldErrors.contact && <p id="error-contact" className="mt-2 text-xs font-medium text-error">{fieldErrors.contact}</p>}
                      <p id="contact-help" className="mt-2 text-xs text-muted-foreground">Usaremos este dato solo para responder tu consulta.</p>
                    </div>

                    {/* Un único role="alert" para todo el formulario: varios
                        compiten entre sí y el lector de pantalla los pisa. Los
                        mensajes por campo llegan por aria-describedby. */}
                    {error && <p className="mt-5 rounded-lg border border-error/25 bg-error/8 p-3 text-sm text-error" role="alert">{error}</p>}

                    <button type="submit" disabled={loading} className="btn btn-primary mt-6 h-13 w-full px-6 text-sm font-bold disabled:cursor-wait disabled:opacity-65">
                      {loading ? "Enviando…" : "Enviar mi consulta"} <Send className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">Al enviar aceptas nuestra <a href="/privacidad" className="underline underline-offset-2 hover:text-primary">política de privacidad</a>.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* La página tenía menos de doscientas palabras y ningún encabezado
            propio: para el buscador era una plantilla vacía, y para quien
            duda antes de escribir no respondía nada. Esto contesta las tres
            preguntas que frenan el mensaje. */}
        <section className="section-pad border-t border-border bg-secondary/40" aria-labelledby="antes-titulo">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <span className="eyebrow">Antes de escribir</span>
              <h2 id="antes-titulo" className="section-title mt-4">
                Lo que conviene saber.
              </h2>
            </div>

            <div className="max-w-2xl">
              <article className="border-t border-border py-8 first:border-t-0 first:pt-0">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Qué pasa después de que envías</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Te responde Lucas, no un ejecutivo de cuentas ni un formulario automático. El mismo
                  día hábil, por el medio que hayas indicado.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  En esa primera respuesta ya va lo concreto: qué tipo de proyecto corresponde, un
                  rango de precio y un plazo estimado. Si tu caso no lo hacemos nosotros o se resuelve
                  con una herramienta de mercado más barata, también te lo decimos ahí.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Qué incluir en el mensaje</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  No hace falta un documento técnico ni saber qué tecnología quieres. Con tres cosas
                  alcanza: qué vendes, a quién, y qué pasa hoy cuando alguien quiere comprarte.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Si ya tienes sitio, la dirección. Si tienes una fecha límite o un presupuesto
                  máximo, dilo desde el principio: cambia lo que conviene proponerte y evita dos
                  correos de ida y vuelta.
                </p>
              </article>

              <article className="border-t border-border py-8">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em]">Si prefieres no escribir un formulario</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  WhatsApp funciona igual de bien y suele ser más rápido para resolver una duda
                  puntual. Y si prefieres conversarlo, puedes agendar treinta minutos directamente en
                  el calendario, sin pasar por acá.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Los precios de todos los servicios están publicados en{" "}
                  <Link to="/precios" className="font-semibold text-primary hover:underline">la página de precios</Link>,
                  así que puedes hacerte una idea antes de contactarnos.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
          <TurnstileGate />
    </PageShell>
  );
}
