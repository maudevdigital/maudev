import type { CSSProperties } from "react";
import { COLORS } from "./theme";

// "Skins" de marca: TODAS comparten el fondo oscuro, las fuentes y el logo
// (armónico en el feed), pero varían el color de acento (familia fría: teal /
// sky / mint / indigo) y el patrón de fondo. Así cada pieza se ve distinta
// pero claramente de la misma marca.
export type Skin = { name: string; accent: string; bg: CSSProperties; glowY: string };

const gridBg = (size = 64): CSSProperties => ({
  backgroundColor: COLORS.bg,
  backgroundImage: `linear-gradient(${COLORS.border}66 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}66 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});
const dotsBg = (): CSSProperties => ({
  backgroundColor: COLORS.bg,
  backgroundImage: `radial-gradient(${COLORS.border}aa 1.5px, transparent 1.5px)`,
  backgroundSize: "40px 40px",
});
const diagBg = (): CSSProperties => ({
  backgroundColor: COLORS.bg,
  backgroundImage: `repeating-linear-gradient(45deg, ${COLORS.border}44 0, ${COLORS.border}44 1px, transparent 1px, transparent 24px)`,
});

export const SKINS: Skin[] = [
  { name: "teal-grid", accent: "#19d4d4", bg: gridBg(64), glowY: "24%" },
  { name: "sky-dots", accent: "#38b6ff", bg: dotsBg(), glowY: "30%" },
  { name: "mint-diag", accent: "#2ee6a6", bg: diagBg(), glowY: "20%" },
  { name: "indigo-grid", accent: "#8b9cff", bg: gridBg(48), glowY: "26%" },
];

// Pista de música que combina con cada skin (mismo orden de energía).
export const MUSIC_BY_SKIN: Record<string, string> = {
  "teal-grid": "music.wav",
  "sky-dots": "music-chill.wav",
  "mint-diag": "music.wav",
  "indigo-grid": "music-energetico.wav",
};

export const skinFor = (i: number): Skin =>
  SKINS[((i % SKINS.length) + SKINS.length) % SKINS.length];
