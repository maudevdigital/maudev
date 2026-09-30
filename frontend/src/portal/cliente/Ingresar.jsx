import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import PortalShell, { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/ingresar: para quien llega desde el menú y no desde su enlace. Acepta
// el enlace completo o solo el código (lo que va después del #). El canje tiene
// límite de intentos por IP en el backend, y un token de 256 bits no se adivina.
function extraerToken(texto) {
  const limpio = texto.trim();
  const i = limpio.indexOf("#");
  return i >= 0 ? limpio.slice(i + 1) : limpio;
}

export default function Ingresar() {
  const navegar = useNavigate();
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const ingresar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await api("/auth/token", { metodo: "POST", cuerpo: { token: extraerToken(valor) } });
      navegar("/portal", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PortalShell titulo="Ingresar">
      <div className="mx-auto max-w-lg">
        <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em]">Portal de clientes</h1>
        <p className="mt-3 text-muted-foreground">
          Pega el enlace de acceso que te enviamos. Ahí ves el avance de tu proyecto, sus fases y lo que está por aprobar.
        </p>
        <form onSubmit={ingresar} className="mt-8 grid gap-3">
          <label htmlFor="acceso" className="form-label">Enlace o código de acceso</label>
          <Input id="acceso" value={valor} onChange={(e) => setValor(e.target.value)} autoComplete="off" spellCheck={false}
            placeholder="https://maudev.cl/portal/entrar#…" className="h-12 bg-background font-mono text-sm" required />
          <button type="submit" disabled={enviando || !valor.trim()} className="btn btn-primary h-12 px-6 text-sm disabled:opacity-60">
            {enviando ? "Verificando…" : "Entrar"}
          </button>
        </form>
        {error && <div className="mt-4"><Aviso tono="error">{error}</Aviso></div>}
        <p className="mt-8 text-sm text-muted-foreground">
          ¿No tienes enlace o se venció? Escríbenos a <a href="mailto:contacto@maudev.cl" className="font-semibold text-primary hover:underline">contacto@maudev.cl</a> y te enviamos uno nuevo.
        </p>
      </div>
    </PortalShell>
  );
}
