"""Original, synthesized background track for the travel reel.

109 BPM so one bar = 2.2 s and the first cut (4.4 s) lands on a downbeat.
Progression C - G - Am - F, light kick/clap/shaker, warm pad, pluck arp, bass.
Ends on a held C chord that rings out under the closing card.
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 109
BEAT = 60 / BPM
BAR = BEAT * 4
TOTAL = 18.9
N = int(SR * TOTAL)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a, d, s_level, r_len):
    t = np.arange(n) / SR
    e = np.ones(n) * s_level
    a_n = max(1, int(a * SR))
    e[:a_n] = np.linspace(0, 1, a_n)
    d_n = int(d * SR)
    e[a_n : a_n + d_n] = np.linspace(1, s_level, len(e[a_n : a_n + d_n]))
    r_n = int(r_len * SR)
    if r_n:
        e[-r_n:] *= np.linspace(1, 0, r_n)
    return e


def pad(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for det in (-0.12, 0.0, 0.12):
        f = freq * 2 ** (det / 12)
        for h in range(1, 7):
            s += np.sin(2 * np.pi * f * h * t + rng.random() * 6) / (h**1.6)
    return s * env(n, 0.35, 0.4, 0.8, min(0.6, dur / 2)) * 0.06


def pluck(freq, dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * freq * h * t) * np.exp(-t * (6 + 5 * h)) / h for h in range(1, 6))
    return s * np.minimum(1, t / 0.003) * 0.22


def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * 2 * freq * t)
    return s * env(n, 0.005, 0.15, 0.7, 0.05) * 0.28


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.55


def clap():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = noise - np.convolve(noise, np.ones(8) / 8, mode="same")  # crude high-pass
    e = np.exp(-t * 22) * (1 + 0.6 * (np.sin(2 * np.pi * 90 * t) > 0) * (t < 0.03))
    return noise * e * 0.12


def shaker():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = noise - np.convolve(noise, np.ones(4) / 4, mode="same")
    return noise * np.exp(-t * 60) * 0.045


# C, G, Am, F voicings (MIDI) and bass roots
chords = [
    ([60, 64, 67, 72], 36),
    ([59, 62, 67, 71], 43),
    ([60, 64, 69, 72], 45),
    ([60, 65, 69, 72], 41),
]

n_bars = 8
for b in range(n_bars):
    t0 = b * BAR
    notes, root = chords[b % 4]
    full = b >= 2  # bars 0-1 intro: pad, arp and shaker only
    for m in notes:
        add(pad(midi(m), BAR + 0.3), t0, pan=rng.uniform(-0.5, 0.5))
    # 8th-note arpeggio
    arp = [notes[0], notes[2], notes[1] + 12, notes[3], notes[2] + 12, notes[3], notes[1] + 12, notes[2]]
    for k, m in enumerate(arp):
        add(pluck(midi(m + 12 if b >= 4 else m)), t0 + k * BEAT / 2, pan=(-0.35 if k % 2 else 0.35), gain=0.8)
    for k in range(8):
        add(shaker(), t0 + k * BEAT / 2 + 0.01, pan=0.4, gain=1.0 if k % 2 else 0.6)
    if full:
        for k in range(4):
            add(kick(), t0 + k * BEAT)
            if k in (1, 3):
                add(clap(), t0 + k * BEAT, pan=-0.1)
        for k, off in enumerate([0, 1.5, 2, 3, 3.5]):
            add(bass(midi(root), BEAT * 0.45), t0 + off * BEAT)

# Pickup fill into the first cut (bar 2 downbeat = 4.4 s)
for k in range(4):
    add(clap(), 2 * BAR - BEAT + k * BEAT / 4, gain=0.5 + 0.15 * k)

# Final held C chord + low C at bar 8 (17.6 s), ringing out
tf = n_bars * BAR
for m in [48, 60, 64, 67, 72, 76]:
    add(pad(midi(m), TOTAL - tf), tf, gain=1.3)
add(pluck(midi(84), 1.2), tf, gain=1.0)
add(kick(), tf)

# Simple stereo "room": a couple of short delays
for d, g in ((0.031, 0.18), (0.047, 0.14)):
    k = int(d * SR)
    L[k:] += R[:-k] * g
    R[k:] += L[:-k] * g

mix = np.stack([L, R], axis=1)
mix /= np.max(np.abs(mix)) / 0.89
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
pcm = (mix * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", TOTAL)
