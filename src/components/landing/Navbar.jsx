import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/landing/Logo";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const { pathname } = useLocation();

  // Toggle manual de tema: persiste en localStorage y pisa la preferencia del
  // sistema (ver script en index.html, que lee "theme" al cargar).
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch { /* almacenamiento bloqueado: el toggle igual funciona en la sesión */ }
  };

  // En la landing page (/) el CTA hace scroll al formulario de contacto.
  // En el resto de páginas navega a /contacto.
  const ctaHref = pathname === "/" ? "/#contacto" : "/contacto";
  const handleCtaClick = (e) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: t("Servicios", "Services"), to: "/servicios" },
    { label: t("Precios", "Pricing"), to: "/precios" },
    { label: t("Portafolio", "Portfolio"), to: "/portafolio" },
    { label: t("Contacto", "Contact"), to: "/contacto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-primary"
          >
            <Logo size={32} />
            <span className="text-lg font-bold tracking-tight text-foreground">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              aria-label={t("Cambiar tema", "Toggle theme")}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href={ctaHref} onClick={handleCtaClick}>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                {CTA_LABEL}
              </Button>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={t("Cambiar tema", "Toggle theme")}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setOpen(!open)} className="text-foreground">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {l.label}
              </NavLink>
            ))}
            <a href={ctaHref} onClick={handleCtaClick}>
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                {CTA_LABEL}
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
