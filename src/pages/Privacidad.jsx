import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Shield } from "lucide-react";
import { t, lang } from "@/lib/i18n";

const sections = [
  {
    num: "01",
    title: t("Responsable del tratamiento", "Data controller"),
    content: (
      <p>
        {t("Maudev, con domicilio en Chile y correo de contacto", "Maudev, domiciled in Chile with contact email")}{" "}
        <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>,{" "}
        {t("es responsable del tratamiento de los datos personales recopilados a través de este sitio. Esta política cumple con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.", "is responsible for processing the personal data collected through this site. This policy complies with Chilean Privacy Law No. 19.628.")}
      </p>
    ),
  },
  {
    num: "02",
    title: t("Datos que recopilamos", "Data we collect"),
    content: (
      <>
        <p>{t("Cuando completas un formulario de contacto, podemos recopilar:", "When you fill out a contact form, we may collect:")}</p>
        <ul className="mt-3 space-y-2">
          {[
            t("Nombre", "Name"),
            t("Correo electrónico", "Email address"),
            t("Número de WhatsApp / teléfono y país", "WhatsApp / phone number and country"),
            t("Tipo de interés o servicio solicitado", "Type of interest or service requested"),
            t("Mensaje libre", "Free-text message"),
            t("Datos técnicos: dirección IP, navegador, parámetros UTM de campañas", "Technical data: IP address, browser, campaign UTM parameters"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "03",
    title: t("Finalidad del tratamiento", "Purpose of processing"),
    content: (
      <>
        <p>{t("Usamos tus datos exclusivamente para:", "We use your data solely to:")}</p>
        <ul className="mt-3 space-y-2">
          {[
            t("Responder a tu consulta y agendar reuniones de diagnóstico", "Respond to your inquiry and schedule diagnostic meetings"),
            t("Enviarte cotizaciones y propuestas comerciales", "Send you quotes and commercial proposals"),
            t("Mantener registro de la comunicación contigo", "Keep a record of our communication with you"),
            t("Mejorar la experiencia del sitio mediante analítica agregada y anónima", "Improve the site experience through aggregate, anonymous analytics"),
            t("Mostrar publicidad relevante a través de Meta Ads y Google Ads (solo si diste consentimiento)", "Show relevant ads through Meta Ads and Google Ads (only with your consent)"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          {t("No enviamos newsletters ni comunicaciones masivas sin tu consentimiento explícito.", "We don't send newsletters or mass communications without your explicit consent.")}
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: t("Compartición con terceros", "Sharing with third parties"),
    content: (
      <>
        <p>
          {t("Tus datos se almacenan en servicios que cumplen estándares internacionales de seguridad. No vendemos, alquilamos ni cedemos tus datos con fines comerciales. Los sub-procesadores que utilizamos son:", "Your data is stored on services that meet international security standards. We don't sell, rent or transfer your data for commercial purposes. Our sub-processors are:")}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            { name: "Supabase", desc: t("Base de datos y autenticación (USA)", "Database and authentication (USA)") },
            { name: "Cloudflare", desc: t("CDN, workers y hosting (USA)", "CDN, workers and hosting (USA)") },
            { name: "Meta (Facebook)", desc: t("Analítica de conversiones y publicidad", "Conversion analytics and advertising") },
            { name: "Google Analytics 4", desc: t("Analítica de tráfico web agregada y anónima", "Aggregate, anonymous web traffic analytics") },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60 shrink-0 mt-0.5">{item.name}</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "05",
    title: t("Cookies y tecnologías de seguimiento", "Cookies and tracking technologies"),
    content: (
      <>
        <p>
          {t("Utilizamos las siguientes tecnologías de seguimiento:", "We use the following tracking technologies:")}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            { name: "Meta Pixel", desc: t("Mide conversiones de anuncios y construye audiencias de retargeting.", "Measures ad conversions and builds retargeting audiences.") },
            { name: "Meta CAPI", desc: t("API de conversiones del lado del servidor (mayor privacidad, sin cookies).", "Server-side conversions API (greater privacy, no cookies).") },
            { name: "Google Analytics 4", desc: t("Analiza el comportamiento de usuarios de forma anónima y agregada.", "Analyzes user behavior anonymously and in aggregate.") },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">{item.name}</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("Puedes deshabilitar las cookies desde la configuración de tu navegador. Algunas funciones del sitio pueden verse afectadas.", "You can disable cookies in your browser settings. Some site features may be affected.")}
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: t("Retención de datos", "Data retention"),
    content: (
      <p>
        {t("Los datos de contacto se conservan mientras sean necesarios para gestionar la relación comercial y por el plazo que exijan las obligaciones legales y tributarias aplicables (máximo 6 años). Los datos de analítica se conservan por los plazos predeterminados de cada plataforma.", "Contact data is retained as long as necessary to manage the business relationship and for the period required by applicable legal and tax obligations (maximum 6 years). Analytics data is retained for each platform's default periods.")}
      </p>
    ),
  },
  {
    num: "07",
    title: t("Tus derechos", "Your rights"),
    content: (
      <>
        <p>
          {t("Conforme a la Ley N° 19.628, tienes derecho a:", "Under Chilean Law No. 19.628, you have the right to:")}
        </p>
        <ul className="mt-3 space-y-2">
          {[
            t("Acceder a los datos personales que tenemos sobre ti", "Access the personal data we hold about you"),
            t("Rectificar datos inexactos o desactualizados", "Rectify inaccurate or outdated data"),
            t("Solicitar la cancelación de tus datos (salvo obligación legal de conservarlos)", "Request deletion of your data (unless there is a legal obligation to retain them)"),
            t("Oponerte al tratamiento de tus datos para fines publicitarios", "Object to the processing of your data for advertising purposes"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          {t("Para ejercer estos derechos, escríbenos a", "To exercise these rights, write to us at")}{" "}
          <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>{" "}
          {t("con el asunto \"Datos personales\". Respondemos en un plazo máximo de 5 días hábiles.", "with the subject \"Personal data\". We respond within a maximum of 5 business days.")}
        </p>
      </>
    ),
  },
  {
    num: "08",
    title: t("Cambios en esta política", "Changes to this policy"),
    content: (
      <p>
        {t("Podemos actualizar esta política. La versión vigente siempre estará publicada en esta página con su fecha de actualización. Los cambios materiales serán comunicados por email a los contactos en nuestra base.", "We may update this policy. The current version will always be published on this page with its update date. Material changes will be communicated by email to contacts in our database.")}
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
                {t("Protección de datos", "Data protection")}
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
                "Esta política explica qué datos recopilamos, para qué los usamos y cómo los protegemos.",
                "This policy explains what data we collect, what we use it for, and how we protect it."
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
