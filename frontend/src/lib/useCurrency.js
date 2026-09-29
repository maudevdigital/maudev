import { useEffect, useState } from "react";
import { BASE, getCurrency } from "@/data/currencies";

// Devuelve la moneda activa y vuelve a renderizar cuando cambia.
//
// Se escucha un evento del window en vez de montar un contexto global: los
// precios viven en componentes que no comparten árbol —hero, tarjetas de
// solución, páginas de servicio— y un provider por encima de toda la app era
// más cañería de la que el problema pide para un dato de presentación.
//
// El estado guarda un contador además del código, y no solo el código. Cuando
// llegan las tasas frescas se vuelve a emitir la MISMA moneda para repintar con
// el valor bueno; si el estado fuera solo el string, React vería el mismo valor,
// descartaría el render y el precio se quedaría en la tasa de respaldo para
// siempre. El contador garantiza que cada aviso produzca un estado distinto.
//
// El valor inicial es BASE y no getCurrency(): la lectura de localStorage se
// hace en el efecto, después del primer render, para que el HTML prerenderizado
// y el primer pintado coincidan siempre en pesos.
export function useCurrency() {
  const [estado, setEstado] = useState({ code: BASE, tick: 0 });

  useEffect(() => {
    setEstado((previo) => ({ code: getCurrency(), tick: previo.tick + 1 }));

    const alCambiar = (evento) =>
      setEstado((previo) => ({
        code: evento.detail || getCurrency(),
        tick: previo.tick + 1,
      }));

    window.addEventListener("maudev:moneda", alCambiar);
    return () => window.removeEventListener("maudev:moneda", alCambiar);
  }, []);

  return estado.code;
}
