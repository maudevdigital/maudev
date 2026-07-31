import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { t, lang } from "@/lib/i18n";
import { useSeo } from "@/lib/useSeo";

// ─────────────────────────────────────────────────────────────────────────────
// TÉRMINOS Y CONDICIONES
//
// Cubre dos escenarios distintos a propósito:
//   A) Cliente en Chile   → Ley 19.496 (consumidor), IVA 19%, boleta/factura SII
//   B) Cliente extranjero → exportación de servicios, sin IVA, USD/USDT
//
// ⚠️ EL DERECHO DE RETRACTO ES EL PUNTO DELICADO.
// El art. 3 bis de la Ley 19.496 da 10 días para desistir de contratos a
// distancia. El reglamento excluye, entre otros, los bienes hechos según
// especificaciones del cliente, el software ya entregado y los servicios ya
// ejecutados — que es justo lo que vendemos.
//
// PERO: si no se informa el derecho al momento de contratar, el plazo se
// extiende de 10 a 90 días. Por eso lo declaramos explícitamente acá: informarlo
// bien protege más que omitirlo.
//
// ⚠️ REVISAR CON ABOGADO antes de publicar, en especial la sección 05 y la
// cláusula de jurisdicción. Esto es una base técnica informada, no asesoría
// legal.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL = "contacto@maudev.cl";
const mail = (
  <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
);

