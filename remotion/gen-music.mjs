// Sintetiza VARIAS pistas de fondo ORIGINALES (libres de derechos) para los reels.
// Cada una tiene un MOOD distinto (progresión, tonalidad, tempo y energía
// diferentes) para que NO suene la misma música — pero todas comparten la misma
// paleta sonora (pad + arpegio + kick + hats) para seguir siendo armónicas.
// Ejecuta:  node gen-music.mjs
import { writeFileSync } from "fs";

const SR = 44100;
const DUR = 12;

function synth({ bpm, shift, kickGain, arpGain, chords, padGain = 0.05, swing = 0 }) {
  const beat = 60 / bpm;
  const N = Math.floor(SR * DUR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const midi = (n) => 440 * Math.pow(2, (n - 69 + shift) / 12);
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
      s += padGain * padEnv * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t));
    }
    const ai = Math.floor(t / eighth);
    const arpNote = chords[Math.floor(t / chordDur) % chords.length][ai % 3] + 12;
    const swingShift = ai % 2 === 1 ? swing * eighth : 0;
    s += arpGain * Math.exp(-(t - ai * eighth - swingShift) * 11) * Math.sin(2 * Math.PI * midi(arpNote) * t);
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

// Acordes (notas MIDI). Cada progresión = otro mood.
const Am = [57, 60, 64], F = [53, 57, 60], C = [48, 52, 55], G = [55, 59, 62];
const Dm = [50, 53, 57], Em = [52, 55, 59], Cmaj = [60, 64, 67], Gmaj = [55, 59, 62], Bb = [46, 50, 53];
const D = [50, 54, 57], Bm = [47, 50, 54];

const variants = [
  // base / chill / energético (lo ya existente)
  { file: "music.wav", bpm: 112, shift: 0, kickGain: 0.55, arpGain: 0.12, chords: [Am, F, C, G] },
  { file: "music-chill.wav", bpm: 96, shift: -2, kickGain: 0.3, arpGain: 0.16, chords: [Am, F, C, G], padGain: 0.06 },
  { file: "music-energetico.wav", bpm: 124, shift: 3, kickGain: 0.7, arpGain: 0.1, chords: [Am, F, C, G] },
  // moods NUEVOS (progresiones distintas → no suena igual)
  { file: "music-uplift.wav", bpm: 120, shift: 0, kickGain: 0.5, arpGain: 0.14, chords: [Cmaj, Gmaj, Am, F], swing: 0.06 }, // luminoso I-V-vi-IV
  { file: "music-tension.wav", bpm: 84, shift: -4, kickGain: 0.42, arpGain: 0.1, chords: [Dm, Dm, Bb, Am], padGain: 0.07 }, // dramático/lento
  { file: "music-focus.wav", bpm: 108, shift: 1, kickGain: 0.6, arpGain: 0.13, chords: [Am, Em, Dm, Em], swing: 0.04 }, // hipnótico/groove
  { file: "music-night.wav", bpm: 100, shift: -1, kickGain: 0.38, arpGain: 0.18, chords: [Am, C, G, Em], padGain: 0.065 }, // nocturno/suave
  // VIRALES: progresiones pop pegajosas + energía alta + arp marcado (gancho).
  { file: "music-viral1.wav", bpm: 130, shift: 2, kickGain: 0.72, arpGain: 0.2, chords: [Em, C, G, D], swing: 0.05 }, // vi-IV-I-V (himno pop)
  { file: "music-viral2.wav", bpm: 128, shift: 0, kickGain: 0.7, arpGain: 0.19, chords: [Am, G, F, G] }, // tensión-resolución
  { file: "music-viral3.wav", bpm: 126, shift: -2, kickGain: 0.68, arpGain: 0.17, chords: [Dm, Am, Bb, C], swing: 0.06 }, // épico/drop
  { file: "music-viral4.wav", bpm: 132, shift: 3, kickGain: 0.74, arpGain: 0.2, chords: [Cmaj, Am, F, G] }, // doo-wop alegre
  { file: "music-viral5.wav", bpm: 124, shift: 1, kickGain: 0.66, arpGain: 0.21, chords: [Em, Bm, C, G], swing: 0.05 }, // melancólico-pegajoso
];

for (const v of variants) {
  const buf = synth(v);
  writeFileSync(`public/${v.file}`, buf);
  console.log(`${v.file}: ${(buf.length / 1048576).toFixed(2)} MB · ${v.bpm} BPM`);
}
