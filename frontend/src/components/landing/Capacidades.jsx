import { Link } from "react-router-dom";
import { ArrowUpRight, Bot, Code2, KeyRound, LifeBuoy, ShieldCheck } from "lucide-react";
import { capacidades, clp } from "@shared/oferta";

// Grilla bento de 6 columnas: Ley 21.719 e IA arriba y grandes (son los
// pilares); abajo Desarrollo, Soporte y el portal de clientes, que es la prueba
// de cómo se trabaja. El precio "desde" se lee de la oferta.
const orden = [
  { id: "ley-21719", icono: ShieldCheck, grande: true },
  { id: "ia", icono: Bot, grande: true },
  { id: "desarrollo", icono: Code2 },
  { id: "soporte", icono: LifeBuoy },
];

function desde(c) {
  const p = c.planes[0];
  if (p.precio != null) return `Desde ${clp(p.precio)}`;
  return `Desde ${clp(p.mensual)}/mes`;
}

export default function Capacidades() {
  return (
    <section id="servicios" className="section-pad scroll-mt-20" aria-labelledby="servicios-titulo">
      <div className="site-container">
        <span className="eyebrow">Servicios</span>
        <h2 id="servicios-titulo" className="section-title mt-4">Cuatro cosas, bien hechas.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {orden.map(({ id, icono: Icono, grande }) => {
            const c = capacidades[id];
            return (
              <Link
                key={id}
                to={c.path}
                className={`panel-hover group flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 ${grande ? "lg:col-span-3 lg:min-h-64" : "lg:col-span-2"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <Icono className="h-6 w-6 text-primary" aria-hidden="true" />
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
                <h3 className={`mt-6 font-extrabold tracking-tight ${grande ? "text-3xl" : "text-xl"}`}>{c.nombre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.resumen}</p>
                <p className="cifra mt-auto pt-6 font-mono text-sm font-semibold text-primary">{desde(c)} + IVA</p>
              </Link>
            );
          })}
          <Link
            to="/portal/ingresar"
            className="card-invertida group flex flex-col rounded-2xl border border-transparent p-6 sm:p-8 sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-start justify-between gap-4">
              <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-extrabold tracking-tight">Portal de clientes</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Cada proyecto se sigue en línea: avance por fases, lo que está por aprobar y las horas de soporte usadas.</p>
            <p className="mt-auto pt-6 font-mono text-sm font-semibold text-primary">Incluido en todos los servicios</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
