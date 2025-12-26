// workoutService.ts
import { api } from '../../services/api'; // đường dẫn tuỳ theo cấu trúc dự án của bạn

type WorkoutRecord = {
  time: {
    startAt: string;
    endAt: string;
  };
  steps: number;
};

/**
 * Gọi API /health/workouts để lấy số bước trong 1 ngày
 * - Nếu có nhiều bản ghi → lấy bản ghi mới nhất
 */
export const getStepsByDate = async (date: string): Promise<number> => {
  try {
    const from = `${date}T00:00:00.000Z`;
    const to = `${date}T23:59:59.999Z`;

    const res = await api.get<WorkoutRecord[]>('/health/workouts', {
      params: { from, to },
    });

    const workouts = res.data;

    if (!workouts || workouts.length === 0) return 0;

    const latest = workouts.sort(
      (a, b) =>
        new Date(b.time.endAt).getTime() - new Date(a.time.endAt).getTime(),
    )[0];

    return latest.steps ?? 0;
  } catch (err) {
    console.error('getStepsByDate error:', err);
    return 0;
  }
};
