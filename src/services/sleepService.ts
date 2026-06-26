import { api, unwrapApiData } from './api';
import type { DailyMetrics } from '../types/home';

export interface CreateSleepInput {
  startAt: string; // ISO
  endAt: string; // ISO
  source?: string;
}

export const createSleepSession = async (
  input: CreateSleepInput,
): Promise<boolean> => {
  try {
    await api.post('/health/sleep', {
      time: { startAt: input.startAt, endAt: input.endAt },
      meta: { source: input.source ?? 'manual' },
    });
    return true;
  } catch {
    return false;
  }
};

export const fetchSleepWeek = async (
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
