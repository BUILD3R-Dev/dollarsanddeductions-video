#!/usr/bin/env python3
"""Turn a short music phrase into a seamless, bar-aligned bed of any length.

    python3 scripts/loop-music.py public/audio/music/<in>.wav public/audio/music/<out>.loop.wav --seconds 620

Why: short generated clips (e.g. Suno exports) are usually a whole musical phrase whose
file length is a few tens of ms longer or shorter than the bars, and whose last bar
decays. Looping the file raw makes every downbeat after the seam land late. This script:
  1. measures the bar length from the clip's rhythm (onset autocorrelation at 1 and 2 bars);
  2. repeats the phrase every N bars (default 4) instead of every file length;
  3. lets each repeat's tail overlap the next repeat's start, fading the tail out over
     --overlap ms (default 60) so the downbeat attack is untouched and there is no click.

Input: 16-bit PCM WAV, mono or stereo (convert others first:
`npx remotion ffmpeg -i in.mp3 -c:a pcm_s16le in.wav`). Pure standard library.
"""
import argparse, math, struct, sys, wave


def read(path):
    w = wave.open(path)
    if w.getsampwidth() != 2:
        sys.exit(f'{path}: need 16-bit PCM WAV (got {8 * w.getsampwidth()}-bit)')
    ch, sr, n = w.getnchannels(), w.getframerate(), w.getnframes()
    raw = struct.unpack('<%dh' % (n * ch), w.readframes(n))
    return [list(raw[c::ch]) for c in range(ch)], sr


def bar_length(chans, sr, expect):
    """Bar length near `expect` (file length / bars), from onset autocorrelation at 1 and 2 bars."""
    lo, hi = expect * 0.95, expect * 1.05
    mono = [sum(s) / len(chans) / 32768 for s in zip(*chans)]
    hop = int(0.002 * sr)
    env = [math.sqrt(sum(v * v for v in mono[i:i + hop]) / hop) for i in range(0, len(mono) - hop, hop)]
    flux = [max(0.0, env[i] - env[i - 1]) for i in range(1, len(env))]
    m = sum(flux) / len(flux)
    f = [v - m for v in flux]
    ac = lambda lag: sum(f[i] * f[i + lag] for i in range(len(f) - lag)) / (len(f) - lag)
    one = max(range(int(lo / 0.002), int(hi / 0.002)), key=ac) * 0.002
    two = max(range(int(2 * lo / 0.002), min(int(2 * hi / 0.002), len(f) - 1)), key=ac) * 0.002 / 2
    return (one + two) / 2, one, two


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--seconds', type=float, required=True, help='length of the bed to write')
    ap.add_argument('--bars', type=int, default=4, help='bars per phrase (default 4)')
    ap.add_argument('--period', type=float, help='override the repeat period in seconds')
    ap.add_argument('--overlap', type=float, default=60, help='tail overlap / fade in ms (default 60)')
    a = ap.parse_args()

    chans, sr = read(a.src)
    n = len(chans[0])
    if a.period:
        period = a.period
        print(f'period {period:.3f}s (given)')
    else:
        bar, one, two = bar_length(chans, sr, n / sr / a.bars)
        spread = abs(one - two) / bar
        print(f'bar {bar:.3f}s (1-bar {one:.3f}, 2-bar {two:.3f}, spread {100 * spread:.1f}%) = {240 / bar:.1f} BPM; {a.bars} bars = {a.bars * bar:.3f}s; file {n / sr:.3f}s')
        if spread > 0.015:
            # Soft material: the pulse is too weak to time the seam better than the file's own phrase cut.
            period = n / sr - a.overlap / 1000
            print(f'tempo estimates disagree; trusting the file as one phrase: period = file - overlap = {period:.3f}s')
        else:
            period = a.bars * bar
    P = int(round(period * sr))
    if P > n:
        sys.exit(f'period {period:.3f}s is longer than the file ({n / sr:.3f}s)')
    ov = min(int(a.overlap / 1000 * sr), n - P) if n > P else 0
    total = int(a.seconds * sr)

    # Tail beyond the period (n - P samples) overlaps the next repeat; fade it out over `ov`.
    out = [[0.0] * (total + n) for _ in chans]
    fade = [math.cos(0.5 * math.pi * i / ov) ** 2 if ov else 0.0 for i in range(n - P)]
    start = 0
    while start < total:
        for c, s in enumerate(chans):
            o = out[c]
            for i in range(P):
                o[start + i] += s[i]
            for i in range(P, n):
                k = i - P
                if k < ov:
                    o[start + i] += s[i] * fade[k]
        start += P

    w = wave.open(a.dst, 'wb')
    w.setnchannels(len(chans))
    w.setsampwidth(2)
    w.setframerate(sr)
    frames = bytearray()
    for i in range(total):
        for c in range(len(chans)):
            frames += struct.pack('<h', max(-32768, min(32767, int(round(out[c][i])))))
    w.writeframes(bytes(frames))
    w.close()
    print(f'wrote {a.dst}: {total / sr:.1f}s, {math.ceil(total / P)} repeats every {P / sr:.3f}s, {1000 * ov / sr:.0f} ms tail fade')


if __name__ == '__main__':
    main()
