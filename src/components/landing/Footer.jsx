import { Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/landing/Logo";
import { t } from "@/lib/i18n";
import { getWhatsAppUrl, whatsappEnabled } from "@/components/landing/WhatsAppFloat";

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
              {t(
                "Desarrollo web, software a medida y automatización para emprendedores y PYMEs en Chile.",
                "Web development, custom software and automation for founders and SMBs in Chile."
              )}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">{t("Empresa", "Company")}</h4>
            <ul className="space-y-2">
              <li><Link to="/servicios" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Servicios", "Services")}</Link></li>
              <li><Link to="/portafolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Portafolio", "Portfolio")}</Link></li>
              <li><Link to="/sobre-nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Sobre nosotros", "About us")}</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Términos y condiciones", "Terms & conditions")}</Link></li>
              <li><Link to="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Política de privacidad", "Privacy policy")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">{t("Contacto", "Contact")}</h4>
            <a
              href="mailto:contacto@maudev.cl"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
            >
              <Mail className="h-3.5 w-3.5" />
              contacto@maudev.cl
            </a>
            {whatsappEnabled && (
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#25D366] hover:underline mb-2"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
            <Link to="/contacto" className="block text-sm text-primary font-medium hover:underline">
              {t("Agendar diagnóstico", "Book a consult")} →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            © {year} maudev · Chile.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {t("Desarrollo · Automatización · Consultoría TI", "Development · Automation · IT Consulting")}
          </p>
        </div>
      </div>
    </footer>
  );
}
