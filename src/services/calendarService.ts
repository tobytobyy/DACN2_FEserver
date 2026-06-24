import { api, unwrapApiData } from './api';
import type { DailyMetrics } from '../types/home';

export const fetchDayAggregate = async (
  date: string,
): Promise<DailyMetrics | null> => {
  try {
    const res = await api.get('/health/daily-aggregate', { params: { date } });
    return unwrapApiData(res.data) as DailyMetrics;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
};

export const fetchMonthAggregates = async (
  from: string,
  to: string,
): Promise<DailyMetrics[]> => {
  try {
    const res = await api.get('/health/summary', { params: { from, to } });
    return (unwrapApiData(res.data) as DailyMetrics[]) ?? [];
  } catch (err: any) {
    if (err?.response?.status === 404) return [];
    throw err;
  }
};
