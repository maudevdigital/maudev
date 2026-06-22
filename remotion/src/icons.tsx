import { COLORS } from "./theme";

// Íconos de línea simples (estilo lucide), elegidos según la categoría del tip.
export const iconFor = (category: string): string => {
  const c = category.toLowerCase();
  if (c.includes("autom")) return "bolt";
  if (c.includes("seo")) return "search";
  if (c.includes("pago")) return "card";
  if (c.includes("antes") || c.includes("confianza") || c.includes("contrato")) return "shield";
  if (c.includes("software") || c.includes("web") || c.includes("código") || c.includes("codigo")) return "code";
  return "bolt";
};

export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 28,
  color = COLORS.primary,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {name === "search" ? (
      <>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ) : name === "card" ? (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ) : name === "shield" ? (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ) : name === "code" ? (
      <>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </>
    ) : (
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    )}
  </svg>
);
