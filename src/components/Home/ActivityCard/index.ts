import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { listWorkouts } from './types'; // import đúng từ file API

type ActivityData = {
  steps: number;
  calories: number;
  distanceKm: number;
  title: string;
  progressSteps: number;
  progressCalories: number;
  target: number;
};

const DAILY_STEP_GOAL = 10000;
const DEFAULT_TARGET = 1000;

export const useActivityToday = () => {
  const [activity, setActivity] = useState<ActivityData>({
    steps: 0,
    calories: 0,
    distanceKm: 0,
    title: 'Activity today',
    progressSteps: 0,
    progressCalories: 0,
    target: DEFAULT_TARGET,
  });

  useEffect(() => {
    const fetchLatestWorkout = async () => {
      const now = new Date();
      const past = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 ngày trước

      try {
        const data = await listWorkouts(past.toISOString(), now.toISOString());

        if (!data || data.length === 0) {
          // Không có dữ liệu → giữ mặc định 0
          return;
        }

        // Sắp xếp theo thời gian kết thúc giảm dần
        const sorted = data.sort(
          (a, b) =>
            new Date(b.time?.endAt).getTime() -
            new Date(a.time?.endAt).getTime(),
        );

        const latest = sorted[0];
        const startTime = new Date(latest.time?.startAt);
        const isToday =
          format(startTime, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

        const title = isToday ? 'Activity today' : 'Recent activity';

        const steps = latest.steps ?? 0;
        const calories = latest.caloriesOut ?? 0;
        const distanceKm = latest.distanceKm ?? 0;

        setActivity({
          steps,
          calories,
          distanceKm,
          title,
          progressSteps: Math.min((steps / DAILY_STEP_GOAL) * 100, 100),
          progressCalories: Math.min((calories / DEFAULT_TARGET) * 100, 100),
          target: DEFAULT_TARGET,
        });
      } catch (error) {
        console.log('Error fetching workout data:', error);
        // Giữ mặc định 0 nếu lỗi
      }
    };

    fetchLatestWorkout();
  }, []);

  return { activity };
};
