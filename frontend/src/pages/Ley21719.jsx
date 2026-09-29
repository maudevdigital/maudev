import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Scale } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { capacidades, precioPlan } from "@/data/oferta";
import { useSeo } from "@/lib/useSeo";
import { trackAction } from "@/lib/MetaPixelTracker";

const oferta = capacidades["ley-21719"];
const VIGENCIA = new Date("2026-12-01T00:00:00-03:00");

// Cifras tomadas del texto de la ley. Nada de "cero riesgo" ni porcentajes de
// ahorro: si no se puede citar, no se publica.
const cambios = [
  { titulo: "Una agencia que fiscaliza", texto: "La Agencia de Protección de Datos Personales puede investigar, pedir antecedentes y sancionar." },
  { titulo: "Multas de hasta 20.000 UTM", texto: "Hasta 5.000 UTM las leves, 10.000 las graves y 20.000 las gravísimas. Si hay reincidencia, una empresa grande puede pagar un porcentaje de sus ventas." },
  { titulo: "Derechos ARCOP", texto: "Cualquier persona puede pedir acceso, rectificación, supresión, oposición y portabilidad de sus datos. Tienes que poder responder." },
  { titulo: "Aviso de vulneraciones", texto: "Una filtración de datos se notifica a la Agencia sin dilación, y a los afectados si el riesgo para ellos es alto." },
];

// El autodiagnóstico corre entero en el navegador: no se envía ni se guarda
// ninguna respuesta. Sería incoherente pedir datos para evaluar si alguien
// pide demasiados datos.
const preguntas = [
  "¿Tu sitio pide consentimiento antes de cargar cookies de análisis o publicidad (Google Analytics, píxel de Meta)?",
  "¿Cada formulario dice para qué se usan los datos y pide solo los necesarios?",
  "¿Tienes una política de privacidad que nombra a los proveedores que reciben los datos?",
  "¿Una persona puede pedirte ver, corregir o borrar sus datos por un canal definido?",
  "¿Sabes en qué servicios quedan guardados los datos de tus clientes (correo, planillas, CRM, hosting)?",
  "¿El acceso a esos datos está limitado a quien lo necesita, con contraseñas propias?",
  "¿Tienes respaldos y sabes qué harías si se filtran datos?",
  "¿Borras los datos cuando dejan de ser necesarios?",
];

const faqs = [
  { q: "¿La ley aplica a una PYME?", a: "Sí. Aplica a quien trata datos personales, sin importar el tamaño. Un formulario de contacto, una lista de clientes o un píxel de Meta ya son tratamiento de datos." },
  { q: "¿Maudev entrega asesoría legal?", a: "No. Hacemos la adecuación técnica: sitio, formularios, cookies, canal de derechos, seguridad y documentación. La interpretación legal y la redacción final de tus políticas le corresponden a un abogado, y te recomendamos uno si no tienes." },
  { q: "¿Desde cuándo rige?", a: "Desde el 1 de diciembre de 2026. La ley se publicó el 13 de diciembre de 2024 y dio dos años para adecuarse." },
  { q: "¿Mi sitio lo hizo otra persona, igual pueden adecuarlo?", a: "Sí. El diagnóstico parte revisando lo que existe; si algún cambio requiere acceso que no tienes, lo decimos en el informe." },
  { q: "¿Qué pasa después de la adecuación?", a: "Cada nuevo formulario, herramienta o proveedor puede volver a abrir una brecha. El plan con mantención revisa eso todos los meses y gestiona las solicitudes ARCOP que lleguen." },
];

function diasParaVigencia() {
  return Math.ceil((VIGENCIA - Date.now()) / 86400000);
}

