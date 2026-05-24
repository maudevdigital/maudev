import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function Terminos() {
  useEffect(() => {
    document.title = "Términos y Condiciones · Maudev";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// legal</span>
          <h1 className="text-4xl font-black tracking-tight mt-3 mb-2">Términos y condiciones</h1>
          <p className="text-sm text-muted-foreground mb-10">Última actualización: {new Date().toLocaleDateString("es-CL")}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">1. Aceptación</h2>
              <p>
                Al usar este sitio web y/o contratar servicios provistos por Maudev (en adelante "la empresa"),
                el usuario o cliente acepta los presentes términos y condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">2. Servicios</h2>
              <p>
                Maudev presta servicios de desarrollo web, software a medida, automatización de procesos
                y consultoría tecnológica. El alcance específico, plazos y precios se acuerdan por escrito
                en una propuesta o cotización previa para cada proyecto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">3. Cotizaciones y pagos</h2>
              <p>
                Toda cotización tiene una vigencia de 30 días desde su emisión. Salvo pacto distinto,
                los proyectos se cobran 50% al inicio y 50% al entregar. La emisión de boleta o factura
                electrónica se realiza al recibir el pago correspondiente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">4. Propiedad intelectual</h2>
              <p>
                El código y los entregables desarrollados específicamente para el cliente son de su propiedad
                una vez pagado el saldo total. Maudev conserva el derecho de utilizar el proyecto como
                referencia en su portafolio, salvo solicitud expresa de confidencialidad acordada por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">5. Responsabilidad</h2>
              <p>
                Maudev no se responsabiliza por daños indirectos, lucro cesante o pérdidas derivadas
                del uso de los entregables. La responsabilidad máxima se limita al monto efectivamente
                pagado por el cliente por el servicio en cuestión.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">6. Cambios</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos. Los cambios se publicarán en esta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">7. Jurisdicción</h2>
              <p>
                Cualquier controversia derivada de los servicios se someterá a las leyes de la República de Chile
                y a la competencia de los tribunales ordinarios de justicia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">8. Contacto</h2>
              <p>
                Para consultas legales o sobre estos términos: <a href="mailto:maudevchile@gmail.com" className="text-primary hover:underline">maudevchile@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