const sections = [
  {
    num: "01",
    title: t("Quiénes somos y qué aceptas", "Who we are and what you accept"),
    content: (
      <>
        <p>
          {t(
            "Maudev es un proveedor de servicios de desarrollo de software y automatización de procesos, con domicilio en la Región de Valparaíso, Chile. Contacto:",
            "Maudev is a provider of software development and process automation services, domiciled in the Valparaíso Region, Chile. Contact:"
          )}{" "}
          {mail}.
        </p>
        <p>
          {t(
            "Al usar este sitio o contratar un servicio aceptas estos términos. Si contratas en representación de una empresa, declaras tener facultades para obligarla.",
            "By using this site or hiring a service you accept these terms. If you contract on behalf of a company, you declare you have authority to bind it."
          )}
        </p>
        <p>
          {t(
            "Cada proyecto se formaliza además en una cotización o propuesta escrita. Si algo de esa propuesta contradice estos términos, manda la propuesta.",
            "Each project is additionally formalised in a written quote or proposal. If anything in that proposal contradicts these terms, the proposal prevails."
          )}
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: t("Qué servicios ofrecemos", "What services we offer"),
    content: (
      <>
        <ul className="space-y-1.5 list-disc pl-5">
          {[
            t("Automatización de procesos con n8n e inteligencia artificial", "Process automation with n8n and artificial intelligence"),
            t("Desarrollo de sitios web y software a medida", "Website and custom software development"),
            t("Integraciones entre sistemas (WhatsApp, calendarios, pasarelas de pago, planillas, CRM)", "System integrations (WhatsApp, calendars, payment gateways, spreadsheets, CRM)"),
            t("Workflows de n8n listos para importar, entregados como archivo .json", "Ready-to-import n8n workflows, delivered as a .json file"),
            t("Instalación y configuración de n8n en tu propio servidor", "Installation and configuration of n8n on your own server"),
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>
        <p className="mt-3">
          {t(
            "El alcance exacto de cada trabajo queda por escrito en la propuesta antes de empezar. Lo que no está en la propuesta no está incluido, y se cotiza aparte.",
            "The exact scope of each engagement is put in writing in the proposal before starting. Anything not in the proposal is not included, and is quoted separately."
          )}
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: t("Precios, monedas e impuestos", "Prices, currencies and taxes"),
    content: (
      <>
        <p className="font-medium text-foreground">{t("Si estás en Chile", "If you are in Chile")}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>{t("Los precios se expresan en pesos chilenos (CLP).", "Prices are stated in Chilean pesos (CLP).")}</li>
          <li>{t("Se agrega IVA del 19% cuando corresponde, y se indica siempre antes de que pagues.", "19% VAT is added where applicable, and is always stated before you pay.")}</li>
          <li>{t("Emitimos boleta o factura electrónica del SII por cada pago.", "We issue an SII electronic invoice or receipt for every payment.")}</li>
          <li>{t("Medios de pago: transferencia bancaria.", "Payment methods: bank transfer.")}</li>
        </ul>

        <p className="mt-4 font-medium text-foreground">{t("Si estás fuera de Chile", "If you are outside Chile")}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>{t("Los precios se expresan en dólares estadounidenses (USD).", "Prices are stated in US dollars (USD).")}</li>
          <li>
            {t(
              "La operación constituye exportación de servicios, por lo que no se aplica IVA chileno. Cualquier impuesto, retención o arancel en tu país es de tu cargo.",
              "The transaction constitutes an export of services, so Chilean VAT does not apply. Any tax, withholding or duty in your country is your responsibility."
            )}
          </li>
          <li>
            {t(
              "Aceptamos transferencia internacional y stablecoins (USDT). En el caso de stablecoins, 1 USDT se considera equivalente a 1 USD al momento de emitir la cotización, y las comisiones de red son de tu cargo.",
              "We accept international transfer and stablecoins (USDT). For stablecoins, 1 USDT is treated as equivalent to 1 USD at the time the quote is issued, and network fees are your responsibility."
            )}
          </li>
          <li>{t("Emitimos el documento tributario que corresponda a una exportación de servicios.", "We issue the tax document applicable to an export of services.")}</li>
        </ul>

        <p className="mt-4">
          {t(
            "Forma de pago por defecto: 50% para iniciar y 50% contra entrega. Los productos digitales de descarga inmediata se pagan 100% por adelantado. Los precios de una cotización se mantienen vigentes 15 días corridos.",
            "Default payment terms: 50% to start and 50% on delivery. Instant-download digital products are paid 100% in advance. Quoted prices remain valid for 15 calendar days."
          )}
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: t("Plazos y responsabilidades de cada parte", "Timelines and each party's responsibilities"),
    content: (
      <>
        <p>
          {t(
            "El plazo se acuerda por escrito en la propuesta y empieza a correr desde que recibimos el primer pago y los accesos o contenidos necesarios para trabajar.",
            "The timeline is agreed in writing in the proposal and starts running once we receive the first payment and the access or content needed to work."
          )}
        </p>
        <p>
          {t(
            "Necesitamos de tu parte: los accesos a las cuentas que se van a integrar, los contenidos (textos, imágenes, logos) y respuesta a nuestras consultas en un plazo razonable. Si el proyecto se detiene esperando algo tuyo, el plazo se extiende por el mismo tiempo. Si la espera supera 60 días, podemos cerrar el proyecto y facturar lo avanzado.",
            "We need from you: access to the accounts to be integrated, the content (copy, images, logos) and answers to our questions within a reasonable time. If the project stalls waiting on you, the deadline extends by the same amount of time. If the wait exceeds 60 days, we may close the project and invoice the work completed."
          )}
        </p>
        <p>
          {t(
            "Garantía: 30 días corridos desde la entrega para corregir sin costo cualquier falla de lo acordado en la propuesta. La garantía cubre errores nuestros; no cubre cambios de alcance, ni fallas causadas por servicios de terceros, ni modificaciones que hagas tú o alguien más al código entregado.",
            "Warranty: 30 calendar days from delivery to fix, at no cost, any failure of what was agreed in the proposal. The warranty covers our errors; it does not cover scope changes, failures caused by third-party services, or modifications made by you or anyone else to the delivered code."
          )}
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: t("Derecho de retracto, cancelaciones y reembolsos", "Right of withdrawal, cancellations and refunds"),
    content: (
      <>
        <p className="font-medium text-foreground">
          {t("Derecho de retracto (clientes en Chile)", "Right of withdrawal (clients in Chile)")}
        </p>
        <p className="mt-1">
          {t(
            "El artículo 3 bis de la Ley N° 19.496 otorga a los consumidores 10 días corridos para desistir de un contrato celebrado a distancia, contados desde la contratación del servicio y antes de que este se haya prestado.",
            "Article 3 bis of Law No. 19.496 gives consumers 10 calendar days to withdraw from a distance contract, counted from the date the service was contracted and before it has been rendered."
          )}
        </p>
        <p className="mt-2">
          {t("Ese derecho NO aplica, conforme a la misma ley y su reglamento, cuando:", "That right does NOT apply, under the same law and its regulations, where:")}
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>
            {t(
              "El servicio ya fue prestado, total o parcialmente, con tu conformidad.",
              "The service has already been rendered, in whole or in part, with your agreement."
            )}
          </li>
          <li>
            {t(
              "El desarrollo fue hecho según tus especificaciones o personalizado para tu negocio, que es el caso del software a medida y de las automatizaciones configuradas para ti.",
              "The work was made to your specifications or customised for your business, which is the case for custom software and automations configured for you."
            )}
          </li>
          <li>
            {t(
              "Se trata de un producto digital ya descargado o entregado, como un archivo .json de workflow.",
              "It is a digital product already downloaded or delivered, such as a workflow .json file."
            )}
          </li>
        </ul>
        <p className="mt-3">
          {t(
            "Si retractas dentro de plazo y el caso no cae en las exclusiones, devolvemos lo pagado descontando únicamente los servicios ya prestados al momento del retracto. Para ejercerlo, escríbenos a",
            "If you withdraw within the deadline and the case does not fall under the exclusions, we refund what you paid, deducting only the services already rendered at the time of withdrawal. To exercise it, write to us at"
          )}{" "}
          {mail}.
        </p>

        <p className="mt-4 font-medium text-foreground">{t("Cancelación de un proyecto", "Cancelling a project")}</p>
        <p className="mt-1">
          {t(
            "Puedes cancelar en cualquier momento. El primer pago cubre el trabajo ya realizado y no se reembolsa una vez iniciado el desarrollo. Te entregamos lo avanzado hasta ese punto.",
            "You may cancel at any time. The first payment covers work already performed and is not refundable once development has started. We hand over whatever has been completed up to that point."
          )}
        </p>

        <p className="mt-4 font-medium text-foreground">{t("Si no cumplimos", "If we fail to deliver")}</p>
        <p className="mt-1">
          {t(
            "Si no entregamos lo acordado en la propuesta y no lo podemos corregir dentro de la garantía, devolvemos lo pagado por la parte no entregada. Eso aplica sin importar dónde estés.",
            "If we do not deliver what was agreed in the proposal and cannot fix it within the warranty period, we refund what you paid for the undelivered portion. This applies regardless of where you are."
          )}
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: t("Propiedad intelectual", "Intellectual property"),
    content: (
      <>
        <p>
          {t(
            "Una vez pagado el total, el código y los archivos desarrollados específicamente para tu proyecto quedan de tu propiedad, junto con las credenciales y los repositorios. Puedes modificarlos, migrarlos o entregárselos a otro proveedor sin pedirnos permiso.",
            "Once paid in full, the code and files developed specifically for your project become your property, along with credentials and repositories. You may modify, migrate or hand them to another provider without asking us."
          )}
        </p>
        <p>
          {t(
            "Quedan fuera: las librerías y el software de terceros, que se rigen por sus propias licencias, y las herramientas y componentes genéricos reutilizables que traemos de proyectos anteriores, sobre los que conservamos nuestros derechos y que puedes seguir usando dentro de tu proyecto sin límite de tiempo.",
            "Excluded are: third-party libraries and software, governed by their own licences, and the generic reusable tooling and components we bring from previous projects, over which we retain our rights and which you may keep using within your project without time limit."
          )}
        </p>
        <p>
          {t(
            "Salvo que nos pidas lo contrario, podemos mencionar el proyecto y mostrar capturas en nuestro portafolio. Si prefieres que no, basta con decirlo.",
            "Unless you ask otherwise, we may mention the project and show screenshots in our portfolio. If you'd rather we didn't, just say so."
          )}
        </p>
      </>
    ),
  },
  {
    num: "07",
    title: t("Límites de responsabilidad", "Limitation of liability"),
    content: (
      <>
        <p>
          {t(
            "Entregamos el trabajo con el cuidado profesional que corresponde, pero no podemos garantizar resultados comerciales: no prometemos una cantidad de ventas, de leads ni una posición determinada en Google.",
            "We deliver the work with due professional care, but we cannot guarantee commercial outcomes: we do not promise a number of sales, leads or a specific ranking on Google."
          )}
        </p>
        <p>
          {t(
            "No respondemos por caídas o cambios de servicios de terceros de los que dependa la solución (WhatsApp, Meta, Google, pasarelas de pago, proveedores de IA), ni por fallas derivadas de modificaciones hechas por ti o por terceros al código entregado, ni por pérdidas indirectas o lucro cesante.",
            "We are not liable for outages or changes in third-party services the solution depends on (WhatsApp, Meta, Google, payment gateways, AI providers), nor for failures arising from modifications made by you or third parties to the delivered code, nor for indirect losses or loss of profit."
          )}
        </p>
        <p>
          {t(
            "En cualquier caso, nuestra responsabilidad total se limita al monto que hayas pagado por el servicio en cuestión. Nada de lo anterior limita los derechos que la ley te reconoce como consumidor y que no pueden renunciarse anticipadamente.",
            "In any event, our total liability is limited to the amount you paid for the service in question. Nothing above limits the rights the law grants you as a consumer, which cannot be waived in advance."
          )}
        </p>
      </>
    ),
  },
  {
    num: "08",
    title: t("Datos personales", "Personal data"),
    content: (
      <>
        <p>
          {t(
            "El tratamiento de datos personales se rige por nuestra política de privacidad, redactada conforme a la Ley N° 21.719.",
            "The processing of personal data is governed by our privacy policy, drafted in accordance with Law No. 21.719."
          )}
        </p>
        <p>
          {t(
            "Cuando un proyecto implique que tratemos datos de tus propios clientes (por ejemplo, una automatización que recibe contactos), lo hacemos como encargado de tratamiento por cuenta tuya: tú sigues siendo el responsable frente a esas personas, y firmamos el acuerdo de tratamiento que necesites.",
            "Where a project involves us processing your own customers' data (for example, an automation that receives contacts), we act as a data processor on your behalf: you remain the controller towards those individuals, and we will sign whatever data processing agreement you need."
          )}
        </p>
        <p className="mt-2">
          <Link to="/privacidad" className="text-primary hover:underline">
            {t("Leer la política de privacidad →", "Read the privacy policy →")}
          </Link>
        </p>
      </>
    ),
  },
  {
    num: "09",
    title: t("Cambios a estos términos", "Changes to these terms"),
    content: (
      <p>
        {t(
          "Podemos actualizar estos términos. Los proyectos ya contratados se rigen por la versión vigente al momento de firmar la propuesta, así que un cambio posterior no te afecta retroactivamente.",
          "We may update these terms. Projects already contracted are governed by the version in force when the proposal was signed, so a later change does not affect you retroactively."
        )}
      </p>
    ),
  },
  {
    num: "10",
    title: t("Ley aplicable y dónde se resuelven las disputas", "Governing law and where disputes are resolved"),
    content: (
      <>
        <p>
          {t(
            "Estos términos se rigen por la ley chilena.",
            "These terms are governed by Chilean law."
          )}
        </p>
        <p>
          {t(
            "Si eres consumidor con domicilio en Chile, conservas el derecho de recurrir al SERNAC y a los tribunales que la Ley N° 19.496 disponga; nada acá te obliga a renunciar a ese fuero.",
            "If you are a consumer domiciled in Chile, you retain the right to turn to SERNAC and to the courts designated by Law No. 19.496; nothing here requires you to waive that forum."
          )}
        </p>
        <p>
          {t(
            "Si contratas desde fuera de Chile, las partes se someten a los tribunales ordinarios de Valparaíso, Chile, sin perjuicio de que intentemos primero resolver cualquier diferencia de buena fe y por escrito. Si tu legislación local te otorga derechos irrenunciables como consumidor, esos derechos se mantienen.",
            "If you contract from outside Chile, the parties submit to the ordinary courts of Valparaíso, Chile, without prejudice to first attempting to resolve any dispute in good faith and in writing. If your local law grants you non-waivable consumer rights, those rights remain."
          )}
        </p>
      </>
    ),
  },
  {
    num: "11",
    title: t("Contacto", "Contact"),
    content: (
      <p>
        {t("Para cualquier duda sobre estos términos, sobre una cotización o para ejercer el derecho de retracto:", "For any question about these terms, about a quote, or to exercise the right of withdrawal:")}{" "}
        {mail}.{" "}
        {t("Respondemos dentro de 1 día hábil.", "We respond within 1 business day.")}
      </p>
    ),
  },
];

export default function Terminos() {
  useSeo({
    title: "Términos y condiciones · Maudev",
    description: "Condiciones de contratación, entrega, propiedad intelectual y soporte de los servicios de Maudev.",
    path: "/terminos",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-24">
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
                "Cómo se cotiza, cómo se paga, qué pasa si te arrepientes y de quién queda el código. Aplica tanto si estás en Chile como si contratas desde el extranjero.",
                "How we quote, how you pay, what happens if you change your mind, and who owns the code. Applies whether you are in Chile or contracting from abroad."
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
      </main>
      <Footer />
    </div>
  );
}
