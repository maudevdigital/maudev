import { currencyList, getCurrency, refreshRates, setCurrency, BASE } from "@/data/currencies";
import { useCurrency } from "@/lib/useCurrency";
import { trackAction } from "@/lib/MetaPixelTracker";

// Banderas de los países cuya moneda cotizamos.
//
// Van dibujadas en SVG y no como emoji: Windows no tiene glifos de bandera y
// muestra las dos letras del código en su lugar, así que el emoji se vería roto
// justo en el sistema operativo de la mayoría de los visitantes de escritorio.
// Tampoco son imágenes: siete PNG serían siete peticiones y un borrón al
// escalar; así son vectores nítidos que además heredan el borde del tema.
//
// Y no son decoración: al pulsar una, el sitio cambia a esa moneda. Eso le da
// una función al bloque y hace descubrible el selector del header, que pasa
// desapercibido por estar entre los botones.

const banderas = {
  CL: (
    <>
      <rect width="24" height="8" fill="#fff" />
      <rect y="8" width="24" height="8" fill="#D52B1E" />
      <rect width="8" height="8" fill="#0039A6" />
      <path d="M4 2.1l.62 1.9h2l-1.62 1.18.62 1.9L4 5.9 2.38 7.08 3 5.18 1.38 4h2z" fill="#fff" />
    </>
  ),
  US: (
    <>
      <rect width="24" height="16" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 2.46} width="24" height="1.23" fill="#B22234" />
      ))}
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </>
  ),
  EU: (
    <>
      <rect width="24" height="16" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <circle key={i} cx={12 + Math.sin(a) * 4.6} cy={8 - Math.cos(a) * 4.6} r="0.85" fill="#FFCC00" />;
      })}
    </>
  ),
  MX: (
    <>
      <rect width="8" height="16" fill="#006847" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#CE1126" />
      <circle cx="12" cy="8" r="2.1" fill="none" stroke="#8B5A2B" strokeWidth="1.1" />
    </>
  ),
  AR: (
    <>
      <rect width="24" height="5.33" fill="#74ACDF" />
      <rect y="5.33" width="24" height="5.34" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#74ACDF" />
      <circle cx="12" cy="8" r="1.9" fill="#F6B40E" />
    </>
  ),
  PE: (
    <>
      <rect width="8" height="16" fill="#D91023" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#D91023" />
    </>
  ),
  CO: (
    <>
      <rect width="24" height="8" fill="#FCD116" />
      <rect y="8" width="24" height="4" fill="#003893" />
      <rect y="12" width="24" height="4" fill="#CE1126" />
    </>
  ),
};

export default function CountryFlags() {
  const activa = useCurrency();

  const elegir = (code) => {
    setCurrency(code);
    trackAction("moneda_bandera", { moneda: code });
    const avisar = () => window.dispatchEvent(new CustomEvent("maudev:moneda", { detail: code }));
    avisar();
    if (code !== BASE) refreshRates().then(avisar);
  };

  return (
    <div className="mt-7 border-t border-border pt-5">
      <ul className="flex flex-wrap gap-1.5">
        {currencyList.map(({ code, country }) => {
          const seleccionada = code === (activa || getCurrency());
          return (
            <li key={code}>
              <button
                type="button"
                onClick={() => elegir(code)}
                aria-pressed={seleccionada}
                aria-label={`Ver precios en ${code}`}
                className={`group flex items-center gap-2 rounded-lg border py-1.5 pl-1.5 pr-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  seleccionada
                    ? "border-primary/50 bg-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-secondary"
                }`}
              >
                <svg
                  viewBox="0 0 24 16"
                  width="22"
                  height="15"
                  aria-hidden="true"
                  className="shrink-0 rounded-[3px] shadow-[0_0_0_1px_hsl(var(--ink)/0.12)]"
                >
                  {banderas[country] || banderas.CL}
                </svg>
                <span
                  className={`font-mono text-[10px] font-bold tracking-wide ${
                    seleccionada ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {code}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-sm leading-snug text-muted-foreground">
        <strong className="font-semibold text-foreground">Cotizamos en tu moneda.</strong>{" "}
        Trabajamos a distancia con toda Latinoamérica.
      </p>
    </div>
  );
}
