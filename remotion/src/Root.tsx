import { Composition, Still } from "remotion";
import { TipReel } from "./TipReel";
import { ValueCard } from "./ValueCard";
import { tips } from "./tips";

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
        defaultProps={sample}
      />
      {/* Tarjeta estática 4:5 — post unitario o página de carrusel */}
      <Still id="ValueCard" component={ValueCard} width={1080} height={1350} defaultProps={sample} />
    </>
  );
};
