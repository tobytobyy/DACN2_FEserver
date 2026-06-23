import React from 'react';
import { View, Text } from 'react-native';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import PulseLine from '@assets/icons/svgs/heart_beat_2022.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import styles from './styles';

const SLEEP_TARGET_HOURS = 8;

type StatusLabel = { label: string; color: string };

const getHeartStatus = (bpm: number | null): StatusLabel => {
  if (bpm === null) return { label: 'No data', color: '#9CA3AF' };
  if (bpm < 60) return { label: 'Low', color: '#F97316' };
  if (bpm <= 100) return { label: 'Normal', color: '#10B981' };
  return { label: 'High', color: '#EF4444' };
};

const getSleepStatus = (totalMinutes: number | null): StatusLabel => {
  if (totalMinutes === null) return { label: 'No data', color: '#9CA3AF' };
  const h = totalMinutes / 60;
  if (h < 6) return { label: 'Low', color: '#F97316' };
  if (h <= 9) return { label: 'Normal', color: '#10B981' };
  return { label: 'Long', color: '#F97316' };
};

type Props = {
  heartRate: number | null;
  sleepMinutes: number | null;
};

const HeartCard: React.FC<{ heartRate: number | null }> = ({ heartRate }) => {
  const status = getHeartStatus(heartRate);
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
        <Text style={styles.bigValue}>
          {heartRate != null ? String(heartRate) : '–'}
        </Text>
        {heartRate != null && <Text style={styles.smallUnit}> BPM</Text>}
      </View>
      <View style={styles.statusRow}>
        <PulseLine color={status.color} fill={status.color} />
        <Text style={[styles.heartStatusText, { color: status.color }]}>
          {status.label}
        </Text>
      </View>
    </View>
  );
};

const SleepCard: React.FC<{ sleepMinutes: number | null }> = ({
  sleepMinutes,
}) => {
  const status = getSleepStatus(sleepMinutes);
  const hours = sleepMinutes != null ? Math.floor(sleepMinutes / 60) : null;
  const mins = sleepMinutes != null ? sleepMinutes % 60 : null;
  const displayValue =
    hours != null && mins != null
      ? `${hours}h ${String(mins).padStart(2, '0')}`
      : '–';

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
        <Text style={styles.bigValue}>{displayValue}</Text>
      </View>
      <Text style={[styles.targetLabel, { color: status.color }]}>
        {status.label}
      </Text>
      <Text style={styles.targetLabel}>Target: {SLEEP_TARGET_HOURS}h</Text>
    </View>
  );
};

const HeartSleepGrid: React.FC<Props> = ({ heartRate, sleepMinutes }) => (
  <View style={styles.gridContainer}>
    <HeartCard heartRate={heartRate} />
    <SleepCard sleepMinutes={sleepMinutes} />
  </View>
);

export default HeartSleepGrid;
