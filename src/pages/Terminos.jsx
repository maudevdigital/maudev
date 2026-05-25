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

          <div className="max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">1. Identificación y aceptación</h2>
              <p>
                Este sitio y los servicios son provistos por Maudev (en adelante "la empresa" o "el prestador"),
                con domicilio en Chile y correo de contacto{" "}
                <a href="mailto:contacto@maudev.cl" className="text-primary hover:underline">contacto@maudev.cl</a>.
                Al usar este sitio web y/o contratar los servicios, el usuario o cliente declara haber leído y
                aceptado los presentes términos y condiciones. La razón social y el RUT de la empresa se
                indicarán en cada documento tributario emitido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">2. Servicios</h2>
              <p>
                Maudev presta servicios de desarrollo web, software a medida, automatización de procesos,
                integración de pasarelas de pago y consultoría tecnológica. El alcance específico, los plazos
                y el precio se acuerdan por escrito en una propuesta o cotización previa para cada proyecto, la
                que forma parte integrante de estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">3. Precios, monedas y formas de pago</h2>
              <p>
                Toda cotización tiene una vigencia de 30 días corridos desde su emisión. Salvo pacto distinto,
                los proyectos se cobran 50% al inicio y 50% contra entrega. Se aceptan las siguientes monedas y
                medios de pago:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong className="text-foreground">CLP (pesos chilenos):</strong> transferencia bancaria nacional. Es la moneda de referencia para clientes en Chile.</li>
                <li><strong className="text-foreground">USD (dólares):</strong> para clientes internacionales, mediante transferencia o plataforma de pago acordada.</li>
                <li><strong className="text-foreground">USDT (stablecoin):</strong> se acepta pago en USDT en la red que se acuerde por escrito. El monto en USDT se calcula con paridad 1 USDT ≈ 1 USD al momento de emitir la cotización; las comisiones de red ("gas") son de cargo del cliente.</li>
              </ul>
              <p className="mt-3">
                Cuando corresponda, Maudev emitirá la boleta o factura electrónica a través del Servicio de
                Impuestos Internos (SII), incluyendo el IVA vigente. Los pagos en moneda extranjera o en cripto
                se convierten a CLP al tipo de cambio observado del día de emisión del documento tributario, para
                efectos de la declaración de impuestos en Chile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">4. Propiedad intelectual</h2>
              <p>
                El código y los entregables desarrollados específicamente para el cliente son de su propiedad una
                vez pagado el saldo total. Las licencias de software de terceros, librerías de código 