import {
  BadgeCheck,
  CalendarCheck2,
  CreditCard,
  FileCheck2,
  MessageCircle,
  Route,
} from "lucide-react";

const steps = [
  { label: "Mensaje", icon: MessageCircle },
  { label: "Clasificación", icon: Route },
  { label: "Reserva", icon: CalendarCheck2 },
  { label: "Pago", icon: CreditCard },
  { label: "Factura", icon: FileCheck2 },
  { label: "Confirmación", icon: BadgeCheck },
];

export default function AutomationFlow() {
  return (
    <figure className="automation-canvas" aria-label="Ejemplo de un proceso automatizado desde un mensaje hasta su confirmación">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgb(52_211_153/0.1)]" aria-hidden="true" />
          Flujo activo
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">en tiempo real</span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#6ee7a0]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] text-white/45">Mensaje recibido · 09:41</p>
            <p className="mt-1 text-sm font-semibold text-white">“Quiero reservar para mañana”</p>
          </div>
        </div>

        <ol className="flow-grid">
          {steps.map(({ label, icon: Icon }, index) => (
            <li key={label} className="flow-step" style={{ "--step-delay": `${index * 0.34}s` }}>
              <span className="flow-step-icon">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ol>

        <figcaption className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">Resultado</span>
            <span className="mt-0.5 block text-sm font-bold">Reserva confirmada y registrada</span>
          </span>
          <BadgeCheck className="h-6 w-6 shrink-0" aria-hidden="true" />
        </figcaption>
      </div>
    </figure>
  );
}
