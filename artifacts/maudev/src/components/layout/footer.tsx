import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background text-muted-foreground py-12">
      <div className="container max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold tracking-tighter text-primary">
                MAU<span className="text-foreground">DEV</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs">
              Herramientas de trading de precisión y experiencias digitales para profesionales serios. Santiago, Chile.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold text-sm">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=pine_script" className="hover:text-primary transition-colors">
                  Extensiones Pine Script
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
            <h4 className="text-foreground font-semibold text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} MauDev. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <span className="text-xs font-mono">ESTADO: OPERACIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
