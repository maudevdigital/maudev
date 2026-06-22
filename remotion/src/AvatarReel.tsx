import { AbsoluteFill, Audio, Loop, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { COLORS, FONTS } from "./theme";
import { gridBg, Glow, Wordmark, CategoryChip, NumBadge } from "./Brand";
import { Mascot } from "./Mascot";
import type { Tip } from "./tips";

type AvatarProps = Tip & { voice?: string; music?: string };

// Layout visual (presentacional): texto arriba + mascota abajo. `mouthOpen` lo
// inyecta el variante con voz (sincronizado) o el idle.
const AvatarLayout: React.FC<AvatarProps & { mouthOpen: number; withAudio?: boolean }> = ({
  category,
  title,
  bullets,
  mouthOpen,
  music,
  voice,
  withAudio,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ ...gridBg, fontFamily: FONTS.sans }}>
      {music ? (
        <Loop durationInFrames={Math.round(12 * fps)}>
          <Audio src={staticFile(music)} volume={0.18} />
        </Loop>
      ) : null}
      {withAudio && voice ? <Audio src={staticFile(voice)} /> : null}
      <Glow y="20%" />

      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark size={44} />
        <CategoryChip category={category} />
      </div>

      {/* Texto (lo que el personaje "dice") */}
      <div style={{ position: "absolute", top: 230, left: 90, right: 90 }}>
        <div style={{ fontSize: 76, fontWeight: 900, color: COLORS.text, lineHeight: 1.05, letterSpacing: -1, opacity: enter(4), transform: `translateY(${interpolate(enter(4), [0, 1], [30, 0])}px)` }}>
          {title}
        </div>
        <div style={{ marginTop: 44 }}>
          {bullets.map((b, i) => {
            const d = 16 + i * 12;
            return (
              <div key={i} style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 26, opacity: enter(d), transform: `translateX(${interpolate(enter(d), [0, 1], [-26, 0])}px)` }}>
                <NumBadge n={i + 1} size={50} />
                <div style={{ color: COLORS.text, fontSize: 42, lineHeight: 1.22 }}>{b}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mascota (abajo, centrada) */}
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Mascot mouthOpen={mouthOpen} size={460} />
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, height: 12, width: `${progress * 100}%`, background: COLORS.primary }} />
    </AbsoluteFill>
  );
};

// Con voz: la boca se mueve según el volumen del audio.
const TalkingAvatar: React.FC<AvatarProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile(props.voice as string));
  let mouthOpen = 0;
  if (audioData) {
    const viz = visualizeAudio({ audioData, frame, fps, numberOfSamples: 16 });
    const band = (viz[1] + viz[2] + viz[3] + viz[4]) / 4; // graves-medios = voz
    mouthOpen = Math.min(1, band * 9);
  }
  return <AvatarLayout {...props} mouthOpen={mouthOpen} withAudio />;
};

// Sin voz: boca con movimiento idle (para previsualizar sin generar el audio aún).
const IdleAvatar: React.FC<AvatarProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mouthOpen = (Math.sin((frame / fps) * 9) * 0.5 + 0.5) * 0.55;
  return <AvatarLayout {...props} mouthOpen={mouthOpen} withAudio={false} />;
};

export const AvatarReel: React.FC<AvatarProps> = (props) =>
  props.voice ? <TalkingAvatar {...props} /> : <IdleAvatar {...props} />;
