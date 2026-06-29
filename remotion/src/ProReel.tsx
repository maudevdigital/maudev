import {
  AbsoluteFill,
  Series,
  Audio,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import { COLORS, FONTS } from "./theme";
import { Wordmark } from "./Brand";

// Motor de reel "PRO": animaciones, luces y sombras en movimiento, transiciones
// de escena (slide / scale / wipe), tipografía cinética, + música y voz en off.
// Más sofisticado que VoiceReel. Parametrizable por props.
export type ProFx = "slideL" | "slideR" | "slideU" | "scale" | "wipe";
export type ProScene = { text: string; fx?: ProFx; frames: number; accent?: boolean; size?: number };
export type ProReelProps = {
  scenes: ProScene[];
  voice?: string;
  music?: string;
  accent?: string;
  secondary?: string;
  tagline?: string;
  // CTA final del video: incita a comentar para recibir el lead magnet por DM.
  ctaKeyword?: string; // palabra clave a comentar (ej. "GUÍA")
  ctaLine?: string; // bajada (ej. "y te enviamos el PDF gratis al privado")
};

// ── LUCES: blobs de color que derivan (mesh gradient animado) ────────────────
const Blob: React.FC<{ color: string; x: number; y: number; size: number; speed: number; phase: number }> = ({ color, x, y, size, speed, phase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * speed + phase;
  const dx = Math.sin(t) * 120;
  const dy = Math.cos(t * 0.8) * 90;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        background: color,
        filter: "blur(90px)",
        opacity: 0.5,
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    />
  );
};

// ── LUZ: foco (spotlight) que se mueve sobre la escena ───────────────────────
const Spotlight: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const x = 50 + Math.sin(t * 0.6) * 28;
  const y = 38 + Math.cos(t * 0.45) * 18;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% ${y}%, ${accent}33, transparent 45%)` }} />;
};

// ── SOMBRA: viñeta + piso oscuro para dar profundidad ────────────────────────
const Vignette: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, transparent 38%, #000000d9 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 60%, #000000aa 100%)" }} />
  </>
);

// Grano de película (textura).
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const op = 0.045 + random(`g${seed}`) * 0.03;
  return (
    <AbsoluteFill style={{ opacity: op, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="pg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#pg)" />
      </svg>
    </AbsoluteFill>
  );
};

// Grid en perspectiva que se desliza (profundidad tech).
const Grid: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.7) % 70;
  return (
    <AbsoluteFill style={{ perspective: 700, opacity: 0.16 }}>
      <div style={{ position: "absolute", bottom: -40, left: "-50%", width: "200%", height: "65%", transform: "rotateX(74deg)", transformOrigin: "bottom center", backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "70px 70px", backgroundPositionY: `${shift}px` }} />
    </AbsoluteFill>
  );
};

// ── TRANSICIÓN de entrada según fx (devuelve transform/opacity/blur) ──────────
function enterStyle(fx: ProFx, p: number): React.CSSProperties {
  const e = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const blur = interpolate(p, [0, 1], [14, 0], { extrapolateRight: "clamp" });
  const base: React.CSSProperties = { opacity: e, filter: `blur(${blur}px)` };
  if (fx === "slideL") return { ...base, transform: `translateX(${interpolate(e, [0, 1], [220, 0])}px)` };
  if (fx === "slideR") return { ...base, transform: `translateX(${interpolate(e, [0, 1], [-220, 0])}px)` };
  if (fx === "slideU") return { ...base, transform: `translateY(${interpolate(e, [0, 1], [160, 0])}px)` };
  if (fx === "scale") return { ...base, transform: `scale(${interpolate(e, [0, 1], [0.6, 1])})` };
  return base; // wipe se maneja con overlay
}

// Barrido de luz al entrar la escena (light sweep).
const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 16], [-120, 220], { extrapolateRight: "clamp" });
  const op = interpolate(frame, [0, 8, 16], [0, 0.5, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "40%", transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent, #ffffff55, transparent)", opacity: op }} />
    </AbsoluteFill>
  );
};

// Texto cinético: palabra por palabra, con sombra y entrada por fx.
const Kinetic: React.FC<{ text: string; fx: ProFx; color: string; size: number }> = ({ text, fx, color, size }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", opacity: out, maxWidth: 920 }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - i * 3, fps, config: { damping: 200 } });
        const st = enterStyle(fx, s);
        return (
          <span key={i} style={{ ...st, display: "inline-block", fontFamily: FONTS.sans, fontWeight: 900, fontSize: size, color, letterSpacing: -1, lineHeight: 1.08, textShadow: "0 14px 34px rgba(0,0,0,0.65)" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const BrandReveal: React.FC<{ tagline: string; accent: string }> = ({ tagline, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.6))" }}>
      <div style={{ transform: "scale(1.7)" }}><Wordmark size={92} accent={accent} /></div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.muted, letterSpacing: 2, textAlign: "center", maxWidth: 760 }}>{tagline}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 26, color: accent, letterSpacing: 1 }}>maudev.cl</div>
    </AbsoluteFill>
  );
};

const FX: ProFx[] = ["slideU", "slideL", "scale", "slideR", "wipe", "slideU"];

// CTA final: incita a comentar la palabra clave para recibir el PDF por DM.
const CommentCta: React.FC<{ keyword: string; line: string; accent: string }> = ({ keyword, line, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin((frame / fps) * 6) * 0.05;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22, padding: 80, textAlign: "center", opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, filter: "drop-shadow(0 16px 36px rgba(0,0,0,0.6))" }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 58, fontWeight: 800, color: COLORS.text }}>Comenta</div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 128, fontWeight: 900, color: accent, letterSpacing: -2, transform: `scale(${pulse})`, textShadow: `0 0 44px ${accent}66` }}>{keyword}</div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 46, fontWeight: 700, color: COLORS.text, maxWidth: 840, lineHeight: 1.2 }}>{line}</div>
      <div style={{ fontSize: 84, marginTop: 4 }}>👇</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 28, color: COLORS.muted, marginTop: 6 }}>maudev.cl</div>
    </AbsoluteFill>
  );
};

export const ProReel: React.FC<ProReelProps> = ({
  scenes,
  voice,
  music = "music-viral1.wav",
  accent = COLORS.primary,
  secondary = "#8b9cff",
  tagline = "Software y automatización para crecer sin fricción",
  ctaKeyword = "GUÍA",
  ctaLine = "y te enviamos el PDF gratis al privado",
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {music ? (
        <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 40, durationInFrames - 50, durationInFrames], [0, voice ? 0.22 : 0.5, voice ? 0.22 : 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      ) : null}
      {voice ? <Audio src={staticFile(voice)} volume={1} /> : null}

      {/* LUCES: mesh de blobs + foco móvil + grid */}
      <Blob color={accent} x={26} y={28} size={620} speed={0.5} phase={0} />
      <Blob color={secondary} x={76} y={66} size={680} speed={0.42} phase={2} />
      <Blob color={accent} x={62} y={20} size={460} speed={0.6} phase={4} />
      <Grid accent={accent} />
      <Spotlight accent={accent} />

      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={s.frames}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90, textAlign: "center" }}>
              <Kinetic text={s.text} fx={s.fx ?? FX[i % FX.length]} color={s.accent ? accent : COLORS.text} size={s.size ?? 78} />
            </AbsoluteFill>
            {i > 0 ? <LightSweep /> : null}
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={110}>
          <BrandReveal tagline={tagline} accent={accent} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={160}>
          <CommentCta keyword={ctaKeyword} line={ctaLine} accent={accent} />
        </Series.Sequence>
      </Series>

      {/* SOMBRAS: viñeta + piso + grano por encima */}
      <Vignette />
      <Grain />
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 8, width: "100%", background: `linear-gradient(90deg, ${accent}, ${secondary})` }} />
    </AbsoluteFill>
  );
};
