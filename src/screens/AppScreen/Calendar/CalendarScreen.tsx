import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native'; // để điều hướng
import { theme } from '@assets/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';

import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import AiIcon from '@assets/icons/svgs/ai_icon_1111.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import StepsIcon from '@assets/icons/svgs/footprint_1515.svg';
import SleepIcon from '@assets/icons/svgs/sleep_2424.svg';

type HealthSummary = {
  heartRate: string;
  heartStatus: string;
  steps: string;
  sleep: string;
  sleepStatus: string;
};

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <CalendarIcon width={25} height={21} />
          <Text style={styles.headerText}>Calendar</Text>
        </View>

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

        {/* Daily Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Daily Summary</Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => navigation.navigate('AiAnalysis')}
            >
              <AiIcon width={16} height={16} color="#2D8C83" />
              <Text style={styles.aiButtonText}>AI Analysis</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.summaryDate}>
            {new Date(selectedDate).toDateString()}
          </Text>

          <View style={styles.metrics}>
            {/* Heart Rate */}
            <View style={styles.metricCardHeart}>
              <View style={styles.metricRow}>
                <HeartIcon width={20} height={20} color="#DF394C" />
                <Text style={styles.metricLabel}>AVG HEART RATE</Text>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.metricValue}>
                  {summary?.heartRate ?? '0 BPM'}
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {summary?.heartStatus ?? '(Unknown)'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Steps + Progress */}
            <View style={styles.metricCardSteps}>
              <View style={styles.metricRow}>
                <StepsIcon width={20} height={20} color="#0EA5E9" />
                <Text style={styles.metricLabel}>STEPS</Text>
              </View>
              <Text style={styles.metricValue}>
                {summary?.steps ?? '0 steps'}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stepProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stepsValue} / {STEP_GOAL} steps (
                {Math.round(stepProgress * 100)}
                %)
              </Text>
            </View>

            {/* Sleep */}
            <View style={styles.metricCardSleep}>
              <View style={styles.metricRow}>
                <SleepIcon width={20} height={20} color="#6366F1" />
                <Text style={styles.metricLabel}>SLEEP</Text>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.metricValue}>
                  {summary?.sleep ?? '00h00m'}
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {summary?.sleepStatus ?? '(Unknown)'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container có thể cuộn
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  scrollContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
    paddingBottom: theme.spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Calendar
  calendar: {
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },

  // Summary box
  summaryBox: {
    backgroundColor: '#d6e2eeff',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  aiButtonText: {
    color: '#2D8C83',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    fontFamily: theme.fonts.poppins.bold,
    marginLeft: theme.spacing.xs,
  },
  summaryDate: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.poppins.regular,
  },

  // Metrics wrapper
  metrics: {
    gap: theme.spacing.md,
  },

  // Cards
  metricCardHeart: {
    backgroundColor: '#430005',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  metricCardSteps: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  metricCardSleep: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  // Rows
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // đẩy badge sang phải
    gap: theme.spacing.sm,
  },

  // Text styles
  metricLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.regular,
  },
  metricValue: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Status badge
  statusBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FF69B4', // có thể đổi #A855F7 cho tím
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Progress styles
  progressBar: {
    height: 8,
    backgroundColor: '#444', // nền thanh progress (xám đậm)
    borderRadius: 4,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9', // phần đã đi (xanh)
  },
  progressText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.poppins.regular,
  },
});

export default CalendarScreen;
