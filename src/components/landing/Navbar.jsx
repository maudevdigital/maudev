import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarClock, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import Logo from "@/components/landing/Logo";
import CtaButton from "@/components/landing/CtaButton";
import CurrencySwitcher from "@/components/landing/CurrencySwitcher";
import { catalog, headerActions } from "@/data/catalog";

// ─────────────────────────────────────────────────────────────────────────────
// Navbar flotante: una píldora de vidrio despegada del borde.
//
// Comportamiento:
//   · al salir del top gana fondo, borde y sombra para separarse del contenido,
//   · en móvil se esconde al bajar y reaparece al subir (gana pantalla),
//   · marca la sección visible en la home (scrollspy con IntersectionObserver),
//   · el menú móvil cierra con Escape y bloquea el scroll del cuerpo.
// ─────────────────────────────────────────────────────────────────────────────

// El navbar de escritorio muestra solo los destinos que son una decisión.
// "Proceso" y "Preguntas" se encuentran bajando y viven en el menú móvil:
// en el header solo sumaban ancho y obligaban a leer más para elegir.
const navigation = [
  { label: "Servicios", id: "soluciones", enHeader: true },
  { label: "Portafolio", id: "casos", enHeader: true },
  { label: "Proceso", id: "proceso", enHeader: false },
  { label: "Preguntas", id: "preguntas", enHeader: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const [active, setActive] = useState(null);
  const [mega, setMega] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const lastScrollY = useRef(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Un solo listener para fondo y auto-ocultado, pasado por rAF para no
  // disparar layout en cada evento de scroll.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        if (y < 200) setActive(null);

        if (window.innerWidth < 1024) {
          const bajando = y > lastScrollY.current;
          setShow(!bajando || y < 96);
        } else {
          setShow(true);
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: solo en la home, que es donde existen las anclas. La banda es
  // una franja fina a media pantalla; con umbrales por proporción, una sección
  // más alta que la franja nunca llegaría a marcarse.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const nodes = navigation.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setMega(false);
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
      className="fixed inset-x-3 top-3 z-50 transition-transform duration-300 ease-out sm:inset-x-5 sm:top-5"
      style={{ transform: `translateY(${show ? 0 : -140}%)` }}
    >
      <div
        className={`mx-auto w-full max-w-[75rem] overflow-hidden rounded-2xl border transition-colors duration-200 ${
          scrolled || open || mega
            ? "border-border bg-background/90 shadow-lg shadow-[hsl(var(--ink)/0.08)] backdrop-blur-xl"
            : "border-border/60 bg-background/70 backdrop-blur-md"
        }`}
      >
        {/* Hairline superior: el detalle que da la lectura de panel */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent"
        />

        <div className="flex h-15 items-center justify-between gap-3 px-3 sm:h-16 sm:px-5">
          <Link to="/" aria-label="Maudev, ir al inicio" className="group flex shrink-0 items-center gap-2.5">
            <Logo size={28} className="text-primary transition-transform duration-200 group-hover:rotate-6" />
            <span className="text-[1.05rem] font-extrabold tracking-[-0.04em] text-foreground">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            <div>
              <button
                type="button"
                onClick={() => setMega((v) => !v)}
                aria-expanded={mega}
                aria-controls="mega-servicios"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  mega ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Servicios
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </div>

            <a
              href="/#casos"
              onClick={(event) => goToSection(event, "casos")}
              aria-current={active === "casos" ? "true" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active === "casos" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Portafolio
            </a>

            <Link
              to="/contacto"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contacto
            </Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span aria-hidden="true" className="mr-1 h-5 w-px bg-border" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Usar tema claro" : "Usar tema oscuro"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <CurrencySwitcher />
            <a
              href={headerActions.agendar.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-lg border border-border px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              {headerActions.agendar.label}
            </a>
            <CtaButton size="md" context="header" label={headerActions.cotizar.label} className="h-10! px-5!" />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Usar tema claro" : "Usar tema oscuro"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mega && (
          <div
            id="mega-servicios"
            className="hidden border-t border-border bg-background lg:block"
          >
            <div className="grid gap-x-8 gap-y-8 p-6 xl:grid-cols-4">
              {catalog.map((familia) => (
                <div key={familia.id}>
                  <p className="flex items-center gap-2 border-b border-border pb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full bg-current ${familia.accent}`} aria-hidden="true" />
                    {familia.label}
                  </p>
                  <ul className="mt-2">
                    {familia.items.map(({ icon: Icon, title, text, href }) => (
                      <li key={title}>
                        <Link
                          to={href}
                          onClick={() => setMega(false)}
                          className="group flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-primary transition-colors group-hover:border-primary/40">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">{title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{text}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {open && (
          <nav id="menu-movil" aria-label="Navegación móvil" className="border-t border-border lg:hidden">
            {/* La altura descuenta la píldora y su separación del borde para que
                el CTA quede siempre alcanzable sin scroll dentro del menú. */}
            <div className="flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-y-auto px-4 py-4">
              <div className="mb-2">
                {catalog.map((familia) => (
                  <details key={familia.id} className="border-b border-border">
                    <summary className="flex cursor-pointer items-center justify-between py-3.5 text-lg font-bold tracking-tight text-foreground">
                      {familia.label}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </summary>
                    <ul className="pb-3">
                      {familia.items.map(({ title, href }) => (
                        <li key={title}>
                          <Link to={href} className="block py-2 pl-1 text-sm font-semibold text-muted-foreground">
                            {title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>

              <div className="flex flex-col">
                {navigation.map((item) => (
                  <a
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={(event) => goToSection(event, item.id)}
                    className="border-b border-border py-3.5 text-lg font-bold tracking-tight text-foreground focus-visible:text-primary focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                ))}
                <Link to="/contacto" className="border-b border-border py-3.5 text-lg font-bold tracking-tight text-foreground">
                  Contacto
                </Link>
              </div>
              <div className="mt-6 space-y-3">
                <CtaButton size="lg" context="menu-movil" label={headerActions.cotizar.label} full />
                <a
                  href={headerActions.agendar.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-foreground"
                >
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  {headerActions.agendar.label}
                </a>
                <CurrencySwitcher className="pt-1" />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
