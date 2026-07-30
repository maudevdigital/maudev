import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import Logo from "@/components/landing/Logo";
import CtaButton from "@/components/landing/CtaButton";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Navbar flotante.
//
// Sigue siendo la misma navegación reducida (anclas de la home + un solo botón
// sólido), pero montada sobre una "píldora" de vidrio despegada del borde:
// da lectura más tech y separa el chrome del contenido al hacer scroll.
//
// Tres detalles de comportamiento:
//   · en móvil se esconde al bajar y reaparece al subir (gana pantalla),
//   · al salir del top gana borde/sombra para despegarse del fondo,
//   · en la home marca la sección visible (scrollspy con IntersectionObserver).
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
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const [active, setActive] = useState(null);
  const lastScrollY = useRef(0);
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

  // Un solo listener de scroll para las dos cosas (sombra + ocultar en móvil),
  // pasado por rAF para no disparar layout en cada evento.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        // De vuelta arriba estamos en el hero: ninguna sección va marcada.
        if (y < 200) setActive(null);

        if (window.innerWidth < 768) {
          const bajando = y > lastScrollY.current;
          setShow(!bajando || y < 80);
        } else {
          setShow(true);
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: solo tiene sentido en la home, donde las anclas existen.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!nodes.length) return;

    // La "banda" es una franja fina a media pantalla: se marca la sección que
    // la cruza. Con umbrales por ratio no basta — una sección más alta que la
    // franja nunca llega a cubrir la fracción pedida y no se marcaría nunca.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pathname]);

  // Cierra el menú móvil al cambiar de ruta.
  useEffect(() => setOpen(false), [pathname]);

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
    <nav
      className="fixed inset-x-3 top-3 z-50 transition-transform duration-300 ease-out sm:inset-x-4 sm:top-4"
      style={{ transform: `translateY(${show ? 0 : -120}%)` }}
    >
      <div
        className={[
          "mx-auto max-w-6xl overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "border-border bg-background/85 shadow-lg shadow-black/10"
            : "border-border/50 bg-background/60 shadow-none",
        ].join(" ")}
      >
        {/* Hairline superior: el detalle que da el aire "panel" del navbar */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent"
        />

        <div className="px-3 sm:px-5">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2.5 text-primary"
            >
              <Logo size={30} className="transition-transform duration-300 group-hover:rotate-6" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                mau
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  dev
                </span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-1 md:flex">
              {sections.map((s) => {
                const isActive = active === s.id;
                return (
                  <a
                    key={s.id}
                    href={`/#${s.id}`}
                    onClick={(e) => goToSection(e, s.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {s.label}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full",
                        "bg-linear-to-r from-primary/60 via-primary to-primary/60",
                        "transition-all duration-300 ease-out",
                        isActive
                          ? "w-6 opacity-100"
                          : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </a>
                );
              })}

              <span aria-hidden="true" className="mx-2 h-5 w-px bg-border" />

              <button
                onClick={toggleTheme}
                aria-label={t("Cambiar tema", "Toggle theme")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <CtaButton size="md" context="navbar" className="ml-2! h-10! px-5! text-sm!" />
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                aria-label={t("Cambiar tema", "Toggle theme")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setOpen(!open)}
                aria-label={t("Abrir menú", "Open menu")}
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-transform duration-300"
                style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="border-t border-border/60 md:hidden">
            <div className="space-y-1 px-3 py-4">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`/#${s.id}`}
                  onClick={(e) => goToSection(e, s.id)}
                  className={[
                    "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active === s.id
                      ? "border border-primary/20 bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  ].join(" ")}
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
      </div>
    </nav>
  );
}
