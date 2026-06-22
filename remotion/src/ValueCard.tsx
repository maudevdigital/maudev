import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "./theme";
import type { Tip } from "./tips";

// Tarjeta estática 1080x1350 (4:5) — para post unitario o como página de carrusel.
// Render: `remotion still ValueCard out/card.png --props='{...}'`.
export const ValueCard: React.FC<Tip> = ({ category, title, bullets, outro }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.sans, padding: 80, justifyContent: "space-between" }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 25%, ${COLORS.primary}1f, transparent 60%)` }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: COLORS.text, fontWeight: 800, fontSize: 42 }}>
          mau<span style={{ color: COLORS.primary }}>dev</span>
        </span>
        <span
          style={{
            color: COLORS.primary,
            fontFamily: FONTS.mono,
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: 3,
            border: `1px solid ${COLORS.primary}55`,
            borderRadius: 10,
            padding: "8px 16px",
          }}
        >
          {category}
        </span>
      </div>

      {/* Cuerpo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: COLORS.text, lineHeight: 1.08, marginBottom: 50 }}>
          {title}
        </div>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: 30 }}>
            <div style={{ width: 16, height: 16, borderRadius: 5, background: COLORS.primary, marginTop: 12, flexShrink: 0 }} />
            <div style={{ color: COLORS.text, fontSize: 40, lineHeight: 1.25 }}>{b}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.border}`, paddingTop: 28 }}>
        <span style={{ color: COLORS.primary, fontSize: 30, fontWeight: 700 }}>{outro}</span>
        <span style={{ color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 28 }}>maudev.cl</span>
      </div>
    </AbsoluteFill>
  );
};
