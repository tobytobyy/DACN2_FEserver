import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { listWorkouts } from './types';

type ActivityData = {
  steps: number;
  calories: number;
  distanceKm: number;
  title: string;
  progressSteps: number;
  progressCalories: number;
  targetCalories: number; // mục tiêu calo
  targetSteps: number; // mục tiêu bước chân
};

const DEFAULT_STEPS_TARGET = 10000;
const DEFAULT_CALORIES_TARGET = 1000;

// Ước lượng bước chân từ quãng đường
const estimateSteps = (distanceKm: number, strideLengthM = 0.8): number => {
  const distanceM = distanceKm * 1000;
  return Math.round(distanceM / strideLengthM);
};

// Ước lượng calories từ quãng đường
const estimateCalories = (distanceKm: number, kcalPerKm = 50): number => {
  return Math.round(distanceKm * kcalPerKm);
};

export const useActivityToday = () => {
  const [activity, setActivity] = useState<ActivityData>({
    steps: 0,
    calories: 0,
    distanceKm: 0,
    title: 'Activity today',
    progressSteps: 0,
    progressCalories: 0,
    targetCalories: DEFAULT_CALORIES_TARGET,
    targetSteps: DEFAULT_STEPS_TARGET,
  });

  useEffect(() => {
    const fetchLatestWorkout = async () => {
      const now = new Date();
      const past = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      try {
        const data = await listWorkouts(past.toISOString(), now.toISOString());
        if (!data || data.length === 0) return;

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

        const distanceKm = latest.distanceKm ?? 0;
        const steps =
          latest.steps && latest.steps > 0
            ? latest.steps
            : estimateSteps(distanceKm);
        const calories =
          latest.caloriesOut && latest.caloriesOut > 0
            ? latest.caloriesOut
            : estimateCalories(distanceKm);

        // Nếu server có target (ví dụ latest.meta?.targets), ưu tiên dùng
        const targetSteps =
          (latest as any)?.stepsTarget ??
          (latest as any)?.targetSteps ??
          DEFAULT_STEPS_TARGET;
        const targetCalories =
          (latest as any)?.caloriesTarget ??
          (latest as any)?.targetCalories ??
          DEFAULT_CALORIES_TARGET;

        setActivity({
          steps,
          calories,
          distanceKm,
          title,
          progressSteps: Math.min((steps / targetSteps) * 100, 100),
          progressCalories: Math.min((calories / targetCalories) * 100, 100),
          targetSteps,
          targetCalories,
        });
      } catch (error) {
        console.log('Error fetching workout data:', error);
      }
    };

    fetchLatestWorkout();
  }, []);

  return { activity };
};
