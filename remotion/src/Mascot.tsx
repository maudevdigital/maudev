import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "./theme";

// Mascota de marca (estilo tech). La boca se abre según `mouthOpen` (0..1),
// que viene del volumen de la voz. Parpadea y flota suavemente.
export const Mascot: React.FC<{ mouthOpen: number; size?: number }> = ({ mouthOpen, size = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blinkPeriod = Math.round(2.6 * fps);
  const blink = frame % blinkPeriod < 4 ? 0.12 : 1; // cierra los ojos 4 frames
  const bob = Math.sin((frame / fps) * 2.2) * 6;
  const open = Math.max(0, Math.min(1, mouthOpen));
  const mouthH = interpolate(open, [0, 1], [10, 64]);

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: `translateY(${bob}px)` }}>
      <circle cx="100" cy="104" r="94" fill={COLORS.primary} fillOpacity="0.08" />
      {/* antena */}
      <line x1="100" y1="42" x2="100" y2="24" stroke={COLORS.primary} strokeWidth="3" />
      <circle cx="100" cy="19" r="6" fill={COLORS.primary} />
      {/* cabeza */}
      <rect x="38" y="42" width="124" height="124" rx="36" fill={COLORS.card} stroke={COLORS.primary} strokeWidth="3" />
      {/* "audífonos" laterales (vibe presentador) */}
      <rect x="30" y="92" width="12" height="34" rx="6" fill={COLORS.primary} />
      <rect x="158" y="92" width="12" height="34" rx="6" fill={COLORS.primary} />
      {/* ojos (parpadean) */}
      <g fill={COLORS.primary}>
        <ellipse cx="78" cy="96" rx="11" ry={11 * blink} />
        <ellipse cx="122" cy="96" rx="11" ry={11 * blink} />
      </g>
      {/* boca (se abre con la voz) */}
      <rect x="74" y={126 - mouthH / 2} width="52" height={mouthH} rx={Math.min(12, mouthH / 2)} fill={COLORS.primary} />
    </svg>
  );
};
