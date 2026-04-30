import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background text-muted-foreground py-12">
      <div className="container max-w-7xl px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-mono font-bold tracking-tighter">
                <span className="text-primary">MAU</span>
                <span className="text-foreground/80">DEV</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Comparativas honestas de herramientas digitales para emprendedores
              en Chile y LATAM. Hosting, SEO y marketing digital.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400">
                SISTEMA OPERACIONAL
              </span>
            </div>
          </div>

          {/* Herramientas */}
          <div className="space-y-4">
            <h4 className="text-foreground font-mono text-xs tracking-wider">
              HERRAMIENTAS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/herramientas"
                  className="hover:text-primary transition-colors"
                >
                  Ver todas
                </Link>
              </li>
              <li>
                <Link
                  href="/comparativas/mejor-hosting"
                  className="hover:text-primary transition-colors"
                >
                  Hosting Web
                </Link>
              </li>
              <li>
                <Link
                  href="/herramientas"
                  className="hover:text-primary transition-colors"
                >
                  SEO Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/herramientas"
                  className="hover:text-primary transition-colors"
                >
                  Email Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contenido + Legal */}
          <div className="space-y-4">
            <h4 className="text-foreground font-mono text-xs tracking-wider">
              CONTENIDO
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/comparativas/mejor-hosting"
                  className="hover:text-primary transition-colors"
                >
                  Comparativas
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  Productos digitales
                </Link>
              </li>
            </ul>
            <h4 className="text-foreground font-mono text-xs tracking-wider mt-6">
              LEGAL
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-10 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-4xl">
            <strong className="text-muted-foreground/70">
              Divulgación de afiliados:
            </strong>{" "}
            Algunos de los enlaces en este sitio son links de afiliados. Si
            realizas una compra a través de ellos, recibimos una comisión sin
            costo adicional para ti. Solo recomendamos productos que hemos
            probado y consideramos útiles. Esto nos ayuda a mantener el sitio
            gratuito y actualizado. Ver{" "}
            <Link href="/privacy" className="underline hover:text-primary transition-colors">
              política de privacidad
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono">
            © {new Date().getFullYear()} MAUDEV. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6">
            <Link
              href="/herramientas"
              className="text-xs font-mono hover:text-primary transition-colors"
            >
              HERRAMIENTAS
            </Link>
            <Link
              href="/comparativas/mejor-hosting"
              className="text-xs font-mono hover:text-primary transition-colors"
            >
              COMPARATIVAS
            </Link>
            <Link
              href="/blog"
              className="text-xs font-mono hover:text-primary transition-colors"
            >
              BLOG
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
