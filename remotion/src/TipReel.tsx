import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONTS } from "./theme";
import { gridBg, Glow, Wordmark, CategoryChip, NumBadge } from "./Brand";
import type { Tip } from "./tips";

// Reel vertical 1080x1920 (~12s) — tip animado con valor + outro al "link en bio".
export const TipReel: React.FC<Tip> = ({ category, title, bullets, outro }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const outroOp = interpolate(frame, [durationInFrames - 90, durationInFrames - 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ ...gridBg, fontFamily: FONTS.sans, padding: 90 }}>
      <Glow />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: enter(0) }}>
        <Wordmark size={48} />
        <CategoryChip category={category} />
      </div>

      {/* Título */}
      <div
        style={{
          marginTop: 110,
          fontSize: 86,
          fontWeight: 900,
          color: COLORS.text,
          lineHeight: 1.04,
          letterSpacing: -1,
          opacity: enter(6),
          transform: `translateY(${interpolate(enter(6), [0, 1], [40, 0])}px)`,
        }}
      >
        {title}
      </div>

      {/* Bullets numerados */}
      <div style={{ marginTop: 70 }}>
        {bullets.map((b, i) => {
          const d = 18 + i * 12;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 28,
                alignItems: "center",
                marginBottom: 38,
                opacity: enter(d),
                transform: `translateX(${interpolate(enter(d), [0, 1], [-30, 0])}px)`,
              }}
            >
              <NumBadge n={i + 1} size={62} />
              <div style={{ color: COLORS.text, fontSize: 48, lineHeight: 1.22 }}>{b}</div>
            </div>
          );
        })}
      </div>

      {/* Outro */}
      <div style={{ position: "absolute", bottom: 150, left: 90, right: 90, opacity: outroOp }}>
        <div style={{ color: COLORS.primary, fontSize: 46, fontWeight: 800 }}>{outro}</div>
        <div style={{ color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 32, marginTop: 12 }}>
          Guía completa en el link de la bio · maudev.cl
        </div>
      </div>

      {/* Barra de progreso (retención) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 14, width: `${progress * 100}%`, background: COLORS.primary }} />
    </AbsoluteFill>
  );
};
