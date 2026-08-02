import { currencyList } from "@/data/currencies";

// Banderas de los países cuya moneda cotizamos.
//
// Van dibujadas en SVG y no como emoji: Windows no tiene glifos de bandera y
// muestra las dos letras del código en su lugar, así que el emoji se vería roto
// justo en el sistema operativo de la mayoría de los visitantes de escritorio.
// Tampoco son imágenes: siete PNG serían siete peticiones y un borrón al
// escalar; así son vectores nítidos que además heredan el borde del tema.
//
// Son un elemento de lectura, no un control: el cambio de moneda ya vive en el
// header y duplicarlo acá obligaba al visitante a preguntarse cuál de los dos
// manda. Van en círculos superpuestos, que es la forma con la que el ojo ya
// asocia "un grupo de gente o lugares" sin tener que leer nada.

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
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-5">
      <ul className="flex -space-x-2.5" aria-hidden="true">
        {currencyList.map(({ code, country }) => (
          <li
            key={code}
            title={code}
            className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-background transition-transform duration-200 hover:z-10 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 16" width="40" height="40" preserveAspectRatio="xMidYMid slice">
              {banderas[country] || banderas.CL}
            </svg>
          </li>
        ))}
      </ul>

      <p className="text-sm leading-snug text-muted-foreground">
        <strong className="font-semibold text-foreground">Cotizamos en tu moneda.</strong>{" "}
        Trabajamos a distancia con toda Latinoamérica.
      </p>
    </div>
  );
}
