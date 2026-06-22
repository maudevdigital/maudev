import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONTS } from "./theme";
import type { Tip } from "./tips";

// Reel vertical 1080x1920 (~12s). Texto animado con valor + outro al "link en bio".
export const TipReel: React.FC<Tip> = ({ category, title, bullets, outro }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const outroOp = interpolate(frame, [durationInFrames - 90, durationInFrames - 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.sans, padding: 90 }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 28%, ${COLORS.primary}22, transparent 60%)` }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: enter(0) }}>
        <span style={{ color: COLORS.text, fontWeight: 800, fontSize: 46 }}>
          mau<span style={{ color: COLORS.primary }}>dev</span>
        </span>
        <span
          style={{
            color: COLORS.primary,
            fontFamily: FONTS.mono,
            fontSize: 26,
            textTransform: "uppercase",
            letterSpacing: 3,
            border: `1px solid ${COLORS.primary}55`,
            borderRadius: 12,
            padding: "10px 18px",
          }}
        >
          {category}
        </span>
      </div>

      {/* Título */}
      <div
        style={{
          marginTop: 120,
          fontSize: 84,
          fontWeight: 900,
          color: COLORS.text,
          lineHeight: 1.05,
          opacity: enter(6),
          transform: `translateY(${interpolate(enter(6), [0, 1], [40, 0])}px)`,
        }}
      >
        {title}
      </div>

      {/* Bullets */}
      <div style={{ marginTop: 70 }}>
        {bullets.map((b, i) => {
          const d = 18 + i * 12;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 26,
                alignItems: "flex-start",
                marginBottom: 42,
                opacity: enter(d),
                transform: `translateX(${interpolate(enter(d), [0, 1], [-30, 0])}px)`,
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 7, background: COLORS.primary, marginTop: 14, flexShrink: 0 }} />
              <div style={{ color: COLORS.text, fontSize: 48, lineHeight: 1.25 }}>{b}</div>
            </div>
          );
        })}
      </div>

      {/* Outro */}
      <div style={{ position: "absolute", bottom: 150, left: 90, right: 90, opacity: outroOp }}>
        <div style={{ color: COLORS.primary, fontSize: 44, fontWeight: 800 }}>{outro}</div>
        <div style={{ color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 32, marginTop: 12 }}>
          Guía completa en el link de la bio · maudev.cl
        </div>
      </div>

      {/* Barra de progreso (ayuda a la retención) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 14, width: `${progress * 100}%`, background: COLORS.primary }} />
    </AbsoluteFill>
  );
};
