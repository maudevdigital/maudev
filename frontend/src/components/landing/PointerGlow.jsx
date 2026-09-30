import { useEffect, useRef, useState } from "react";

// Foco de luz que sigue al puntero, en todo el sitio.
//
// Antes vivía dentro del hero y solo existía en la portada. Acá es una capa fija
// al viewport, así que las coordenadas del evento sirven tal cual y no hay que
// medir la caja del contenedor en cada movimiento.
//
// Se pinta detrás del contenido con z-index negativo. Para que eso funcione, el
// contenedor de la página necesita `isolation: isolate`: sin él la capa cae por
// debajo del fondo opaco de la página y no se ve nada.
export default function PointerGlow() {
  const nodo = useRef(null);
  const frame = useRef(0);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    // En pantallas táctiles no se instala nada: no hay puntero que seguir, y
    // un listener de movimiento ahí solo gasta batería.
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // El escritor va dentro de un rAF: pointermove dispara decenas de veces por
    // segundo y escribir la variable en cada evento repinta de más sin que el
    // ojo note la diferencia.
    const mover = (evento) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        nodo.current?.style.setProperty("--mx", `${evento.clientX}px`);
        nodo.current?.style.setProperty("--my", `${evento.clientY}px`);
        setActivo(true);
      });
    };
    // Al salir el puntero de la ventana la luz se apaga en vez de quedarse
    // encendida en el último punto, que se lee como una mancha olvidada.
    const salir = () => setActivo(false);

    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", salir);
    };
  }, []);

  return <div ref={nodo} data-activo={activo} className="pointer-glow" aria-hidden="true" />;
}
