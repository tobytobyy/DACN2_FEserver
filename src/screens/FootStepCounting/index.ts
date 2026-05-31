import { api } from '../../services/api';

export type WorkoutType = 'WALK' | 'RUN';

export type LiveStats = {
  trackingId: string;
  distanceKm: number;
  activeDurationMs: number;
  steps: number;
  caloriesOut: number;
  avgPaceSecPerKm?: number | null;
  updatedAt: string;
};

export type StartTrackingResponse = {
  trackingId: string;
  startedAt: string;
};

export type Point = {
  tsMs: number;
  lat: number;
  lng: number;
  accuracyM?: number;
  speedMps?: number;
};

/**
 * Start a new tracking session
 * Swagger: POST /health/workouts/tracking/start
 */
export const startTracking = async (
  workoutType: WorkoutType,
): Promise<StartTrackingResponse> => {
  const { data } = await api.post('/health/workouts/tracking/start', {
    workoutType,
  });
  return data as StartTrackingResponse;
};

/**
 * Push GPS points to an active tracking session
 * Swagger: POST /health/workouts/tracking/{trackingId}/points
 */
export const pushPoints = async (
  trackingId: string,
  points: Point[],
): Promise<LiveStats> => {
  const { data } = await api.post(
    `/health/workouts/tracking/${trackingId}/points`,
    { points },
  );
  return data as LiveStats;
};

/**
 * Upsert total steps for an active tracking session
 * Swagger: POST /health/workouts/tracking/{trackingId}/steps
 */
export const upsertSteps = async (
  trackingId: string,
  stepsTotal: number,
  tsMs?: number,
): Promise<any> => {
  const { data } = await api.post(
    `/health/workouts/tracking/${trackingId}/steps`,
    { stepsTotal, tsMs },
  );
  return data;
};

/**
 * Pause an active tracking session
 * Swagger: POST /health/workouts/tracking/{trackingId}/pause
 */
export const pauseTracking = async (trackingId: string): Promise<any> =>
  api.post(`/health/workouts/tracking/${trackingId}/pause`);

/**
 * Resume a paused tracking session
 * Swagger: POST /health/workouts/tracking/{trackingId}/resume
 */
export const resumeTracking = async (trackingId: string): Promise<any> =>
  api.post(`/health/workouts/tracking/${trackingId}/resume`);

/**
 * End a tracking session
 * Swagger: POST /health/workouts/tracking/{trackingId}/end
 */
export const endTracking = async (trackingId: string): Promise<any> => {
  const { data } = await api.post(
    `/health/workouts/tracking/${trackingId}/end`,
  );
  return data;
};

/**
 * List workouts within a time range
 * Swagger: GET /health/workouts?from=...&to=...
 */
export const listWorkouts = async (from: string, to: string): Promise<any> => {
  const { data } = await api.get('/health/workouts', { params: { from, to } });
  return data;
};
