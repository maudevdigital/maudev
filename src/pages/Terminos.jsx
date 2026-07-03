import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { t, lang } from "@/lib/i18n";

const sections = [
  {
    num: "01",
    title: t("Identificación y aceptación", "Identification and acceptance"),
    content: (
      <>
        <p>
          {t("Este sitio y los servicios son provistos por Maudev, con domicilio en Chile y correo de contacto", "This site and services are provided by Maudev, domiciled in Chile, with contact email")}{" "}
          <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>.{" "}
          {t("Al usar este sitio web y/o contratar los servicios, el usuario o cliente declara haber leído y aceptado los presentes términos y condiciones. La razón social y el RUT de la empresa se indicarán en cada documento tributario emitido.", "By using this website and/or hiring the services, the user or client declares they have read and accepted these terms and conditions. The company's legal name and tax ID will be stated on each tax document issued.")}
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: t("Servicios", "Services"),
    content: (
      <p>
        {t("Maudev presta servicios de desarrollo web, software a medida, automatización de procesos, integración de pasarelas de pago y consultoría tecnológica. El alcance específico, los plazos y el precio se acuerdan por escrito en una propuesta o cotización previa para cada proyecto, la que forma parte integrante de estos términos.", "Maudev provides web development, custom software, process automation, payment gateway integration and technology consulting. The specific scope, timelines and price are agreed in writing in a prior proposal or quote for each project, which forms an integral part of these terms.")}
      </p>
    ),
  },
  {
    num: "03",
    title: t("Precios, monedas y formas de pago", "Prices, currencies and payment"),
    content: (
      <>
        <p>
          {t("Toda cotización tiene una vigencia de 30 días corridos desde su emisión. Salvo pacto distinto, los proyectos se cobran 50% al inicio y 50% contra entrega. Se aceptan:", "Every quote is valid for 30 calendar days from issuance. Unless otherwise agreed, projects are billed 50% upfront and 50% on delivery. We accept:")}
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-3 text-sm">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">CLP</span>
            <span>{t("Pesos chilenos — transferencia bancaria. Moneda de referencia para clientes en Chile.", "Chilean pesos — bank transfer. Reference currency for clients in Chile.")}</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">USD</span>
            <span>{t("Para clientes internacionales, mediante transferencia o plataforma acordada.", "For international clients, via transfer or an agreed payment platform.")}</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">USDT</span>
            <span>{t("Stablecoin en la red acordada. 1 USDT ≈ 1 USD al momento de emitir la cotización; comisiones de red a cargo del cliente.", "Stablecoin on the agreed network. 1 USDT ≈ 1 USD at quote issuance; network fees borne by the client.")}</span>
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("Cuando corresponda, Maudev emitirá boleta o factura electrónica a través del SII, incluyendo el IVA vigente. Los pagos en moneda extranjera o cripto se convierten a CLP al tipo de cambio observado del día de emisión del documento.", "Where applicable, Maudev will issue an electronic receipt or invoice through Chile's SII, including applicable VAT. Foreign currency or crypto payments are converted to CLP at the observed rate on the document issuance date.")}
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: t("Propiedad intelectual", "Intellectual property"),
    content: (
      <p>
        {t("El código y los entregables desarrollados específicamente para el cliente son de su propiedad una vez pagado el saldo total. Las licencias de software de terceros, librerías de código abierto y servicios externos se rigen por sus propias licencias. Maudev conserva el derecho de usar el proyecto como referencia en su portafolio, salvo solicitud expresa de confidencialidad acordada por escrito.", "The code and deliverables developed specifically for the client become their property once the full balance is paid. Third-party licenses and external services are governed by their own licenses. Maudev reserves the right to use the project as a portfolio reference, unless confidentiality is expressly agreed in writing.")}
      </p>
    ),
  },
  {
    num: "05",
    title: t("Plazos, revisiones y cancelaciones", "Timelines, revisions and cancellations"),
    content: (
      <p>
        {t("Los plazos se acuerdan en el roadmap inicial. El trabajo es iterativo e incluye revisiones dentro del alcance acordado; los cambios fuera de alcance se cotizan por separado. Si el cliente desiste del proyecto una vez iniciado, el anticipo cubre el trabajo ya ejecutado y no es reembolsable en esa parte. Para servicios contratados a distancia por consumidores, se respetará el derecho de retracto cuando resulte aplicable conforme a la Ley N° 19.496.", "Timelines are agreed in the initial roadmap. Work is iterative and includes revisions within the agreed scope; out-of-scope changes are quoted separately. If the client withdraws once started, the deposit covers the work already done and is non-refundable to that extent. For services hired remotely by consumers, the right of withdrawal will be honored where applicable under Chilean Consumer Protection Law No. 19.496.")}
      </p>
    ),
  },
  {
    num: "06",
    title: t("Responsabilidad", "Liability"),
    content: (
      <p>
        {t("Maudev no se responsabiliza por daños indirectos, lucro cesante ni pérdidas derivadas del uso de los entregables. La responsabilidad máxima se limita al monto efectivamente pagado por el servicio. Esta limitación no afecta los derechos irrenunciables que la legislación chilena reconoce a los consumidores.", "Maudev is not liable for indirect damages, loss of profit or losses from the use of deliverables. Maximum liability is limited to the amount actually paid for the service. This limitation does not affect the non-waivable consumer rights granted under Chilean law.")}
      </p>
    ),
  },
  {
    num: "07",
    title: t("Protección de datos", "Data protection"),
    content: (
      <p>
        {t("El tratamiento de datos personales se rige por la Ley N° 19.628 sobre Protección de la Vida Privada y se detalla en nuestra", "The processing of personal data is governed by Chilean Privacy Law No. 19.628 and detailed in our")}{" "}
        <Link to="/privacidad" className="text-primary hover:underline">{t("política de privacidad", "privacy policy")}</Link>.
      </p>
    ),
  },
  {
    num: "08",
    title: t("Modificaciones", "Changes"),
    content: (
      <p>
        {t("Nos reservamos el derecho de modificar estos términos. La versión vigente siempre estará publicada en esta página con su fecha de actualización.", "We reserve the right to modify these terms. The current version will always be published on this page with its update date.")}
      </p>
    ),
  },
  {
    num: "09",
    title: t("Legislación y jurisdicción", "Governing law and jurisdiction"),
    content: (
      <p>
        {t("Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia derivada de los servicios se someterá a la competencia de los tribunales ordinarios de justicia con asiento en Chile.", "These terms are governed by the laws of the Republic of Chile. Any dispute arising from the services will be submitted to the ordinary courts of justice seated in Chile.")}
      </p>
    ),
  },
  {
    num: "10",
    title: t("Contacto", "Contact"),
    content: (
      <p>
        {t("Para consultas legales o sobre estos términos:", "For legal inquiries or about these terms:")}{" "}
        <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>.
      </p>
    ),
  },
];

export default function Terminos() {
  useEffect(() => {
    document.title = t("Términos y Condiciones · Maudev", "Terms & Conditions · Maudev");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 pb-8 border-b border-border/40">
            <span className="kicker">legal</span>
            <h1 className="text-4xl font-black tracking-tight mt-3 mb-3">
              {t("Términos y condiciones", "Terms & conditions")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Última actualización:", "Last updated:")}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                "Estos términos regulan el uso del sitio maudev.cl y la contratación de los servicios de Maudev.",
                "These terms govern the use of maudev.cl and the hiring of Maudev's services."
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
              {t("¿Buscas la política de privacidad?", "Looking for the privacy policy?")}
            </p>
            <Link to="/privacidad" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
              {t("Ver política →", "View policy →")}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
