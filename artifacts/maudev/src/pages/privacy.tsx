import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

const LAST_UPDATED = "6 de abril de 2025";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/20">
        <div className="container max-w-screen-lg px-4 md:px-8 py-10">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">INICIO</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">POLÍTICA DE PRIVACIDAD</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Política de Privacidad</h1>
          <p className="font-mono text-xs text-muted-foreground">Última actualización: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-screen-lg px-4 md:px-8 py-16">
        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Responsable del Tratamiento</h2>
            <p>
              MAUDEV (en adelante, "nosotros", "nuestro" o "la Empresa") es el responsable del tratamiento de los datos personales recopilados a través de <strong className="text-foreground">maudev.cl</strong>. Operamos desde Santiago, Chile, y cumplimos con la <strong className="text-foreground">Ley N.° 19.628 sobre Protección de la Vida Privada</strong> de la República de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Datos que Recopilamos</h2>
            <p>Recopilamos la siguiente información personal:</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Datos de cuenta",
                  items: ["Nombre y apellido", "Dirección de correo electrónico", "Contraseña (almacenada en formato cifrado vía Clerk)"],
                },
                {
                  title: "Datos de transacción",
                  items: ["Historial de compras", "Productos adquiridos", "Fechas de transacción"],
                },
                {
                  title: "Datos de suscripción al newsletter",
                  items: ["Nombre", "Correo electrónico"],
                },
                {
                  title: "Datos técnicos",
                  items: ["Dirección IP", "Tipo de navegador", "Sistema operativo", "Páginas visitadas y tiempo de sesión (datos de uso anónimos)"],
                },
              ].map((group) => (
                <div key={group.title} className="border border-border/30 bg-card/30 p-4">
                  <p className="font-semibold text-foreground mb-2">{group.title}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Finalidad del Tratamiento</h2>
            <p>Utilizamos sus datos personales para:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
              <li>Gestionar su cuenta y acceso a los productos adquiridos.</li>
              <li>Procesar y confirmar sus compras.</li>
              <li>Enviarle comunicaciones transaccionales (confirmaciones de pago, acceso a productos).</li>
              <li>Enviar actualizaciones del newsletter, solo si usted se suscribió voluntariamente.</li>
              <li>Mejorar el funcionamiento del Sitio y la experiencia del usuario.</li>
              <li>Cumplir con obligaciones legales y tributarias aplicables en Chile.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Compartición de Datos con Terceros</h2>
            <p>
              MAUDEV <strong className="text-foreground">no vende ni alquila</strong> sus datos personales a terceros. Podemos compartir datos con proveedores de servicios de confianza, únicamente en la medida necesaria para operar el Sitio:
            </p>
            <div className="mt-4 space-y-2">
              {[
                { name: "Clerk", role: "Autenticación y gestión de identidad", url: "https://clerk.com/privacy" },
                { name: "Procesadores de pago", role: "Gestión segura de transacciones financieras" },
                { name: "Proveedores de hosting", role: "Alojamiento de la infraestructura del Sitio" },
              ].map((partner) => (
                <div key={partner.name} className="border border-border/30 bg-card/30 px-4 py-3 flex items-start gap-4">
                  <div className="font-mono text-xs font-semibold text-foreground min-w-[120px]">{partner.name}</div>
                  <div className="text-sm">{partner.role}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm">
              Todos los proveedores están contractualmente obligados a proteger sus datos y a no utilizarlos para fines distintos a los descritos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración. Esto incluye:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
              <li>Transmisión de datos mediante <strong className="text-foreground">HTTPS/TLS</strong>.</li>
              <li>Contraseñas almacenadas en formato <strong className="text-foreground">cifrado irreversible</strong> (bcrypt) a través de Clerk.</li>
              <li>No almacenamos datos de tarjetas de crédito en nuestros servidores.</li>
              <li>Acceso a datos de usuarios restringido a personal autorizado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Cookies y Tecnologías de Seguimiento</h2>
            <p>
              El Sitio utiliza cookies necesarias para el funcionamiento de la sesión y la autenticación. No utilizamos cookies de seguimiento publicitario de terceros.
            </p>
            <p className="mt-3">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de algunas funciones del Sitio (como el inicio de sesión).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Sus Derechos</h2>
            <p>De acuerdo con la Ley N.° 19.628, usted tiene derecho a:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { right: "Acceso", desc: "Solicitar información sobre qué datos suyos almacenamos." },
                { right: "Rectificación", desc: "Corregir datos incorrectos o desactualizados." },
                { right: "Cancelación", desc: "Solicitar la eliminación de sus datos personales." },
                { right: "Oposición", desc: "Oponerse al tratamiento de sus datos para fines de marketing." },
              ].map((item) => (
                <div key={item.right} className="border border-border/30 bg-card/30 p-4">
                  <p className="font-semibold text-foreground text-sm mb-1">{item.right}</p>
                  <p className="text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Para ejercer estos derechos, contáctenos en <strong className="text-foreground">contacto@maudev.cl</strong>. Responderemos en un plazo máximo de <strong className="text-foreground">10 días hábiles</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Newsletter y Comunicaciones Comerciales</h2>
            <p>
              Si se suscribió a nuestro newsletter, puede cancelar su suscripción en cualquier momento haciendo clic en el enlace "Cancelar suscripción" que incluye cada correo, o enviando un mensaje a <strong className="text-foreground">contacto@maudev.cl</strong>. Procesaremos su solicitud en un máximo de 5 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Retención de Datos</h2>
            <p>
              Conservamos sus datos personales mientras su cuenta esté activa o mientras sea necesario para los fines descritos. Los datos de transacciones se retienen por el período exigido por la legislación tributaria chilena (6 años). Puede solicitar la eliminación de su cuenta en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Notificaremos cambios materiales por correo electrónico o mediante un aviso prominente en el Sitio. Le recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Contacto</h2>
            <p>Para cualquier consulta sobre esta Política de Privacidad:</p>
            <div className="border border-border/40 bg-card/40 p-4 mt-3 font-mono text-sm space-y-1">
              <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">contacto@maudev.cl</span></p>
              <p><span className="text-muted-foreground">País:</span> <span className="text-foreground">Chile</span></p>
              <p><span className="text-muted-foreground">Ciudad:</span> <span className="text-foreground">Santiago</span></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
