import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONTS } from "./theme";
import { NumBadge } from "./Brand";
import type { Scene } from "./scripts";

// Las escenas se dibujan sobre el fondo/marca que pone ScriptedVideo (transparentes).
// Cada una anima con su frame LOCAL (dentro de su Series.Sequence).
const center: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "260px 90px 140px",
};

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
};

const IntroScene: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const e = useEnter(0);
  return (
    <AbsoluteFill style={center}>
      <div style={{ opacity: e, transform: `scale(${interpolate(e, [0, 1], [0.9, 1])})` }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: COLORS.text, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.primary, marginTop: 26 }}>{subtitle}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const PointScene: React.FC<{ n: number; heading: string; body: string }> = ({ n, heading, body }) => {
  const e = useEnter(0);
  const eb = useEnter(8);
  return (
    <AbsoluteFill style={{ ...center, alignItems: "flex-start", textAlign: "left" }}>
      <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px)` }}>
        <NumBadge n={n} size={96} />
        <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.text, marginTop: 36, lineHeight: 1.05 }}>{heading}</div>
      </div>
      <div style={{ fontSize: 50, color: COLORS.muted, lineHeight: 1.3, marginTop: 28, opacity: eb }}>{body}</div>
    </AbsoluteFill>
  );
};

const CodeScene: React.FC<{ caption: string; lines: string[] }> = ({ caption, lines }) => {
  const e = useEnter(0);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={center}>
      <div style={{ width: "100%", opacity: e }}>
        <div style={{ color: COLORS.primary, fontFamily: FONTS.mono, fontSize: 30, marginBottom: 24, textTransform: "uppercase", letterSpacing: 2 }}>
          {caption}
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 40, fontFamily: FONTS.mono }}>
          {lines.map((ln, i) => (
            <div
              key={i}
              style={{
                fontSize: 40,
                color: i === 0 ? COLORS.primary : COLORS.text,
                lineHeight: 1.5,
                opacity: interpolate(frame, [10 + i * 12, 22 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              {ln}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ text: string }> = ({ text }) => {
  const e = useEnter(0);
  return (
    <AbsoluteFill style={center}>
      <div style={{ opacity: e, transform: `scale(${interpolate(e, [0, 1], [0.9, 1])})` }}>
        <div style={{ fontSize: 84, fontWeight: 900, color: COLORS.text, lineHeight: 1.08 }}>{text}</div>
        <div style={{ marginTop: 40, display: "inline-block", color: COLORS.primary, fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, border: `2px solid ${COLORS.primary}`, borderRadius: 18, padding: "18px 36px" }}>
          Link en la bio →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "intro":
      return <IntroScene title={scene.title} subtitle={scene.subtitle} />;
    case "point":
      return <PointScene n={scene.n} heading={scene.heading} body={scene.body} />;
    case "code":
      return <CodeScene caption={scene.caption} lines={scene.lines} />;
    case "outro":
      return <OutroScene text={scene.text} />;
    default:
      return null;
  }
};
