import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Shield } from "lucide-react";
import { t, lang } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// POLÍTICA DE PRIVACIDAD
//
// Escrita para la Ley 21.719 (publicada 13-dic-2024, en vigencia el 1 de
// diciembre de 2026), que reemplaza la Ley 19.628 de 1999. Se redacta ya en
// clave 21.719 para no tener que rehacerla en diciembre.
//
// La 21.719 exige que esta política declare, como mínimo:
//   responsable · finalidades · BASES DE LICITUD · destinatarios ·
//   transferencias internacionales · plazos de conservación · cómo ejercer
//   los derechos del titular.
//
// ⚠️ MANTENER SINCRONIZADO: la lista de encargados (sección 05) tiene que
// reflejar los servicios que REALMENTE tocan datos. Si cambias el destino de
// los leads en src/lib/leads.js, o agregas un pixel, actualiza esta lista.
//
// ⚠️ REVISAR CON ABOGADO antes de publicar. Esto es una base técnica bien
// informada, no asesoría legal.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL = "contacto@maudev.cl";
const mail = (
  <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
);

const sections = [
  {
    num: "01",
    title: t("Quién es responsable de tus datos", "Who is responsible for your data"),
    content: (
      <>
        <p>
          {t(
            "Maudev, con domicilio en la Región de Valparaíso, Chile, es el responsable del tratamiento de los datos personales que se recogen a través de este sitio. Para cualquier tema de privacidad puedes escribir a",
            "Maudev, domiciled in the Valparaíso Region, Chile, is the controller of the personal data collected through this site. For any privacy matter you can write to"
          )}{" "}
          {mail}.
        </p>
        <p>
          {t(
            "Esta política se rige por la Ley N° 21.719 sobre Protección de Datos Personales de Chile, que entra en vigencia el 1 de diciembre de 2026 y reemplaza a la Ley N° 19.628. Hasta esa fecha sigue aplicando la Ley N° 19.628; hemos redactado esta política conforme al estándar más exigente de ambas.",
            "This policy is governed by Chilean Law No. 21.719 on Personal Data Protection, which takes effect on December 1, 2026 and replaces Law No. 19.628. Until then, Law No. 19.628 still applies; this policy has been drafted to the stricter standard of the two."
          )}
        </p>
        <p>
          {t(
            "Si resides en el Espacio Económico Europeo o en el Reino Unido, te aplican además los derechos del RGPD, y esta política los respeta.",
            "If you reside in the European Economic Area or the United Kingdom, GDPR rights also apply to you, and this policy honours them."
          )}
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: t("Qué datos recogemos", "What data we collect"),
    content: (
      <>
        <p className="font-medium text-foreground">
          {t("Los que tú nos entregas:", "What you give us:")}
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          {[
            t("Nombre y apellido", "First and last name"),
            t("Correo electrónico", "Email address"),
            t("Teléfono o WhatsApp", "Phone or WhatsApp number"),
            t("El mensaje o descripción del proyecto que escribes", "The message or project description you write"),
            t("Rubro o tipo de negocio, si lo indicas", "Industry or business type, if you provide it"),
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>

        <p className="mt-4 font-medium text-foreground">
          {t("Los que se recogen solos al navegar:", "What is collected automatically as you browse:")}
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          {[
            t("Dirección IP y país aproximado", "IP address and approximate country"),
            t("Navegador, sistema operativo y tipo de dispositivo", "Browser, operating system and device type"),
            t("Páginas visitadas, tiempo en el sitio y desde dónde llegaste", "Pages visited, time on site and referrer"),
            t("Parámetros de campaña (utm_source, utm_medium, utm_campaign y similares)", "Campaign parameters (utm_source, utm_medium, utm_campaign and similar)"),
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>

        <p className="mt-4">
          {t(
            "No pedimos ni queremos datos sensibles: no necesitamos tu RUT para cotizar, ni datos de salud, origen étnico, afiliación política o sindical, orientación sexual ni datos biométricos. Tampoco procesamos datos de menores de 14 años a sabiendas. Si nos envías información sensible por tu cuenta, la eliminaremos.",
            "We don't ask for or want sensitive data: we don't need your national ID to quote, nor health data, ethnic origin, political or union affiliation, sexual orientation or biometric data. We also don't knowingly process data of children under 14. If you send us sensitive information on your own, we will delete it."
          )}
        </p>
        <p>
          {t(
            "Los datos de pago (tarjeta, cuenta bancaria) nunca pasan por este sitio: los maneja directamente la pasarela o el banco.",
            "Payment data (card, bank account) never passes through this site: it is handled directly by the payment provider or bank."
          )}
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: t("Para qué los usamos y con qué base legal", "What we use them for and on what legal basis"),
    content: (
      <>
        <p>
          {t(
            "La Ley 21.719 exige declarar la base de licitud de cada tratamiento. Estas son las nuestras:",
            "Law 21.719 requires declaring the legal basis for each processing activity. These are ours:"
          )}
        </p>
        <div className="mt-3 space-y-3">
          {[
            {
              use: t("Responder tu consulta y preparar una cotización", "Replying to your enquiry and preparing a quote"),
              basis: t("Consentimiento", "Consent"),
              note: t("Lo das al enviar el formulario o escribirnos. Puedes revocarlo cuando quieras.", "You give it by submitting the form or messaging us. You can revoke it at any time."),
            },
            {
              use: t("Ejecutar el proyecto contratado y darte soporte", "Delivering the contracted project and supporting you"),
              basis: t("Ejecución de un contrato", "Performance of a contract"),
              note: t("Sin estos datos no podemos entregarte el servicio que compraste.", "Without this data we cannot deliver the service you purchased."),
            },
            {
              use: t("Emitir boleta o factura y llevar contabilidad", "Issuing invoices and keeping accounting records"),
              basis: t("Obligación legal", "Legal obligation"),
              note: t("Normativa tributaria del SII. No podemos borrar estos datos antes del plazo legal.", "Chilean tax authority (SII) rules. We cannot delete this data before the legal retention period."),
            },
            {
              use: t("Medir qué campañas y páginas funcionan, y proteger el sitio", "Measuring which campaigns and pages work, and protecting the site"),
              basis: t("Consentimiento (analítica y publicidad) · Interés legítimo (seguridad)", "Consent (analytics and advertising) · Legitimate interest (security)"),
              note: t("La analítica y los píxeles publicitarios solo se activan si los aceptas. La protección contra ataques y abuso se apoya en interés legítimo, ponderado para no afectar tus derechos.", "Analytics and advertising pixels only activate if you accept them. Protection against attacks and abuse relies on legitimate interest, balanced so as not to affect your rights."),
            },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-3">
              <p className="text-sm font-medium text-foreground">{r.use}</p>
              <p className="mt-1 text-xs font-mono text-primary">{r.basis}</p>
              <p className="mt-1.5 text-xs">{r.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          {t(
            "No vendemos, arrendamos ni cedemos tus datos. No tomamos decisiones automatizadas que te afecten legalmente, ni hacemos perfilamiento para negarte un servicio.",
            "We do not sell, rent or transfer your data. We do not make automated decisions that legally affect you, nor do we profile you to deny you a service."
          )}
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: t("Cuánto tiempo los guardamos", "How long we keep them"),
    content: (
      <>
        <div className="space-y-2">
          {[
            { k: t("Consultas que no terminan en proyecto", "Enquiries that don't become a project"), v: t("12 meses", "12 months") },
            { k: t("Datos de clientes con proyecto ejecutado", "Client data for delivered projects"), v: t("Mientras dure la relación y 5 años después", "For the relationship plus 5 years") },
            { k: t("Documentos tributarios (boletas, facturas)", "Tax documents (invoices, receipts)"), v: t("6 años, por obligación del SII", "6 years, as required by the SII") },
            { k: t("Registros de analítica", "Analytics records"), v: t("14 meses (configuración de GA4)", "14 months (GA4 setting)") },
          ].map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-4 border-b border-border/30 pb-2 last:border-b-0">
              <span>{r.k}</span>
              <span className="shrink-0 font-mono text-xs text-foreground">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3">
          {t(
            "Cumplido el plazo, se eliminan o se anonimizan de forma irreversible. Si pides la eliminación antes, la hacemos, salvo en lo que la ley tributaria nos obliga a conservar (y en ese caso te decimos exactamente qué queda y por qué).",
            "Once the period ends, data is deleted or irreversibly anonymised. If you request deletion earlier, we comply, except where tax law requires retention (and in that case we tell you exactly what remains and why)."
          )}
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: t("Quién más toca tus datos", "Who else touches your data"),
    content: (
      <>
        <p>
          {t(
            "Trabajamos con los siguientes encargados de tratamiento. Cada uno accede solo a lo necesario para su función:",
            "We work with the following data processors. Each one accesses only what is necessary for its function:"
          )}
        </p>
        <ul className="mt-3 space-y-2.5">
          {[
            {
              name: "Cloudflare",
              desc: t("Hosting del sitio, CDN y protección contra ataques", "Site hosting, CDN and attack protection"),
              loc: t("EE.UU. / red global", "USA / global network"),
            },
            {
              name: "n8n",
              desc: t("Automatización que recibe los formularios y nos avisa", "Automation that receives form submissions and notifies us"),
              loc: t("Servidor propio — ver nota abajo", "Self-hosted — see note below"),
            },
            {
              name: "Telegram",
              desc: t("Aviso interno inmediato de un nuevo contacto", "Immediate internal notification of a new contact"),
              loc: t("Fuera de Chile", "Outside Chile"),
            },
            {
              name: "Meta",
              desc: t("Píxel y API de conversiones, para medir publicidad", "Pixel and Conversions API, to measure advertising"),
              loc: t("EE.UU.", "USA"),
            },
            {
              name: "Google Analytics 4",
              desc: t("Analítica de tráfico agregada", "Aggregate traffic analytics"),
              loc: t("EE.UU.", "USA"),
            },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 shrink-0 rounded border border-border/60 bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {item.name}
              </span>
              <span className="text-muted-foreground">
                {item.desc} · <span className="text-xs">{item.loc}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          {t(
            "Además podemos entregar datos a la autoridad cuando exista una orden judicial o una obligación legal que nos obligue a hacerlo.",
            "We may also disclose data to authorities where there is a court order or a legal obligation requiring it."
          )}
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: t("Transferencias fuera de Chile", "Transfers outside Chile"),
    content: (
      <>
        <p>
          {t(
            "Varios de los servicios anteriores están alojados fuera de Chile, principalmente en Estados Unidos. Eso significa que tus datos cruzan la frontera.",
            "Several of the services above are hosted outside Chile, mainly in the United States. That means your data crosses the border."
          )}
        </p>
        <p>
          {t(
            "La Ley 21.719 permite estas transferencias cuando el país de destino ofrece un nivel de protección equivalente, o cuando existe un contrato con cláusulas que garanticen esa protección. Nos apoyamos en los acuerdos de tratamiento de datos y cláusulas contractuales tipo que cada uno de estos proveedores ofrece, que es el mecanismo estándar y el más usado en la práctica.",
            "Law 21.719 allows these transfers where the destination country offers an equivalent level of protection, or where a contract with clauses guaranteeing that protection is in place. We rely on the data processing agreements and standard contractual clauses each of these providers offers, which is the standard and most widely used mechanism in practice."
          )}
        </p>
        <p>
          {t(
            "Si necesitas saber la ubicación exacta del servidor donde corre nuestra automatización, escríbenos y te lo confirmamos por escrito.",
            "If you need to know the exact location of the server running our automation, write to us and we'll confirm it in writing."
          )}
        </p>
      </>
    ),
  },
  {
    num: "07",
    title: t("Cookies y seguimiento", "Cookies and tracking"),
    content: (
      <>
        <p>
          {t("Usamos tres tipos de cookies, y solo el primero es obligatorio:", "We use three types of cookies, and only the first is mandatory:")}
        </p>
        <div className="mt-3 space-y-2">
          {[
            {
              k: t("Técnicas", "Essential"),
              v: t("Hacen funcionar el sitio: recuerdan tu preferencia de tema claro/oscuro y protegen contra abuso. No requieren consentimiento.", "Make the site work: remember your light/dark theme preference and protect against abuse. No consent required."),
            },
            {
              k: t("Analíticas", "Analytics"),
              v: t("Google Analytics 4. Nos dicen qué páginas sirven y cuáles no. Solo se activan si aceptas.", "Google Analytics 4. Tell us which pages work and which don't. Only activate if you accept."),
            },
            {
              k: t("Publicitarias", "Advertising"),
              v: t("Meta Pixel y Meta CAPI. Miden si un anuncio se convirtió en contacto. Solo se activan si aceptas.", "Meta Pixel and Meta CAPI. Measure whether an ad turned into a contact. Only activate if you accept."),
            },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-3">
              <p className="font-mono text-xs text-primary">{r.k}</p>
              <p className="mt-1 text-xs">{r.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">
          {t(
            "Puedes cambiar tu decisión cuando quieras desde el aviso de cookies, o bloquearlas desde tu navegador. Si las bloqueas, el sitio sigue funcionando igual.",
            "You can change your decision at any time from the cookie notice, or block them from your browser. If you block them, the site still works the same."
          )}
        </p>
      </>
    ),
  },
  {
    num: "08",
    title: t("Tus derechos", "Your rights"),
    content: (
      <>
        <p>
          {t("La Ley 21.719 te reconoce estos derechos sobre tus datos:", "Law 21.719 grants you these rights over your data:")}
        </p>
        <div className="mt-3 space-y-2">
          {[
            { k: t("Acceso", "Access"), v: t("Pedir una copia de todo lo que tenemos sobre ti.", "Request a copy of everything we hold about you.") },
            { k: t("Rectificación", "Rectification"), v: t("Corregir lo que esté equivocado o incompleto.", "Correct anything wrong or incomplete.") },
            { k: t("Supresión", "Erasure"), v: t("Pedir que lo borremos, salvo lo que la ley nos obligue a guardar.", "Ask us to delete it, except what the law requires us to keep.") },
            { k: t("Oposición", "Objection"), v: t("Negarte a un tratamiento concreto, como la analítica o la publicidad.", "Refuse a specific processing activity, such as analytics or advertising.") },
            { k: t("Portabilidad", "Portability"), v: t("Recibir tus datos en un formato estructurado y reutilizable, o que los enviemos a otro proveedor.", "Receive your data in a structured, reusable format, or have us send it to another provider.") },
            { k: t("Bloqueo", "Blocking"), v: t("Suspender temporalmente el uso de tus datos mientras se resuelve un reclamo.", "Temporarily suspend use of your data while a claim is resolved.") },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-b-0">
              <span className="mt-0.5 w-24 shrink-0 font-mono text-xs text-primary">{r.k}</span>
              <span className="text-sm">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-4">
          {t("Para ejercerlos, escribe a", "To exercise them, write to")} {mail}.{" "}
          {t(
            "Respondemos dentro de 30 días corridos. No cobramos por esto. Solo te pediremos verificar tu identidad, para no entregarle tus datos a otra persona.",
            "We respond within 30 calendar days. There is no charge. We will only ask you to verify your identity, so we don't hand your data to someone else."
          )}
        </p>
        <p>
          {t(
            "Si no quedas conforme con nuestra respuesta, puedes reclamar ante la Agencia de Protección de Datos Personales, el organismo fiscalizador creado por la Ley 21.719.",
            "If you are not satisfied with our response, you may complain to the Personal Data Protection Agency, the supervisory authority created by Law 21.719."
          )}
        </p>
        <p className="mt-2">
          <Link to="/eliminacion-datos" className="text-primary hover:underline">
            {t("Ver el procedimiento paso a paso para eliminar tus datos →", "See the step-by-step data deletion procedure →")}
          </Link>
        </p>
      </>
    ),
  },
  {
    num: "09",
    title: t("Seguridad y qué pasa si hay una brecha", "Security and what happens in a breach"),
    content: (
      <>
        <p>
          {t(
            "El sitio va sobre HTTPS, el acceso a los sistemas está restringido y usa autenticación en dos pasos, y guardamos el mínimo de datos necesario. Ningún sistema es infalible, así que también tenemos un plan para cuando algo falle.",
            "The site runs over HTTPS, system access is restricted and uses two-factor authentication, and we store the minimum data necessary. No system is infallible, so we also have a plan for when something fails."
          )}
        </p>
        <p>
          {t(
            "Si ocurre una brecha que afecte tus datos, la Ley 21.719 nos obliga a notificarla a la Agencia de Protección de Datos Personales sin demora, y a más tardar dentro de 72 horas de haberla detectado. Si el riesgo para ti es alto, te avisaremos directamente por correo, explicando qué pasó, qué datos se vieron afectados y qué te recomendamos hacer.",
            "If a breach affecting your data occurs, Law 21.719 requires us to notify the Personal Data Protection Agency without delay, and no later than 72 hours after detecting it. If the risk to you is high, we will notify you directly by email, explaining what happened, which data was affected and what we recommend you do."
          )}
        </p>
      </>
    ),
  },
  {
    num: "10",
    title: t("Cambios a esta política", "Changes to this policy"),
    content: (
      <p>
        {t(
          "Si esta política cambia de forma relevante, actualizamos la fecha de arriba y, cuando el cambio te afecte de manera significativa, te avisamos por correo si tenemos uno tuyo. Te recomendamos revisarla antes de enviarnos datos nuevos.",
          "If this policy changes materially, we update the date above and, where the change significantly affects you, we notify you by email if we have one. We recommend reviewing it before sending us new data."
        )}
      </p>
    ),
  },
];

export default function Privacidad() {
  useEffect(() => {
    document.title = t("Política de Privacidad · Maudev", "Privacy Policy · Maudev");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 pb-8 border-b border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="kicker">legal</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                <Shield className="h-3 w-3" />
                {t("Ley 21.719", "Law 21.719")}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mt-1 mb-3">
              {t("Política de privacidad", "Privacy policy")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Última actualización:", "Last updated:")}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                "Qué datos recogemos, con qué base legal, quién más los ve y cómo pedir que los borremos. Sin letra chica.",
                "What data we collect, on what legal basis, who else sees it and how to ask us to delete it. No fine print."
              )}
            </p>
          </div>

          {/* Secciones */}
          <div className="space-y-0">
            {sections.map((s) => (
              <div key={s.num} className="py-7 border-b border-border/30 last:border-b-0">
                <div className="flex items-start gap-4">
                  <span className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-primary/8 text-primary border border-primary/15 font-bold shrink-0 mt-0.5">
                    {s.num}
                  </span>
                  <div className="flex-1 space-y-3">
                    <h2 className="text-base font-bold text-foreground">{s.title}</h2>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                      {s.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Terms link */}
          <div className="mt-10 p-5 bg-card border border-border rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("¿Buscas los términos y condiciones?", "Looking for the terms and conditions?")}
            </p>
            <Link to="/terminos" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
              {t("Ver términos →", "View terms →")}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
