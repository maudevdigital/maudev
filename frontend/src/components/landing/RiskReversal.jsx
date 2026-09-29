import { ShieldCheck, FileSignature, KeyRound } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// REVERSIÓN DE RIESGO
//
// Va pegado al precio, no en una sección aparte más abajo. La objeción "¿y si me
// estafa / si no funciona?" aparece en el instante exacto en que el visitante lee
// la cifra; contestarla tres pantallas después es tarde.
//
// Las tres promesas son verificables y ya están en /terminos. No hay que inventar
// nada: garantía de 30 días (§04), precio fijo por escrito (§03) y propiedad del
// código (§06). Si alguna cambia allá, cambiarla acá.
//
// Deliberadamente NO lleva testimonios: hoy el sitio no tiene ni una cita real de
// cliente. Fabricar prueba social es la forma más rápida de perder la venta
// cuando alguien la verifica.
// ─────────────────────────────────────────────────────────────────────────────

const items = [
  {
    icon: ShieldCheck,
    title: "30 días de garantía",
    body: "Si no hace lo acordado, lo arreglo sin costo. Si no tiene arreglo, te devuelvo lo pagado.",
  },
  {
    icon: FileSignature,
    title: "Precio fijo por escrito",
    body: "El valor de arriba es el final. Nada de costos que aparecen a mitad de camino.",
  },
  {
    icon: KeyRound,
    title: "El código queda tuyo",
    body: "Credenciales y repositorio a tu nombre. Si mañana no me quieres, te lo llevas.",
  },
];

export default function RiskReversal({ className = "" }) {
  return (
    <div className={`rounded-xl border border-border/60 bg-card/50 p-4 ${className}`}>
      <ul className="space-y-3">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
