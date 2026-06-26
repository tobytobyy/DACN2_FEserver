import { useCallback, useEffect, useState } from 'react';
import { fetchDayAggregate } from '../../services/calendarService';
import { fetchSleepWeek } from '../../services/sleepService';
import { formatHm, toStageView, weekHours } from './sleepFormat';

const todayStr = () => new Date().toISOString().slice(0, 10);
const daysAgoStr = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const useSleepData = () => {
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<Awaited<
    ReturnType<typeof fetchDayAggregate>
  > | null>(null);
  const [weekly, setWeekly] = useState<number[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    const today = todayStr();
    const [d, week] = await Promise.all([
      fetchDayAggregate(today),
      fetchSleepWeek(daysAgoStr(6), today),
    ]);
    setDay(d);
    setWeekly(weekHours(week));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const total = day?.sleepMinutes ?? 0;
  const hasData = total > 0;

  return {
    loading,
    hasData,
    totalSleep: formatHm(total),
    score: day?.sleepScore ?? 0,
    stages: toStageView(
      day?.deepMinutes ?? 0,
      day?.remMinutes ?? 0,
      day?.lightMinutes ?? 0,
      total,
    ),
    weekly,
    estimated: hasData, // manual logs are estimated; real-segment logs are rare in v1
    reload,
  };
};
