// src/screens/SleepTracking/components/WeeklyTrend/WeeklyTrend.tsx
import React from 'react';
import { View, Text } from 'react-native';

import styles, { dynamicStyles } from '@components/SleepTracking/styles';
import { WEEK_LABELS, WEEK_MAX_HOURS } from '@context/SleepContext';

type Props = {
  weeklyData: number[];
};

/**
 * ✅ Weekly Trend chart
 * - Render 7 cột theo weeklyData
 * - Chiều cao cột scale theo WEEK_MAX_HOURS
 */
const WeeklyTrend: React.FC<Props> = ({ weeklyData }) => {
  return (
    <View style={styles.trendContainer}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Weekly Trend</Text>
        <Text style={styles.subText}>Last 7 Days</Text>
      </View>

      <View style={styles.chartRow}>
        {weeklyData.map((hours, idx) => {
          const height = Math.max(
            0,
            Math.min((hours / WEEK_MAX_HOURS) * 80, 80),
          );

          return (
            <View key={idx} style={styles.chartColumn}>
              <View
                style={[
                  styles.chartBarBase,
                  dynamicStyles.weeklyBarHeight(height),
                  idx === 3
                    ? weeklyBarStyles.highlightBar
                    : weeklyBarStyles.normalBar,
                ]}
              />
              <Text style={styles.chartLabel}>{WEEK_LABELS[idx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklyTrend;

import { StyleSheet } from 'react-native';

const weeklyBarStyles = StyleSheet.create({
  highlightBar: { backgroundColor: '#312E81' },
  normalBar: { backgroundColor: '#E0E7FF' },
});
