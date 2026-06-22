import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "./theme";
import { Glow, Wordmark, CategoryChip, NumBadge } from "./Brand";
import { skinFor } from "./skins";
import type { Tip } from "./tips";

// Tarjeta estática 1080x1350 (4:5) — post unitario o página de carrusel.
// `skin` (0..3) varía el estilo manteniendo la marca (armónico en el feed).
// Render: `remotion still ValueCard out/card.png --props='{...}'`.
export const ValueCard: React.FC<Tip & { skin?: number }> = ({ category, title, bullets, outro, skin = 0 }) => {
  const sk = skinFor(skin);
  return (
    <AbsoluteFill style={{ ...sk.bg, fontFamily: FONTS.sans, padding: 80, justifyContent: "space-between" }}>
      <Glow y={sk.glowY} accent={sk.accent} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark size={42} accent={sk.accent} />
        <CategoryChip category={category} accent={sk.accent} />
      </div>

      {/* Cuerpo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 74, fontWeight: 900, color: COLORS.text, lineHeight: 1.06, letterSpacing: -1, marginBottom: 50 }}>
          {title}
        </div>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 28 }}>
            <NumBadge n={i + 1} size={50} accent={sk.accent} />
            <div style={{ color: COLORS.text, fontSize: 40, lineHeight: 1.22 }}>{b}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.border}`, paddingTop: 28 }}>
        <span style={{ color: sk.accent, fontSize: 30, fontWeight: 700 }}>{outro}</span>
        <span style={{ color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 28 }}>maudev.cl</span>
      </div>
    </AbsoluteFill>
  );
};
