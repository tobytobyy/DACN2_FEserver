import { LiveStats } from '.';

let mockDistance = 0;
let mockStartTime = 0;

/* ================= START ================= */
export const startTracking = async () => {
  mockStartTime = Date.now();
  mockDistance = 0;

  return {
    trackingId: 'mock-tracking-id',
    startedAt: new Date().toISOString(),
  };
};

/* ================= PUSH GPS POINT ================= */
export const pushPoints = async (
  trackingId: string,
  points: any[],
): Promise<LiveStats> => {
  mockDistance += points.length * 0.005; // fake distance

  const elapsed = Date.now() - mockStartTime;

  return {
    trackingId,
    distanceKm: Number(mockDistance.toFixed(2)),
    activeDurationMs: elapsed,
    steps: Math.floor(elapsed / 800),
    caloriesOut: Math.floor(mockDistance * 60),
    avgPaceSecPerKm: mockDistance > 0 ? elapsed / 1000 / mockDistance : null,
    updatedAt: new Date().toISOString(),
  };
};

/* ================= OTHERS ================= */
export const pauseTracking = async () => ({ ok: true });
export const resumeTracking = async () => ({ ok: true });
export const endTracking = async () => ({ ok: true });
