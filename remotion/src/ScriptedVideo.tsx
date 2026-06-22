import { AbsoluteFill, Series, Loop, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS } from "./theme";
import { gridBg, Glow, Wordmark, CategoryChip } from "./Brand";
import { SceneRenderer } from "./scenes";
import type { VideoScript } from "./scripts";

// Video multi-escena 1080x1920 generado desde un guion (scripts.ts).
// Reproduce las escenas en orden, con marca persistente, música y progreso.
export const ScriptedVideo: React.FC<VideoScript> = ({ category, scenes, music }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ ...gridBg, fontFamily: FONTS.sans }}>
      {music ? (
        <Loop durationInFrames={Math.round(12 * fps)}>
          <Audio src={staticFile(music)} volume={0.3} />
        </Loop>
      ) : null}
      <Glow />

      {/* Marca persistente en todas las escenas */}
      <div style={{ position: "absolute", top: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <Wordmark size={44} />
        <CategoryChip category={category} />
      </div>

      <Series>
        {scenes.map((sc, i) => (
          <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(sc.seconds * fps))}>
            <SceneRenderer scene={sc} />
          </Series.Sequence>
        ))}
      </Series>

      <div style={{ position: "absolute", bottom: 0, left: 0, height: 12, width: `${progress * 100}%`, background: COLORS.primary }} />
    </AbsoluteFill>
  );
};
