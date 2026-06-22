// Sintetiza una pista de fondo ORIGINAL (libre de derechos) para los reels.
// Genera public/music.wav (12s, loopeable). Ejecuta: `node gen-music.mjs`.
// Vibe: tech/minimal — pad de acordes + arpegio + kick + hats suaves.
import { writeFileSync } from "fs";

const SR = 44100;
const DUR = 12;
const BPM = 112;
const beat = 60 / BPM;
const N = Math.floor(SR * DUR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
// Progresión en La menor (Am – F – C – G): cálida y "tech".
const chords = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
const chordDur = 2 * beat; // cada acorde dura 2 tiempos
const eighth = beat / 2;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;

  // PAD (acordes con envolvente suave)
  const ci = Math.floor(t / chordDur) % chords.length;
  const ct = t - Math.floor(t / chordDur) * chordDur;
  const padEnv = Math.min(ct / 0.2, 1) * Math.min((chordDur - ct) / 0.3, 1);
  for (const m of chords[ci]) {
    const f = midi(m);
    s += 0.05 * padEnv * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t));
  }

  // ARPEGIO (plucks en corcheas, octava arriba)
  const ai = Math.floor(t / eighth);
  const arpNote = chords[Math.floor(t / chordDur) % chords.length][ai % 3] + 12;
  const aDecay = Math.exp(-(t - ai * eighth) * 11);
  s += 0.12 * aDecay * Math.sin(2 * Math.PI * midi(arpNote) * t);

  // KICK (en cada tiempo)
  const bt = t - Math.floor(t / beat) * beat;
  const kf = 110 * Math.exp(-bt * 28) + 45;
  s += 0.55 * Math.exp(-bt * 15) * Math.sin(2 * Math.PI * kf * bt);

  // HAT (ruido corto en contratiempo)
  if (ai % 2 === 1) {
    const ht = t - ai * eighth;
    s += 0.04 * Math.exp(-ht * 70) * (Math.random() * 2 - 1);
  }

  s = Math.tanh(s * 0.9); // suave saturación para pegar todo
  L[i] = s;
  R[i] = s;
}

// Fades cortos en los bordes (loop limpio)
const fade = Math.floor(SR * 0.04);
for (let i = 0; i < fade; i++) {
  const g = i / fade;
  L[i] *= g; R[i] *= g;
  L[N - 1 - i] *= g; R[N - 1 - i] *= g;
}

// Escribir WAV 16-bit estéreo
const channels = 2, bps = 2;
const dataLen = N * channels * bps;
const buf = Buffer.alloc(44 + dataLen);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataLen, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(channels, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * channels * bps, 28);
buf.writeUInt16LE(channels * bps, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataLen, 40);
let off = 44;
for (let i = 0; i < N; i++) {
  for (const ch of [L[i], R[i]]) {
    const v = Math.max(-1, Math.min(1, ch));
    buf.writeInt16LE((v * 32767) | 0, off);
    off += 2;
  }
}
writeFileSync("public/music.wav", buf);
console.log(`music.wav generado: ${(buf.length / 1048576).toFixed(2)} MB · ${DUR}s · ${BPM} BPM`);
