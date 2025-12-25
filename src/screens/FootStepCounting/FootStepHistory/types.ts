import { api } from '../../../services/api';

export const listWorkouts = async (from: string, to: string): Promise<any> => {
  const { data } = await api.get('/health/workouts', { params: { from, to } });
  return data;
};
export const estimateSteps = (
  distanceKm: number,
  strideLengthM = 0.8,
): number => {
  const distanceM = distanceKm * 1000;
  return Math.round(distanceM / strideLengthM);
};
