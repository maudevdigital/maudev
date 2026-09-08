import { useEffect, useRef, useState } from "react";

// Posiciones estables, pocos elementos y movimiento solo con transform.
const particles = Array.from({ length: 32 }, (_, id) => ({
  id, x: (id * 37 + 7) % 100, y: (id * 23 + 13) % 100,
  size: 2 + id % 3, duration: 20 + id % 12,
  moveX: (id % 2 ? -1 : 1) * (14 + id % 24), moveY: -12 - id % 28,
}));

export default function ParticleField({ className = "" }) {
  const container = useRef(null);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const update = () => setCount(motion.matches ? 0 : mobile.matches ? 12 : 32);
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
          animationDuration: `${p.duration}s`, animationDelay: `${-p.id}s`,
        }} />
      ))}
    </div>
  );
}
