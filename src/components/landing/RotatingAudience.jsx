import { useEffect, useState } from "react";

// Línea rotativa bajo el titular: "Para barberías", "Para talleres"…
//
// El titular dice qué se vende; esta línea dice a quién. El visitante se
// reconoce en dos segundos sin que el H1 tenga que nombrar a nadie.
//
// Son rubros para los que el servicio aplica, no una lista de clientes: decir
// "para barberías" es posicionamiento, decir "trabajamos con barberías" sería
// un claim que habría que respaldar.
//
// Accesibilidad: la parte que rota va aria-hidden y se ofrece la lista completa
// a lectores de pantalla en un texto estático. Si se dejara visible al lector,
// anunciaría un cambio cada tres segundos y volvería la página inusable.
const rubros = [
  "barberías y salones",
  "talleres y repuestos",
  "servicios profesionales",
  "restaurantes",
  "tiendas online",
  "consultoras",
];

const INTERVALO = 2600;

export default function RotatingAudience() {
  const [indice, setIndice] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Dos tiempos: se apaga, se cambia el texto y se vuelve a encender. Cambiar
    // el texto con la opacidad arriba produce un salto brusco.
    const ciclo = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndice((previo) => (previo + 1) % rubros.length);
        setVisible(true);
      }, 320);
    }, INTERVALO);

    return () => clearInterval(ciclo);
  }, []);

  return (
    <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
      <span aria-hidden="true">
        Para{" "}
        <span
          className={`font-semibold text-foreground transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {rubros[indice]}
        </span>
      </span>
      <span className="sr-only">
        Para {rubros.slice(0, -1).join(", ")} y {rubros.at(-1)}.
      </span>
    </p>
  );
}