function Autodiagnostico() {
  const [respuestas, setRespuestas] = useState({});
  const respondidas = Object.keys(respuestas).length;
  const faltan = preguntas.filter((_, i) => respuestas[i] === false).length;
  const listo = respondidas === preguntas.length;
  const plan = faltan >= 3 ? "ley-adecuacion" : "ley-diagnostico";

  const responder = (i, valor) => {
    const siguiente = { ...respuestas, [i]: valor };
    setRespuestas(siguiente);
    if (Object.keys(siguiente).length === preguntas.length) {
      trackAction("autodiagnostico_21719", { brechas: preguntas.filter((_, j) => siguiente[j] === false).length });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <ol className="grid gap-5">
        {preguntas.map((pregunta, i) => (
          <li key={pregunta} className="grid gap-3 border-b border-border pb-5 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-sm font-semibold leading-relaxed">{i + 1}. {pregunta}</p>
            <div className="flex gap-2" role="group" aria-label={`Respuesta a la pregunta ${i + 1}`}>
              {[["Sí", true], ["No", false]].map(([etiqueta, valor]) => (
                <button
                  key={etiqueta}
                  type="button"
                  aria-pressed={respuestas[i] === valor}
                  onClick={() => responder(i, valor)}
                  className={`h-10 min-w-16 rounded-lg border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    respuestas[i] === valor ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 border-t border-border pt-6" aria-live="polite">
        {!listo ? (
          <p className="text-sm text-muted-foreground">Respondidas {respondidas} de {preguntas.length}. Tus respuestas no se envían ni se guardan.</p>
        ) : (
          <div>
            <p className="text-lg font-bold">
              {faltan === 0
                ? "Vas bien encaminado. Un diagnóstico confirma que lo que respondiste se cumple en la práctica."
                : `Encontraste ${faltan} ${faltan === 1 ? "punto pendiente" : "puntos pendientes"} de ${preguntas.length}.`}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {faltan >= 3
                ? "Con varias brechas conviene ir directo a la adecuación: el diagnóstico va incluido."
                : "El diagnóstico te dice exactamente qué ajustar y cuánto cuesta, antes de gastar en adecuarte."}
            </p>
            <Link to={`/contacto?plan=${plan}`} className="btn btn-primary mt-5 h-12 px-6 text-sm" onClick={() => trackAction("cta_principal_click", { ubicacion: "autodiagnostico" })}>
              Quiero resolverlo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Ley21719() {
  const dias = diasParaVigencia();

  useSeo({
    title: "Adecuación a la Ley 21.719 para empresas y PYMEs · Maudev",
    description: "Adecuación técnica de tu sitio y formularios a la Ley 21.719 de datos personales: cookies, derechos ARCOP, seguridad y documentación. Precios publicados.",
    path: oferta.path,
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: oferta.nombre,
          provider: { "@type": "Organization", name: "Maudev", url: "https://maudev.cl" },
          areaServed: { "@type": "Country", name: "Chile" },
          url: `https://maudev.cl${oferta.path}`,
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
        },
      ],
    },
  });

  return (
    <PageShell>
      <main>
        <section className="pb-20 pt-30 sm:pt-36 lg:pb-28 lg:pt-42">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Ley 21.719" }]} />
            <span className="eyebrow">Ley 21.719 · Protección de datos personales</span>
            <h1 className="mt-5 max-w-[18ch] text-5xl font-extrabold leading-[0.99] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Tu sitio web también tiene que cumplir la nueva ley de datos.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {dias > 0
                ? `Rige desde el 1 de diciembre de 2026: quedan ${dias} días. `
                : "Rige desde el 1 de diciembre de 2026. "}
              Adecuamos tu sitio, formularios y herramientas para que traten los datos de tus clientes como exige la ley, con precio publicado.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#autodiagnostico" className="btn btn-primary h-14 px-8 text-base">Hacer el autodiagnóstico gratis</a>
              <a href="#planes" className="btn btn-ghost h-14 px-8 text-base">Ver planes</a>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-secondary/55">
          <div className="site-container">
            <span className="eyebrow">Qué cambia</span>
            <h2 className="section-title mt-4 max-w-[22ch]">Hasta ahora la ley de datos casi no se fiscalizaba. Eso se acaba.</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {cambios.map(({ titulo, texto }) => (
                <article key={titulo} className="border-t border-border pt-5">
                  <h3 className="text-lg font-bold">{titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="autodiagnostico" className="section-pad scroll-mt-24">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="eyebrow">Autodiagnóstico gratis</span>
              <h2 className="section-title mt-4">¿Qué tan lejos estás? Ocho preguntas, dos minutos.</h2>
              <p className="mt-5 text-muted-foreground">Responde por tu sitio web y las herramientas donde guardas datos de clientes.</p>
            </div>
            <Autodiagnostico />
          </div>
        </section>

        <section id="planes" className="section-pad scroll-mt-24 border-y border-border bg-secondary/55">
          <div className="site-container">
            <span className="eyebrow">Planes</span>
            <h2 className="section-title mt-4">Precio publicado, alcance por escrito.</h2>
            <p className="mt-4 text-sm text-muted-foreground">Valores netos, más IVA. El monto final de la adecuación se fija en el diagnóstico.</p>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {oferta.planes.map((plan) => (
                <article key={plan.id} className={`flex flex-col rounded-2xl border bg-card p-6 sm:p-8 ${plan.destacado ? "border-primary" : "border-border"}`}>
                  {plan.destacado && <span className="eyebrow">Recomendado</span>}
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{plan.nombre}</h3>
                  <p className="mt-3 text-xl font-bold text-primary">{precioPlan(plan)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.resumen}</p>
                  <ul className="mb-8 mt-6 grid gap-3 text-sm">
                    {plan.incluye.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/contacto?plan=${plan.id}`}
                    onClick={() => trackAction("cta_principal_click", { ubicacion: `plan-${plan.id}` })}
                    className={`btn mt-auto h-12 px-6 text-sm ${plan.destacado ? "btn-primary" : "btn-ghost"}`}
                  >
                    Solicitar {plan.nombre.toLowerCase()}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="section-title mt-4">Somos ingeniería, no un estudio jurídico.</h2>
            </div>
            <div className="text-lg leading-relaxed text-muted-foreground">
              <p>Intervenimos lo que la ley toca en la práctica: el código del sitio, los formularios, las cookies, dónde quedan guardados los datos y quién puede verlos.</p>
              <p className="mt-4">No redactamos contratos ni representamos a nadie ante la Agencia. Te entregamos la documentación técnica lista para que tu abogado la revise y, si no tienes uno, te recomendamos a quién acudir.</p>
              <p className="mt-4">Este mismo sitio está adecuado: revisa nuestra <Link to="/privacidad" className="font-semibold text-primary underline-offset-4 hover:underline">política de privacidad</Link>.</p>
            </div>
          </div>
        </section>

        <section className="section-pad border-t border-border">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div><span className="eyebrow">Preguntas</span><h2 className="section-title mt-4">Lo que más nos preguntan.</h2></div>
            <div className="border-t border-border">
              {faqs.map((faq) => (
                <details key={faq.q} className="faq-item group">
                  <summary><span>{faq.q}</span></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
    </PageShell>
  );
}
