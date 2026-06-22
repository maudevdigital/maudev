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

// Reel CINEMATOGRÁFICO (hecho 100% por código, sin IA de pago).
// Estética: letterbox 2.39, viñeta, grano de película, glow a la deriva y
// tipografía lenta con desenfoque. Copy NO invasivo: atrae por confianza/valor,
// no por venta dura. 1080x1920, ~18s.

const ACCENT = COLORS.primary;

// ── Capas de atmósfera ───────────────────────────────────────────────────────
const Letterbox: React.FC = () => (
  <>
    <AbsoluteFill style={{ height: 150, top: 0, bottom: "auto", background: "#000" }} />
    <AbsoluteFill style={{ height: 150, top: "auto", bottom: 0, background: "#000" }} />
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, height: 1, background: `${ACCENT}40` }} />
    <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, height: 1, background: `${ACCENT}40` }} />
  </>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ background: "radial-gradient(circle at 50% 45%, transparent 35%, #000000cc 100%)" }}
  />
);

// Grano de película: ruido que parpadea sutilmente por frame.
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const flicker = 0.05 + random(`g${seed}`) * 0.04;
  return (
    <AbsoluteFill style={{ opacity: flicker, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </AbsoluteFill>
  );
};

// Glow cian que deriva lentamente (luz de cámara).
const DriftGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const x = interpolate(frame, [0, durationInFrames], [30, 70]);
  const y = interpolate(frame, [0, durationInFrames], [60, 35]);
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(circle at ${x}% ${y}%, ${ACCENT}22, transparent 55%)` }}
    />
  );
};

// Grid en perspectiva que se desliza hacia el horizonte (profundidad/tech).
const PerspectiveGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.6) % 80;
  return (
    <AbsoluteFill style={{ perspective: 600, opacity: 0.25 }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          width: "200%",
          height: "70%",
          transform: "rotateX(72deg)",
          transformOrigin: "bottom center",
          backgroundImage: `linear-gradient(${ACCENT}55 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}55 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPositionY: `${shift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Tipografía cinematográfica (fade + blur + drift) ─────────────────────────
const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; hold?: number }> = ({
  children,
  size = 70,
  color = COLORS.text,
  weight = 800,
  hold = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inOp = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const blur = interpolate(frame, [0, 22], [12, 0], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, durationInFrames], [18, -18]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: size,
          fontWeight: weight,
          color,
          textAlign: "center",
          lineHeight: 1.12,
          letterSpacing: -1,
          opacity: Math.min(inOp, outOp),
          filter: `blur(${blur}px)`,
          transform: `translateY(${drift + hold}px)`,
          textWrap: "balance",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Reveal de marca (logo + wordmark + tagline) al cierre.
const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 30], [0.92, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, opacity: op, transform: `scale(${scale})` }}>
      <div style={{ transform: "scale(1.6)" }}>
        <Wordmark size={92} />
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.muted, letterSpacing: 2, textAlign: "center", maxWidth: 720 }}>
        Software y automatización para crecer sin fricción
      </div>
    </AbsoluteFill>
  );
};

export const CinematicReel: React.FC<{ music?: string; voice?: string }> = ({
  music = "music-energetico.wav",
  voice,
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Música de fondo: más baja si hay voz, para que la narración mande. */}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 40, durationInFrames - 50, durationInFrames], [0, voice ? 0.22 : 0.5, voice ? 0.22 : 0.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {/* Voz en off cinematográfica (ElevenLabs) — narra el copy. */}
      {voice ? <Audio src={staticFile(voice)} volume={1} /> : null}

      <PerspectiveGrid />
      <DriftGlow />

      <Series>
        <Series.Sequence durationInFrames={90}>
          <Line size={66} color={COLORS.muted}>Cada día, clientes buscan<br />lo que tú haces.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={80}>
          <Line size={74}>La pregunta no es<br />si te encuentran.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Line size={78} color={ACCENT}>Es qué sienten<br />cuando lo hacen.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={70}>
          <Line size={62}>Una web que carga rápido.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={70}>
          <Line size={62}>Un sistema que responde solo.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={70}>
          <Line size={62}>Procesos que no se caen.</Line>
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <BrandReveal />
        </Series.Sequence>
        <Series.Sequence durationInFrames={80}>
          <Line size={48} color={COLORS.muted} weight={600}>
            Cuando quieras, conversamos.<br />
            <span style={{ color: ACCENT, fontFamily: FONTS.mono }}>maudev.cl</span>
          </Line>
        </Series.Sequence>
      </Series>

      <PerspectiveGrid />
      <Vignette />
      <Grain />
      <Letterbox />
    </AbsoluteFill>
  );
};
