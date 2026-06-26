import type { DailyMetrics } from '../../types/home';

const COLORS = { deep: '#4338CA', light: '#818CF8', rem: '#C084FC' };

export const formatHm = (minutes: number): string => {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

const pct = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0;

export const toStageView = (
  deep: number,
  rem: number,
  light: number,
  total: number,
) => ({
  deep: { text: formatHm(deep), percent: pct(deep, total), color: COLORS.deep },
  light: {
    text: formatHm(light),
    percent: pct(light, total),
    color: COLORS.light,
  },
  rem: { text: formatHm(rem), percent: pct(rem, total), color: COLORS.rem },
});

export const weekHours = (metrics: DailyMetrics[]): number[] =>
  metrics.map(m =>
    m.sleepMinutes ? Math.round((m.sleepMinutes / 60) * 10) / 10 : 0,
  );
