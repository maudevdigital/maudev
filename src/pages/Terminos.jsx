import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { t, lang } from "@/lib/i18n";

export default function Terminos() {
  useEffect(() => {
    document.title = t("Términos y Condiciones · Maudev", "Terms & Conditions · Maudev");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// legal</span>
          <h1 className="text-4xl font-black tracking-tight mt-3 mb-2">{t("Términos y condiciones", "Terms & conditions")}</h1>
          <p className="text-sm text-muted-foreground mb-10">{t("Última actualización:", "Last updated:")} {new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-CL")}</p>

          <div className="max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("1. Identificación y aceptación", "1. Identification and acceptance")}</h2>
              <p>
                {t("Este sitio y los servicios son provistos por Maudev (en adelante \"la empresa\" o \"el prestador\"), con domicilio en Chile y correo de contacto", "This site and services are provided by Maudev (hereinafter \"the company\" or \"the provider\"), domiciled in Chile, with contact email")}{" "}
                <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>.{" "}
                {t("Al usar este sitio web y/o contratar los servicios, el usuario o cliente declara haber leído y aceptado los presentes términos y condiciones. La razón social y el RUT de la empresa se indicarán en cada documento tributario emitido.", "By using this website and/or hiring the services, the user or client declares they have read and accepted these terms and conditions. The company's legal name and tax ID will be stated on each tax document issued.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("2. Servicios", "2. Services")}</h2>
              <p>
                {t("Maudev presta servicios de desarrollo web, software a medida, automatización de procesos, integración de pasarelas de pago y consultoría tecnológica. El alcance específico, los plazos y el precio se acuerdan por escrito en una propuesta o cotización previa para cada proyecto, la que forma parte integrante de estos términos.", "Maudev provides web development, custom software, process automation, payment gateway integration and technology consulting. The specific scope, timelines and price are agreed in writing in a prior proposal or quote for each project, which forms an integral part of these terms.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("3. Precios, monedas y formas de pago", "3. Prices, currencies and payment")}</h2>
              <p>
                {t("Toda cotización tiene una vigencia de 30 días corridos desde su emisión. Salvo pacto distinto, los proyectos se cobran 50% al inicio y 50% contra entrega. Se aceptan las siguientes monedas y medios de pago:", "Every quote is valid for 30 calendar days from issuance. Unless otherwise agreed, projects are billed 50% upfront and 50% on delivery. The following currencies and payment methods are accepted:")}
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong className="text-foreground">CLP (pesos chilenos):</strong> {t("transferencia bancaria nacional. Es la moneda de referencia para clientes en Chile.", "domestic bank transfer. It is the reference currency for clients in Chile.")}</li>
                <li><strong className="text-foreground">USD:</strong> {t("para clientes internacionales, mediante transferencia o plataforma de pago acordada.", "for international clients, via transfer or an agreed payment platform.")}</li>
                <li><strong className="text-foreground">USDT (stablecoin):</strong> {t("se acepta pago en USDT en la red que se acuerde por escrito. El monto en USDT se calcula con paridad 1 USDT ≈ 1 USD al momento de emitir la cotización; las comisiones de red (\"gas\") son de cargo del cliente.", "USDT payment is accepted on the network agreed in writing. The USDT amount is calculated at parity 1 USDT ≈ 1 USD at the time the quote is issued; network fees (\"gas\") are borne by the client.")}</li>
              </ul>
              <p className="mt-3">
                {t("Cuando corresponda, Maudev emitirá la boleta o factura electrónica a través del Servicio de Impuestos Internos (SII), incluyendo el IVA vigente. Los pagos en moneda extranjera o en cripto se convierten a CLP al tipo de cambio observado del día de emisión del documento tributario, para efectos de la declaración de impuestos en Chile.", "Where applicable, Maudev will issue the electronic invoice or receipt through Chile's tax authority (SII), including the applicable VAT. Payments in foreign currency or crypto are converted to CLP at the observed exchange rate on the date the tax document is issued, for tax reporting purposes in Chile.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("4. Propiedad intelectual", "4. Intellectual property")}</h2>
              <p>
                {t("El código y los entregables desarrollados específicamente para el cliente son de su propiedad una vez pagado el saldo total. Las licencias de software de terceros, librerías de código abierto y servicios externos (por ejemplo Supabase o Cloudflare) se rigen por sus propias licencias. Maudev conserva el derecho de utilizar el proyecto como referencia en su portafolio, salvo solicitud expresa de confidencialidad acordada por escrito.", "The code and deliverables developed specifically for the client become their property once the full balance is paid. Third-party software licenses, open-source libraries and external services (e.g. Supabase or Cloudflare) are governed by their own licenses. Maudev reserves the right to use the project as a reference in its portfolio, unless confidentiality is expressly agreed in writing.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("5. Plazos, revisiones y cancelaciones", "5. Timelines, revisions and cancellations")}</h2>
              <p>
                {t("Los plazos se acuerdan en el roadmap inicial. El trabajo es iterativo e incluye revisiones dentro del alcance acordado; los cambios fuera de alcance se cotizan por separado. Si el cliente desiste del proyecto una vez iniciado, el anticipo cubre el trabajo ya ejecutado y no es reembolsable en esa parte. Para servicios contratados a distancia por consumidores, se respetará el derecho de retracto cuando resulte aplicable conforme a la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores.", "Timelines are agreed in the initial roadmap. Work is iterative and includes revisions within the agreed scope; out-of-scope changes are quoted separately. If the client withdraws from the project once started, the deposit covers the work already done and is non-refundable to that extent. For services hired remotely by consumers, the right of withdrawal will be honored where applicable under Chilean Consumer Protection Law No. 19.496.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("6. Responsabilidad", "6. Liability")}</h2>
              <p>
                {t("Maudev no se responsabiliza por daños indirectos, lucro cesante ni pérdidas derivadas del uso de los entregables. La responsabilidad máxima se limita al monto efectivamente pagado por el cliente por el servicio en cuestión. Esta limitación no afecta los derechos irrenunciables que la legislación chilena reconoce a los consumidores.", "Maudev is not liable for indirect damages, loss of profit or losses arising from the use of the deliverables. Maximum liability is limited to the amount actually paid by the client for the service in question. This limitation does not affect the non-waivable rights granted to consumers under Chilean law.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("7. Protección de datos", "7. Data protection")}</h2>
              <p>
                {t("El tratamiento de datos personales se rige por la Ley N° 19.628 sobre Protección de la Vida Privada y se detalla en nuestra", "The processing of personal data is governed by Chilean Privacy Law No. 19.628 and detailed in our")}{" "}
                <a href="/privacidad" className="text-primary hover:underline">{t("política de privacidad", "privacy policy")}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("8. Modificaciones", "8. Changes")}</h2>
              <p>
                {t("Nos reservamos el derecho de modificar estos términos. La versión vigente siempre estará publicada en esta página con su fecha de actualización.", "We reserve the right to modify these terms. The current version will always be published on this page with its update date.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("9. Legislación y jurisdicción", "9. Governing law and jurisdiction")}</h2>
              <p>
                {t("Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia derivada de los servicios se someterá a la competencia de los tribunales ordinarios de justicia con asiento en Chile.", "These terms are governed by the laws of the Republic of Chile. Any dispute arising from the services will be submitted to the ordinary courts of justice seated in Chile.")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">{t("10. Contacto", "10. Contact")}</h2>
              <p>
                {t("Para consultas legales o sobre estos términos:", "For legal inquiries or about these terms:")}{" "}
                <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
