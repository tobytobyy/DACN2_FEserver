// mockHealthData.ts
import { HealthSummary } from '@components/Calendar/Calendar.types';

export const generateMockSleepAndHeart = (): Pick<
  HealthSummary,
  'heartRate' | 'heartStatus' | 'sleep' | 'sleepStatus'
> => {
  const heartRateValue = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
  const heartStatus =
    heartRateValue < 70
      ? 'Low'
      : heartRateValue <= 85
      ? 'Normal'
      : 'Slightly High';

  const sleepHours = Math.floor(Math.random() * (9 - 5 + 1)) + 5;
  const sleepMinutes = Math.floor(Math.random() * 60);
  const sleepStatus =
    sleepHours >= 8 ? 'Good' : sleepHours >= 6 ? 'Fair' : 'Poor';

  return {
    heartRate: `${heartRateValue} BPM`,
    heartStatus,
    sleep: `${sleepHours}h ${sleepMinutes}m`,
    sleepStatus,
  };
};
