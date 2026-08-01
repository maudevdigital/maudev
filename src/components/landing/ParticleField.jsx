import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Fondo de partículas (CSS puro, sin canvas ni librería).
//
// Cada punto es un div con `transform` animado por keyframes (`particleFloat`
// en index.css): la animación corre en el compositor, así que no cuesta CPU en
// scroll. Se generan en el cliente y después del primer paint para no retrasar
// el LCP del hero, menos en móvil, y ninguna si el usuario pidió menos motion.
// ─────────────────────────────────────────────────────────────────────────────

export default function ParticleField({ className = "" }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = window.innerWidth < 768 ? 44 : 120;
    setParticles(
      Array.from({ length: count }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.6,
        duration: Math.random() * 14 + 12,
        delay: Math.random() * 6,
        moveX: (Math.random() - 0.5) * 120,
        moveY: (Math.random() - 0.5) * 90,
      }))
    );
  }, []);

  if (!particles.length) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle absolute rounded-full bg-primary"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            "--move-x": `${p.moveX}px`,
            "--move-y": `${p.moveY}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
