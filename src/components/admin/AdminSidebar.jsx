import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, ExternalLink, LogOut, Briefcase, Music2, BarChart3, Receipt, Radar, Wallet } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/landing/Logo";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Portafolio", path: "/admin/portafolio", icon: Briefcase },
  { label: "Blog", path: "/admin/blog", icon: FileText },
  { label: "Leads", path: "/admin/leads", icon: Users },
  { label: "Métricas", path: "/admin/metricas", icon: BarChart3 },
  { label: "Cotizaciones", path: "/admin/cotizaciones", icon: Receipt },
  { label: "Prospección", path: "/admin/prospeccion", icon: Radar },
  { label: "Cobros", path: "/admin/cobros", icon: Wallet },
  { label: "TikTok", path: "/admin/tiktok", icon: Music2 },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 h-full min-h-0 bg-card border-r border-border flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5 text-primary">
          <Logo size={28} />
          <span className="text-sm font-bold tracking-tight text-foreground">
            mau<span className="text-primary">dev</span>
            <span className="text-[10px] font-mono text-muted-foreground ml-1.5">admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(item.path)
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 pb-3 mb-3 border-b border-border/60">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">sesión admin</p>
          <p className="text-xs text-foreground truncate mt-1">{user?.email}</p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver sitio
        </Link>
        <button
          type="button"
          onClick={() => logout(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
