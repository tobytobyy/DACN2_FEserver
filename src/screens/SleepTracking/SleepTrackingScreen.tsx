// src/screens/SleepTracking/SleepTrackerScreen.tsx
import React, { useMemo } from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '@components/SleepTracking/styles';
import { MOCK_SLEEP_DATA, MOCK_WEEKLY } from '@context/SleepContext';

import NightBackground from '@components/SleepTracking/NightBackground/NightBackground';
import SleepHeader from '@components/SleepTracking/SleepHeader/SleepHeader';
import SleepDial from '@components/SleepTracking/SleepDial/SleepDial';
import ScheduleRow from '@components/SleepTracking/ScheduleRow/ScheduleRow';
import SleepStages from '@components/SleepTracking/SleepStages/SleepStages';
import WeeklyTrend from '@components/SleepTracking/WeeklyTrend/WeeklyTrend';

/**
 * ✅ Sleep Tracker Screen
 * - Chỉ làm nhiệm vụ: gom layout + truyền data xuống component con
 * - Không render UI chi tiết (để component con xử lý)
 */
const SleepTrackerScreen: React.FC = () => {
  const navigation = useNavigation();

  /**
   * ✅ Data demo
   * - useMemo để ổn định reference (tối ưu render)
   */
  const sleepData = useMemo(() => MOCK_SLEEP_DATA, []);
  const weeklyData = useMemo(() => MOCK_WEEKLY, []);

  return (
    <View style={styles.container}>
      {/* StatusBar theo theme của màn sleep (night mode) */}
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />

      {/* Background decor (ngôi sao / nền tím) */}
      <NightBackground />

      {/* Header: back + title + icon right */}
      <SleepHeader onBack={() => navigation.goBack()} />

      {/* Nội dung chính */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Dial: vòng tròn + score */}
        <SleepDial score={sleepData.score} totalSleep={sleepData.totalSleep} />

        {/* Bed time / wake time */}
        <ScheduleRow
          bedTime={sleepData.bedTime}
          wakeTime={sleepData.wakeTime}
        />

        {/* Card chứa Stages + Trend */}
        <View style={styles.analysisCard}>
          <SleepStages stages={sleepData.stages} />
          <WeeklyTrend weeklyData={weeklyData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default SleepTrackerScreen;
