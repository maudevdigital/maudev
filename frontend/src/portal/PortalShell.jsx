import { Link } from "react-router-dom";
import Logo from "@/components/landing/Logo";
import { useSeo } from "@/lib/useSeo";

// Marco del portal: sin el menú ni el pie del sitio público, y nunca indexable.
export default function PortalShell({ titulo, acciones, children }) {
  useSeo({ title: `${titulo} · Portal Maudev`, noindex: true });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="site-container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Ir al sitio de Maudev">
            <Logo />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Portal</span>
          </Link>
          <div className="flex items-center gap-2">{acciones}</div>
        </div>
      </header>
      <main className="site-container py-10 sm:py-14">{children}</main>
    </div>
  );
}

export function Aviso({ children, tono = "neutro" }) {
  const estilos = tono === "error" ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground";
  return <div className={`rounded-xl border bg-card p-6 text-sm ${estilos}`} role={tono === "error" ? "alert" : "status"}>{children}</div>;
}

export function Barra({ valor }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${valor}%` }} />
    </div>
  );
}
