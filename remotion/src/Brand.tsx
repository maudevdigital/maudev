import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "./theme";
import { Icon, iconFor } from "./icons";

// Fondo on-brand: grid sutil + glow cian (igual vibe que el sitio).
export const gridBg: React.CSSProperties = {
  backgroundColor: COLORS.bg,
  backgroundImage: `linear-gradient(${COLORS.border}66 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}66 1px, transparent 1px)`,
  backgroundSize: "64px 64px",
};

export const Glow: React.FC<{ y?: string; accent?: string }> = ({ y = "26%", accent = COLORS.primary }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(circle at 50% ${y}, ${accent}26, transparent 60%)` }}
  />
);

export const Wordmark: React.FC<{ size?: number; accent?: string }> = ({ size = 46, accent = COLORS.primary }) => (
  <span style={{ color: COLORS.text, fontFamily: FONTS.sans, fontWeight: 800, fontSize: size }}>
    mau<span style={{ color: accent }}>dev</span>
  </span>
);

export const CategoryChip: React.FC<{ category: string; accent?: string }> = ({ category, accent = COLORS.primary }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      color: accent,
      fontFamily: FONTS.mono,
      fontSize: 26,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 2,
      border: `1px solid ${accent}55`,
      borderRadius: 14,
      padding: "10px 18px",
      background: `${accent}10`,
    }}
  >
    <Icon name={iconFor(category)} size={26} accent={accent} />
    {category}
  </span>
);

// Badge numerado para bullets (estilo checklist/paso a paso).
export const NumBadge: React.FC<{ n: number; size?: number; accent?: string }> = ({ n, size = 56, accent = COLORS.primary }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 16,
      background: `${accent}1a`,
      border: `1px solid ${accent}55`,
      color: accent,
      fontFamily: FONTS.mono,
      fontWeight: 700,
      fontSize: size * 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);
