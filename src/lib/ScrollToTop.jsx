import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Lleva la vista al tope al cambiar de ruta (excepto cuando hay un ancla #).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
