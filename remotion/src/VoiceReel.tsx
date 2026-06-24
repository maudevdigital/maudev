import {
  AbsoluteFill,
  Series,
  Audio,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import { COLORS, FONTS } from "./theme";
import { Wordmark } from "./Brand";

// Motor de REEL NARRADO (voz en off) cinematográfico y parametrizable.
// Mismo lenguaje visual que CinematicReel (letterbox, grano, glow, grid en
// perspectiva) pero con guion, voz, música y color de acento por props → cada
// reel se ve y suena distinto, manteniendo la marca.
export type VoiceScene = { text: string; frames: number; accent?: boolean; size?: number };
export type VoiceReelProps = {
  scenes: VoiceScene[];
  voice?: string;
  music?: string;
  accent?: string;
  tagline?: string;
};

const Letterbox: React.FC<{ accent: string }> = ({ accent }) => (
  <>
    <AbsoluteFill style={{ height: 150, top: 0, bottom: "auto", background: "#000" }} />
    <AbsoluteFill style={{ height: 150, top: "auto", bottom: 0, background: "#000" }} />
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, height: 1, background: `${accent}40` }} />
    <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, height: 1, background: `${accent}40` }} />
  </>
);

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 35%, #000000cc 100%)" }} />
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const flicker = 0.05 + random(`g${seed}`) * 0.04;
  return (
    <AbsoluteFill style={{ opacity: flicker, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="vn">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#vn)" />
      </svg>
    </AbsoluteFill>
  );
};

const DriftGlow: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const x = interpolate(frame, [0, durationInFrames], [30, 70]);
  const y = interpolate(frame, [0, durationInFrames], [60, 35]);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% ${y}%, ${accent}22, transparent 55%)` }} />;
};

const PerspectiveGrid: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.6) % 80;
  return (
    <AbsoluteFill style={{ perspective: 600, opacity: 0.22 }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          width: "200%",
          height: "70%",
          transform: "rotateX(72deg)",
          transformOrigin: "bottom center",
          backgroundImage: `linear-gradient(${accent}55 1px, transparent 1px), linear-gradient(90deg, ${accent}55 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPositionY: `${shift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 70, color = COLORS.text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const blur = interpolate(frame, [0, 20], [12, 0], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, durationInFrames], [16, -16]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: size,
          fontWeight: 800,
          color,
          textAlign: "center",
          lineHeight: 1.12,
          letterSpacing: -1,
          opacity: Math.min(inOp, outOp),
          filter: `blur(${blur}px)`,
          transform: `translateY(${drift}px)`,
          textWrap: "balance",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const BrandReveal: React.FC<{ tagline: string; accent: string }> = ({ tagline, accent }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 30], [0.92, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28, opacity: op, transform: `scale(${scale})` }}>
      <div style={{ transform: "scale(1.6)" }}>
        <Wordmark size={92} accent={accent} />
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.muted, letterSpacing: 2, textAlign: "center", maxWidth: 740 }}>{tagline}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 26, color: accent, letterSpacing: 1, marginTop: 6 }}>maudev.cl</div>
    </AbsoluteFill>
  );
};

export const VoiceReel: React.FC<VoiceReelProps> = ({
  scenes,
  voice,
  music = "music-tension.wav",
  accent = COLORS.primary,
  tagline = "Software y automatización para crecer sin fricción",
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 40, durationInFrames - 50, durationInFrames], [0, voice ? 0.2 : 0.45, voice ? 0.2 : 0.45, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {voice ? <Audio src={staticFile(voice)} volume={1} /> : null}

      <PerspectiveGrid accent={accent} />
      <DriftGlow accent={accent} />

      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={s.frames}>
            <Line size={s.size ?? 68} color={s.accent ? accent : COLORS.text}>
              {s.text.split("\n").map((ln, j) => (
                <div key={j}>{ln}</div>
              ))}
            </Line>
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={130}>
          <BrandReveal tagline={tagline} accent={accent} />
        </Series.Sequence>
      </Series>

      <PerspectiveGrid accent={accent} />
      <Vignette />
      <Grain />
      <Letterbox accent={accent} />
    </AbsoluteFill>
  );
};
