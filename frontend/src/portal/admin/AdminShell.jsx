import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import PortalShell, { Aviso, Esqueleto } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// Marco del panel admin. El login lo hace Cloudflare Access antes de que esta
// página cargue (código al correo); acá se muestra con qué correo se entró y se
// ofrece cerrar esa sesión. En desarrollo no hay Access, y se avisa.
export default function AdminShell({ titulo, children }) {
  const [yo, setYo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/admin/yo").then(setYo).catch(setError);
  }, []);

  const acciones = yo && (
    <>
      <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        {yo.email}
      </span>
      <Link to="/portal/admin" className="btn btn-ghost h-10 px-4 text-sm">Clientes</Link>
      {!yo.local && <a href="/cdn-cgi/access/logout" className="btn btn-ghost h-10 px-4 text-sm">Salir</a>}
    </>
  );

  return (
    <PortalShell titulo={titulo} acciones={acciones}>
      {yo?.local && (
        <div className="mb-8 rounded-xl border border-dashed border-primary/50 bg-card p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Modo desarrollo:</strong> sin Cloudflare Access. En maudev.cl esta página pide
          primero el código que llega a tu correo, y solo entran los correos autorizados.
        </div>
      )}
      {error ? <Aviso tono="error">No tienes acceso al panel. {error.message}</Aviso> : yo ? children : <Esqueleto />}
    </PortalShell>
  );
}
