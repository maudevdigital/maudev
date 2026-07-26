import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Trash2 } from "lucide-react";
import { t, lang } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// ELIMINACIÓN DE DATOS
//
// Esta URL es requisito de Meta para cualquier app que use sus APIs (el Pixel y
// la Conversions API siguen activos), así que la página se mantiene.
//
// ⚠️ REESCRITA: antes describía la automatización de respuestas automáticas en
// Instagram/Facebook, que se dio de baja junto con el worker `ig-autopost`. Una
// página legal no puede declarar un tratamiento de datos que ya no ocurre.
//
// Ahora cubre los derechos del titular de la Ley 21.719 (ARCO + portabilidad y
// bloqueo) para cualquier dato que tengamos, venga de donde venga.
//
// ⚠️ REVISAR CON ABOGADO antes de publicar.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL = "contacto@maudev.cl";
const mail = (
  <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
);

const Bullets = ({ items }) => (
  <ul className="mt-3 space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5 text-sm">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const sections = [
  {
    num: "01",
    title: t("Qué datos podemos tener sobre ti", "What data we may hold about you"),
    content: (
      <>
        <p>
          {t("Dependiendo de cómo hayas llegado a nosotros, podemos tener:", "Depending on how you reached us, we may hold:")}
        </p>
        <Bullets items={[
          t("Los datos que escribiste en el formulario de contacto: nombre, correo, teléfono y tu mensaje.", "The data you typed into the contact form: name, email, phone and your message."),
          t("La conversación que tuvimos por WhatsApp, si nos escribiste por ahí.", "The conversation we had over WhatsApp, if you messaged us there."),
          t("Los datos de facturación, si llegamos a trabajar juntos.", "Billing data, if we ended up working together."),
          t("Datos de navegación anónimos o pseudonimizados, si aceptaste las cookies de analítica o publicidad.", "Anonymous or pseudonymised browsing data, if you accepted analytics or advertising cookies."),
        ]} />
        <p className="mt-3 text-sm">
          {t(
            "No vendemos estos datos ni los usamos para publicidad sin tu consentimiento.",
            "We do not sell this data nor use it for advertising without your consent."
          )}
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: t("Cómo pedir que los eliminemos", "How to request deletion"),
    content: (
      <>
        <p>
          {t(
            "Puedes pedirlo en cualquier momento y no tienes que justificar el motivo. Escríbenos a",
            "You can request it at any time and you don't have to justify why. Write to us at"
          )}{" "}
          {mail} {t("con el asunto", "with the subject")} <strong className="text-foreground">
            {t("\"Eliminación de datos\"", "\"Data deletion\"")}
          </strong>{" "}
          {t("e incluye:", "and include:")}
        </p>
        <Bullets items={[
          t("El correo o teléfono con el que nos contactaste, para poder encontrarte en nuestros registros.", "The email or phone you contacted us with, so we can find you in our records."),
          t("Qué quieres exactamente: eliminar todo, o solo dejar de recibir comunicaciones.", "What exactly you want: delete everything, or just stop receiving communications."),
        ]} />
        <p className="mt-3 text-sm">
          {t(
            "Te confirmamos por el mismo medio dentro de 5 días hábiles, y el plazo máximo legal de respuesta es de 30 días corridos. El trámite es gratuito. Solo te pediremos verificar tu identidad, para no entregarle tus datos a otra persona.",
            "We confirm through the same channel within 5 business days, and the maximum legal response period is 30 calendar days. The process is free. We will only ask you to verify your identity, so we don't hand your data to someone else."
          )}
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: t("Qué no podemos borrar, y por qué", "What we can't delete, and why"),
    content: (
      <>
        <p>
          {t(
            "Si trabajamos juntos y emitimos boleta o factura, la normativa tributaria del SII nos obliga a conservar esos documentos por 6 años. Eso incluye tu nombre o razón social y el monto de la operación.",
            "If we worked together and issued an invoice or receipt, Chilean tax rules (SII) require us to keep those documents for 6 years. That includes your name or company name and the transaction amount."
          )}
        </p>
        <p>
          {t(
            "Fuera de eso, borramos todo. Y te decimos exactamente qué queda y hasta cuándo, para que no te quedes con la duda.",
            "Beyond that, we delete everything. And we tell you exactly what remains and until when, so you're not left wondering."
          )}
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: t("Tus otros derechos, no solo el de borrar", "Your other rights, not just deletion"),
    content: (
      <>
        <p>
          {t(
            "La Ley N° 21.719 te da más opciones que la eliminación. Se piden todas al mismo correo:",
            "Law No. 21.719 gives you more options than deletion. All are requested at the same email address:"
          )}
        </p>
        <div className="mt-3 space-y-2">
          {[
            { k: t("Acceso", "Access"), v: t("Una copia de todo lo que tenemos sobre ti.", "A copy of everything we hold about you.") },
            { k: t("Rectificación", "Rectification"), v: t("Corregir un dato equivocado o incompleto.", "Correct data that is wrong or incomplete.") },
            { k: t("Oposición", "Objection"), v: t("Que dejemos de usar tus datos para un fin concreto, como la analítica.", "Have us stop using your data for a specific purpose, such as analytics.") },
            { k: t("Portabilidad", "Portability"), v: t("Recibirlos en un formato reutilizable, o que los enviemos a otro proveedor.", "Receive them in a reusable format, or have us send them to another provider.") },
            { k: t("Bloqueo", "Blocking"), v: t("Congelar el uso de tus datos mientras se resuelve un reclamo.", "Freeze the use of your data while a claim is resolved.") },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-b-0">
              <span className="mt-0.5 w-24 shrink-0 font-mono text-xs text-primary">{r.k}</span>
              <span className="text-sm">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">
          {t(
            "Si no quedas conforme con nuestra respuesta, puedes reclamar ante la Agencia de Protección de Datos Personales.",
            "If you are not satisfied with our response, you may complain to the Personal Data Protection Agency."
          )}
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: t("Datos que quedan en plataformas de terceros", "Data held on third-party platforms"),
    content: (
      <>
        <p>
          {t(
            "Hay datos que no están en nuestros sistemas y que por lo tanto no podemos borrar por ti:",
            "Some data is not in our systems and therefore we cannot delete it on your behalf:"
          )}
        </p>
        <Bullets items={[
          t("Si nos escribiste por WhatsApp, la conversación también queda en tu teléfono y en los servidores de Meta, según sus propias políticas.", "If you messaged us on WhatsApp, the conversation also lives on your phone and on Meta's servers, under their own policies."),
          t("Si comentaste o reaccionaste en nuestras publicaciones de Instagram o Facebook, esa actividad la administra Meta. Puedes borrarla desde las opciones de privacidad de cada app.", "If you commented or reacted on our Instagram or Facebook posts, that activity is managed by Meta. You can delete it from each app's privacy settings."),
          t("Las cookies de analítica y publicidad se borran desde tu navegador, o rechazándolas en nuestro aviso de cookies.", "Analytics and advertising cookies are deleted from your browser, or by rejecting them in our cookie notice."),
        ]} />
        <p className="mt-3 text-sm">
          {t(
            "Sí podemos pedirle a Meta que elimine los eventos de conversión asociados a ti que nosotros les enviamos. Indícalo en tu solicitud y lo gestionamos.",
            "We can ask Meta to delete the conversion events associated with you that we sent them. Mention it in your request and we'll handle it."
          )}
        </p>
      </>
    ),
  },
];

export default function EliminacionDatos() {
  useEffect(() => {
    document.title = t("Eliminación de datos · Maudev", "Data Deletion · Maudev");
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
                <Trash2 className="h-3 w-3" />
                {t("Eliminación de datos", "Data deletion")}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mt-1 mb-3">
              {t("Cómo eliminar tus datos", "How to delete your data")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Última actualización:", "Last updated:")}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                "Un correo y listo. Acá está qué datos podemos tener, cómo pedir que los borremos y qué estamos obligados a conservar.",
                "One email and you're done. Here's what data we may hold, how to request deletion, and what we're required to keep."
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

          {/* CTA correo */}
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("¿Quieres que borremos tus datos ahora?", "Want us to delete your data now?")}
            </p>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(t("Eliminación de datos", "Data deletion"))}`}
              className="text-base font-semibold text-primary hover:underline"
            >
              {EMAIL}
            </a>
          </div>

          {/* Links legales */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/privacidad" className="text-muted-foreground hover:text-primary">
              {t("Política de privacidad", "Privacy policy")}
            </Link>
            <Link to="/terminos" className="text-muted-foreground hover:text-primary">
              {t("Términos y condiciones", "Terms & conditions")}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
