import { Composition, Still } from "remotion";
import { TipReel } from "./TipReel";
import { ValueCard } from "./ValueCard";
import { ScriptedVideo } from "./ScriptedVideo";
import { tips } from "./tips";
import { scripts } from "./scripts";

const FPS = 30;
const REEL_SECONDS = 12;

export const RemotionRoot: React.FC = () => {
  const sample = tips[0];
  return (
    <>
      {/* Reel vertical para Instagram/Facebook/TikTok */}
      <Composition
        id="TipReel"
        component={TipReel}
        durationInFrames={REEL_SECONDS * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ ...sample, music: "music.wav" }}
      />
      {/* Tarjeta estática 4:5 — post unitario o página de carrusel */}
      <Still id="ValueCard" component={ValueCard} width={1080} height={1350} defaultProps={sample} />

      {/* Video multi-escena desde guion (scripts.ts). Duración = suma de escenas. */}
      <Composition
        id="ScriptedVideo"
        component={ScriptedVideo}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={scripts[0]}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.scenes.reduce(
            (a, s) => a + Math.max(1, Math.round(s.seconds * FPS)),
            0,
          ),
        })}
      />
    </>
  );
};
