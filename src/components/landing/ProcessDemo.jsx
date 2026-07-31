import { BadgeCheck, BookOpenCheck, CalendarDays, Database, MessageCircle, ScanSearch } from "lucide-react";

const stages = [
  { icon: MessageCircle, title: "El cliente escribe", detail: "“¿Tienen hora mañana?”", state: "entrada" },
  { icon: ScanSearch, title: "El sistema interpreta", detail: "Detecta servicio y fecha", state: "proceso" },
  { icon: Database, title: "Consulta información", detail: "Revisa disponibilidad", state: "consulta" },
  { icon: CalendarDays, title: "Ejecuta la acción", detail: "Reserva el bloque disponible", state: "acción" },
  { icon: BadgeCheck, title: "Confirma al cliente", detail: "Envía el detalle por WhatsApp", state: "salida" },
  { icon: BookOpenCheck, title: "Registra el resultado", detail: "Actualiza agenda y seguimiento", state: "registro" },
];

export default function ProcessDemo() {
  return (
    <section className="section-pad overflow-hidden bg-ink text-white" aria-labelledby="demo-title">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div>
          <span className="eyebrow eyebrow-on-dark">Un proceso, de punta a punta</span>
          <h2 id="demo-title" className="section-title mt-4 text-white">La automatización toma el relevo donde hoy interviene una persona.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/62">
            Cada paso queda definido y conectado. Si aparece una excepción, el sistema puede derivarla a tu equipo en vez de improvisar.
          </p>
          <p className="mt-8 border-l border-primary pl-4 text-sm leading-relaxed text-white/55">
            Ejemplo: solicitud de reserva recibida por WhatsApp.
          </p>
        </div>

        <div className="process-console" role="img" aria-label="Secuencia de seis pasos de una automatización de reserva">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">registro del flujo</span>
            <span className="flex items-center gap-2 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" /> operativo
            </span>
          </div>
          <ol className="p-3 sm:p-5">
            {stages.map(({ icon: Icon, title, detail, state }, index) => (
              <li key={title} className="process-event" style={{ "--event-delay": `${index * 0.42}s` }}>
                <span className="process-event-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="process-event-icon"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">{title}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/48">{detail}</span>
                </span>
                <span className="hidden rounded-full border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/40 sm:inline">{state}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
