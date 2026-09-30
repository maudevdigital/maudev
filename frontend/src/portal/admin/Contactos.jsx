import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminShell, { Encabezado } from "@/portal/admin/AdminShell";
import { Aviso } from "@/portal/PortalShell";
import { api } from "@/portal/api";

// /portal/admin/contactos: lo que llega por el formulario del sitio. Antes solo
// existía en el correo de aviso. Un contacto con correo se convierte en cliente
// con un clic, y queda listo para crearle proyecto y enlace de acceso.
const fechaHora = (texto) => {
  const d = new Date(`${String(texto).replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

export default function Contactos() {
  const navegar = useNavigate();
  const [lista, setLista] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { api("/admin/contactos").then((d) => setLista(d.contactos)).catch(setError); }, []);

  const convertir = async (c) => {
    try {
      const { id } = await api("/admin/clientes", {
        metodo: "POST",
        cuerpo: { nombre: c.name || c.email, email: c.email, notas: [c.interest, c.message].filter(Boolean).join("\n\n") || undefined },
      });
      navegar(`/portal/admin/clientes/${id}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AdminShell titulo="Contactos">
      <Encabezado titulo="Contactos" bajada="Últimos 200 mensajes del formulario. Se borran solos a los 12 meses." />
      {error && <Aviso tono="error">{error.message}</Aviso>}
      <div className="grid gap-3">
        {lista?.map((c) => (
          <article key={c.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{c.name || "Sin nombre"}</p>
                <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm">
                  {c.email && <a href={`mailto:${c.email}`} className="text-primary hover:underline">{c.email}</a>}
                  {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{c.whatsapp}</a>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="cifra text-xs text-muted-foreground">{fechaHora(c.created_at)}</span>
                {c.email && <button type="button" onClick={() => convertir(c)} className="btn btn-ghost h-9 px-3 text-xs">Convertir en cliente</button>}
              </div>
            </div>
            {c.interest && <p className="mt-3 text-sm font-semibold">{c.interest}</p>}
            {c.message && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.message}</p>}
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {[c.page_path && `desde ${c.page_path}`, c.utm_source && `utm ${c.utm_source}${c.utm_campaign ? ` / ${c.utm_campaign}` : ""}`, c.referrer && `ref ${c.referrer}`].filter(Boolean).join(" · ") || "origen directo"}
            </p>
          </article>
        ))}
        {lista?.length === 0 && <Aviso>Todavía no llegan contactos.</Aviso>}
        {!lista && !error && [0, 1, 2].map((i) => <div key={i} className="esqueleto h-28" />)}
      </div>
    </AdminShell>
  );
}
