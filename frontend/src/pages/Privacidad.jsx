import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Shield } from "lucide-react";
import { useSeo } from "@/lib/useSeo";

// ─────────────────────────────────────────────────────────────────────────────
// POLÍTICA DE PRIVACIDAD
//
// Escrita para la Ley 21.719 (publicada 13-dic-2024, en vigencia el 1 de
// diciembre de 2026), que reemplaza la Ley 19.628 de 1999. Se redacta ya en
// clave 21.719 para no tener que rehacerla en diciembre.
//
// La 21.719 exige que esta política declare, como mínimo:
//   responsable · finalidades · BASES DE LICITUD · destinatarios ·
//   transferencias internacionales · plazos de conservación · cómo ejercer
//   los derechos del titular.
//
// ⚠️ MANTENER SINCRONIZADO: la lista de encargados (sección 05) tiene que
// reflejar los servicios que REALMENTE tocan datos. Ya se desfasó dos veces:
// primero declaraba Supabase después de migrar a n8n, y luego Telegram después
// de migrar al worker. Hoy los leads van a workers/lead-intake/: se guardan en
// Cloudflare D1 y se avisan por correo vía Resend. Si eso cambia, cambia acá.
//
// ⚠️ REVISAR CON ABOGADO antes de publicar. Esto es una base técnica bien
// informada, no asesoría legal.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL = "contacto@maudev.cl";
const mail = (
  <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
);

