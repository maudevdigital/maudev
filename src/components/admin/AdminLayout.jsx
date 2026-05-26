import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Cierra el sidebar móvil al navegar.
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Bloquea el scroll del body cuando el sidebar móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-3 -right-11 h-9 w-9 rounded-md bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden h-14 border-b border-border flex items-center px-4">
          <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menú" className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-semibold">maudev admin</span>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
