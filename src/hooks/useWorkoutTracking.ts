import { useRef, useState, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { workoutApi } from '../services/api';

const GPS_INTERVAL_MS = 5000;
const UI_TIMER_INTERVAL_MS = 1000;
const MIN_DISTANCE_METERS = 30;
const MAX_ACCURACY_METERS = 5;

const { startTracking, pushPoints, endTracking } = workoutApi;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
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
  const startTimeRef = useRef<number>(0);
  const lastSavedPointRef = useRef<{ lat: number; lng: number } | null>(null);

  // handlePosition
  const handlePosition = useCallback(async (pos: any, id: string) => {
    const { latitude, longitude, accuracy } = pos.coords;
    setCurrentLat(latitude);
    setCurrentLng(longitude);

    if (accuracy && accuracy > MAX_ACCURACY_METERS) return;

    let isRealMovement = false;
    if (!lastSavedPointRef.current) {
      isRealMovement = true;
    } else {
      const dist = calculateDistance(
        lastSavedPointRef.current.lat,
        lastSavedPointRef.current.lng,
        latitude,
        longitude,
      );
      if (dist >= MIN_DISTANCE_METERS) isRealMovement = true;
    }

    if (isRealMovement) {
      lastSavedPointRef.current = { lat: latitude, lng: longitude };
      setRoute(prev => [...prev, { lat: latitude, lng: longitude }]);
      try {
        const live = await pushPoints(id, [
          {
            tsMs: Date.now(),
            lat: latitude,
            lng: longitude,
            accuracyM: accuracy,
          },
        ]);
        setDistanceKm(live.distanceKm);
        setStepsTotal(live.steps);
        setCaloriesOut(live.caloriesOut);
        setAvgPaceSecPerKm(live.avgPaceSecPerKm);
      } catch (e) {
        console.log('API Error', e);
      }
    }
  }, []);

  // startGpsLoop
  const startGpsLoop = useCallback(
    (id: string) => {
      const getOnce = () =>
        Geolocation.getCurrentPosition(
          pos => handlePosition(pos, id),
          err => console.log(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
      getOnce();
      gpsIntervalRef.current = setInterval(getOnce, GPS_INTERVAL_MS);
    },
    [handlePosition],
  );

  // start
  const start = async (type = 'WALK') => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Lỗi', 'Bạn cần cấp quyền GPS để bắt đầu');
          return;
        }
      }

      const res = await startTracking(type);
      setTrackingId(res.trackingId);
      setIsTracking(true);
      setIsPaused(false);
      setHasFinished(false);
      setRoute([]);
      lastSavedPointRef.current = null;
      startTimeRef.current = Date.now();
      uiTimerRef.current = setInterval(
        () => setElapsedMs(Date.now() - startTimeRef.current),
        UI_TIMER_INTERVAL_MS,
      );
      startGpsLoop(res.trackingId);
    } catch (e) {
      console.log('Start error', e);
      Alert.alert('Lỗi', 'Không thể bắt đầu');
    }
  };

  // pause
  const pause = useCallback(() => {
    if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    if (uiTimerRef.current) clearInterval(uiTimerRef.current);
    setIsPaused(true);
    // giữ isTracking = true để biết vẫn trong session
  }, []);

  // resume
  const resume = useCallback(() => {
    if (!trackingId) return;
    setIsTracking(true);
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedMs;
    uiTimerRef.current = setInterval(
      () => setElapsedMs(Date.now() - startTimeRef.current),
      UI_TIMER_INTERVAL_MS,
    );
    startGpsLoop(trackingId);
  }, [trackingId, elapsedMs, startGpsLoop]);

  // reset
  const reset = useCallback(() => {
    if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    if (uiTimerRef.current) clearInterval(uiTimerRef.current);
    setIsTracking(false);
    setIsPaused(false);
    setHasFinished(false);
    setRoute([]);
    setDistanceKm(0);
    setElapsedMs(0);
    setStepsTotal(0);
    setCaloriesOut(0);
    setAvgPaceSecPerKm(null);
    setTrackingId(null);
    lastSavedPointRef.current = null;
  }, []);

  // end
  const end = async () => {
    if (trackingId) {
      const res = await endTracking(trackingId);
      setHasFinished(true);
      return res;
    }
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
