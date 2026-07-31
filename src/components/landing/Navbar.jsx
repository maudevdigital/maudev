import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import Logo from "@/components/landing/Logo";
import CtaButton from "@/components/landing/CtaButton";

const navigation = [
  { label: "Soluciones", id: "soluciones" },
  { label: "Proyectos", id: "casos" },
  { label: "Cómo trabajamos", id: "proceso" },
  { label: "Preguntas", id: "preguntas" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goToSection = (event, id) => {
    event.preventDefault();
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }
    navigate(`/#${id}`);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // El tema sigue funcionando durante la sesión si el almacenamiento falla.
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open
          ? "border-border bg-background/95 backdrop-blur-xl"
          : "border-transparent bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="site-container flex h-18 items-center justify-between gap-4">
        <Link to="/" aria-label="Maudev, ir al inicio" className="group flex items-center gap-2.5">
          <Logo size={30} className="text-primary transition-transform duration-200 group-hover:rotate-6" />
          <span className="text-[1.05rem] font-extrabold tracking-[-0.04em] text-foreground">
            mau<span className="text-primary">dev</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(event) => goToSection(event, item.id)}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/contacto"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Contacto
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Usar tema claro" : "Usar tema oscuro"}
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <CtaButton size="md" context="header" className="h-11! px-5!" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Navegación móvil" className="border-t border-border bg-background lg:hidden">
          <div className="site-container flex min-h-[calc(100dvh-4.5rem)] flex-col py-5">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(event) => goToSection(event, item.id)}
                  className="border-b border-border py-4 text-xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <Link to="/contacto" className="border-b border-border py-4 text-xl font-bold tracking-tight text-foreground">
                Contacto
              </Link>
            </div>
            <div className="mt-auto space-y-3 pt-8">
              <CtaButton size="lg" context="menu-movil" full />
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-muted-foreground"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {dark ? "Usar tema claro" : "Usar tema oscuro"}
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
