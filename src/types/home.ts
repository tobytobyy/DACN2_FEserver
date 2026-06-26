export interface DailyMetrics {
  date: string;
  steps: number | null;
  caloriesOut: number | null;
  avgHeartRate: number | null;
  sleepMinutes: number | null;
  deepMinutes?: number | null;
  remMinutes?: number | null;
  lightMinutes?: number | null;
  sleepScore?: number | null;
  waterMl: number | null;
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string | null;
  source: string;
}
