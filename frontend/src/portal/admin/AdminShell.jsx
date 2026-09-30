import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ExternalLink, FileText, FolderKanban, History, Inbox, LayoutDashboard, LogOut, Scale, ShieldCheck, Users } from "lucide-react";
import Logo from "@/components/landing/Logo";
import { Aviso, Esqueleto } from "@/portal/PortalShell";
import { api } from "@/portal/api";
import { useSeo } from "@/lib/useSeo";

// Marco del panel admin: menú lateral en escritorio, fila deslizable en celular.
// El login lo hace Cloudflare Access antes de que cargue la página (código al
// correo); acá se muestra con qué correo se entró y se ofrece cerrar la sesión.
const secciones = [
  { to: "/portal/admin", label: "Resumen", icono: LayoutDashboard, exacta: true },
  { to: "/portal/admin/clientes", label: "Clientes", icono: Users },
  { to: "/portal/admin/proyectos", label: "Proyectos", icono: FolderKanban },
  { to: "/portal/admin/contactos", label: "Contactos", icono: Inbox },
  { to: "/portal/admin/derechos", label: "Derechos ARCOP", icono: Scale },
  { to: "/portal/admin/guias", label: "Guías", icono: FileText },
  { to: "/portal/admin/auditoria", label: "Auditoría", icono: History },
];

function Enlace({ to, label, icono: Icono, exacta, compacto }) {
  return (
    <NavLink
      to={to}
      end={exacta}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
          compacto ? "h-10" : "h-10 w-full"
        } ${isActive ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`
      }
    >
      <Icono className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

export default function AdminShell({ titulo, children }) {
  const [yo, setYo] = useState(null);
  const [error, setError] = useState(null);
  const filaMovil = useRef(null);
  useSeo({ title: `${titulo} · Admin Maudev`, noindex: true });

  useEffect(() => {
    api("/admin/yo").then(setYo).catch(setError);
    // En celular, la sección actual puede quedar fuera de la fila: se centra.
    filaMovil.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
          <Link to="/portal/admin" className="flex items-center gap-2.5" aria-label="Resumen del panel">
            <Logo size={26} className="text-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            {yo && (
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                {yo.email}
              </span>
            )}
            <a href="/" className="btn btn-ghost h-9 px-3 text-sm" title="Ver el sitio">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ver sitio</span>
            </a>
            {yo && !yo.local && (
              <a href="/cdn-cgi/access/logout" className="btn btn-ghost h-9 px-3 text-sm" title="Cerrar sesión">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Salir</span>
              </a>
            )}
          </div>
        </div>
        {/* Celular: las secciones en una fila que se desliza. */}
        <nav ref={filaMovil} aria-label="Secciones del panel" className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden">
          {secciones.map((s) => <Enlace key={s.to} {...s} compacto />)}
        </nav>
      </header>

      <div className="lg:grid lg:grid-cols-[15rem_1fr]">
        <aside className="hidden border-r border-border lg:block">
          <nav aria-label="Secciones del panel" className="sticky top-14 grid gap-1 p-4">
            {secciones.map((s) => <Enlace key={s.to} {...s} />)}
          </nav>
        </aside>

        <main id="contenido" tabIndex={-1} className="min-w-0 px-4 py-8 lg:px-10 lg:py-10">
          {yo?.local && (
            <div className="mb-6 rounded-xl border border-dashed border-primary/50 bg-card p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Modo desarrollo:</strong> sin Cloudflare Access. En maudev.cl el panel pide
              primero el código que llega a tu correo, y solo entran los correos autorizados.
            </div>
          )}
          {error ? <Aviso tono="error">No tienes acceso al panel. {error.message}</Aviso> : yo ? children : <Esqueleto />}
        </main>
      </div>
    </div>
  );
}

/** Encabezado de cada sección: título, bajada y acciones a la derecha. */
export function Encabezado({ titulo, bajada, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{titulo}</h1>
        {bajada && <p className="mt-1.5 text-sm text-muted-foreground">{bajada}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
