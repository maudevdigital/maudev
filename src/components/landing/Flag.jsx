// Banderas en SVG, compartidas por el bloque del hero y el selector del header.
//
// No son emoji: Windows no tiene glifos de bandera y los reemplaza por las dos
// letras del codigo, asi que se verian rotas justo en el sistema operativo de la
// mayoria de los visitantes de escritorio.
//
// Van dibujadas sobre un lienzo CUADRADO y no en el 3:2 real de una bandera.
// Recortar un rectangulo a circulo le come los costados, que es donde vive la
// informacion: Mexico perdia sus bandas verde y roja y Chile quedaba casi toda
// estrella. En cuadrado cada una conserva sus elementos dentro del circulo.

const banderas = {
  CL: (
    <>
      <rect width="24" height="12" fill="#fff" />
      <rect y="12" width="24" height="12" fill="#D52B1E" />
      <rect width="11" height="12" fill="#0039A6" />
      <path d="M5.5 3.4l1.06 3.27h3.44L7.22 8.7l1.06 3.27L5.5 9.95l-2.78 2.02L3.78 8.7 1 6.67h3.44z" fill="#fff" />
    </>
  ),
  US: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 3.7} width="24" height="1.85" fill="#B22234" />
      ))}
      <rect width="11" height="12.95" fill="#3C3B6E" />
    </>
  ),
  EU: (
    <>
      <rect width="24" height="24" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <circle key={i} cx={12 + Math.sin(a) * 7} cy={12 - Math.cos(a) * 7} r="1.3" fill="#FFCC00" />;
      })}
    </>
  ),
  MX: (
    <>
      <rect width="8" height="24" fill="#006847" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#CE1126" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#8B5A2B" strokeWidth="1.5" />
    </>
  ),
  AR: (
    <>
      <rect width="24" height="8" fill="#74ACDF" />
      <rect y="8" width="24" height="8" fill="#fff" />
      <rect y="16" width="24" height="8" fill="#74ACDF" />
      <circle cx="12" cy="12" r="2.8" fill="#F6B40E" />
    </>
  ),
  PE: (
    <>
      <rect width="8" height="24" fill="#D91023" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#D91023" />
    </>
  ),
  CO: (
    <>
      <rect width="24" height="12" fill="#FCD116" />
      <rect y="12" width="24" height="6" fill="#003893" />
      <rect y="18" width="24" height="6" fill="#CE1126" />
    </>
  ),
};

export default function Flag({ country, size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {banderas[country] || banderas.CL}
    </svg>
  );
}
