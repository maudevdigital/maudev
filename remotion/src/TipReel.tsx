import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { COLORS, FONTS } from "./theme";
import { Glow, Wordmark, CategoryChip, NumBadge } from "./Brand";
import { skinFor } from "./skins";
import type { Tip } from "./tips";

// Props del reel: el tip + audio opcional + `skin` (0..3) para variar el estilo
// manteniendo la marca. Pon los archivos de audio en remotion/public/.
type ReelProps = Tip & { music?: string; voice?: string; skin?: number };

// Reel vertical 1080x1920 (~12s) — tip animado con valor + outro al "link en bio".
export const TipReel: React.FC<ReelProps> = ({ category, title, bullets, outro, music, voice, skin = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sk = skinFor(skin);
  const enter = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const outroOp = interpolate(frame, [durationInFrames - 90, durationInFrames - 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ ...sk.bg, fontFamily: FONTS.sans, padding: 90 }}>
      {/* Música de fondo con fade in/out (archivo en remotion/public/). */}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.45, 0.45, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {/* Voz en off opcional (ej. generada con ElevenLabs). */}
      {voice ? <Audio src={staticFile(voice)} /> : null}

      <Glow y={sk.glowY} accent={sk.accent} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: enter(0) }}>
        <Wordmark size={48} accent={sk.accent} />
        <CategoryChip category={category} accent={sk.accent} />
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
              <NumBadge n={i + 1} size={62} accent={sk.accent} />
              <div style={{ color: COLORS.text, fontSize: 48, lineHeight: 1.22 }}>{b}</div>
            </div>
          );
        })}
      </div>

      {/* Outro */}
      <div style={{ position: "absolute", bottom: 150, left: 90, right: 90, opacity: outroOp }}>
        <div style={{ color: sk.accent, fontSize: 46, fontWeight: 800 }}>{outro}</div>
        <div style={{ color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 32, marginTop: 12 }}>
          Guía completa en el link de la bio · maudev.cl
        </div>
      </div>

      {/* Barra de progreso (retención) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 14, width: `${progress * 100}%`, background: sk.accent }} />
    </AbsoluteFill>
  );
};
