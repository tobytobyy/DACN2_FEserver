// src/screens/FootStepCounting/FootStepCountingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

// components tách riêng
import FootStepMapHeader from '@components/FootstepCounting/FootStepMapHeader/FootStepMapHeader';
import FootStepBottomCard from '@components/FootstepCounting/FootStepBottomCard/FootStepBottomCard';

type Nav = NativeStackNavigationProp<BrowserStackParamList, 'FootStepCounting'>;

const STEP_PER_SECOND = 2;
const KM_PER_STEP = 0.0008;
const CALO_PER_STEP = 0.04;

const FootStepCountingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [isTracking, setIsTracking] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTracking = () => {
    if (isTracking) return;

    setIsTracking(true);
    setHasFinished(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setElapsedSec(prev => prev + 1);
      setSteps(prev => prev + STEP_PER_SECOND);
      setDistanceKm(prev => prev + STEP_PER_SECOND * KM_PER_STEP);
      setCalories(prev => prev + STEP_PER_SECOND * CALO_PER_STEP);
    }, 1000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setHasFinished(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // format helpers
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDistance = (km: number) => km.toFixed(2);

  const formatPace = () => {
    if (distanceKm <= 0) return `--'--" /km`;
    const minutesPerKm = elapsedSec / 60 / distanceKm;
    const min = Math.floor(minutesPerKm);
    const sec = Math.round((minutesPerKm - min) * 60);
    return `${min}'${sec.toString().padStart(2, '0')}" /km`;
  };

  const distanceText = formatDistance(distanceKm);
  const timeText = formatTime(elapsedSec);
  const paceText = formatPace();

  const resetActivity = () => {
    setIsTracking(false);
    setHasFinished(false);
    setElapsedSec(0);
    setDistanceKm(0);
    setSteps(0);
    setCalories(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FootStepMapHeader onBack={() => navigation.goBack()} />

      <FootStepBottomCard
        hasFinished={hasFinished}
        isTracking={isTracking}
        distanceText={distanceText}
        timeText={timeText}
        paceText={paceText}
        steps={steps}
        calories={Math.round(calories)}
        onToggleTracking={toggleTracking}
        onReset={resetActivity}
      />
    </SafeAreaView>
  );
};

export default FootStepCountingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
});
