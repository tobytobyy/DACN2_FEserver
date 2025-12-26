import { useRef, useState, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { workoutApi } from '../services/api';

const GPS_INTERVAL_MS = 1000;
const UI_TIMER_INTERVAL_MS = 1000;
const MIN_DISTANCE_METERS = 20;
const MAX_ACCURACY_METERS = 50;

// Chiều dài bước chân mặc định (có thể cho phép user cấu hình)
const STRIDE_LENGTH_M = 0.8;

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
  const totalDistanceMetersRef = useRef<number>(0);

  const handlePosition = useCallback(async (pos: any, id: string) => {
    const { latitude, longitude, accuracy } = pos.coords;
    setCurrentLat(latitude);
    setCurrentLng(longitude);

    if (accuracy && accuracy > MAX_ACCURACY_METERS) return;

    // Tính khoảng cách từ điểm trước đó (nếu có)
    let segmentDistM = 0;
    if (lastSavedPointRef.current) {
      segmentDistM = calculateDistance(
        lastSavedPointRef.current.lat,
        lastSavedPointRef.current.lng,
        latitude,
        longitude,
      );
    }

    const isRealMovement =
      !lastSavedPointRef.current || segmentDistM >= MIN_DISTANCE_METERS;
    if (!isRealMovement) return;

    // Cập nhật route và điểm cuối
    lastSavedPointRef.current = { lat: latitude, lng: longitude };
    setRoute(prev => [...prev, { lat: latitude, lng: longitude }]);

    // Client-side: cộng dồn quãng đường và tính bước từ distance
    totalDistanceMetersRef.current += segmentDistM;
    setDistanceKm(totalDistanceMetersRef.current / 1000);
    setStepsTotal(Math.round(totalDistanceMetersRef.current / STRIDE_LENGTH_M));

    // (Tuỳ chọn) Ước lượng calo thô theo distance (có thể thay bằng server)
    // Ví dụ rất đơn giản: ~50 kcal mỗi km đi bộ chậm
    setCaloriesOut(Math.round((totalDistanceMetersRef.current / 1000) * 50));

    try {
      const live = await pushPoints(id, [
        {
          tsMs: Date.now(),
          lat: latitude,
          lng: longitude,
          accuracyM: accuracy,
        },
      ]);

      // Nếu server trả về distanceKm đáng tin cậy, đồng bộ theo server:
      if (typeof live.distanceKm === 'number') {
        totalDistanceMetersRef.current = live.distanceKm * 1000;
        setDistanceKm(live.distanceKm);
        setStepsTotal(Math.round((live.distanceKm * 1000) / STRIDE_LENGTH_M));
      }

      // Nếu server có steps/caloriesOut thực, có thể ưu tiên:
      if (typeof live.steps === 'number' && live.steps > 0) {
        setStepsTotal(live.steps);
      }
      if (typeof live.caloriesOut === 'number' && live.caloriesOut > 0) {
        setCaloriesOut(live.caloriesOut);
      }

      setAvgPaceSecPerKm(live.avgPaceSecPerKm ?? null);
    } catch (e) {
      console.log('API Error', e);
      // Giữ số liệu client-side để UI không bị "0"
    }
  }, []);

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
      totalDistanceMetersRef.current = 0;
      setDistanceKm(0);
      setStepsTotal(0);
      setCaloriesOut(0);
      setAvgPaceSecPerKm(null);

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

  const pause = useCallback(() => {
    if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    if (uiTimerRef.current) clearInterval(uiTimerRef.current);
    setIsPaused(true);
  }, []);

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
    totalDistanceMetersRef.current = 0;
  }, []);

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
