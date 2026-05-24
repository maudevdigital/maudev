import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function Privacidad() {
  useEffect(() => {
    document.title = "Política de Privacidad · Maudev";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// legal</span>
          <h1 className="text-4xl font-black tracking-tight mt-3 mb-2">Política de privacidad</h1>
          <p className="text-sm text-muted-foreground mb-10">Última actualización: {new Date().toLocaleDateString("es-CL")}</p>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">1. Responsable del tratamiento</h2>
              <p>
                Maudev, con domicilio en Chile y correo de contacto <a href="mailto:maudevchile@gmail.com" className="text-primary hover:underline">maudevchile@gmail.com</a>,
                es responsable del tratamiento de los datos personales recopilados a través de este sitio.
                Esta política cumple con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">2. Datos que recopilamos</h2>
              <p>Cuando completas un formulario de contacto, podemos recopilar:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>Nombre</li>
                <li>Correo electrónico</li>
                <li>Número de WhatsApp / teléfono (opcional)</li>
                <li>Tipo de interés o servicio solicitado</li>
                <li>Mensaje libre</li>
                <li>Datos técnicos: dirección IP, navegador, parámetros UTM</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">3. Finalidad</h2>
              <p>Usamos tus datos exclusivamente para:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>Responder a tu consulta y agendar reuniones</li>
                <li>Enviarte cotizaciones y propuestas comerciales</li>
                <li>Mantener registro de la comunicación contigo</li>
                <li>Mejorar la experiencia del sitio (análisis agregado)</li>
              </ul>
              <p className="mt-3">
                No enviamos newsletters ni comunicaciones masivas sin tu consentimiento explícito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">4. Compartición con terceros</h2>
              <p>
                Tus datos se almacenan en servicios de terceros que cumplen estándares internacionales de
                seguridad (Supabase, Cloudflare). No vendemos, alquilamos ni cedemos tus datos a
                terceros con fines comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">5. Cookies y analítica</h2>
              <p>
                Podemos usar cookies propias y de terceros (Google Analytics) para entender el uso del sitio
                de forma agregada y anónima. Puedes deshabilitar cookies desde tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">6. Tus derechos</h2>
              <p>
                Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos
                personales. Para ejercer estos derechos, escríbenos a <a href="mailto:maudevchile@gmail.com" className="text-primary hover:underline">maudevchile@gmail.com</a>
                con el asunto "Datos personales". Respondemos en un plazo máximo de 5 días hábiles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">7. Cambios</h2>
              <p>
                Podemos actualizar esta política. La versión vigente siempre estará publicada en esta página
                con su fecha de actualización.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
