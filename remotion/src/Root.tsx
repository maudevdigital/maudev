import { Composition, Still, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { TipReel } from "./TipReel";
import { ValueCard } from "./ValueCard";
import { ScriptedVideo } from "./ScriptedVideo";
import { AvatarReel } from "./AvatarReel";
import { tips } from "./tips";
import { scripts } from "./scripts";
import { SKINS, MUSIC_BY_SKIN } from "./skins";

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
        defaultProps={{ ...sample, skin: 0, music: "music.wav" }}
      />

      {/* Una variante de reel por skin (distinto acento/fondo + su música). */}
      {SKINS.map((sk, i) => (
        <Composition
          key={sk.name}
          id={`Reel-${sk.name}`}
          component={TipReel}
          durationInFrames={REEL_SECONDS * FPS}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ ...tips[i % tips.length], skin: i, music: MUSIC_BY_SKIN[sk.name] }}
        />
      ))}

      {/* Tarjeta estática 4:5 — post unitario o página de carrusel */}
      <Still id="ValueCard" component={ValueCard} width={1080} height={1350} defaultProps={{ ...sample, skin: 0 }} />

      {/* Una tarjeta por skin (para ver cómo se ve el feed: variado pero armónico). */}
      {SKINS.map((sk, i) => (
        <Still
          key={sk.name}
          id={`Card-${sk.name}`}
          component={ValueCard}
          width={1080}
          height={1350}
          defaultProps={{ ...tips[i % tips.length], skin: i }}
        />
      ))}

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

      {/* Mascota que "habla" la voz (ElevenLabs). Duración = largo del audio. */}
      <Composition
        id="AvatarReel"
        component={AvatarReel}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ ...sample, music: "music.wav" }}
        calculateMetadata={async ({ props }) => {
          if (props.voice) {
            const dur = await getAudioDurationInSeconds(staticFile(props.voice));
            return { durationInFrames: Math.ceil(dur * FPS) + FPS }; // +1s de cola
          }
          return { durationInFrames: 14 * FPS };
        }}
      />
    </>
  );
};
