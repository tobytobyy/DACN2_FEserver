// src/screens/SleepTracking/constants.ts

/**
 * ✅ Map chữ ngày trong tuần để render chart
 */
export const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * ✅ Tổng số giờ max để scale cột chart (để cột không quá cao)
 */
export const WEEK_MAX_HOURS = 10;

/**
 * ✅ Sleep score demo (sau này bạn thay bằng data thật từ API/Context)
 */
export const MOCK_SLEEP_DATA = {
  totalSleep: '7h 42m',
  score: 85,
  quality: 'Excellent',
  bedTime: '23:15',
  wakeTime: '06:57',
  stages: {
    deep: { text: '1h 30m', percent: 20, color: '#4338CA' },
    light: { text: '4h 15m', percent: 55, color: '#818CF8' },
    rem: { text: '1h 57m', percent: 25, color: '#C084FC' },
  },
};

/**
 * ✅ Dữ liệu weekly (giờ ngủ)
 */
export const MOCK_WEEKLY = [6, 7.5, 5, 8, 7, 7.5, 6.5];
