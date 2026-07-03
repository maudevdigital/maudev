import { Mail, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/landing/SocialIcons";
import { Link } from "react-router-dom";
import Logo from "@/components/landing/Logo";
import { t } from "@/lib/i18n";
import { getWhatsAppUrl, whatsappEnabled } from "@/components/landing/WhatsAppFloat";
import { founder, CTA_LABEL } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-primary">
              <Logo size={32} />
              <span className="text-lg font-bold tracking-tight text-foreground">
                mau<span className="text-primary">dev</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
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
              <li><Link to="/precios" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Precios", "Pricing")}</Link></li>
              <li><Link to="/portafolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Portafolio", "Portfolio")}</Link></li>
              <li><Link to="/sobre-nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Sobre nosotros", "About us")}</Link></li>
              <li><Link to="/ahora" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Ahora", "Now")}</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">{t("Herramientas gratis", "Free tools")}</h4>
            <ul className="space-y-2">
              <li><Link to="/diagnostico-web" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Diagnóstico de tu web", "Website audit")}</Link></li>
              <li><Link to="/cotizador" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Cotizador de proyectos", "Project estimator")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/contrato" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("Modelo de contrato", "Contract template")}</Link></li>
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
            <div className="flex items-center gap-3 mb-3">
              {founder.github && (
                <a href={founder.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {founder.linkedin && (
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
            <Link to="/contacto" className="block text-sm text-primary font-medium hover:underline">
              {CTA_LABEL} →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} <span className="font-semibold text-foreground">mau<span className="text-primary">dev</span></span> · Chile.
          </p>
          <p className="text-xs text-muted-foreground">
            {t("Desarrollo · Automatización · Consultoría TI", "Development · Automation · IT Consulting")}
          </p>
        </div>
      </div>
    </footer>
  );
}
