import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { precioPlan } from "@shared/oferta";
import { trackAction } from "@/lib/MetaPixelTracker";

// Tarjetas de planes de cualquier servicio. En escritorio usan subgrid: título,
// precio, resumen, lista y botón quedan a la misma altura en todas las tarjetas.
// El plan destacado va en tarjeta oscura invertida, no con un borde de color.
export default function Planes({ planes }) {
  const columnas = planes.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <div className={`mt-12 grid gap-6 ${columnas} lg:grid-rows-[auto_auto_auto_1fr_auto] lg:gap-y-0`}>
      {planes.map((plan) => (
        <article
          key={plan.id}
          className={`flex flex-col rounded-2xl border p-6 sm:p-8 lg:row-span-5 lg:grid lg:grid-rows-subgrid ${plan.destacado ? "card-invertida border-transparent" : "border-border bg-card"}`}
        >
          <div>
            {/* En los demás planes la etiqueta ocupa su lugar sin verse, para que
                los títulos queden a la misma altura. */}
            <span className={`eyebrow ${plan.destacado ? "" : "hidden lg:inline-flex lg:invisible"}`} aria-hidden={!plan.destacado}>Recomendado</span>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{plan.nombre}</h3>
          </div>
          <p className="cifra mt-3 text-xl font-bold text-primary">{precioPlan(plan)}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.resumen}</p>
          <ul className="mb-8 mt-6 grid content-start gap-3 text-sm">
            {plan.incluye.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            to={`/contacto?plan=${plan.id}`}
            onClick={() => trackAction("cta_principal_click", { ubicacion: `plan-${plan.id}` })}
            className={`btn mt-auto h-12 px-6 text-sm ${plan.destacado ? "btn-primary" : "btn-ghost"}`}
          >
            Solicitar {plan.nombre.toLowerCase()}
          </Link>
        </article>
      ))}
    </div>
  );
}
