// Pure PPG signal pipeline. No react-native / native imports — fully unit-testable.

export type PpgSample = { t: number; red: number };
export type PpgQuality = 'good' | 'weak' | 'no_finger' | 'saturated';
export type PpgResult = {
  bpm: number | null;
  quality: PpgQuality;
  confidence: number;
};

// Quality thresholds (spec-defined).
const RED_MEAN_NO_FINGER = 200; // below -> finger not covering / not lit
const RED_MEAN_SATURATED = 253; // above -> blown out
const AC_DC_MIN = 0.005; // 0.5% peak-to-peak/mean -> below is too weak

export function assessQuality(reds: number[]): {
  quality: PpgQuality;
  acDcRatio: number;
  redMean: number;
} {
  if (reds.length === 0) {
    return { quality: 'no_finger', acDcRatio: 0, redMean: 0 };
  }
  const redMean = reds.reduce((s, v) => s + v, 0) / reds.length;
  let min = Infinity;
  let max = -Infinity;
  for (const v of reds) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const acDcRatio = redMean > 0 ? (max - min) / redMean : 0;

  if (redMean < RED_MEAN_NO_FINGER) {
    return { quality: 'no_finger', acDcRatio, redMean };
  }
  if (redMean >= RED_MEAN_SATURATED) {
    return { quality: 'saturated', acDcRatio, redMean };
  }
  if (acDcRatio < AC_DC_MIN) {
    return { quality: 'weak', acDcRatio, redMean };
  }
  return { quality: 'good', acDcRatio, redMean };
}

/**
 * Remove a slow baseline by subtracting a centred moving average.
 * `window` should be odd and roughly 1–2 seconds of samples (e.g. 31 @30fps).
 */
export function detrend(series: number[], window: number): number[] {
  const n = series.length;
  if (n === 0) return [];
  const half = Math.floor(window / 2);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    const lo = Math.max(0, i - half);
    const hi = Math.min(n - 1, i + half);
    for (let j = lo; j <= hi; j++) {
      sum += series[j];
      count++;
    }
    out[i] = series[i] - sum / count;
  }
  return out;
}
