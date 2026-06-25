import { useRef, useState, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import type { Subscription } from 'rxjs';
import { workoutApi } from '../services/api';
import { useUser } from '../context/UserContext';
import type { Point } from '../screens/FootStepCounting/index';

// GPS polls every 1s for smooth route, but API batches every 10s (saves battery ~10x)
const GPS_INTERVAL_MS = 1000;
const UI_TIMER_INTERVAL_MS = 1000;
const POINT_PUSH_INTERVAL_MS = 10000;
const MIN_DISTANCE_METERS = 5;
const MAX_ACCURACY_METERS = 50;
const STRIDE_LENGTH_M = 0.8; // GPS fallback stride

// MET (Compendium of Physical Activities)
const WALK_MET = 3.5;
const RUN_MET = 7.0;
const DEFAULT_WEIGHT_KG = 65;

// Accelerometer step detection thresholds (m/s²)
const ACC_SAMPLE_MS = 100; // 10 Hz
const MAG_HIGH = 11.5; // crossing up triggers potential step
const MAG_LOW = 9.0; // crossing down confirms the step
const MIN_STEP_INTERVAL_MS = 350; // max ~2.8 steps/second

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
  const accSubscriptionRef = useRef<Subscription | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);
  const lastSavedPointRef = useRef<{ lat: number; lng: number } | null>(null);
  const totalDistanceMetersRef = useRef<number>(0);
  const pointBufferRef = useRef<Point[]>([]);
  const stepsTotalRef = useRef<number>(0);
  const useAccelerometerRef = useRef(false);
  const workoutTypeRef = useRef<string>('WALK');

  // Accelerometer step detection state
  const accIsAboveRef = useRef(false);
  const accLastStepMsRef = useRef(0);

  // User weight via ref — avoid stale closure without recreating callbacks on profile updates
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

  // Two-threshold step detection from accelerometer magnitude
  const detectStep = useCallback((mag: number): boolean => {
    if (!accIsAboveRef.current && mag > MAG_HIGH) {
      accIsAboveRef.current = true;
    } else if (accIsAboveRef.current && mag < MAG_LOW) {
      accIsAboveRef.current = false;
      const now = Date.now();
      if (now - accLastStepMsRef.current > MIN_STEP_INTERVAL_MS) {
        accLastStepMsRef.current = now;
        return true;
      }
    }
    return false;
  }, []);

  // Flush buffered GPS points; sync server values back to client
  const flushPoints = useCallback(
    async (id: string) => {
      const toSend = pointBufferRef.current.splice(0);
      if (toSend.length === 0) return;
      try {
        const live = await pushPoints(id, toSend);
        if (typeof live.distanceKm === 'number' && live.distanceKm > 0) {
          totalDistanceMetersRef.current = live.distanceKm * 1000;
          setDistanceKm(live.distanceKm);
          // Sync GPS-derived steps only when accelerometer not in use
          if (!useAccelerometerRef.current) {
            updateSteps(Math.round((live.distanceKm * 1000) / STRIDE_LENGTH_M));
          }
        }
        if (
          typeof live.steps === 'number' &&
          live.steps > 0 &&
          !useAccelerometerRef.current
        ) {
          updateSteps(live.steps);
        }
        if (typeof live.caloriesOut === 'number' && live.caloriesOut > 0) {
          setCaloriesOut(live.caloriesOut);
        }
        setAvgPaceSecPerKm(live.avgPaceSecPerKm ?? null);
      } catch {
        // Silently retain client-side values on network failure
      }
    },
    [updateSteps],
  );

  const handlePosition = useCallback(
    (pos: any) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setCurrentLat(latitude);
      setCurrentLng(longitude);

      if (accuracy && accuracy > MAX_ACCURACY_METERS) return;

      let segmentDistM = 0;
      if (lastSavedPointRef.current) {
        segmentDistM = calculateDistance(
          lastSavedPointRef.current.lat,
          lastSavedPointRef.current.lng,
          latitude,
          longitude,
        );
      }
      if (lastSavedPointRef.current && segmentDistM < MIN_DISTANCE_METERS)
        return;

      lastSavedPointRef.current = { lat: latitude, lng: longitude };
      setRoute(prev => [...prev, { lat: latitude, lng: longitude }]);
      totalDistanceMetersRef.current += segmentDistM;
      setDistanceKm(totalDistanceMetersRef.current / 1000);

      // GPS-based steps — fallback when accelerometer is unavailable
      if (!useAccelerometerRef.current) {
        updateSteps(
          Math.round(totalDistanceMetersRef.current / STRIDE_LENGTH_M),
        );
      }

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

  const stopAccelerometer = useCallback(() => {
    if (accSubscriptionRef.current) {
      accSubscriptionRef.current.unsubscribe();
      accSubscriptionRef.current = null;
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
      pointPushTimerRef.current = setInterval(
        () => flushPoints(id),
        POINT_PUSH_INTERVAL_MS,
      );
    },
    [handlePosition, flushPoints],
  );

  const startAccelerometer = useCallback(
    (baseSteps: number) => {
      accIsAboveRef.current = false;
      accLastStepMsRef.current = 0;
      let stepCount = baseSteps;

      try {
        setUpdateIntervalForType(SensorTypes.accelerometer, ACC_SAMPLE_MS);
        accSubscriptionRef.current = accelerometer.subscribe({
          next: ({ x, y, z }: { x: number; y: number; z: number }) => {
            const mag = Math.sqrt(x * x + y * y + z * z);
            if (detectStep(mag)) {
              stepCount++;
              updateSteps(stepCount);
            }
          },
          error: () => {
            // Sensor unavailable — silently fall back to GPS-based steps
            useAccelerometerRef.current = false;
          },
        });
        useAccelerometerRef.current = true;
      } catch {
        useAccelerometerRef.current = false;
      }
    },
    [detectStep, updateSteps],
  );

  const startUiTimer = useCallback((baseElapsedMs: number) => {
    const origin = Date.now() - baseElapsedMs;
    startTimeRef.current = origin;
    uiTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - origin;
      setElapsedMs(elapsed);
      const met = workoutTypeRef.current === 'RUN' ? RUN_MET : WALK_MET;
      // MET-based calorie: kcal = MET × weight_kg × hours
      setCaloriesOut(
        Math.round(met * weightKgRef.current * (elapsed / 3_600_000)),
      );
    }, UI_TIMER_INTERVAL_MS);
  }, []);

  const start = async (type = 'WALK') => {
    try {
      if (Platform.OS === 'android') {
        const locationGrant = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (locationGrant !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Lỗi', 'Bạn cần cấp quyền GPS để bắt đầu');
          return;
        }
        if (Platform.Version >= 29) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          );
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

      startAccelerometer(0);
      startUiTimer(0);
      startGpsLoop(res.trackingId);
    } catch (e) {
      console.log('Start error', e);
      Alert.alert('Lỗi', 'Không thể bắt đầu');
    }
  };

  const pause = useCallback(
    async (id: string | null) => {
      stopAllIntervals();
      stopAccelerometer();
      if (id) await flushPoints(id).catch(() => {});
      pausedElapsedRef.current = Date.now() - startTimeRef.current;
      setIsPaused(true);
      setIsTracking(false);
    },
    [stopAllIntervals, stopAccelerometer, flushPoints],
  );

  const resume = useCallback(
    (id: string | null) => {
      if (!id) return;
      setIsTracking(true);
      setIsPaused(false);
      startAccelerometer(stepsTotalRef.current);
      startUiTimer(pausedElapsedRef.current);
      startGpsLoop(id);
    },
    [startAccelerometer, startUiTimer, startGpsLoop],
  );

  const reset = useCallback(() => {
    stopAllIntervals();
    stopAccelerometer();
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
  }, [stopAllIntervals, stopAccelerometer, updateSteps]);

  const end = async (id: string | null) => {
    if (!id) return;
    await flushPoints(id).catch(() => {});
    // Sync step count to backend before finalising — fixes steps = 0 in workout history
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
