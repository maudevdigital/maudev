import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Printer, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

// Modelo de contrato publicado como ejercicio de transparencia radical: el
// cliente puede leer exactamente qué va a firmar antes del primer contacto.
// Se presenta con formato de contrato real (comparecencia, cláusulas ordinales
// y firmas) y con dos variantes: "Chile" (CLP, RUT, tribunales locales) e
// "Internacional" (USD/USDT, pasaporte/ID tributaria) para clientes extranjeros.
// El contrato real de cada proyecto parte de este modelo y se completa con los
// datos de las partes, el alcance y los hitos acordados en la propuesta.

const ordinals = {
  es: ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno"],
  en: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth"],
};

// Cláusulas comunes a ambas variantes. Las que cambian (precio, ley) se
// resuelven aparte según el modo.
const baseClauses = (mode) => [
  {
    title: t("Partes y objeto", "Parties and purpose"),
    body: t(
      "El objeto del contrato es el desarrollo del proyecto descrito en la propuesta técnica adjunta, la que forma parte integrante de este instrumento. Todo lo que el proyecto incluye —y lo que no incluye— queda listado en dicha propuesta.",
      "The purpose of this agreement is the development of the project described in the attached technical proposal, which forms an integral part of this instrument. Everything the project includes —and does not include— is listed in that proposal."
    ),
  },
  {
    title: t("Precio fijo y forma de pago", "Fixed price and payment terms"),
    body:
      mode === "intl"
        ? t(
            "El precio es fijo y se expresa por escrito en dólares de los Estados Unidos (USD) o su equivalente en USDT (stablecoin). Salvo pacto distinto, se paga 50% como anticipo a la firma y 50% contra entrega aprobada. Si el alcance acordado no cambia, el precio no cambia. Las ampliaciones de alcance se cotizan por separado y requieren acuerdo escrito de ambas partes antes de ejecutarse.",
            "The price is fixed and stated in writing in United States dollars (USD) or its equivalent in USDT (stablecoin). Unless otherwise agreed, 50% is paid upfront at signing and 50% upon approved delivery. If the agreed scope does not change, the price does not change. Scope extensions are quoted separately and require written agreement from both parties before execution."
          )
        : t(
            "El precio es fijo y se expresa por escrito en pesos chilenos (CLP). Salvo pacto distinto, se paga 50% como anticipo a la firma y 50% contra entrega aprobada. Si el alcance acordado no cambia, el precio no cambia. Las ampliaciones de alcance se cotizan por separado y requieren acuerdo escrito de ambas partes antes de ejecutarse.",
            "The price is fixed and stated in writing in Chilean pesos (CLP). Unless otherwise agreed, 50% is paid upfront at signing and 50% upon approved delivery. If the agreed scope does not change, the price does not change. Scope extensions are quoted separately and require written agreement from both parties before execution."
          ),
  },
  {
    title: t("Hitos y entregas parciales", "Milestones and partial deliveries"),
    body: t(
      "El proyecto se divide en hitos con fechas definidas en la propuesta. En cada hito el Cliente recibe acceso a una versión funcional del avance para revisar y comentar. Las observaciones dentro del alcance se corrigen sin costo. El hito se entiende aprobado cuando el Cliente lo confirma por escrito (correo o mensaje es suficiente).",
      "The project is divided into milestones with dates defined in the proposal. At each milestone the Client gets access to a working version of the progress to review and comment on. Observations within scope are fixed at no cost. A milestone is deemed approved when the Client confirms it in writing (email or message is sufficient)."
    ),
  },
  {
    title: t("Propiedad intelectual", "Intellectual property"),
    body: t(
      "Pagado el saldo total, el código fuente, los diseños y los entregables desarrollados específicamente para el proyecto pasan a ser propiedad exclusiva del Cliente, incluyendo el repositorio Git, el dominio, el hosting y todas las credenciales. Las librerías de código abierto y los servicios de terceros mantienen sus propias licencias. El Desarrollador podrá mencionar el proyecto en su portafolio, salvo que el Cliente solicite confidencialidad por escrito.",
      "Once the full balance is paid, the source code, designs and deliverables developed specifically for the project become the Client's exclusive property, including the Git repository, domain, hosting and all credentials. Open-source libraries and third-party services keep their own licenses. The Developer may reference the project in its portfolio unless the Client requests confidentiality in writing."
    ),
  },
  {
    title: t("Confidencialidad", "Confidentiality"),
    body: t(
      "Toda información de negocio que el Cliente comparta durante el proyecto (datos, procesos, credenciales, estrategia) se trata como confidencial y no se comparte con terceros, ni durante el proyecto ni después de terminado.",
      "All business information the Client shares during the project (data, processes, credentials, strategy) is treated as confidential and is not shared with third parties, neither during the project nor after it ends."
    ),
  },
  {
    title: t("Garantía y soporte post-entrega", "Warranty and post-delivery support"),
    body: t(
      "Los errores de funcionamiento atribuibles al desarrollo (bugs) reportados dentro de los 30 días siguientes a la entrega se corrigen sin costo. La entrega incluye documentación y una guía de uso. La mantención continua, los cambios nuevos y las funcionalidades adicionales se acuerdan por separado, sin obligación de contratarlas con el Desarrollador.",
      "Functional errors attributable to the development (bugs) reported within 30 days of delivery are fixed at no cost. Delivery includes documentation and a user guide. Ongoing maintenance, new changes and additional features are agreed separately, with no obligation to hire the Developer for them."
    ),
  },
  {
    title: t("Plazos y término anticipado", "Timelines and early termination"),
    body: t(
      "Los plazos corren desde el pago del anticipo y la entrega del material necesario por parte del Cliente (contenidos, accesos, aprobaciones). Si el Cliente desiste una vez iniciado el proyecto, el anticipo cubre el trabajo ya ejecutado. Si el Desarrollador no puede continuar por causa propia, devuelve la parte del anticipo proporcional al trabajo no realizado y entrega todo el avance existente.",
      "Timelines run from the payment of the deposit and the delivery of necessary material by the Client (content, access, approvals). If the Client withdraws once the project has started, the deposit covers the work already done. If the Developer cannot continue for its own reasons, it refunds the portion of the deposit proportional to unfinished work and hands over all existing progress."
    ),
  },
  {
    title: t("Firma y formalización", "Signing and formalization"),
    body:
      mode === "intl"
        ? t(
            "El contrato puede firmarse de forma simple (firma electrónica o escaneada), modalidad plenamente vinculante entre las partes. A solicitud del Cliente, podrá elevarse a una forma más solemne (por ejemplo, ante notario o con firma electrónica avanzada), asumiendo el Cliente los costos asociados.",
            "The contract may be signed simply (electronic or scanned signature), a fully binding form between the parties. At the Client's request, it may be elevated to a more formal modality (for example, before a notary or with advanced electronic signature), with the Client assuming the associated costs."
          )
        : t(
            "El contrato puede firmarse de forma simple (firma electrónica o escaneada) o, si el Cliente lo prefiere, ante notario en Chile para darle fecha cierta y mayor formalidad. El costo notarial se divide entre las partes. Ambas modalidades son igualmente vinculantes.",
            "The contract may be signed simply (electronic or scanned signature) or, if the Client prefers, before a notary in Chile for certified date and added formality. The notary cost is split between the parties. Both options are equally binding."
          ),
  },
  {
    title: t("Legislación aplicable y controversias", "Governing law and disputes"),
    body:
      mode === "intl"
        ? t(
            "El contrato se rige por las leyes de la República de Chile. Las controversias se procurarán resolver de buena fe entre las partes y, a falta de acuerdo, se someterán a los tribunales de Santiago de Chile o a arbitraje, según lo que se defina en la propuesta. El idioma de referencia del contrato es el español, sin perjuicio de su traducción para facilidad del Cliente.",
            "The contract is governed by the laws of the Republic of Chile. Disputes shall be resolved in good faith between the parties and, failing agreement, submitted to the courts of Santiago de Chile or to arbitration, as defined in the proposal. The contract's reference language is Spanish, without prejudice to its translation for the Client's convenience."
          )
        : t(
            "El contrato se rige por las leyes de la República de Chile y cualquier controversia se somete a los tribunales ordinarios de justicia con asiento en Santiago de Chile.",
            "The contract is governed by the laws of the Republic of Chile and any dispute is submitted to the ordinary courts of justice seated in Santiago de Chile."
          ),
  },
];

