import { Composition, Still, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { TipReel } from "./TipReel";
import { ValueCard } from "./ValueCard";
import { ScriptedVideo } from "./ScriptedVideo";
import { CinematicReel } from "./CinematicReel";
import { VoiceReel } from "./VoiceReel";
import { AvatarReel } from "./AvatarReel";
import { tips } from "./tips";
import { scripts } from "./scripts";
import { voiceScripts } from "./voiceScripts";
import { carousels } from "./carousels";
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

      {/* Un reel por TEMA (9): skin + música rotan para máxima variedad armónica.
          Render del lote:  for i in 0..8 → remotion render Reel-tip-$i */}
      {tips.map((tip, i) => {
        const sk = SKINS[i % SKINS.length];
        return (
          <Composition
            key={`tip-${i}`}
            id={`Reel-tip-${i}`}
            component={TipReel}
            durationInFrames={REEL_SECONDS * FPS}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={{ ...tip, skin: i % SKINS.length, music: MUSIC_BY_SKIN[sk.name] }}
          />
        );
      })}

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

      {/* Carruseles (20%): una tarjeta-still por slide. Se publican en orden. */}
      {carousels.map((c) =>
        c.slides.map((slide, i) => (
          <Still
            key={`${c.id}-${i}`}
            id={`Carousel-${c.id}-${i + 1}`}
            component={ValueCard}
            width={1080}
            height={1350}
            defaultProps={{ ...slide, skin: i % 4 }}
          />
        )),
      )}

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

      {/* Reel CINEMATOGRÁFICO (letterbox, grano, glow) con voz en off ElevenLabs. */}
      <Composition
        id="CinematicReel"
        component={CinematicReel}
        durationInFrames={670}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ music: "music-energetico.wav", voice: "cinematic-voice.mp3" }}
        calculateMetadata={async ({ props }) => {
          if (props.voice) {
            const dur = await getAudioDurationInSeconds(staticFile(props.voice as string));
            return { durationInFrames: Math.max(670, Math.ceil(dur * FPS) + FPS) };
          }
          return { durationInFrames: 670 };
        }}
      />

      {/* Reels NARRADOS estratégicos (psicología): voz, música y acento propios. */}
      {voiceScripts.map((vs) => (
        <Composition
          key={vs.id}
          id={`VoiceReel-${vs.id}`}
          component={VoiceReel}
          durationInFrames={700}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={vs}
          calculateMetadata={async ({ props }) => {
            const scenesFrames = props.scenes.reduce((a, s) => a + s.frames, 0) + 130;
            if (props.voice) {
              const dur = await getAudioDurationInSeconds(staticFile(props.voice));
              return { durationInFrames: Math.max(scenesFrames, Math.ceil(dur * FPS) + FPS) };
            }
            return { durationInFrames: scenesFrames };
          }}
        />
      ))}

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
