import { getDayStatus, buildMarkedDates } from '../../utils/healthStatus';
import type { DailyMetrics } from '../../types/home';

const TODAY = '2026-06-24';

const healthy: DailyMetrics = {
  date: TODAY,
  steps: 9000,
  caloriesOut: 400,
  avgHeartRate: 75,
  sleepMinutes: 420,
  waterMl: 2200,
};

const lowSteps: DailyMetrics = { ...healthy, steps: 3000 };
const highHeart: DailyMetrics = { ...healthy, avgHeartRate: 110 };
const shortSleep: DailyMetrics = { ...healthy, sleepMinutes: 300 };
const noMetrics: DailyMetrics = {
  date: TODAY,
  steps: null,
  caloriesOut: null,
  avgHeartRate: null,
  sleepMinutes: null,
  waterMl: null,
};

describe('getDayStatus', () => {
  it('returns future for dates after today', () => {
    expect(getDayStatus(null, '2026-06-25', TODAY)).toBe('future');
    expect(getDayStatus(healthy, '2026-07-01', TODAY)).toBe('future');
  });

  it('returns no-data when metrics is null', () => {
    expect(getDayStatus(null, '2026-06-23', TODAY)).toBe('no-data');
    expect(getDayStatus(undefined, '2026-06-23', TODAY)).toBe('no-data');
  });

  it('returns no-data when all metric fields are null/0', () => {
    expect(getDayStatus(noMetrics, TODAY, TODAY)).toBe('no-data');
  });

  it('returns healthy when all non-null metrics are in range', () => {
    expect(getDayStatus(healthy, TODAY, TODAY)).toBe('healthy');
  });

  it('returns attention when steps below 8000', () => {
    expect(getDayStatus(lowSteps, TODAY, TODAY)).toBe('attention');
  });

  it('returns attention when heart rate above 100', () => {
    expect(getDayStatus(highHeart, TODAY, TODAY)).toBe('attention');
  });

  it('returns attention when sleep below 360 minutes', () => {
    expect(getDayStatus(shortSleep, TODAY, TODAY)).toBe('attention');
  });

  // Unified 8h sleep goal: healthy band is 6-9h (360-540 min); outside = attention.
  it('treats the unified 6-9h sleep band as healthy', () => {
    const eightHours: DailyMetrics = { ...healthy, sleepMinutes: 480 };
    const sixHours: DailyMetrics = { ...healthy, sleepMinutes: 360 };
    const nineHours: DailyMetrics = { ...healthy, sleepMinutes: 540 };
    expect(getDayStatus(eightHours, TODAY, TODAY)).toBe('healthy');
    expect(getDayStatus(sixHours, TODAY, TODAY)).toBe('healthy');
    expect(getDayStatus(nineHours, TODAY, TODAY)).toBe('healthy');
  });

  it('returns attention when sleep above 540 minutes (over 9h)', () => {
    const tenHours: DailyMetrics = { ...healthy, sleepMinutes: 600 };
    expect(getDayStatus(tenHours, TODAY, TODAY)).toBe('attention');
  });

  it('ignores null/0 metrics when checking range (no false attention)', () => {
    const partialHealthy: DailyMetrics = {
      date: TODAY,
      steps: 9000,
      caloriesOut: null,
      avgHeartRate: null,
      sleepMinutes: null,
      waterMl: null,
    };
    expect(getDayStatus(partialHealthy, TODAY, TODAY)).toBe('healthy');
  });
});

describe('buildMarkedDates', () => {
  it('marks selected date with teal background regardless of status', () => {
    const map = { [TODAY]: healthy };
    const result = buildMarkedDates(map, TODAY, TODAY) as any;
    expect(result[TODAY].customStyles.container.backgroundColor).toBe(
      '#2D8C83',
    );
    expect(result[TODAY].customStyles.text.color).toBe('#FFFFFF');
  });

  it('includes green border for healthy non-selected day', () => {
    const yesterday = '2026-06-23';
    const map = { [yesterday]: healthy };
    const result = buildMarkedDates(map, TODAY, TODAY) as any;
    expect(result[yesterday].customStyles.container.borderColor).toBe(
      '#10B981',
    );
    expect(result[yesterday].customStyles.container.borderWidth).toBe(2);
  });

  it('includes amber border for attention day', () => {
    const yesterday = '2026-06-23';
    const map = { [yesterday]: lowSteps };
    const result = buildMarkedDates(map, TODAY, TODAY) as any;
    expect(result[yesterday].customStyles.container.borderColor).toBe(
      '#F59E0B',
    );
  });

  it('does not render a border for future dates', () => {
    const tomorrow = '2026-06-25';
    const map = { [tomorrow]: healthy };
    const result = buildMarkedDates(map, '2026-06-23', TODAY) as any;
    expect(result[tomorrow]).toBeUndefined();
  });
});
