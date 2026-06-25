import { useRef, useState, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { workoutApi } from '../services/api';
import { useUser } from '../context/UserContext';
import type { Point } from '../screens/FootStepCounting/index';

// GPS polls every 1s for smooth route, but pushes to API every 10s (saves battery ~10x)
const GPS_INTERVAL_MS = 1000;
const UI_TIMER_INTERVAL_MS = 1000;
const POINT_PUSH_INTERVAL_MS = 10000;

// Filtering: ignore GPS noise
const MIN_DISTANCE_METERS = 3; // smaller = more responsive route; larger = less drift noise
const MAX_ACCURACY_METERS = 30; // tighter than before — ignore weak GPS fixes

// Step estimation from GPS distance
const WALK_STRIDE_M = 0.75; // avg walking step length
const RUN_STRIDE_M = 1.2; // avg running step length

// MET values (Compendium of Physical Activities) for calorie calc
const WALK_MET = 3.5;
const RUN_MET = 7.0;
const DEFAULT_WEIGHT_KG = 65;

const { startTracking, pushPoints, endTracking, upsertSteps } = workoutApi;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const useWorkoutTracking = () => {
  const { user } = useUser();

  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stepsTotal, setStepsTotal] = useState(0);
  const [caloriesOut, setCaloriesOut] = useState(0);
  const [avgPaceSecPerKm, setAvgPaceSecPerKm] = useState<number | null>(null);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);

  const gpsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pointPushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);
  const lastSavedPointRef = useRef<{ lat: number; lng: number } | null>(null);
  const totalDistanceMetersRef = useRef<number>(0);
  const pointBufferRef = useRef<Point[]>([]);
  const stepsTotalRef = useRef<number>(0);
  const workoutTypeRef = useRef<string>('WALK');

  // Keep weight in ref so callbacks don't need to re-create when user profile updates
  const weightKgRef = useRef<number>(DEFAULT_WEIGHT_KG);
  weightKgRef.current =
    user?.profile?.weightKg ??
    user?.profile?.weight ??
    user?.healthMetrics?.weightKg ??
    DEFAULT_WEIGHT_KG;

  const updateSteps = useCallback((steps: number) => {
    stepsTotalRef.current = steps;
    setStepsTotal(steps);
  }, []);

  // Flush buffered GPS points to backend; sync server values back to UI
  const flushPoints = useCallback(
    async (id: string) => {
      const toSend = pointBufferRef.current.splice(0);
      if (toSend.length === 0) return;
      try {
        const live = await pushPoints(id, toSend);
        // Server is source of truth — sync distance, steps, calories, pace
        if (typeof live.distanceKm === 'number' && live.distanceKm > 0) {
          totalDistanceMetersRef.current = live.distanceKm * 1000;
          setDistanceKm(live.distanceKm);
        }
        if (typeof live.steps === 'number' && live.steps > 0) {
          updateSteps(live.steps);
        }
        if (typeof live.caloriesOut === 'number' && live.caloriesOut > 0) {
          setCaloriesOut(live.caloriesOut);
        }
        setAvgPaceSecPerKm(live.avgPaceSecPerKm ?? null);
      } catch {
        // Keep client-side estimates on network failure; retry next flush
      }
    },
    [updateSteps],
  );

  const handlePosition = useCallback(
    (pos: any) => {
      const { latitude, longitude, accuracy } = pos.coords;

      // Always update marker position for UI responsiveness
      setCurrentLat(latitude);
      setCurrentLng(longitude);

      // Drop fixes with poor accuracy (e.g. indoors, first GPS lock)
      if (accuracy && accuracy > MAX_ACCURACY_METERS) return;

      // Calculate distance from previous point
      let segmentDistM = 0;
      if (lastSavedPointRef.current) {
        segmentDistM = calculateDistance(
          lastSavedPointRef.current.lat,
          lastSavedPointRef.current.lng,
          latitude,
          longitude,
        );
      }

      // Skip GPS noise: ignore movement smaller than threshold
      if (lastSavedPointRef.current && segmentDistM < MIN_DISTANCE_METERS)
        return;

      // Record point
      lastSavedPointRef.current = { lat: latitude, lng: longitude };
      setRoute(prev => [...prev, { lat: latitude, lng: longitude }]);

      // Accumulate distance
      totalDistanceMetersRef.current += segmentDistM;
      const km = totalDistanceMetersRef.current / 1000;
      setDistanceKm(km);

      // Estimate steps from GPS distance — same principle as Strava/Nike Run Club
      const stride =
        workoutTypeRef.current === 'RUN' ? RUN_STRIDE_M : WALK_STRIDE_M;
      updateSteps(Math.round(totalDistanceMetersRef.current / stride));

      // Buffer point for batch push (sends every 10s, not every 1s)
      pointBufferRef.current.push({
        tsMs: Date.now(),
        lat: latitude,
        lng: longitude,
        accuracyM: accuracy,
      });
    },
    [updateSteps],
  );

  const stopAllIntervals = useCallback(() => {
    if (gpsIntervalRef.current) {
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
    if (uiTimerRef.current) {
      clearInterval(uiTimerRef.current);
      uiTimerRef.current = null;
    }
    if (pointPushTimerRef.current) {
      clearInterval(pointPushTimerRef.current);
      pointPushTimerRef.current = null;
    }
  }, []);

  const startGpsLoop = useCallback(
    (id: string) => {
      const getOnce = () =>
        Geolocation.getCurrentPosition(
          pos => handlePosition(pos),
          err => console.log('GPS error:', err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
      getOnce();
      gpsIntervalRef.current = setInterval(getOnce, GPS_INTERVAL_MS);
      // Batch push: flush accumulated points every 10s
      pointPushTimerRef.current = setInterval(
        () => flushPoints(id),
        POINT_PUSH_INTERVAL_MS,
      );
    },
    [handlePosition, flushPoints],
  );

  const startUiTimer = useCallback((baseElapsedMs: number) => {
    const origin = Date.now() - baseElapsedMs;
    startTimeRef.current = origin;
    uiTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - origin;
      setElapsedMs(elapsed);
      // MET-based calorie: kcal = MET × weight_kg × hours elapsed
      const met = workoutTypeRef.current === 'RUN' ? RUN_MET : WALK_MET;
      setCaloriesOut(
        Math.round(met * weightKgRef.current * (elapsed / 3_600_000)),
      );
    }, UI_TIMER_INTERVAL_MS);
  }, []);

  const start = async (type = 'WALK') => {
    try {
      if (Platform.OS === 'android') {
        const grant = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (grant !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Lỗi', 'Bạn cần cấp quyền GPS để bắt đầu');
          return;
        }
      }

      const res = await startTracking(type);
      workoutTypeRef.current = type;
      setTrackingId(res.trackingId);
      setIsTracking(true);
      setIsPaused(false);
      setHasFinished(false);
      setRoute([]);
      lastSavedPointRef.current = null;
      totalDistanceMetersRef.current = 0;
      pointBufferRef.current = [];
      pausedElapsedRef.current = 0;
      updateSteps(0);
      setDistanceKm(0);
      setCaloriesOut(0);
      setAvgPaceSecPerKm(null);

      startUiTimer(0);
      startGpsLoop(res.trackingId);
    } catch (e) {
      console.log('Start error', e);
      Alert.alert('Lỗi', 'Không thể bắt đầu. Hãy kiểm tra kết nối mạng.');
    }
  };

  const pause = useCallback(
    async (id: string | null) => {
      stopAllIntervals();
      if (id) await flushPoints(id).catch(() => {});
      pausedElapsedRef.current = Date.now() - startTimeRef.current;
      setIsPaused(true);
      setIsTracking(false);
    },
    [stopAllIntervals, flushPoints],
  );

  const resume = useCallback(
    (id: string | null) => {
      if (!id) return;
      setIsTracking(true);
      setIsPaused(false);
      startUiTimer(pausedElapsedRef.current);
      startGpsLoop(id);
    },
    [startUiTimer, startGpsLoop],
  );

  const reset = useCallback(() => {
    stopAllIntervals();
    setIsTracking(false);
    setIsPaused(false);
    setHasFinished(false);
    setRoute([]);
    setDistanceKm(0);
    setElapsedMs(0);
    updateSteps(0);
    setCaloriesOut(0);
    setAvgPaceSecPerKm(null);
    setTrackingId(null);
    lastSavedPointRef.current = null;
    totalDistanceMetersRef.current = 0;
    pointBufferRef.current = [];
    pausedElapsedRef.current = 0;
  }, [stopAllIntervals, updateSteps]);

  const end = async (id: string | null) => {
    if (!id) return;
    // Flush remaining buffered points before finalising
    await flushPoints(id).catch(() => {});
    // Sync final step count — fixes steps = 0 in workout history
    if (stepsTotalRef.current > 0) {
      try {
        await upsertSteps(id, stepsTotalRef.current);
      } catch {}
    }
    const res = await endTracking(id);
    setHasFinished(true);
    return res;
  };

  return {
    trackingId,
    isTracking,
    isPaused,
    hasFinished,
    distanceKm,
    elapsedMs,
    stepsTotal,
    caloriesOut,
    avgPaceSecPerKm,
    currentLat,
    currentLng,
    route,
    start,
    pause,
    resume,
    reset,
    end,
  };
};