const sections = [
  {
    num: "01",
    title: "Quién es responsable de tus datos",
    content: (
      <>
        <p>
          {"Maudev, con domicilio en la Región de Valparaíso, Chile, es el responsable del tratamiento de los datos personales que se recogen a través de este sitio. Para cualquier tema de privacidad puedes escribir a"}{" "}
          {mail}.
        </p>
        <p>
          Esta política se rige por la Ley N° 21.719 sobre Protección de Datos Personales de Chile, que entra en vigencia el 1 de diciembre de 2026 y reemplaza a la Ley N° 19.628. Hasta esa fecha sigue aplicando la Ley N° 19.628; hemos redactado esta política conforme al estándar más exigente de ambas.
        </p>
        <p>
          Si resides en el Espacio Económico Europeo o en el Reino Unido, te aplican además los derechos del RGPD, y esta política los respeta.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Qué datos recogemos",
    content: (
      <>
        <p className="font-medium text-foreground">
          Los que tú nos entregas:
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          {[
            "Nombre y apellido",
            "Correo electrónico",
            "Teléfono o WhatsApp",
            "El mensaje o descripción del proyecto que escribes",
            "Rubro o tipo de negocio, si lo indicas",
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>

        <p className="mt-4 font-medium text-foreground">
          Los que se recogen solos al navegar:
        </p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          {[
            "Dirección IP y país aproximado",
            "Navegador, sistema operativo y tipo de dispositivo",
            "Páginas visitadas, tiempo en el sitio y desde dónde llegaste",
            "Parámetros de campaña (utm_source, utm_medium, utm_campaign y similares)",
          ].map((x, i) => <li key={i}>{x}</li>)}
        </ul>

        <p className="mt-4">
          No pedimos ni queremos datos sensibles: no necesitamos tu RUT para cotizar, ni datos de salud, origen étnico, afiliación política o sindical, orientación sexual ni datos biométricos. Tampoco procesamos datos de menores de 14 años a sabiendas. Si nos envías información sensible por tu cuenta, la eliminaremos.
        </p>
        <p>
          Los datos de pago (tarjeta, cuenta bancaria) nunca pasan por este sitio: los maneja directamente la pasarela o el banco.
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: "Para qué los usamos y con qué base legal",
    content: (
      <>
        <p>
          La Ley 21.719 exige declarar la base de licitud de cada tratamiento. Estas son las nuestras:
        </p>
        <div className="mt-3 space-y-3">
          {[
            {
              use: "Responder tu consulta y preparar una cotización",
              basis: "Consentimiento",
              note: "Lo das al enviar el formulario o escribirnos. Puedes revocarlo cuando quieras.",
            },
            {
              use: "Ejecutar el proyecto contratado y darte soporte",
              basis: "Ejecución de un contrato",
              note: "Sin estos datos no podemos entregarte el servicio que compraste.",
            },
            {
              use: "Emitir boleta o factura y llevar contabilidad",
              basis: "Obligación legal",
              note: "Normativa tributaria del SII. No podemos borrar estos datos antes del plazo legal.",
            },
            {
              use: "Medir qué campañas y páginas funcionan, y proteger el sitio",
              basis: "Consentimiento (analítica y publicidad) · Interés legítimo (seguridad)",
              note: "La analítica y los píxeles publicitarios solo se activan si los aceptas. La protección contra ataques y abuso se apoya en interés legítimo, ponderado para no afectar tus derechos.",
            },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-3">
              <p className="text-sm font-medium text-foreground">{r.use}</p>
              <p className="mt-1 text-xs font-mono text-primary">{r.basis}</p>
              <p className="mt-1.5 text-xs">{r.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          No vendemos, arrendamos ni cedemos tus datos. No tomamos decisiones automatizadas que te afecten legalmente, ni hacemos perfilamiento para negarte un servicio.
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: "Cuánto tiempo los guardamos",
    content: (
      <>
        <div className="space-y-2">
          {[
            { k: "Formularios guardados en nuestra base de datos", v: "12 meses" },
            { k: "Datos de clientes con proyecto ejecutado", v: "Mientras dure la relación y 5 años después" },
            { k: "Documentos tributarios (boletas, facturas)", v: "6 años, por obligación del SII" },
            { k: "Registros de analítica", v: "14 meses (configuración de GA4)" },
            { k: "Solicitudes de derechos (constancia)", v: "24 meses" },
            { k: "Registro de tu elección de cookies (sin datos personales)", v: "24 meses" },
          ].map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-4 border-b border-border/30 pb-2 last:border-b-0">
              <span>{r.k}</span>
              <span className="shrink-0 font-mono text-xs text-foreground">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3">
          Cumplido el plazo, se eliminan o se anonimizan de forma irreversible. Si pides la eliminación antes, la hacemos, salvo en lo que la ley tributaria nos obliga a conservar (y en ese caso te decimos exactamente qué queda y por qué).
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: "Quién más toca tus datos",
    content: (
      <>
        <p>
          Trabajamos con los siguientes encargados de tratamiento. Cada uno accede solo a lo necesario para su función:
        </p>
        <ul className="mt-3 space-y-2.5">
          {[
            {
              name: "Cloudflare",
              desc: "Hosting del sitio, CDN y protección contra ataques",
              loc: "EE.UU. / red global",
            },
            {
              name: "Cloudflare D1",
              desc: "Base de datos donde se guardan los formularios que envías",
              loc: "EE.UU. / red global",
            },
            {
              name: "Resend",
              desc: "Envío del correo que nos avisa de tu contacto",
              loc: "EE.UU.",
            },
            {
              name: "Meta",
              desc: "Píxel y API de conversiones, para medir publicidad",
              loc: "EE.UU.",
            },
            {
              name: "Google Analytics 4",
              desc: "Analítica de tráfico agregada",
              loc: "EE.UU.",
            },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 shrink-0 rounded border border-border/60 bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {item.name}
              </span>
              <span className="text-muted-foreground">
                {item.desc} · <span className="text-xs">{item.loc}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Además podemos entregar datos a la autoridad cuando exista una orden judicial o una obligación legal que nos obligue a hacerlo.
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: "Transferencias fuera de Chile",
    content: (
      <>
        <p>
          Varios de los servicios anteriores están alojados fuera de Chile, principalmente en Estados Unidos. Eso significa que tus datos cruzan la frontera.
        </p>
        <p>
          La Ley 21.719 permite estas transferencias cuando el país de destino ofrece un nivel de protección equivalente, o cuando existe un contrato con cláusulas que garanticen esa protección. Nos apoyamos en los acuerdos de tratamiento de datos y cláusulas contractuales tipo que cada uno de estos proveedores ofrece, que es el mecanismo estándar y el más usado en la práctica.
        </p>
        <p>
          Si necesitas saber la ubicación exacta del servidor donde corre nuestra automatización, escríbenos y te lo confirmamos por escrito.
        </p>
      </>
    ),
  },
  {
    num: "07",
    title: "Cookies y seguimiento",
    content: (
      <>
        <p>
          Usamos tres tipos de cookies, y solo el primero es obligatorio:
        </p>
        <div className="mt-3 space-y-2">
          {[
            {
              k: "Técnicas",
              v: "Hacen funcionar el sitio: recuerdan tu preferencia de tema claro/oscuro y protegen contra abuso. No requieren consentimiento.",
            },
            {
              k: "Analíticas",
              v: "Google Analytics 4. Nos dicen qué páginas sirven y cuáles no. Solo se activan si aceptas.",
            },
            {
              k: "Publicitarias",
              v: "Meta Pixel y Meta CAPI. Miden si un anuncio se convirtió en contacto. Solo se activan si aceptas.",
            },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-3">
              <p className="font-mono text-xs text-primary">{r.k}</p>
              <p className="mt-1 text-xs">{r.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">
          Puedes cambiar tu decisión cuando quieras desde el aviso de cookies, o bloquearlas desde tu navegador. Si las bloqueas, el sitio sigue funcionando igual.
        </p>
      </>
    ),
  },
  {
    num: "08",
    title: "Tus derechos",
    content: (
      <>
        <p>
          La Ley 21.719 te reconoce estos derechos sobre tus datos:
        </p>
        <div className="mt-3 space-y-2">
          {[
            { k: "Acceso", v: "Pedir una copia de todo lo que tenemos sobre ti." },
            { k: "Rectificación", v: "Corregir lo que esté equivocado o incompleto." },
            { k: "Supresión", v: "Pedir que lo borremos, salvo lo que la ley nos obligue a guardar." },
            { k: "Oposición", v: "Negarte a un tratamiento concreto, como la analítica o la publicidad." },
            { k: "Portabilidad", v: "Recibir tus datos en un formato estructurado y reutilizable, o que los enviemos a otro proveedor." },
            { k: "Bloqueo", v: "Suspender temporalmente el uso de tus datos mientras se resuelve un reclamo." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-b-0">
              <span className="mt-0.5 w-24 shrink-0 font-mono text-xs text-primary">{r.k}</span>
              <span className="text-sm">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-4">
          Para ejercerlos, usa el <Link to="/eliminacion-datos#solicitud" className="text-primary hover:underline">formulario de solicitud</Link> o escribe a {mail}.{" "}
          Respondemos dentro de 30 días corridos. No cobramos por esto. Solo te pediremos verificar tu identidad, para no entregarle tus datos a otra persona.
        </p>
        <p>
          Si no quedas conforme con nuestra respuesta, puedes reclamar ante la Agencia de Protección de Datos Personales, el organismo fiscalizador creado por la Ley 21.719.
        </p>
        <p className="mt-2">
          <Link to="/eliminacion-datos" className="text-primary hover:underline">
            Ver el procedimiento paso a paso para eliminar tus datos →
          </Link>
        </p>
      </>
    ),
  },
  {
    num: "09",
    title: "Seguridad y qué pasa si hay una brecha",
    content: (
      <>
        <p>
          El sitio va sobre HTTPS, el acceso a los sistemas está restringido y usa autenticación en dos pasos, y guardamos el mínimo de datos necesario. Ningún sistema es infalible, así que también tenemos un plan para cuando algo falle.
        </p>
        <p>
          Si ocurre una brecha que afecte tus datos, la Ley 21.719 nos obliga a notificarla a la Agencia de Protección de Datos Personales sin demora, y a más tardar dentro de 72 horas de haberla detectado. Si el riesgo para ti es alto, te avisaremos directamente por correo, explicando qué pasó, qué datos se vieron afectados y qué te recomendamos hacer.
        </p>
      </>
    ),
  },
  {
    num: "10",
    title: "Cambios a esta política",
    content: (
      <p>
        Si esta política cambia de forma relevante, actualizamos la fecha de arriba y, cuando el cambio te afecte de manera significativa, te avisamos por correo si tenemos uno tuyo. Te recomendamos revisarla antes de enviarnos datos nuevos.
      </p>
    ),
  },
];

export default function Privacidad() {
  useSeo({
    title: "Política de privacidad · Maudev",
    description: "Cómo Maudev recopila, utiliza, conserva y protege los datos personales de quienes usan el sitio.",
    path: "/privacidad",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="contenido" tabIndex={-1} className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 pb-8 border-b border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="kicker">legal</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                <Shield className="h-3 w-3" />
                Ley 21.719
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mt-1 mb-3">
              Política de privacidad
            </h1>
            <p className="text-sm text-muted-foreground">
              {"Última actualización:"}{" "}
              <strong className="text-foreground">
                {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Qué datos recogemos, con qué base legal, quién más los ve y cómo pedir que los borremos. Sin letra chica.
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
              ¿Buscas los términos y condiciones?
            </p>
            <Link to="/terminos" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
              Ver términos →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
