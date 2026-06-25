import { api, unwrapApiData } from '../../services/api';

export type HeartRateReading = {
  id: string;
  bpm: number;
  measuredAt: string;
};

export const saveHeartRate = async (
  bpm: number,
  measuredAt: string,
): Promise<void> => {
  await api.post('/health/heart-rate', { bpm, measuredAt });
};

export const fetchHeartRateHistory = async (
  from: string,
  to: string,
): Promise<HeartRateReading[]> => {
  const res = await api.get('/health/heart-rate', { params: { from, to } });
  return (unwrapApiData(res.data) as HeartRateReading[]) ?? [];
};
