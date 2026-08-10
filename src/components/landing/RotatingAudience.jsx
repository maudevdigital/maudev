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
// Cada línea nombra el rubro Y la situación que lo trae. Antes decía solo
// "para barberías", que informaba a quién sin decir por qué: cualquiera de los
// seis rubros podía leerla y seguir de largo. Nombrar el síntoma hace que el
// que lo vive se detenga, y el que no, sepa en dos segundos que no es para él.
const rubros = [
  { quien: "barberías", situacion: "que agendan hora por mensaje, una por una" },
  { quien: "talleres", situacion: "a los que piden presupuesto por Instagram" },
  { quien: "consultoras", situacion: "que explican lo mismo en cada reunión" },
  { quien: "restaurantes", situacion: "que anotan los pedidos a mano" },
  { quien: "tiendas", situacion: "que hoy solo venden por redes sociales" },
  { quien: "profesionales", situacion: "que no aparecen al buscarlos en Google" },
];

// Más lento que antes: ahora hay una frase que leer, no una palabra.
const INTERVALO = 3800;

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
    <p className="mt-5 text-base text-muted-foreground sm:text-lg">
      <span aria-hidden="true">
        Para{" "}
        <span
          className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <strong className="font-semibold text-foreground">{rubros[indice].quien}</strong>{" "}
          {rubros[indice].situacion}
        </span>
      </span>
      <span className="sr-only">
        Para {rubros.map((r) => `${r.quien} ${r.situacion}`).join("; ")}.
      </span>
    </p>
  );
}
