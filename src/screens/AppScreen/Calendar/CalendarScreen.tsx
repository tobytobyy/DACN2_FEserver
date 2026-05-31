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
import { HealthSummary } from '@components/Calendar/Calendar.types';
import { styles } from '@components/Calendar/styles';

import { generateMockSleepAndHeart } from '@components/Calendar/mockHealthData';
import { api } from '../../../services/api';

const STEP_GOAL = 10000;

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-12-26');
  const [healthData, setHealthData] = useState<Record<string, HealthSummary>>(
    {},
  );

  type NavigationProp = NativeStackNavigationProp<
    CalendarStackParamList,
    'Calendar'
  >;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchStepsAndCompose = async (date: string) => {
      try {
        // Tạo khoảng thời gian trong ngày đó
        const from = `${date}T00:00:00.000Z`;
        const to = `${date}T23:59:59.999Z`;

        // Gọi API /health/workouts
        const res = await api.get('/health/workouts', {
          params: { from, to },
        });

        const workouts: any[] = res.data ?? [];
        let stepsValue = 0;

        if (workouts.length > 0) {
          // Lấy bản ghi mới nhất trong ngày
          const latest = workouts.sort(
            (a, b) =>
              new Date(b.time.endAt).getTime() -
              new Date(a.time.endAt).getTime(),
          )[0];
          stepsValue = latest.steps ?? 0;
        }

        // Ghép với sleep/heart mock
        const sleepHeart = generateMockSleepAndHeart();

        const summary: HealthSummary = {
          ...sleepHeart,
          steps: `${stepsValue.toLocaleString()} steps`,
        };

        setHealthData(prev => ({ ...prev, [date]: summary }));
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
      }
    };

    fetchStepsAndCompose(selectedDate);
  }, [selectedDate]);

  const summary = healthData[selectedDate];
  const stepsValue = parseInt(summary?.steps?.replace(/[^\d]/g, '') ?? '0', 10);
  const stepProgress = Math.min(stepsValue / STEP_GOAL, 1);

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

        {summary && (
          <DailySummary
            onPressAiAnalysis={() => navigation.navigate('AiAnalysis')}
            selectedDate={selectedDate}
            stepGoal={STEP_GOAL}
            stepProgress={stepProgress}
            stepsValue={stepsValue}
            summary={summary}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
