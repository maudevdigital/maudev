// Sintetiza VARIAS pistas de fondo ORIGINALES (libres de derechos) para los reels.
// Mismo "ADN" sonoro (pad + arpegio + kick + hats) pero distinto tempo/tono/energía
// → varían pero suenan armónicas entre sí. Ejecuta: `node gen-music.mjs`.
import { writeFileSync } from "fs";

const SR = 44100;
const DUR = 12;

function synth({ bpm, shift, kickGain, arpGain }) {
  const beat = 60 / bpm;
  const N = Math.floor(SR * DUR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const midi = (n) => 440 * Math.pow(2, (n - 69 + shift) / 12);
  const chords = [
    [57, 60, 64], // Am
    [53, 57, 60], // F
    [48, 52, 55], // C
    [55, 59, 62], // G
  ];
  const chordDur = 2 * beat;
  const eighth = beat / 2;

  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let s = 0;
    const ci = Math.floor(t / chordDur) % chords.length;
    const ct = t - Math.floor(t / chordDur) * chordDur;
    const padEnv = Math.min(ct / 0.2, 1) * Math.min((chordDur - ct) / 0.3, 1);
    for (const m of chords[ci]) {
      const f = midi(m);
      s += 0.05 * padEnv * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t));
    }
    const ai = Math.floor(t / eighth);
    const arpNote = chords[Math.floor(t / chordDur) % chords.length][ai % 3] + 12;
    s += arpGain * Math.exp(-(t - ai * eighth) * 11) * Math.sin(2 * Math.PI * midi(arpNote) * t);
    const bt = t - Math.floor(t / beat) * beat;
    const kf = 110 * Math.exp(-bt * 28) + 45;
    s += kickGain * Math.exp(-bt * 15) * Math.sin(2 * Math.PI * kf * bt);
    if (ai % 2 === 1) {
      const ht = t - ai * eighth;
      s += 0.04 * Math.exp(-ht * 70) * (Math.random() * 2 - 1);
    }
    s = Math.tanh(s * 0.9);
    L[i] = s;
    R[i] = s;
  }
  const fade = Math.floor(SR * 0.04);
  for (let i = 0; i < fade; i++) {
    const g = i / fade;
    L[i] *= g; R[i] *= g; L[N - 1 - i] *= g; R[N - 1 - i] *= g;
  }
  // WAV 16-bit estéreo
  const ch = 2, bps = 2, dataLen = N * ch * bps;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + dataLen, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(ch, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * ch * bps, 28); buf.writeUInt16LE(ch * bps, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(dataLen, 40);
  let off = 44;
  for (let i = 0; i < N; i++) for (const v of [L[i], R[i]]) { buf.writeInt16LE((Math.max(-1, Math.min(1, v)) * 32767) | 0, off); off += 2; }
  return buf;
}

// 3 variantes armónicas (misma familia, distinta energía/tono).
const variants = [
  { file: "music.wav", bpm: 112, shift: 0, kickGain: 0.55, arpGain: 0.12 },   // base
  { file: "music-chill.wav", bpm: 96, shift: -2, kickGain: 0.3, arpGain: 0.16 }, // suave
  { file: "music-energetico.wav", bpm: 124, shift: 3, kickGain: 0.7, arpGain: 0.1 }, // potente
];

for (const v of variants) {
  const buf = synth(v);
  writeFileSync(`public/${v.file}`, buf);
  console.log(`${v.file}: ${(buf.length / 1048576).toFixed(2)} MB · ${v.bpm} BPM`);
}
