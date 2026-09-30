import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarClock, KeyRound, Menu, Moon, Sun, X } from "lucide-react";
import Logo from "@/components/landing/Logo";
import CtaButton from "@/components/landing/CtaButton";
import { headerActions } from "@/data/site";
import { listaCapacidades } from "@shared/oferta";

// Navegación: las cuatro capacidades y los casos, cada uno con su página. Antes
// había un mega-menú con 19 servicios que se repetían en el pie, en la portada y
// en la antigua página de precios; la oferta nueva cabe en una fila.
const enlaces = [
  ...listaCapacidades.map((c) => ({ label: c.navLabel, to: c.path })),
  { label: "Casos", to: "/casos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);
  const { pathname } = useLocation();

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Con el menú móvil desplegado, la página de atrás se queda
  // quieta: el único que se desplaza es la lista.
  //
  // `overflow: hidden` en el body no alcanza —Safari en iPhone lo ignora— así
  // que el cuerpo se fija y se compensa con `top` la posición en la que estaba,
  // para que al cerrar el visitante vuelva exactamente donde iba.
  //
  // Al fijar el cuerpo desaparece la barra de desplazamiento, y en escritorio
  // eso ensancha la página de golpe: el contenido salta unos pixeles hacia el
  // costado justo al abrir el menú. Se rellena ese ancho con padding para que
  // el fondo quede realmente inmóvil y no solo sin scroll.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const y = window.scrollY;
    const anchoAntes = document.documentElement.clientWidth;
    const previo = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    // Se mide el ensanche REAL en vez de suponer que es el ancho de la barra.
    // Con `scrollbar-gutter: stable` en el html el hueco ya está reservado y no
    // hay ensanche, así que esto queda en cero y no compensa de más —que
    // desplazaría el contenido hacia el otro lado—. En un navegador sin soporte
    // para esa propiedad sigue funcionando como antes.
    const salto = document.documentElement.clientWidth - anchoAntes;
    if (salto > 0) body.style.paddingRight = `${salto}px`;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      Object.assign(body.style, previo);

      // `behavior: "instant"` NO es decorativo: el sitio declara
      // `html { scroll-behavior: smooth }`, así que un `scrollTo` normal ANIMA
      // el regreso desde 0 hasta `y`. Esa animación emite decenas de eventos de
      // scroll crecientes, y el detector de dirección los lee como que el
      // visitante está bajando: la cabecera se escondía sola justo al cerrar el
      // menú y en el teléfono parecía que la página se hubiera recargado.
      window.scrollTo({ top: y, left: 0, behavior: "instant" });

      // Y se pone al día la última posición conocida antes de que corra el
      // manejador —va diferido en un requestAnimationFrame—, para que el salto
      // tampoco se interprete como gesto.
      lastScrollY.current = y;
      setShow(true);

      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
      ref={headerRef}
      className={`site-header transition-transform duration-200 ${scrolled ? "shadow-sm" : ""}`}
      style={{ transform: `translateY(${show || open ? 0 : -140}%)` }}
      onFocusCapture={() => setShow(true)}
    >
      <div
        className="site-header-inner"
      >
        <div className="flex h-18 items-center justify-between gap-3">
          <Link to="/" aria-label="Maudev, ir al inicio" className="group flex shrink-0 items-center gap-2.5">
            <Logo size={28} className="text-primary transition-transform duration-200 group-hover:rotate-6" />
            <span className="text-[1.05rem] font-extrabold tracking-[-0.04em] text-foreground">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {enlaces.map(({ label, to }) => {
              const actual = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={actual ? "page" : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                    actual ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span aria-hidden="true" className="mr-1 h-5 w-px bg-border" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Usar tema claro" : "Usar tema oscuro"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {/* Entrada para clientes con su enlace o código de acceso. */}
            {/* Entre 1024 y 1280 px no cabe el texto: queda el ícono con su nombre accesible. */}
            <Link
              to="/portal/ingresar"
              aria-label="Portal clientes"
              aria-current={pathname.startsWith("/portal") ? "page" : undefined}
              title="Portal clientes"
              className="btn btn-ghost h-10 rounded-lg! px-3 text-sm xl:px-3.5"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">Portal clientes</span>
            </Link>
            <a
              href={headerActions.agendar.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={headerActions.agendar.label}
              title={headerActions.agendar.label}
              className="btn btn-ghost h-10 rounded-lg! px-3 text-sm xl:px-3.5"
            >
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{headerActions.agendar.label}</span>
            </a>
            <CtaButton size="md" context="header" label={headerActions.cotizar.label} className="h-10! px-5!" />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Usar tema claro" : "Usar tema oscuro"}
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="menu-movil" aria-label="Navegación móvil" className="border-t border-border lg:hidden">
            {/* Dos zonas: la lista se desplaza y las acciones quedan fijas
                abajo.

                Antes era un solo bloque con scroll: el contenido cabía casi
                justo, así que el menú terminaba al ras del borde inferior de la
                pantalla, "Cotizar proyecto" quedaba cortado por unos píxeles y
                nada indicaba que hubiera más abajo. Se podía deslizar, pero no
                se veía que se pudiera, que para el visitante es lo mismo que no
                poder.

                Ahora la altura deja aire bajo la píldora, la lista lleva
                sombras de scroll que aparecen solo cuando queda contenido hacia
                ese lado, y el botón principal no depende de que alguien baje
                para encontrarlo. */}
            <div className="flex max-h-[calc(100dvh-9.5rem)] flex-col">
              <div className="scroll-shadows min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <div className="flex flex-col">
                {enlaces.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    aria-current={pathname === to || pathname.startsWith(`${to}/`) ? "page" : undefined}
                    className="border-b border-border py-3.5 text-lg font-bold tracking-tight text-foreground aria-[current=page]:text-primary"
                  >
                    {label}
                  </Link>
                ))}
                <Link to="/contacto" className="border-b border-border py-3.5 text-lg font-bold tracking-tight text-foreground">
                  Contacto
                </Link>
                <Link to="/portal/ingresar" className="flex items-center gap-2 border-b border-border py-3.5 text-lg font-bold tracking-tight text-foreground">
                  <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
                  Portal clientes
                </Link>
              </div>
              </div>

              <div className="shrink-0 space-y-2.5 border-t border-border px-4 py-4">
                <CtaButton size="lg" context="menu-movil" label={headerActions.cotizar.label} full />
                <a
                  href={headerActions.agendar.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost h-12 w-full rounded-lg! text-sm"
                >
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  {headerActions.agendar.label}
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