export default function Contrato() {
  const [mode, setMode] = useState("cl"); // "cl" | "intl"

  useEffect(() => {
    document.title = t("Modelo de contrato · Maudev", "Contract template · Maudev");
  }, []);

  const printDate = new Date().toLocaleDateString(t("es-CL", "en-US"), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ord = t(ordinals.es, ordinals.en);
  const clauses = baseClauses(mode);

  const idLabel = mode === "intl"
    ? t("Pasaporte / ID tributaria", "Passport / Tax ID")
    : "RUT";

  const docTitle = t(
    "CONTRATO DE PRESTACIÓN DE SERVICIOS DE DESARROLLO DE SOFTWARE",
    "SOFTWARE DEVELOPMENT SERVICES AGREEMENT"
  );

  const recital = mode === "intl"
    ? t(
        "Con fecha __ de __________ de 20__, comparecen: por una parte, Maudev (Chile), en adelante «el Desarrollador»; y, por la otra, ____________________ , identificado con pasaporte o identificación tributaria N° ____________ , domiciliado en ____________ , en adelante «el Cliente». Ambas partes acuerdan celebrar el siguiente contrato de prestación de servicios de desarrollo de software, que se regirá por las cláusulas que siguen y por la propuesta técnica adjunta:",
        "On ____ ____________ 20__, the following parties appear: on one side, Maudev (Chile), hereinafter «the Developer»; and, on the other, ____________________ , identified with passport or tax ID No. ____________ , domiciled at ____________ , hereinafter «the Client». Both parties agree to enter into the following software development services agreement, governed by the clauses below and by the attached technical proposal:"
      )
    : t(
        "En Santiago de Chile, a __ de __________ de 20__, comparecen: por una parte, Maudev, RUT N° ____________ , en adelante «el Desarrollador»; y, por la otra, ____________________ , RUT N° ____________ , domiciliado en ____________ , en adelante «el Cliente». Ambas partes acuerdan celebrar el siguiente contrato de prestación de servicios de desarrollo de software, que se regirá por las cláusulas que siguen y por la propuesta técnica adjunta:",
        "In Santiago de Chile, on __ ____________ 20__, the following parties appear: on one side, Maudev, Tax ID No. ____________ , hereinafter «the Developer»; and, on the other, ____________________ , Tax ID No. ____________ , domiciled at ____________ , hereinafter «the Client». Both parties agree to enter into the following software development services agreement, governed by the clauses below and by the attached technical proposal:"
      );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Marca de agua — solo al imprimir/guardar PDF. Deja claro que es un
          modelo de referencia y no un contrato vigente (confidencialidad). */}
      <div className="print-watermark" aria-hidden="true">
        <span>{t("MODELO REFERENCIAL", "REFERENCE TEMPLATE")}</span>
      </div>

      <section className="pt-32 pb-24 print-doc">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Membrete: solo visible al imprimir / guardar como PDF */}
          <div className="print-only mb-8 pb-4" style={{ borderBottom: "2px solid #1a1a1a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em" }}>maudev</span>
              <span style={{ fontSize: "11px" }}>maudev.cl · contacto@maudev.cl</span>
            </div>
            <div style={{ fontSize: "11px", marginTop: "4px" }}>
              {t("Desarrollo web · Software a medida · Automatización — Chile", "Web development · Custom software · Automation — Chile")}
              {" · "}{printDate}
            </div>
          </div>

          {/* Encabezado (pantalla): contexto de transparencia + selector de variante */}
          <div className="mb-10 pb-8 border-b border-border/40">
            <span className="kicker print-hidden">{t("transparencia", "transparency")}</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-3 print-hidden">
              {t("Modelo de contrato", "Contract template")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl print-hidden">
              {t(
                "Esto es lo que firmas si trabajamos juntos — publicado completo, antes de que nos escribas. Es un modelo referencial: el contrato real de tu proyecto parte de aquí y se completa con los datos de las partes, el alcance y los hitos de tu propuesta.",
                "This is what you sign if we work together — published in full, before you even contact us. It's a reference template: your project's actual contract starts here and is completed with the parties' details, scope and milestones from your proposal."
              )}
            </p>

            {/* Selector Chile / Internacional */}
            <div className="mt-5 inline-flex rounded-lg border border-border p-1 bg-card print-hidden">
              <button
                onClick={() => setMode("cl")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === "cl" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("Cliente en Chile", "Client in Chile")}
              </button>
              <button
                onClick={() => setMode("intl")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === "intl" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("Cliente extranjero", "Foreign client")}
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-5 ml-0 sm:ml-3 inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors print-hidden align-top"
            >
              <Printer className="h-4 w-4" />
              {t("Imprimir o guardar como PDF", "Print or save as PDF")}
            </button>
          </div>

          {/* Documento del contrato */}
          <article>
            {/* Título legal del documento */}
            <h2 className="text-center text-base sm:text-lg font-bold tracking-tight mb-2 uppercase">
              {docTitle}
            </h2>
            <p className="text-center text-xs font-mono text-muted-foreground mb-8">
              {mode === "intl"
                ? t("Variante para cliente extranjero (USD / USDT)", "Variant for foreign client (USD / USDT)")
                : t("Variante para cliente en Chile (CLP)", "Variant for client in Chile (CLP)")}
            </p>

            {/* Comparecencia */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 print-clause">
              {recital}
            </p>

            {/* Cláusulas ordinales */}
            <ol className="space-y-6 list-none p-0 m-0">
              {clauses.map((c, i) => (
                <li key={i} className="print-clause">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground uppercase">{ord[i]}.</span>{" "}
                    <span className="font-semibold text-foreground">{c.title}.</span>{" "}
                    {c.body}
                  </p>
                </li>
              ))}
            </ol>

            {/* Firmas */}
            <div className="mt-12 pt-8 border-t border-border/40 print-clause">
              <p className="text-xs text-muted-foreground mb-8">
                {t(
                  "En señal de conformidad, las partes firman el presente contrato en dos ejemplares de igual tenor y fecha:",
                  "In agreement, the parties sign this contract in two copies of equal content and date:"
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { who: t("El Desarrollador", "The Developer"), name: "Maudev", id: mode === "intl" ? t("ID tributaria: ____________", "Tax ID: ____________") : "RUT: ____________" },
                  { who: t("El Cliente", "The Client"), name: "____________________", id: `${idLabel}: ____________` },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="h-12 border-b border-foreground/40" />
                    <p className="mt-2 text-sm font-semibold text-foreground">{s.who}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("Fecha:", "Date:")} ____ / ____ / 20__</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-10 text-xs text-muted-foreground font-mono">
              {t(
                "Este modelo es referencial y se ajusta a cada proyecto. No constituye asesoría legal.",
                "This template is for reference and is adjusted per project. It does not constitute legal advice."
              )}
            </p>
          </article>

          {/* CTA (no se imprime) */}
          <div className="mt-10 p-6 bg-card border border-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print-hidden">
            <p className="text-sm text-muted-foreground">
              {t("¿Te hace sentido cómo trabajamos?", "Does the way we work make sense to you?")}
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {CTA_LABEL}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
