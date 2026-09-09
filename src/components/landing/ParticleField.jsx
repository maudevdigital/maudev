import { useEffect, useRef, useState } from "react";

// Ruido determinista: la misma semilla da siempre el mismo valor, así que las
// posiciones no cambian entre renders ni parpadean al hidratar, pero se ven
// repartidas al azar. La fórmula anterior —(id * 37 + 7) % 100— distribuía
// demasiado parejo y el conjunto se leía como una retícula, no como un campo.
const azar = (semilla) => {
  const x = Math.sin(semilla * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// El recorrido es amplio a propósito: con desplazamientos de treinta píxeles el
// campo parecía vibrar en el sitio en vez de derivar.
const particles = Array.from({ length: 96 }, (_, id) => ({
  id,
  x: azar(id + 1) * 100,
  y: azar(id + 11) * 100,
  size: 1.6 + azar(id + 21) * 2.6,
  duration: 16 + azar(id + 31) * 14,
  delay: azar(id + 41) * 12,
  moveX: (azar(id + 51) - 0.5) * 190,
  moveY: (azar(id + 61) - 0.5) * 140,
}));

export default function ParticleField({ className = "" }) {
  const container = useRef(null);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    // 96 en escritorio. Sigue por debajo de las 120 originales, pero ya se lee
    // como un campo denso. En movil se mantiene bajo: ahi cada nodo pesa mas y
    // la pantalla es un tercio del ancho.
    const update = () => setCount(motion.matches ? 0 : mobile.matches ? 28 : 96);
    update();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    let inView = true;
    const visibility = () => setPaused(document.hidden || !inView);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); });
    if (container.current) observer.observe(container.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={container} aria-hidden="true" data-paused={paused} className={`particle-field pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.slice(0, count).map(p => (
        <span key={p.id} className="particle absolute rounded-full bg-primary" style={{
          left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
          "--move-x": `${p.moveX}px`, "--move-y": `${p.moveY}px`,
          // Retardo NEGATIVO: cada punto arranca con su ciclo ya empezado, asi
          // el campo aparece en movimiento en vez de partir todo alineado.
          animationDuration: `${p.duration}s`, animationDelay: `-${p.delay}s`,
        }} />
      ))}
    </div>
  );
}
