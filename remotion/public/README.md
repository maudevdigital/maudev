# Archivos estáticos (música, voz, imágenes para los reels)

Lo que pongas aquí se referencia con `staticFile("nombre")` en las composiciones.

## Música de fondo — `music.mp3`
1. Descarga una pista **libre de derechos** (NO uses música con copyright o
   Instagram/Facebook la silencia o limita el alcance).
   - Gratis y buenas: **Pixabay Music**, **Mixkit**, **Uppbeat**, **YouTube Audio Library**.
   - Busca algo con beat marcado / "energetic" / "tech" para captar atención.
2. Guárdala aquí como `music.mp3`.
3. Actívala: en `src/Root.tsx` agrega `music: "music.mp3"` a los `defaultProps`
   del `TipReel`, o pásala al renderizar:
   `npx remotion render TipReel out/reel.mp4 --props='{"music":"music.mp3"}'`

## Voz en off (opcional) — `voice.mp3`
Genera la narración del tip con **ElevenLabs** (TTS, voz muy natural; plan gratis
~10k caracteres/mes) y guárdala como `voice.mp3`. Pásala como `voice:"voice.mp3"`.
Un reel **narrado + música suave de fondo** suele retener mucho mejor.
