import { formatHm, toStageView, weekHours } from '../sleepFormat';

describe('sleepFormat', () => {
  it('formatHm formats minutes', () => {
    expect(formatHm(462)).toBe('7h 42m');
    expect(formatHm(60)).toBe('1h 0m');
    expect(formatHm(0)).toBe('0h 0m');
  });

  it('toStageView computes percents against total', () => {
    const v = toStageView(60, 120, 300, 480);
    expect(v.deep.percent).toBe(13); // round(60/480*100)
    expect(v.rem.percent).toBe(25);
    expect(v.light.percent).toBe(63);
    expect(v.deep.color).toBe('#4338CA');
  });

  it('toStageView handles zero total without NaN', () => {
    const v = toStageView(0, 0, 0, 0);
    expect(v.deep.percent).toBe(0);
  });

  it('weekHours converts minutes arrays to hours', () => {
    const out = weekHours([
      { sleepMinutes: 462 } as any,
      { sleepMinutes: null } as any,
    ]);
    expect(out).toEqual([7.7, 0]);
  });
});
