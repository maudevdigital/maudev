import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import PageShell from "@/components/landing/PageShell";
import { useSeo } from "@/lib/useSeo";
import guias from "@/data/guias-indice.json";

const fecha = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });

// /guias: el listado de guías publicadas desde el panel admin.
export default function Guias() {
  useSeo({
    title: "Guías sobre la Ley 21.719 y tecnología para empresas · Maudev",
    description: "Guías prácticas sobre la Ley 21.719 de datos personales: prórroga, cookies, formularios y derechos ARCOP, escritas desde la implementación técnica.",
    path: "/guias",
    image: "/og-image.png",
  });

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-20 pt-30 sm:pt-36">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Guías" }]} />
            <h1 className="max-w-[20ch] text-5xl font-extrabold leading-[1] tracking-[-0.04em] sm:text-6xl">Guías para ponerse al día.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ley 21.719 y tecnología para empresas, explicadas desde la implementación: qué cambia, qué revisar y cómo hacerlo.
            </p>
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {guias.map((g) => (
                <li key={g.slug}>
                  <Link to={`/guias/${g.slug}`} className="panel-hover group flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                    <span className="cifra font-mono text-xs text-muted-foreground">{fecha(g.actualizado_el)} · {g.minutos} min</span>
                    <h2 className="mt-3 text-xl font-extrabold tracking-tight">{g.titulo}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.descripcion}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
                      Leer guía <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
              {guias.length === 0 && <li className="text-muted-foreground">Pronto publicaremos las primeras guías.</li>}
            </ul>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
