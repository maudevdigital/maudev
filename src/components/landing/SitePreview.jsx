import { Gauge, Search, Smartphone } from "lucide-react";

// La demo del hero.
//
// Cuando lo que vendes son sitios web, la demostración tiene que ser un sitio,
// no un diagrama. Va construida en HTML y no como imagen: se ve nítida en
// cualquier pantalla, se adapta al tema y pesa lo que pesa el marcado.
//
// Las tres marcas de abajo son las que el cliente sí nota —que se encuentre,
// que cargue rápido y que se vea bien en el celular—; no son métricas de un
// proyecto real, así que se enuncian como criterios de construcción y no como
// resultados medidos.
const criterios = [
  { icon: Search, label: "Encontrable", detail: "Estructura y metadatos listos para buscadores" },
  { icon: Gauge, label: "Rápido", detail: "Sin plantillas cargadas de peso muerto" },
  { icon: Smartphone, label: "Móvil primero", detail: "Diseñado desde la pantalla chica" },
];

export default function SitePreview() {
  return (
    <figure
      className="site-preview"
      aria-label="Representación de un sitio web publicado y los criterios con que se construye"
    >
      {/* Barra del navegador */}
      <div className="site-preview-chrome">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="site-preview-url">tunegocio.cl</span>
      </div>

      {/* Maqueta del sitio: barras que sugieren la jerarquía sin fingir texto */}
      <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-7">
        <div className="flex items-center justify-between">
          <span className="h-2.5 w-16 rounded-full bg-white/25" aria-hidden="true" />
          <span className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-8 rounded-full bg-white/12" />
            <span className="h-2 w-8 rounded-full bg-white/12" />
            <span className="h-2 w-12 rounded-full bg-primary/70" />
          </span>
        </div>

        <div className="mt-8 space-y-2.5" aria-hidden="true">
          <span className="block h-4 w-4/5 rounded bg-white/80" />
          <span className="block h-4 w-3/5 rounded bg-white/80" />
        </div>
        <div className="mt-4 space-y-2" aria-hidden="true">
          <span className="block h-2 w-full rounded bg-white/14" />
          <span className="block h-2 w-11/12 rounded bg-white/14" />
        </div>

        <div className="mt-6 flex items-center gap-3" aria-hidden="true">
          <span className="h-8 w-32 rounded-full bg-primary" />
          <span className="h-8 w-20 rounded-full border border-white/15" />
        </div>

        <div className="mt-7 grid grid-cols-3 gap-2.5" aria-hidden="true">
          <span className="h-14 rounded-lg border border-white/10 bg-white/5" />
          <span className="h-14 rounded-lg border border-white/10 bg-white/5" />
          <span className="h-14 rounded-lg border border-white/10 bg-white/5" />
        </div>
      </div>

      <figcaption className="grid grid-cols-3 border-t border-white/10">
        {criterios.map(({ icon: Icon, label, detail }, index) => (
          <div
            key={label}
            className={`px-3 py-4 text-center ${index ? "border-l border-white/10" : ""}`}
          >
            <Icon className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
            <p className="mt-2 text-[11px] font-semibold text-white/85">{label}</p>
            <p className="mt-1 hidden text-[10px] leading-tight text-white/45 sm:block">{detail}</p>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
