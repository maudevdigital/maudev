import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import Logo from "@/components/landing/Logo";
import CtaButton from "@/components/landing/CtaButton";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Navbar reducida.
//
// Antes apuntaba a 5 páginas distintas; ahora son anclas de la misma home.
// Menos destinos = menos formas de perderse antes de convertir. El único
// botón sólido es el de WhatsApp.
// ─────────────────────────────────────────────────────────────────────────────

const sections = [
  { label: t("Qué automatizo", "What I automate"), id: "automatizaciones" },
  { label: t("Trabajos", "Work"), id: "portafolio" },
  { label: t("Cómo funciona", "How it works"), id: "proceso" },
  { label: t("Dudas", "FAQ"), id: "dudas" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch { /* almacenamiento bloqueado: el toggle igual funciona en la sesión */ }
  };

  // En la home hacemos scroll suave; fuera de ella navegamos a la home con hash.
  const goToSection = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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

          {/* Desktop */}
          <div className="hidden items-center gap-7 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                onClick={(e) => goToSection(e, s.id)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {s.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              aria-label={t("Cambiar tema", "Toggle theme")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <CtaButton size="md" context="navbar" className="!h-10 !px-5 !text-sm" />
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={t("Cambiar tema", "Toggle theme")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label={t("Abrir menú", "Open menu")}
              aria-expanded={open}
              className="text-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                onClick={(e) => goToSection(e, s.id)}
                className="block py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {s.label}
              </a>
            ))}
            <div className="pt-3">
              <CtaButton size="md" context="navbar-movil" full />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
