import { api, unwrapApiData } from './api';
import type { DailyMetrics } from '../types/home';

export const fetchDayAggregate = async (
  date: string,
): Promise<DailyMetrics | null> => {
  try {
    const res = await api.get(`/health/summary/${date}`);
    return unwrapApiData(res.data) as DailyMetrics;
  } catch {
    return null;
  }
};

export const fetchMonthAggregates = async (
  from: string,
  to: string,
): Promise<DailyMetrics[]> => {
  try {
    const res = await api.get('/health/summary', { params: { from, to } });
    return (unwrapApiData(res.data) as DailyMetrics[]) ?? [];
  } catch {
    return [];
  }
};
