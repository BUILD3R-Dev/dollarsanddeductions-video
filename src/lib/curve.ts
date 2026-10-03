/**
 * Monotone cubic interpolation (Fritsch–Carlson) over evenly spaced samples.
 * Returns y(t) for t in [0, n-1]; never overshoots the data, so money never
 * appears to dip between two rising points.
 */
export const monotone = (ys: number[]) => {
  const n = ys.length;
  if (n < 2) return () => ys[0] ?? 0;
  const d = ys.slice(0, -1).map((y, i) => ys[i + 1] - y);
  const m = ys.map((_, i) => {
    if (i === 0) return d[0];
    if (i === n - 1) return d[n - 2];
    return d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  });
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    const xc = Math.min(Math.max(x, 0), n - 1);
    const k = Math.min(Math.floor(xc), n - 2);
    const t = xc - k;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * m[k] + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * m[k + 1]
    );
  };
};

/** Round an axis maximum up to a friendly number with 4–5 ticks. */
export const niceScale = (max: number) => {
  const target = max * 1.08;
  let best = {max: Infinity, ticks: 4};
  for (const ticks of [4, 5]) {
    const raw = target / ticks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 1.5, 2, 2.5, 3, 4, 5, 10].map((c) => c * mag).find((s) => s >= raw)!;
    if (step * ticks < best.max) best = {max: step * ticks, ticks};
  }
  return best;
};
