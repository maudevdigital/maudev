import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Trash2 } from "lucide-react";
import { useSeo } from "@/lib/useSeo";
import SolicitudDerechos from "@/components/landing/SolicitudDerechos";

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
    title: "Qué datos podemos tener sobre ti",
    content: (
      <>
        <p>
          Dependiendo de cómo hayas llegado a nosotros, podemos tener:
        </p>
        <Bullets items={[
          "Los datos que escribiste en el formulario de contacto: nombre, correo, teléfono y tu mensaje.",
          "La conversación que tuvimos por WhatsApp, si nos escribiste por ahí.",
          "Los datos de facturación, si llegamos a trabajar juntos.",
          "Datos de navegación anónimos o pseudonimizados, si aceptaste las cookies de analítica o publicidad.",
        ]} />
        <p className="mt-3 text-sm">
          No vendemos estos datos ni los usamos para publicidad sin tu consentimiento.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Cómo pedir que los eliminemos",
    content: (
      <>
        <p>
          {"Puedes pedirlo en cualquier momento y no tienes que justificar el motivo. Escríbenos a"}{" "}
          {mail} {"con el asunto"} <strong className="text-foreground">
            {"\"Eliminación de datos\""}
          </strong>{" "}
          e incluye:
        </p>
        <Bullets items={[
          "El correo o teléfono con el que nos contactaste, para poder encontrarte en nuestros registros.",
          "Qué quieres exactamente: eliminar todo, o solo dejar de recibir comunicaciones.",
        ]} />
        <p className="mt-3 text-sm">
          Te confirmamos por el mismo medio dentro de 5 días hábiles, y el plazo máximo legal de respuesta es de 30 días corridos. El trámite es gratuito. Solo te pediremos verificar tu identidad, para no entregarle tus datos a otra persona.
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: "Qué no podemos borrar, y por qué",
    content: (
      <>
        <p>
          Si trabajamos juntos y emitimos boleta o factura, la normativa tributaria del SII nos obliga a conservar esos documentos por 6 años. Eso incluye tu nombre o razón social y el monto de la operación.
        </p>
        <p>
          Fuera de eso, borramos todo. Y te decimos exactamente qué queda y hasta cuándo, para que no te quedes con la duda.
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: "Tus otros derechos, no solo el de borrar",
    content: (
      <>
        <p>
          La Ley N° 21.719 te da más opciones que la eliminación. Se piden todas al mismo correo:
        </p>
        <div className="mt-3 space-y-2">
          {[
            { k: "Acceso", v: "Una copia de todo lo que tenemos sobre ti." },
            { k: "Rectificación", v: "Corregir un dato equivocado o incompleto." },
            { k: "Oposición", v: "Que dejemos de usar tus datos para un fin concreto, como la analítica." },
            { k: "Portabilidad", v: "Recibirlos en un formato reutilizable, o que los enviemos a otro proveedor." },
            { k: "Bloqueo", v: "Congelar el uso de tus datos mientras se resuelve un reclamo." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-b-0">
              <span className="mt-0.5 w-24 shrink-0 font-mono text-xs text-primary">{r.k}</span>
              <span className="text-sm">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">
          Si no quedas conforme con nuestra respuesta, puedes reclamar ante la Agencia de Protección de Datos Personales.
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: "Datos que quedan en plataformas de terceros",
    content: (
      <>
        <p>
          Hay datos que no están en nuestros sistemas y que por lo tanto no podemos borrar por ti:
        </p>
        <Bullets items={[
          "Si nos escribiste por WhatsApp, la conversación también queda en tu teléfono y en los servidores de Meta, según sus propias políticas.",
          "Si comentaste o reaccionaste en nuestras publicaciones de Instagram o Facebook, esa actividad la administra Meta. Puedes borrarla desde las opciones de privacidad de cada app.",
          "Las cookies de analítica y publicidad se borran desde tu navegador, o rechazándolas en nuestro aviso de cookies.",
        ]} />
        <p className="mt-3 text-sm">
          Sí podemos pedirle a Meta que elimine los eventos de conversión asociados a ti que nosotros les enviamos. Indícalo en tu solicitud y lo gestionamos.
        </p>
      </>
    ),
  },
];

export default function EliminacionDatos() {
  useSeo({
    title: "Eliminación de datos · Maudev",
    description: "Cómo solicitar la eliminación, rectificación o portabilidad de tus datos personales en Maudev.",
    path: "/eliminacion-datos",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 pb-8 border-b border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="kicker">legal</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                <Trash2 className="h-3 w-3" />
                Eliminación de datos
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mt-1 mb-3">
              Cómo eliminar tus datos
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Última actualización:"}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Un correo y listo. Acá está qué datos podemos tener, cómo pedir que los borremos y qué estamos obligados a conservar.
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

          {/* Canal ARCOP: queda registrado con folio y fecha límite */}
          <section id="solicitud" className="mt-10 scroll-mt-28">
            <h2 className="mb-2 text-xl font-bold">Ejercer tus derechos</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Acceso, rectificación, supresión, oposición, portabilidad o bloqueo. Recibes un folio y respondemos dentro de 30 días corridos. También puedes escribir a {mail}.
            </p>
            <SolicitudDerechos />
          </section>

          {/* Links legales */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/privacidad" className="text-muted-foreground hover:text-primary">
              Política de privacidad
            </Link>
            <Link to="/terminos" className="text-muted-foreground hover:text-primary">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
