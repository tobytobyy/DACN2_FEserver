import type { DailyMetrics } from '../types/home';

export type DayStatus = 'healthy' | 'attention' | 'no-data' | 'future';

const BORDER_COLOR: Record<DayStatus, string | null> = {
  healthy: '#10B981',
  attention: '#F59E0B',
  'no-data': '#9CA3AF',
  future: null,
};

const BORDER_RADIUS = 18;
const BORDER_WIDTH = 2;
const SELECTED_BG = '#2D8C83';
const SELECTED_TEXT = '#FFFFFF';

const hasData = (m: DailyMetrics): boolean =>
  (m.steps ?? 0) > 0 ||
  (m.avgHeartRate ?? 0) > 0 ||
  (m.sleepMinutes ?? 0) > 0 ||
  (m.waterMl ?? 0) > 0;

const isOutOfRange = (m: DailyMetrics): boolean => {
  if ((m.steps ?? 0) > 0 && (m.steps as number) < 8000) return true;
  if ((m.avgHeartRate ?? 0) > 0) {
    const hr = m.avgHeartRate as number;
    if (hr < 60 || hr > 100) return true;
  }
  if ((m.sleepMinutes ?? 0) > 0) {
    const sl = m.sleepMinutes as number;
    if (sl < 360 || sl > 540) return true;
  }
  if ((m.waterMl ?? 0) > 0 && (m.waterMl as number) < 2000) return true;
  return false;
};

export const getDayStatus = (
  metrics: DailyMetrics | null | undefined,
  dateStr: string,
  today: string,
): DayStatus => {
  if (dateStr > today) return 'future';
  if (!metrics || !hasData(metrics)) return 'no-data';
  return isOutOfRange(metrics) ? 'attention' : 'healthy';
};

export const buildMarkedDates = (
  monthMap: Record<string, DailyMetrics>,
  selectedDate: string,
  today: string,
): Record<string, object> => {
  const result: Record<string, object> = {};

  for (const [date, metrics] of Object.entries(monthMap)) {
    const status = getDayStatus(metrics, date, today);
    if (status === 'future') continue;
    const color = BORDER_COLOR[status]!;
    result[date] = {
      customStyles: {
        container: {
          borderWidth: BORDER_WIDTH,
          borderColor: color,
          borderRadius: BORDER_RADIUS,
        },
        text: {},
      },
    };
  }

  // Selected day overlay — always rendered, merges with health border if present
  const selectedStatus = getDayStatus(
    monthMap[selectedDate],
    selectedDate,
    today,
  );
  const selectedBorder = BORDER_COLOR[selectedStatus];
  result[selectedDate] = {
    customStyles: {
      container: {
        borderRadius: BORDER_RADIUS,
        backgroundColor: SELECTED_BG,
        ...(selectedBorder
          ? { borderWidth: BORDER_WIDTH, borderColor: selectedBorder }
          : {}),
      },
      text: { color: SELECTED_TEXT, fontWeight: 'bold' },
    },
  };

  return result;
};
