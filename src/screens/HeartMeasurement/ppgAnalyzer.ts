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

const BPM_MIN = 40;
const BPM_MAX = 200;
const BAND_LO_HZ = 0.65;
const BAND_HI_HZ = 4.0;
const FREQ_STEP_HZ = 0.05;
const SETTLE_SAMPLES = 150; // ~5s @30fps discarded for filter settle

/**
 * Scan candidate frequencies across [loHz, hiHz] using a direct DFT power
 * estimate (Goertzel-style) and return the peak frequency plus a confidence
 * = peakPower / totalScannedPower (0..1).
 */
export function dominantFrequencyHz(
  series: number[],
  sampleRateHz: number,
  loHz: number,
  hiHz: number,
): { freqHz: number; confidence: number } {
  const n = series.length;
  if (n === 0) return { freqHz: 0, confidence: 0 };

  let bestFreq = 0;
  let bestPower = -1;
  let totalPower = 0;

  for (let f = loHz; f <= hiHz + 1e-9; f += FREQ_STEP_HZ) {
    const w = (2 * Math.PI * f) / sampleRateHz;
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      re += series[i] * Math.cos(w * i);
      im += series[i] * Math.sin(w * i);
    }
    const power = re * re + im * im;
    totalPower += power;
    if (power > bestPower) {
      bestPower = power;
      bestFreq = f;
    }
  }

  const confidence = totalPower > 0 ? bestPower / totalPower : 0;
  return { freqHz: bestFreq, confidence };
}

/**
 * Full pipeline: quality gate -> settle trim -> detrend -> dominant frequency
 * -> BPM. Returns null bpm with a quality reason when the signal is unusable.
 */
export function analyze(samples: PpgSample[], sampleRateHz: number): PpgResult {
  const reds = samples.map(s => s.red);
  const q = assessQuality(reds);
  if (q.quality !== 'good') {
    return { bpm: null, quality: q.quality, confidence: 0 };
  }

  // Trim filter-settle region if we have enough samples.
  const trimmed =
    reds.length > SETTLE_SAMPLES ? reds.slice(SETTLE_SAMPLES) : reds;

  // Detrend with ~1s window (odd).
  const win = Math.max(3, Math.round(sampleRateHz) | 1); // ~1s odd window; Math.round handles fractional fps (e.g. 29.97)
  const detrended = detrend(trimmed, win);

  const { freqHz, confidence } = dominantFrequencyHz(
    detrended,
    sampleRateHz,
    BAND_LO_HZ,
    BAND_HI_HZ,
  );
  const bpm = Math.round(freqHz * 60);

  if (bpm < BPM_MIN || bpm > BPM_MAX) {
    return { bpm: null, quality: 'weak', confidence };
  }
  return { bpm, quality: 'good', confidence };
}
