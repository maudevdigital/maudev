import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
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
    title: "Quiénes somos y qué aceptas",
    content: (
      <>
        <p>
          {"Maudev es un proveedor de servicios de desarrollo de software y automatización de procesos, con domicilio en la Región de Valparaíso, Chile. Contacto:"}{" "}
          {mail}.
        </p>
        <p>
          Al usar este sitio o contratar un servicio aceptas estos términos. Si contratas en representación de una empresa, declaras tener facultades para obligarla.
        </p>
        <p>
          Cada proyecto se formaliza además en una cotización o propuesta escrita. Si algo de esa propuesta contradice estos términos, manda la propuesta.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Qué servicios ofrecemos",
    content: (
      <>
        <ul className="space-y-1.5 list-disc pl-5">
          {[
            "Automatización de procesos con n8n e inteligencia artificial",
            "Desarrollo de sitios web y software a medida",
            "Integraciones entre sistemas (WhatsApp, calendarios, pasarelas de pago, planillas, CRM)",
            "Workflows de n8n listos para importar, entregados como archivo .json",
            "Instalación y configuración de n8n en tu propio servidor",
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>
        <p className="mt-3">
          El alcance exacto de cada trabajo queda por escrito en la propuesta antes de empezar. Lo que no está en la propuesta no está incluido, y se cotiza aparte.
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: "Precios, monedas e impuestos",
    content: (
      <>
        <p className="font-medium text-foreground">{"Si estás en Chile"}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>{"Los precios se expresan en pesos chilenos (CLP)."}</li>
          <li>{"Se agrega IVA del 19% cuando corresponde, y se indica siempre antes de que pagues."}</li>
          <li>{"Emitimos boleta o factura electrónica del SII por cada pago."}</li>
          <li>{"Medios de pago: transferencia bancaria."}</li>
        </ul>

        <p className="mt-4 font-medium text-foreground">{"Si estás fuera de Chile"}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>{"Los precios se expresan en dólares estadounidenses (USD)."}</li>
          <li>
            La operación constituye exportación de servicios, por lo que no se aplica IVA chileno. Cualquier impuesto, retención o arancel en tu país es de tu cargo.
          </li>
          <li>
            Aceptamos transferencia internacional y stablecoins (USDT). En el caso de stablecoins, 1 USDT se considera equivalente a 1 USD al momento de emitir la cotización, y las comisiones de red son de tu cargo.
          </li>
          <li>{"Emitimos el documento tributario que corresponda a una exportación de servicios."}</li>
        </ul>

        <p className="mt-4">
          Forma de pago por defecto: 50% para iniciar y 50% contra entrega. Los productos digitales de descarga inmediata se pagan 100% por adelantado. Los precios de una cotización se mantienen vigentes 15 días corridos.
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: "Plazos y responsabilidades de cada parte",
    content: (
      <>
        <p>
          El plazo se acuerda por escrito en la propuesta y empieza a correr desde que recibimos el primer pago y los accesos o contenidos necesarios para trabajar.
        </p>
        <p>
          Necesitamos de tu parte: los accesos a las cuentas que se van a integrar, los contenidos (textos, imágenes, logos) y respuesta a nuestras consultas en un plazo razonable. Si el proyecto se detiene esperando algo tuyo, el plazo se extiende por el mismo tiempo. Si la espera supera 60 días, podemos cerrar el proyecto y facturar lo avanzado.
        </p>
        <p>
          Garantía: 30 días corridos desde la entrega para corregir sin costo cualquier falla de lo acordado en la propuesta. La garantía cubre errores nuestros; no cubre cambios de alcance, ni fallas causadas por servicios de terceros, ni modificaciones que hagas tú o alguien más al código entregado.
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: "Derecho de retracto, cancelaciones y reembolsos",
    content: (
      <>
        <p className="font-medium text-foreground">
          Derecho de retracto (clientes en Chile)
        </p>
        <p className="mt-1">
          El artículo 3 bis de la Ley N° 19.496 otorga a los consumidores 10 días corridos para desistir de un contrato celebrado a distancia, contados desde la contratación del servicio y antes de que este se haya prestado.
        </p>
        <p className="mt-2">
          Ese derecho NO aplica, conforme a la misma ley y su reglamento, cuando:
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>
            El servicio ya fue prestado, total o parcialmente, con tu conformidad.
          </li>
          <li>
            El desarrollo fue hecho según tus especificaciones o personalizado para tu negocio, que es el caso del software a medida y de las automatizaciones configuradas para ti.
          </li>
          <li>
            Se trata de un producto digital ya descargado o entregado, como un archivo .json de workflow.
          </li>
        </ul>
        <p className="mt-3">
          {"Si retractas dentro de plazo y el caso no cae en las exclusiones, devolvemos lo pagado descontando únicamente los servicios ya prestados al momento del retracto. Para ejercerlo, escríbenos a"}{" "}
          {mail}.
        </p>

        <p className="mt-4 font-medium text-foreground">{"Cancelación de un proyecto"}</p>
        <p className="mt-1">
          Puedes cancelar en cualquier momento. El primer pago cubre el trabajo ya realizado y no se reembolsa una vez iniciado el desarrollo. Te entregamos lo avanzado hasta ese punto.
        </p>

        <p className="mt-4 font-medium text-foreground">{"Si no cumplimos"}</p>
        <p className="mt-1">
          Si no entregamos lo acordado en la propuesta y no lo podemos corregir dentro de la garantía, devolvemos lo pagado por la parte no entregada. Eso aplica sin importar dónde estés.
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: "Propiedad intelectual",
    content: (
      <>
        <p>
          Una vez pagado el total, el código y los archivos desarrollados específicamente para tu proyecto quedan de tu propiedad, junto con las credenciales y los repositorios. Puedes modificarlos, migrarlos o entregárselos a otro proveedor sin pedirnos permiso.
        </p>
        <p>
          Quedan fuera: las librerías y el software de terceros, que se rigen por sus propias licencias, y las herramientas y componentes genéricos reutilizables que traemos de proyectos anteriores, sobre los que conservamos nuestros derechos y que puedes seguir usando dentro de tu proyecto sin límite de tiempo.
        </p>
        <p>
          Salvo que nos pidas lo contrario, podemos mencionar el proyecto y mostrar capturas en nuestro portafolio. Si prefieres que no, basta con decirlo.
        </p>
      </>
    ),
  },
  {
    num: "07",
    title: "Límites de responsabilidad",
    content: (
      <>
        <p>
          Entregamos el trabajo con el cuidado profesional que corresponde, pero no podemos garantizar resultados comerciales: no prometemos una cantidad de ventas, de leads ni una posición determinada en Google.
        </p>
        <p>
          No respondemos por caídas o cambios de servicios de terceros de los que dependa la solución (WhatsApp, Meta, Google, pasarelas de pago, proveedores de IA), ni por fallas derivadas de modificaciones hechas por ti o por terceros al código entregado, ni por pérdidas indirectas o lucro cesante.
        </p>
        <p>
          En cualquier caso, nuestra responsabilidad total se limita al monto que hayas pagado por el servicio en cuestión. Nada de lo anterior limita los derechos que la ley te reconoce como consumidor y que no pueden renunciarse anticipadamente.
        </p>
      </>
    ),
  },
  {
    num: "08",
    title: "Datos personales",
    content: (
      <>
        <p>
          El tratamiento de datos personales se rige por nuestra política de privacidad, redactada conforme a la Ley N° 21.719.
        </p>
        <p>
          Cuando un proyecto implique que tratemos datos de tus propios clientes (por ejemplo, una automatización que recibe contactos), lo hacemos como encargado de tratamiento por cuenta tuya: tú sigues siendo el responsable frente a esas personas, y firmamos el acuerdo de tratamiento que necesites.
        </p>
        <p className="mt-2">
          <Link to="/privacidad" className="text-primary hover:underline">
            Leer la política de privacidad →
          </Link>
        </p>
      </>
    ),
  },
  {
    num: "09",
    title: "Cambios a estos términos",
    content: (
      <p>
        Podemos actualizar estos términos. Los proyectos ya contratados se rigen por la versión vigente al momento de firmar la propuesta, así que un cambio posterior no te afecta retroactivamente.
      </p>
    ),
  },
  {
    num: "10",
    title: "Ley aplicable y dónde se resuelven las disputas",
    content: (
      <>
        <p>
          Estos términos se rigen por la ley chilena.
        </p>
        <p>
          Si eres consumidor con domicilio en Chile, conservas el derecho de recurrir al SERNAC y a los tribunales que la Ley N° 19.496 disponga; nada acá te obliga a renunciar a ese fuero.
        </p>
        <p>
          Si contratas desde fuera de Chile, las partes se someten a los tribunales ordinarios de Valparaíso, Chile, sin perjuicio de que intentemos primero resolver cualquier diferencia de buena fe y por escrito. Si tu legislación local te otorga derechos irrenunciables como consumidor, esos derechos se mantienen.
        </p>
      </>
    ),
  },
  {
    num: "11",
    title: "Contacto",
    content: (
      <p>
        {"Para cualquier duda sobre estos términos, sobre una cotización o para ejercer el derecho de retracto:"}{" "}
        {mail}.{" "}
        Respondemos dentro de 1 día hábil.
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
              Términos y condiciones
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Última actualización:"}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cómo se cotiza, cómo se paga, qué pasa si te arrepientes y de quién queda el código. Aplica tanto si estás en Chile como si contratas desde el extranjero.
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
              ¿Buscas la política de privacidad?
            </p>
            <Link to="/privacidad" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
              Ver política →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
