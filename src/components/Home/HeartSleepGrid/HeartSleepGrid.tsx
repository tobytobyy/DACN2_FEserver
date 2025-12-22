// src/screens/HomeScreen/components/HeartSleepGrid.tsx
import React from 'react';
import { View, Text } from 'react-native';

import HeartIcon from '@assets/icons/svgs/heart.svg';
import PulseLine from '@assets/icons/svgs/heart_beat_2022.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';

import styles from './styles';

type HeartStatus = {
  label: string; // VD: "Normal", "High", "Low"
  color: string; // VD: "#10B981"
};

type Props = {
  /** Nhịp tim */
  heartRate: number;

  /** Trạng thái nhịp tim */
  heartStatus: HeartStatus;

  /** Thời lượng ngủ (giờ, phút) */
  sleepHours: number;
  sleepMinutes: number;

  /** Target ngủ (giờ) */
  sleepTargetHours: number;
};

/** Card hiển thị nhịp tim */
const HeartCard: React.FC<{
  heartRate: number;
  heartStatus: HeartStatus;
}> = ({ heartRate, heartStatus }) => {
  return (
    <View style={styles.smallCard}>
      <View style={styles.heartDecorCircle} />

      <View style={styles.headerRow}>
        <View style={styles.heartIconCircle}>
          <HeartIcon color="#DF394C" fill="#DF394C" width={20} height={20} />
        </View>
        <Text style={styles.smallCardTitle}>Heart beat</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>{heartRate}</Text>
        <Text style={styles.smallUnit}> BPM</Text>
      </View>

      <View style={styles.statusRow}>
        <PulseLine color={heartStatus.color} fill={heartStatus.color} />
        <Text style={[styles.heartStatusText, { color: heartStatus.color }]}>
          {heartStatus.label}
        </Text>
      </View>
    </View>
  );
};

/** Card hiển thị thời gian ngủ */
const SleepCard: React.FC<{
  sleepHours: number;
  sleepMinutes: number;
  sleepTargetHours: number;
}> = ({ sleepHours, sleepMinutes, sleepTargetHours }) => {
  // Format phút dạng 2 chữ số (VD: 7h 05)
  const minutesText = String(sleepMinutes).padStart(2, '0');

  return (
    <View style={styles.smallCard}>
      <View style={styles.sleepDecorCircle} />

      <View style={styles.headerRow}>
        <View style={styles.sleepIconCircle}>
          <MoonIcon color="#6366F1" fill="#6366F1" width={20} height={20} />
        </View>
        <Text style={styles.smallCardTitle}>Sleep</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>
          {sleepHours}
          <Text style={styles.hourUnit}>h</Text> {minutesText}
        </Text>
      </View>

      <Text style={styles.targetLabel}>Target: {sleepTargetHours}h</Text>
    </View>
  );
};

/**
 * HeartSleepGrid
 * - Nhận data từ props để render (không hard-code)
 */
const HeartSleepGrid: React.FC<Props> = ({
  heartRate,
  heartStatus,
  sleepHours,
  sleepMinutes,
  sleepTargetHours,
}) => {
  return (
    <View style={styles.gridContainer}>
      <HeartCard heartRate={heartRate} heartStatus={heartStatus} />
      <SleepCard
        sleepHours={sleepHours}
        sleepMinutes={sleepMinutes}
        sleepTargetHours={sleepTargetHours}
      />
    </View>
  );
};

export default HeartSleepGrid;
