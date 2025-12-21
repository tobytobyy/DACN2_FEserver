import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native'; // để điều hướng
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@assets/theme';
import { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';

import DailySummary from '@components/Calendar/DailySummary/DailySummary';
import CalendarHeader from '@components/Calendar/CalendarHeader/CalendarHeader';
import { HealthSummary } from '@components/Calendar/Calendar.types';
import { styles } from '@components/Calendar/styles';

const healthData: Record<string, HealthSummary> = {
  '2025-11-15': {
    heartRate: '78 BPM',
    heartStatus: 'Normal',
    steps: '6,240 steps',
    sleep: '7h 20m',
    sleepStatus: 'Good',
  },
  '2025-11-22': {
    heartRate: '82 BPM',
    heartStatus: 'Slightly High',
    steps: '4,800 steps',
    sleep: '6h 10m',
    sleepStatus: 'Fair',
  },
};

const STEP_GOAL = 10000; // mục tiêu bước chân

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-11-15');
  const summary = healthData[selectedDate];

  // Khai báo navigation với kiểu đúng
  type NavigationProp = NativeStackNavigationProp<
    CalendarStackParamList,
    'Calendar'
  >;
  const navigation = useNavigation<NavigationProp>();

  // Tính % hoàn thành bước chân
  const stepsValue = parseInt(summary?.steps?.replace(/[^\d]/g, '') ?? '0', 10);
  const stepProgress = Math.min(stepsValue / STEP_GOAL, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CalendarHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar */}
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
          onPressAiAnalysis={() => navigation.navigate('AiAnalysis')}
          selectedDate={selectedDate}
          stepGoal={STEP_GOAL}
          stepProgress={stepProgress}
          stepsValue={stepsValue}
          summary={summary}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
