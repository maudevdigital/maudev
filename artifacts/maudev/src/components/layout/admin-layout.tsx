import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, FileText, Loader2, ShieldX, Send, Menu, X } from "lucide-react";
import { useClerk, useAuth, SignIn } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiBase = import.meta.env.BASE_URL || "/";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const [adminStatus, setAdminStatus] = useState<"loading" | "admin" | "denied">("loading");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${apiBase}api/admin/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          setAdminStatus(res.ok ? "admin" : "denied");
        }
      } catch {
        if (!cancelled) setAdminStatus("denied");
      }
    })();

    return () => { cancelled = true; };
  }, [authLoaded, isSignedIn, getToken]);

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/orders", label: "Pedidos", icon: ShoppingCart },
    { href: "/subscribers", label: "Suscriptores", icon: Users },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/campaigns", label: "Campanas", icon: Send },
  ];

  if (!authLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-6">
        <div className="text-center mb-4">
          <span className="text-2xl font-mono font-bold tracking-tighter text-primary">
            MAU<span className="text-foreground">ADMIN</span>
          </span>
          <p className="text-sm text-muted-foreground mt-2">Inicia sesion para acceder al panel de administracion</p>
        </div>
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    );
  }

  if (adminStatus === "loading") {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-mono">Verificando permisos...</p>
      </div>
    );
  }

  if (adminStatus === "denied") {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-4">
        <ShieldX className="h-12 w-12 text-red-400" />
        <h1 className="text-xl font-bold">Acceso Denegado</h1>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          No tienes permisos de administrador. Si crees que esto es un error, contacta al equipo de MauDev.
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="~/">
            <span className="px-4 py-2 bg-primary text-primary-foreground font-mono text-sm cursor-pointer hover:bg-primary/90 transition-colors">
              VOLVER AL INICIO
            </span>
          </Link>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border border-border/60 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            CERRAR SESION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <span className="text-lg font-mono font-bold tracking-tighter text-primary">
            MAU<span className="text-foreground">ADMIN</span>
          </span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {links.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/40 space-y-2">
          <Link href="~/">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Volver a la App
            </div>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/40 bg-card">
          <span className="text-lg font-mono font-bold tracking-tighter text-primary">
            MAU<span className="text-foreground">ADMIN</span>
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border/40 bg-card px-4 py-4">
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const isActive = location === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </div>
                  </Link>
                );
              })}
              <div className="h-px bg-border/40 my-2" />
              <Link href="~/" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a la App
                </div>
              </Link>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </button>
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}