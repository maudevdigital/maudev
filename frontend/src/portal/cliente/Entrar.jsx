import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortalShell, { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/entrar#<token>: el enlace que el cliente recibe de Maudev.
//
// Lo primero es sacar el token de la barra de direcciones, antes de cualquier
// otra cosa: así no queda en el historial ni en una captura de pantalla. Después
// se canjea por la cookie de sesión y se va al resumen.
export default function Entrar() {
  const navegar = useNavigate();
  const [error, setError] = useState("");
  const hecho = useRef(false);

  useEffect(() => {
    if (hecho.current) return; // StrictMode monta dos veces; el token se canjea una.
    hecho.current = true;
    const token = window.location.hash.slice(1);
    window.history.replaceState(null, "", "/portal/entrar");
    if (!token) {
      setError("Este enlace está incompleto. Ábrelo tal como te llegó, sin recortarlo.");
      return;
    }
    api("/auth/token", { metodo: "POST", cuerpo: { token } })
      .then(() => navegar("/portal", { replace: true }))
      .catch((e) => setError(e.message));
  }, [navegar]);

  return (
    <PortalShell titulo="Entrar">
      <div className="mx-auto max-w-md">
        {error ? (
          <Aviso tono="error">
            <p className="font-semibold">{error}</p>
            <p className="mt-2 text-muted-foreground">Escríbenos a contacto@maudev.cl y te enviamos un enlace nuevo.</p>
          </Aviso>
        ) : (
          <Aviso>Verificando tu acceso…</Aviso>
        )}
      </div>
    </PortalShell>
  );
}
