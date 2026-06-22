// Tema de marca maudev (modo oscuro). Fuentes reales de marca vía Google Fonts.
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", { weights: ["400", "600", "800", "900"] });
const mono = loadMono("normal", { weights: ["400", "600", "700"] });

export const COLORS = {
  bg: "#0a0a0a",
  card: "#0f0f0f",
  primary: "#19d4d4", // cian/teal de marca
  text: "#fafafa",
  muted: "#a3a3a3",
  border: "#262626",
};

export const FONTS = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
};
