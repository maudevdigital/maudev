import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Trash2 } from "lucide-react";
import { t, lang } from "@/lib/i18n";

const sections = [
  {
    num: "01",
    title: t("Qué datos tratamos desde redes sociales", "What data we process from social media"),
    content: (
      <>
        <p>
          {t(
            "Cuando interactúas con nuestras cuentas de Instagram o Facebook (por ejemplo, comentando una publicación o escribiéndonos por mensaje directo), nuestra automatización puede procesar:",
            "When you interact with our Instagram or Facebook accounts (for example, by commenting on a post or sending us a direct message), our automation may process:"
          )}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            t("Tu nombre de usuario y el identificador público de tu perfil", "Your username and your profile's public identifier"),
            t("El contenido del comentario o mensaje que nos envías", "The content of the comment or message you send us"),
            t("El identificador de la publicación o comentario asociado", "The identifier of the associated post or comment"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          {t(
            "Usamos estos datos únicamente para responderte de forma automática (por ejemplo, enviarte por mensaje directo el material que solicitaste). No los vendemos ni los usamos para publicidad sin tu consentimiento.",
            "We use this data solely to respond to you automatically (for example, to send you by direct message the material you requested). We don't sell it or use it for advertising without your consent."
          )}
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: t("Cómo solicitar la eliminación de tus datos", "How to request deletion of your data"),
    content: (
      <>
        <p>
          {t(
            "Puedes pedir que eliminemos todos los datos personales asociados a ti en cualquier momento, sin necesidad de justificar el motivo. Tienes dos vías:",
            "You can request that we delete all personal data associated with you at any time, without needing to justify the reason. You have two options:"
          )}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            t("Escríbenos a contacto@maudev.cl con el asunto \"Eliminación de datos\" indicando tu usuario de Instagram o Facebook.", "Write to contacto@maudev.cl with the subject \"Data deletion\" stating your Instagram or Facebook username."),
            t("Envíanos un mensaje directo desde la misma cuenta con la palabra \"ELIMINAR\".", "Send us a direct message from the same account with the word \"DELETE\"."),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          {t(
            "Eliminaremos tus datos de nuestros sistemas en un plazo máximo de 5 días hábiles y te confirmaremos por el mismo medio. La única excepción son los datos que estemos obligados a conservar por ley.",
            "We will delete your data from our systems within a maximum of 5 business days and confirm it through the same channel. The only exception is data we are legally required to retain."
          )}
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: t("Datos en plataformas de Meta", "Data on Meta platforms"),
    content: (
      <p>
        {t(
          "Los comentarios y mensajes que publicas también quedan almacenados por Meta (Instagram / Facebook) según sus propias políticas. Para eliminar tu actividad directamente en esas plataformas, usa las opciones de privacidad dentro de la app de Instagram o Facebook, o consulta el Centro de ayuda de Meta.",
          "The comments and messages you post are also stored by Meta (Instagram / Facebook) under their own policies. To delete your activity directly on those platforms, use the privacy options within the Instagram or Facebook app, or check Meta's Help Center."
        )}
      </p>
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
              <span className="text-xs font-mono text-primary tracking-wider uppercase">// legal</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                <Trash2 className="h-3 w-3" />
                {t("Eliminación de datos", "Data deletion")}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mt-1 mb-3">
              {t("Instrucciones para eliminar tus datos", "Instructions to delete your data")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Última actualización:", "Last updated:")}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                "Esta página explica qué datos personales tratamos cuando interactúas con nuestras cuentas de Instagram y Facebook, y cómo puedes pedir que los eliminemos.",
                "This page explains what personal data we process when you interact with our Instagram and Facebook accounts, and how you can request its deletion."
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

          {/* Privacy link */}
          <div className="mt-10 p-5 bg-card border border-border rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("¿Buscas la política de privacidad completa?", "Looking for the full privacy policy?")}
            </p>
            <Link to="/privacidad" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
              {t("Ver privacidad →", "View privacy →")}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
