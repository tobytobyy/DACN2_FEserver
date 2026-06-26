import {
  dominantFrequencyHz,
  analyze,
  assessQuality,
  detrend,
  PpgSample,
} from './ppgAnalyzer';

describe('assessQuality', () => {
  it('flags no_finger when red mean is low', () => {
    const reds = new Array(300).fill(120);
    const r = assessQuality(reds);
    expect(r.quality).toBe('no_finger');
  });

  it('flags saturated when red mean is very high', () => {
    const reds = new Array(300).fill(254);
    const r = assessQuality(reds);
    expect(r.quality).toBe('saturated');
  });

  it('returns no_finger for empty input without throwing', () => {
    const r = assessQuality([]);
    expect(r.quality).toBe('no_finger');
    expect(r.acDcRatio).toBe(0);
    expect(r.redMean).toBe(0);
  });

  it('flags weak when finger present but amplitude tiny', () => {
    // mean ~220 (finger present), but essentially flat -> AC/DC ratio ~0
    const reds = new Array(300).fill(0).map((_, i) => 220 + (i % 2) * 0.1);
    const r = assessQuality(reds);
    expect(r.quality).toBe('weak');
  });

  it('passes good when finger present with a real pulsation', () => {
    // mean ~220 with ~2% peak-to-peak oscillation
    const reds = new Array(300)
      .fill(0)
      .map((_, i) => 220 + 5 * Math.sin((2 * Math.PI * 1.2 * i) / 30));
    const r = assessQuality(reds);
    expect(r.quality).toBe('good');
    expect(r.redMean).toBeCloseTo(220, 0);
  });
});

describe('detrend', () => {
  it('removes a slow linear baseline, leaving a zero-centred signal', () => {
    // ramp 0..299 plus a small oscillation; after detrend the mean of the
    // middle region should be ~0 and the oscillation preserved in sign.
    const series = new Array(300)
      .fill(0)
      .map((_, i) => i * 0.5 + 3 * Math.sin((2 * Math.PI * 1.2 * i) / 30));
    const out = detrend(series, 31);
    expect(out).toHaveLength(300);
    const mid = out.slice(100, 200);
    const midMean = mid.reduce((s, v) => s + v, 0) / mid.length;
    expect(Math.abs(midMean)).toBeLessThan(1.0);
  });
});

const FS = 30;

const makeSamples = (
  bpm: number,
  seconds: number,
  ampl = 5,
  mean = 220,
): PpgSample[] => {
  const freq = bpm / 60;
  const n = Math.round(seconds * FS);
  const out: PpgSample[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      t: (i / FS) * 1000,
      red: mean + ampl * Math.sin(2 * Math.PI * freq * (i / FS)),
    });
  }
  return out;
};

describe('dominantFrequencyHz', () => {
  it('finds a 1.2 Hz tone within the band', () => {
    const n = 12 * FS;
    const series = new Array(n)
      .fill(0)
      .map((_, i) => Math.sin((2 * Math.PI * 1.2 * i) / FS));
    const { freqHz } = dominantFrequencyHz(series, FS, 0.65, 4.0);
    expect(freqHz).toBeGreaterThan(1.1);
    expect(freqHz).toBeLessThan(1.3);
  });
});

describe('analyze', () => {
  it('returns ~72 bpm for a clean 72 bpm signal', () => {
    const r = analyze(makeSamples(72, 12), FS);
    expect(r.quality).toBe('good');
    expect(r.bpm).not.toBeNull();
    expect(Math.abs((r.bpm as number) - 72)).toBeLessThanOrEqual(6);
  });

  it('returns ~60 bpm for a clean 60 bpm signal', () => {
    const r = analyze(makeSamples(60, 12), FS);
    expect(Math.abs((r.bpm as number) - 60)).toBeLessThanOrEqual(6);
  });

  it('returns ~90 bpm for a clean 90 bpm signal', () => {
    const r = analyze(makeSamples(90, 12), FS);
    expect(Math.abs((r.bpm as number) - 90)).toBeLessThanOrEqual(6);
  });

  it('reports no_finger for a low flat signal', () => {
    const flat: PpgSample[] = new Array(300)
      .fill(0)
      .map((_, i) => ({ t: (i / FS) * 1000, red: 120 }));
    const r = analyze(flat, FS);
    expect(r.quality).toBe('no_finger');
    expect(r.bpm).toBeNull();
  });

  it('rejects an out-of-range frequency (too fast) as weak/null', () => {
    // 300 bpm = 5 Hz, above the 4 Hz band -> no valid in-band peak -> null bpm
    const r = analyze(makeSamples(300, 12), FS);
    expect(r.bpm).toBeNull();
  });
});
