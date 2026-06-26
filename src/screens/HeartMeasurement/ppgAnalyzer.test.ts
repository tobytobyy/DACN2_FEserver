import { assessQuality, detrend } from './ppgAnalyzer';

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
