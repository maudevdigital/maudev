import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft } from "lucide-react";
import { useClerk } from "@clerk/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Productos", icon: Package },
    { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/subscribers", label: "Suscriptores", icon: Users },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground">
      {/* Sidebar */}
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
          <Link href="/">
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
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/40 bg-card">
          <span className="text-lg font-mono font-bold tracking-tighter text-primary">
            MAU<span className="text-foreground">ADMIN</span>
          </span>
          <Link href="/">
            <span className="text-sm font-medium text-muted-foreground">Exit</span>
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
