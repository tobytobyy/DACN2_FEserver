import React from 'react';
import { FlatList, Text, View } from 'react-native';
import type { DailyMetrics } from '../../../types/home';
import styles from './styles';

type RangeStatus = 'normal' | 'low' | 'high' | 'neutral';

interface MetricRef {
  key: string;
  emoji: string;
  name: string;
  range: string;
  unit: string;
  getStatus: (m: DailyMetrics | null) => RangeStatus;
}

const REFERENCE_METRICS: MetricRef[] = [
  {
    key: 'heart',
    emoji: '💓',
    name: 'Nhịp tim',
    range: '60 – 100',
    unit: 'bpm',
    getStatus: m => {
      if (!m || m.avgHeartRate == null) return 'neutral';
      if (m.avgHeartRate < 60) return 'low';
      if (m.avgHeartRate <= 100) return 'normal';
      return 'high';
    },
  },
  {
    key: 'sleep',
    emoji: '😴',
    name: 'Giấc ngủ',
    range: '7 – 9',
    unit: 'giờ',
    getStatus: m => {
      if (!m || m.sleepMinutes == null) return 'neutral';
      const h = m.sleepMinutes / 60;
      if (h < 7) return 'low';
      if (h <= 9) return 'normal';
      return 'high';
    },
  },
  {
    key: 'steps',
    emoji: '🚶',
    name: 'Bước chân',
    range: '8.000 – 10.000',
    unit: 'bước/ngày',
    getStatus: m => {
      if (!m || m.steps == null) return 'neutral';
      if (m.steps < 8000) return 'low';
      if (m.steps <= 10000) return 'normal';
      return 'high';
    },
  },
  {
    key: 'water',
    emoji: '💧',
    name: 'Uống nước',
    range: '1.5 – 2.5',
    unit: 'L/ngày',
    getStatus: m => {
      if (!m || m.waterMl == null) return 'neutral';
      const L = m.waterMl / 1000;
      if (L < 1.5) return 'low';
      if (L <= 2.5) return 'normal';
      return 'high';
    },
  },
  {
    key: 'bmi',
    emoji: '⚖️',
    name: 'BMI',
    range: '18.5 – 24.9',
    unit: 'kg/m²',
    getStatus: () => 'neutral',
  },
  {
    key: 'bp',
    emoji: '🩺',
    name: 'Huyết áp',
    range: '90/60 – 120/80',
    unit: 'mmHg',
    getStatus: () => 'neutral',
  },
];

const STATUS_BORDER: Record<RangeStatus, object> = {
  normal: styles.cardNormal,
  low: styles.cardLow,
  high: styles.cardHigh,
  neutral: {},
};

type Props = { metrics: DailyMetrics | null };

const ReferenceRangesCard: React.FC<Props> = ({ metrics }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Chỉ số tham chiếu</Text>
    <FlatList
      data={REFERENCE_METRICS}
      keyExtractor={item => item.key}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const status = item.getStatus(metrics);
        return (
          <View style={[styles.card, STATUS_BORDER[status]]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.metricName}>{item.name}</Text>
            <Text style={styles.rangeText}>{item.range}</Text>
            <Text style={styles.unitText}>{item.unit}</Text>
          </View>
        );
      }}
    />
  </View>
);

export default ReferenceRangesCard;
