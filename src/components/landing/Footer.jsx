import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/landing/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-primary">
              <Logo size={32} />
              <span className="text-lg font-bold tracking-tight text-foreground">
                mau<span className="text-primary">dev</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Desarrollo web, software a medida y automatización para emprendedores y PYMEs en Chile.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="/servicios" className="text-sm text-muted-foreground hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/portafolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portafolio</Link></li>
              <li><Link to="/sobre-nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre nosotros</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Términos y condiciones</Link></li>
              <li><Link to="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Contacto</h4>
            <a
              href="mailto:contacto@maudev.cl"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
            >
              <Mail className="h-3.5 w-3.5" />
              contacto@maudev.cl
            </a>
            <Link to="/contacto" className="block text-sm text-primary font-medium hover:underline">
              Agendar diagnóstico →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            © {year} maudev · Chile. Razón social y RUT en trámite.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Desarrollo · Automatización · Consultoría TI
          </p>
        </div>
      </div>
    </footer>
  );
}
