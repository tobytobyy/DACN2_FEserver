import { api } from '../../../services/api';

export const listWorkouts = async (from: string, to: string): Promise<any> => {
  const { data } = await api.get('/health/workouts', { params: { from, to } });
  return data;
};
