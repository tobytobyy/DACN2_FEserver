import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '@assets/theme';
import { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';

import DailySummary from '@components/Calendar/DailySummary/DailySummary';
import CalendarHeader from '@components/Calendar/CalendarHeader/CalendarHeader';
import { styles } from '@components/Calendar/styles';
import type { DailyMetrics } from '@types/home';

import { api } from '../../../services/api';

const STEP_GOAL = 10000;

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-12-26');
  const [metricsMap, setMetricsMap] = useState<Record<string, DailyMetrics>>(
    {},
  );

  type NavigationProp = NativeStackNavigationProp<
    CalendarStackParamList,
    'Calendar'
  >;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchMetrics = async (date: string) => {
      try {
        // Tạo khoảng thời gian trong ngày đó
        const from = `${date}T00:00:00.000Z`;
        const to = `${date}T23:59:59.999Z`;

        // Gọi API /health/workouts
        const res = await api.get('/health/workouts', {
          params: { from, to },
        });

        const workouts: any[] = res.data ?? [];
        let stepsValue: number | null = null;

        if (workouts.length > 0) {
          // Lấy bản ghi mới nhất trong ngày
          const latest = workouts.sort(
            (a, b) =>
              new Date(b.time.endAt).getTime() -
              new Date(a.time.endAt).getTime(),
          )[0];
          stepsValue = latest.steps ?? null;
        }

        const metrics: DailyMetrics = {
          date,
          steps: stepsValue,
          caloriesOut: null,
          avgHeartRate: null,
          sleepMinutes: null,
          waterMl: null,
        };

        setMetricsMap(prev => ({ ...prev, [date]: metrics }));
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
      }
    };

    fetchMetrics(selectedDate);
  }, [selectedDate]);

  const metrics: DailyMetrics | null = metricsMap[selectedDate] ?? null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CalendarHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Calendar
          current={selectedDate}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: theme.colors.blue,
            },
          }}
          theme={{
            todayTextColor: theme.colors.blue,
            arrowColor: theme.colors.blue,
            selectedDayTextColor: theme.colors.white,
          }}
          style={styles.calendar}
        />

        <DailySummary
          onPressAiAnalysis={() =>
            navigation.navigate('AiAnalysis', {
              selectedDate,
              summary: metrics,
            })
          }
          selectedDate={selectedDate}
          stepGoal={STEP_GOAL}
          metrics={metrics}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
