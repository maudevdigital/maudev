import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background text-muted-foreground py-12">
      <div className="container max-w-7xl px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-mono font-bold tracking-tighter">
                <span className="text-primary">MAU</span><span className="text-foreground/80">DEV</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Herramientas de trading de precisión y experiencias digitales para profesionales serios. Santiago, Chile.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400">SISTEMA OPERACIONAL</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-foreground font-mono text-xs tracking-wider">PRODUCTOS</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=trading_scripts" className="hover:text-primary transition-colors">
                  Trading Scripts
                </Link>
              </li>
              <li>
                <Link href="/products?category=digital_service" className="hover:text-primary transition-colors">
                  Servicios Digitales
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-foreground font-mono text-xs tracking-wider">CONTENIDO</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
            <h4 className="text-foreground font-mono text-xs tracking-wider mt-6">LEGAL</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono">
            © {new Date().getFullYear()} MAUDEV. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6">
            <Link href="/products" className="text-xs font-mono hover:text-primary transition-colors">PRODUCTOS</Link>
            <Link href="/blog" className="text-xs font-mono hover:text-primary transition-colors">BLOG</Link>
            <Link href="/sign-in" className="text-xs font-mono hover:text-primary transition-colors">ACCEDER</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
