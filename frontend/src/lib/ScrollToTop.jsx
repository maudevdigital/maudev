import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Lleva la vista al tope al cambiar de ruta. Si la URL trae ancla (#seccion,
// como los links del navbar cuando se pulsan fuera de la home), baja hasta
// ella — en el frame siguiente, porque la sección aún no está montada.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
