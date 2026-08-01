import { BadgeCheck, BookOpenCheck, CalendarDays, MousePointerClick, Search, Send } from "lucide-react";

// La secuencia parte en el sitio, no en un mensaje suelto: así se ve para qué
// sirve la web y dónde entra, después, lo que se puede automatizar.
const stages = [
  { icon: Search, title: "Te buscan en Google", detail: "“barbería en Valparaíso”", state: "búsqueda" },
  { icon: MousePointerClick, title: "Entran a tu sitio", detail: "Carga rápido y se entiende", state: "visita" },
  { icon: Send, title: "Completan el formulario", detail: "Nombre, servicio y horario", state: "contacto" },
  { icon: BadgeCheck, title: "Reciben confirmación", detail: "Respuesta inmediata, no “te aviso”", state: "respuesta" },
  { icon: CalendarDays, title: "Queda agendado", detail: "El bloque se reserva solo", state: "agenda" },
  { icon: BookOpenCheck, title: "Te llega el contacto", detail: "Con todo el detalle, sin copiar nada", state: "registro" },
];

export default function ProcessDemo() {
  return (
    <section className="section-pad overflow-hidden bg-ink text-white" aria-labelledby="demo-title">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div>
          <span className="eyebrow eyebrow-on-dark">Del buscador al contacto</span>
          <h2 id="demo-title" className="section-title mt-4 text-white">Un sitio no es una vitrina: es el primer paso de una venta.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/62">
            Primero construimos la página que hace que te encuentren y te escriban. Después, si conviene, conectamos lo que viene detrás para que no dependa de que alguien esté mirando el teléfono.
          </p>
          <p className="mt-8 border-l border-primary pl-4 text-sm leading-relaxed text-white/55">
            Ejemplo: una consulta que llega desde el buscador y termina agendada.
          </p>
        </div>

        <div className="process-console" role="img" aria-label="Secuencia de seis pasos, desde una búsqueda en Google hasta una reserva agendada">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">recorrido del visitante</span>
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
                <span className="hidden rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/40 sm:inline">{state}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
