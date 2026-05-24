import { Link, Outlet } from "react-router-dom";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const LoadingState = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function AdminGuard() {
  const { isAuthenticated, isLoadingAuth, authChecked, user, isAdmin, navigateToLogin, logout, adminEmail } = useAuth();

  if (isLoadingAuth || !authChecked) return <LoadingState />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 text-center">
          <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold mb-2">Acceso administrativo</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Inicia sesión con Google usando el correo autorizado.
          </p>
          <Button onClick={navigateToLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Entrar con Google
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 text-center">
          <div className="h-12 w-12 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-sm text-muted-foreground mb-2">
            La cuenta <span className="text-foreground font-medium">{user?.email}</span> no tiene permisos de administrador.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            El único correo autorizado es {adminEmail}.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => logout(false)} className="border-border">
              Cerrar sesión
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">Volver al sitio</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
