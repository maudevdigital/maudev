import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import SEOHead from "@/components/seo-head";

const LAST_UPDATED = "6 de abril de 2025";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Términos de Servicio"
        description="Términos y condiciones de uso de MauDev. Licencia de uso de indicadores Pine Script, MetaTrader 5, y servicios de desarrollo digital."
        canonical="https://maudev.cl/terms"
      />
      {/* Header */}
      <div className="border-b border-border/40 bg-card/20">
        <div className="container max-w-screen-lg px-4 md:px-8 py-10">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">INICIO</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">TÉRMINOS DE SERVICIO</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Términos de Servicio</h1>
          <p className="font-mono text-xs text-muted-foreground">Última actualización: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-screen-lg px-4 md:px-8 py-16">
        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder, navegar o adquirir productos y servicios en <strong className="text-foreground">maudev.cl</strong> (en adelante, "el Sitio"), usted acepta quedar vinculado por estos Términos de Servicio y todas las leyes y reglamentos aplicables. Si no está de acuerdo con alguna de estas condiciones, le pedimos que se abstenga de utilizar el Sitio.
            </p>
            <p className="mt-3">
              Estos términos se rigen por las leyes de la República de Chile, incluyendo la Ley N.° 19.496 sobre Protección de los Derechos de los Consumidores y la Ley N.° 19.628 sobre Protección de la Vida Privada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Descripción de los Productos y Servicios</h2>
            <p>MAUDEV ofrece los siguientes productos y servicios digitales:</p>
            <ul className="list-none space-y-2 mt-3 pl-0">
              {[
                { title: "Indicadores Pine Script para TradingView", desc: "Scripts desarrollados en Pine Script v5 para ser utilizados en la plataforma TradingView. Incluyen indicadores técnicos, estrategias y alertas personalizadas." },
                { title: "Indicadores y EAs para MetaTrader 5 (MQL5)", desc: "Herramientas automatizadas y scripts para la plataforma MT5, incluyendo Expert Advisors y scripts de análisis técnico." },
                { title: "Servicios de Desarrollo Digital", desc: "Desarrollo de aplicaciones web, landing pages y aplicaciones móviles. Los servicios se prestan de forma remota desde Santiago de Chile." },
              ].map((item) => (
                <li key={item.title} className="border border-border/30 bg-card/30 p-4">
                  <span className="font-semibold text-foreground block mb-1">{item.title}</span>
                  <span className="text-sm">{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Licencia de Uso</h2>
            <p>
              Al adquirir un indicador o script, MAUDEV le otorga una <strong className="text-foreground">licencia personal, no exclusiva, no transferible e intransferible</strong> para utilizar el producto en su(s) cuenta(s) de TradingView o MetaTrader 5.
            </p>
            <div className="border border-destructive/20 bg-destructive/5 p-4 mt-4 space-y-2 text-sm">
              <p className="font-semibold text-foreground">Está expresamente prohibido:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Redistribuir, revender, sublicenciar o compartir el código fuente de los productos adquiridos.</li>
                <li>Publicar, divulgar o transferir el código a terceros en cualquier forma.</li>
                <li>Utilizar el producto para crear trabajos derivados con fines comerciales sin autorización expresa.</li>
                <li>Realizar ingeniería inversa, descompilar o desensamblar el software cuando sea aplicable.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Precios y Pagos</h2>
            <p>
              Todos los precios en el Sitio están expresados en <strong className="text-foreground">Pesos Chilenos (CLP)</strong>, salvo indicación expresa en contrario. El pago se procesa a través de plataformas de pago seguras. MAUDEV no almacena datos de tarjetas de crédito ni débito en sus servidores.
            </p>
            <p className="mt-3">
              Los precios pueden variar sin previo aviso. El precio vigente al momento de confirmar la compra es el que aplica a dicha transacción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Política de Reembolsos</h2>
            <p>
              Dado que los productos digitales (indicadores Pine Script, scripts MQL5) se entregan de forma inmediata tras la compra, <strong className="text-foreground">no se ofrecen reembolsos una vez efectuada la descarga o el acceso al producto</strong>, salvo en los siguientes casos:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
              <li>El producto no funciona según lo descrito y no se puede resolver el problema dentro de 5 días hábiles.</li>
              <li>Se produjo un cobro duplicado o error técnico en el pago.</li>
            </ul>
            <p className="mt-3">
              Para servicios de desarrollo digital, los términos de reembolso se acuerdan en el contrato de servicio específico previo al inicio del proyecto.
            </p>
            <p className="mt-3 text-sm">
              Para solicitar un reembolso, contacte a <strong className="text-foreground">contacto@maudev.cl</strong> dentro de los 7 días siguientes a la compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Descargo de Responsabilidad — Riesgo Financiero</h2>
            <div className="border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm space-y-2">
              <p className="font-semibold text-foreground">Aviso importante sobre trading e inversiones:</p>
              <p>
                Los indicadores y herramientas ofrecidos por MAUDEV son <strong className="text-foreground">herramientas de análisis técnico únicamente</strong>. No constituyen asesoramiento financiero, asesoramiento de inversión ni recomendaciones de compra o venta de ningún activo financiero.
              </p>
              <p>
                El trading en mercados financieros (criptomonedas, metales preciosos, materias primas, divisas, etc.) conlleva un <strong className="text-foreground">riesgo significativo de pérdida de capital</strong>. Los resultados pasados no garantizan resultados futuros.
              </p>
              <p>
                MAUDEV no se hace responsable de las pérdidas económicas que pudieran derivarse del uso de sus herramientas. El usuario acepta operar bajo su propio riesgo y responsabilidad.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del Sitio, incluyendo pero no limitándose a textos, gráficos, logotipos, código fuente, interfaces y scripts, es propiedad exclusiva de MAUDEV y está protegido por las leyes de propiedad intelectual de Chile y tratados internacionales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Modificaciones a los Términos</h2>
            <p>
              MAUDEV se reserva el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios entrarán en vigor una vez publicados en el Sitio. El uso continuado del Sitio tras la publicación de cambios implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Contacto</h2>
            <p>
              Para consultas relacionadas con estos Términos de Servicio, puede contactarnos en:
            </p>
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
