import { useState } from "react";
import { toast } from "sonner";
import TurnstileGate from "@/components/landing/TurnstileGate";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitDerechos } from "@/lib/leads";

// Canal para ejercer los derechos de la Ley 21.719. Antes era solo un mailto:
// sin folio ni plazo registrado, no había cómo demostrar cuándo llegó una
// solicitud ni si se respondió a tiempo. El worker la guarda con fecha límite.
const TIPOS = [
  ["acceso", "Acceso: recibir una copia de mis datos"],
  ["rectificacion", "Rectificación: corregir mis datos"],
  ["supresion", "Supresión: borrar mis datos"],
  ["oposicion", "Oposición: dejar de usar mis datos para algo concreto"],
  ["portabilidad", "Portabilidad: recibir mis datos en un formato reutilizable"],
  ["bloqueo", "Bloqueo: suspender el uso de mis datos mientras se resuelve un reclamo"],
];

export default function SolicitudDerechos() {
  const [form, setForm] = useState({ tipo: "supresion", nombre: "", email: "", detalle: "" });
  const [honeypot, setHoneypot] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const update = (campo) => (event) => setForm((f) => ({ ...f, [campo]: event.target.value }));

  const enviar = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      setResultado(await submitDerechos({ ...form, empresa_web: honeypot }));
    } catch {
      toast.error("No pudimos registrar la solicitud.", { description: "Escríbenos a contacto@maudev.cl y la registramos a mano." });
    } finally {
      setEnviando(false);
    }
  };

  if (resultado?.folio) {
    const fecha = new Date(`${resultado.vence_el}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
    return (
      <div className="rounded-xl border border-primary bg-card p-6" role="status">
        <p className="text-base font-bold">Solicitud registrada con el folio {resultado.folio}.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te responderemos al correo que indicaste a más tardar el {fecha}. Antes de entregar o modificar datos te pediremos verificar tu identidad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="relative grid gap-5 rounded-xl border border-border bg-card p-6">
      <input type="text" name="empresa_web" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <div>
        <label htmlFor="derecho-tipo" className="form-label">Qué quieres hacer</label>
        <select id="derecho-tipo" value={form.tipo} onChange={update("tipo")} className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm">
          {TIPOS.map(([id, etiqueta]) => <option key={id} value={id}>{etiqueta}</option>)}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="derecho-nombre" className="form-label">Nombre</label>
          <Input id="derecho-nombre" autoComplete="name" value={form.nombre} onChange={update("nombre")} className="mt-2 h-12 bg-background" required />
        </div>
        <div>
          <label htmlFor="derecho-email" className="form-label">Correo</label>
          <Input id="derecho-email" type="email" autoComplete="email" value={form.email} onChange={update("email")} className="mt-2 h-12 bg-background" required />
        </div>
      </div>
      <div>
        <label htmlFor="derecho-detalle" className="form-label">Detalle (opcional)</label>
        <Textarea id="derecho-detalle" value={form.detalle} onChange={update("detalle")} className="mt-2 bg-background" rows={3} placeholder="Ej. qué dato corregir o desde qué formulario nos escribiste" />
      </div>
      <p className="text-xs text-muted-foreground">Usamos estos datos solo para responder tu solicitud y los conservamos 24 meses como constancia.</p>
      <TurnstileGate />
      <button type="submit" disabled={enviando} className="btn btn-primary h-12 px-6 text-sm disabled:opacity-60">
        {enviando ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
