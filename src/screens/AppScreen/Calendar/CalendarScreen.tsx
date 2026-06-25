import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '@assets/theme';
import { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';
import DailySummary from '@components/Calendar/DailySummary/DailySummary';
import CalendarHeader from '@components/Calendar/CalendarHeader/CalendarHeader';
import { styles } from '@components/Calendar/styles';
import type { DailyMetrics } from '@types/home';

import {
  fetchDayAggregate,
  fetchMonthAggregates,
} from '../../../services/calendarService';
import { buildMarkedDates } from '../../../utils/healthStatus';

const STEP_GOAL = 10000;

const formatLocalDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getMonthRange = (dateStr: string): { from: string; to: string } => {
  const d = new Date(dateStr + 'T00:00:00');
  const y = d.getFullYear();
  const mo = d.getMonth();
  const from = `${y}-${String(mo + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(y, mo + 1, 0).getDate();
  const to = `${y}-${String(mo + 1).padStart(2, '0')}-${String(
    lastDay,
  ).padStart(2, '0')}`;
  return { from, to };
};

type NavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'Calendar'
>;

const CalendarScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const today = formatLocalDate(new Date());

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [currentMonth, setCurrentMonth] = useState<string>(today);
  const [monthMap, setMonthMap] = useState<Record<string, DailyMetrics>>({});
  const [dayMetrics, setDayMetrics] = useState<DailyMetrics | null>(null);
  const [isDayLoading, setIsDayLoading] = useState(false);

  // Ref so useFocusEffect can read selectedDate without it being a dep
  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;

  // Load all aggregates for the visible month; returns the built map so callers can chain loadDay
  const loadMonth = useCallback(
    async (monthAnchor: string): Promise<Record<string, DailyMetrics>> => {
      const { from, to } = getMonthRange(monthAnchor);
      try {
        const list = await fetchMonthAggregates(from, to);
        const map: Record<string, DailyMetrics> = {};
        for (const agg of list) {
          if (agg.date) {
            // agg.date may arrive as string 'YYYY-MM-DD' or LocalDate serialized
            const key = String(agg.date).slice(0, 10);
            map[key] = agg;
          }
        }
        setMonthMap(prev => ({ ...prev, ...map }));
        return map;
      } catch {
        // silent — borders just won't appear for failed months
        return {};
      }
    },
    [],
  );

  // Load a single day's metrics
  const loadDay = useCallback(
    async (dateStr: string, map: Record<string, DailyMetrics>) => {
      if (map[dateStr]) {
        setDayMetrics(map[dateStr]);
        return;
      }
      setIsDayLoading(true);
      try {
        const agg = await fetchDayAggregate(dateStr);
        setDayMetrics(agg);
      } finally {
        setIsDayLoading(false);
      }
    },
    [],
  );

  // On focus or month change: load the visible month then load the selected day.
  // monthMap and selectedDate are intentionally excluded from deps — including
  // monthMap would cause an infinite loop (loadMonth writes monthMap state),
  // and selectedDate is read via ref so day presses don't retrigger this effect.
  useFocusEffect(
    useCallback(() => {
      loadMonth(currentMonth).then(newMap => {
        loadDay(selectedDateRef.current, newMap);
      });
    }, [currentMonth, loadMonth, loadDay]),
  );

  // When month changes — useFocusEffect handles the data load via currentMonth dep
  const handleMonthChange = useCallback((month: { dateString: string }) => {
    setCurrentMonth(month.dateString);
  }, []);

  // When a day is tapped
  const handleDayPress = useCallback(
    (day: { dateString: string }) => {
      const dateStr = day.dateString;
      setSelectedDate(dateStr);
      loadDay(dateStr, monthMap);
    },
    [monthMap, loadDay],
  );

  // Recompute markedDates only when monthMap, selectedDate, or today changes
  const markedDates = useMemo(
    () => buildMarkedDates(monthMap, selectedDate, today),
    [monthMap, selectedDate, today],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <CalendarHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markedDates={markedDates}
          markingType="custom"
          theme={{
            todayTextColor: theme.colors.blue,
            arrowColor: theme.colors.blue,
          }}
          style={styles.calendar}
        />

        {isDayLoading ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator color={theme.colors.blue} />
          </View>
        ) : (
          <DailySummary
            selectedDate={selectedDate}
            metrics={dayMetrics}
            stepGoal={STEP_GOAL}
            onPressAiAnalysis={() =>
              navigation.navigate('AiAnalysis', {
                selectedDate,
                summary: dayMetrics,
              })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
