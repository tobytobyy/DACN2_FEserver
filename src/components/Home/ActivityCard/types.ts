import { api } from '../../../services/api';

export type WorkoutSession = {
  time: { startAt: string; endAt: string };
  distanceKm: number;
  steps: number;
  caloriesOut: number;
};
export const listWorkouts = async (
  from: string,
  to: string,
): Promise<WorkoutSession[]> => {
  const response = await api.get<WorkoutSession[]>('/health/workouts', {
    params: { from, to },
  });
  return response.data;
};
