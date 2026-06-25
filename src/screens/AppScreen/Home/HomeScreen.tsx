import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HeaderSection from '@components/Home/HeaderSection/HeaderSection';
import ActivityCard from '@components/Home/ActivityCard/ActivityCard';
import HeartSleepGrid from '@components/Home/HeartSleepGrid/HeartSleepGrid';
import WaterCard from '@components/Home/WaterCard/WaterCard';
import ReferenceRangesCard from '@components/Home/ReferenceRangesCard';
import ArticlesSection from '@components/Home/ArticlesSection';

import { useHomeData } from '../../../hooks/useHomeData';
import { useWater } from '@context/WaterContext';
import type { DailyMetrics } from '../../../types/home';

const SkeletonBox: React.FC<{ height: number; marginBottom?: number }> = ({
  height,
  marginBottom = 12,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { height, marginBottom, opacity }]}
    />
  );
};

// weekMetrics[0] = today, weekMetrics[1] = yesterday, etc.
// null days count as inactive — streak breaks on first inactive day.
const calculateStreak = (week: (DailyMetrics | null)[]): number => {
  let streak = 0;
  for (const day of week) {
    if ((day?.steps ?? 0) > 0 || (day?.caloriesOut ?? 0) > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { metrics, weekMetrics, user, articles, isLoading } = useHomeData();
  const { initializeForDay } = useWater();

  useEffect(() => {
    if (metrics?.waterMl != null) {
      initializeForDay(metrics.waterMl);
    }
  }, [metrics?.waterMl, initializeForDay]);

  const streakDays = calculateStreak(weekMetrics);
  const profile = user?.profile;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D8C83" />

      <HeaderSection
        displayName={profile?.fullName || user?.username}
        avatarUrl={profile?.avatarUrl}
        streakDays={streakDays}
        onPressAvatar={() => navigation.navigate('SettingsTab')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <>
            <SkeletonBox height={120} />
            <SkeletonBox height={100} />
            <SkeletonBox height={100} />
          </>
        ) : (
          <>
            <ActivityCard
              steps={metrics?.steps ?? null}
              calories={metrics?.caloriesOut ?? null}
              targetSteps={user?.goals?.dailySteps ?? undefined}
              targetCalories={user?.goals?.dailyCaloriesOut ?? undefined}
            />
            <HeartSleepGrid
              heartRate={metrics?.avgHeartRate ?? null}
              sleepMinutes={metrics?.sleepMinutes ?? null}
            />
            <WaterCard />
          </>
        )}

        <ReferenceRangesCard metrics={metrics ?? null} />
        <ArticlesSection articles={articles} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
});

export default HomeScreen;
