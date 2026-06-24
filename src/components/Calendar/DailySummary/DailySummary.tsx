import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AiIcon from '@assets/icons/svgs/ai_icon_1111.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import StepsIcon from '@assets/icons/svgs/footprint_1515.svg';
import SleepIcon from '@assets/icons/svgs/sleep_2424.svg';

import styles from '../styles';
import type { DailyMetrics } from '../Calendar.types';

type DailySummaryProps = {
  selectedDate: string;
  metrics: DailyMetrics | null;
  stepGoal: number;
  onPressAiAnalysis: () => void;
};

const getHeartStatus = (bpm: number | null): string | null => {
  if (bpm == null) return null;
  if (bpm < 60) return 'Low';
  if (bpm <= 100) return 'Normal';
  return 'High';
};

const getSleepLabel = (mins: number | null): string => {
  if (mins == null || mins === 0) return '–';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const getSleepStatus = (mins: number | null): string | null => {
  if (mins == null || mins === 0) return null;
  if (mins < 360) return 'Short';
  if (mins <= 540) return 'Normal';
  return 'Long';
};

const DailySummary = ({
  selectedDate,
  metrics,
  stepGoal,
  onPressAiAnalysis,
}: DailySummaryProps) => {
  const steps = metrics?.steps ?? null;
  const stepsValue = steps ?? 0;
  const stepProgress = Math.min(stepsValue / stepGoal, 1);
  const heartRate = metrics?.avgHeartRate ?? null;
  const sleepMinutes = metrics?.sleepMinutes ?? null;
  const heartStatus = getHeartStatus(heartRate);
  const sleepStatus = getSleepStatus(sleepMinutes);

  // Use local date to avoid UTC midnight shifting the displayed day
  const displayDate = new Date(selectedDate + 'T00:00:00').toDateString();

  return (
    <View style={styles.summaryBox}>
      {/* Header */}
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <TouchableOpacity style={styles.aiButton} onPress={onPressAiAnalysis}>
          <AiIcon width={16} height={16} color="#2D8C83" />
          <Text style={styles.aiButtonText}>AI Analysis</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.summaryDate}>{displayDate}</Text>

      <View style={styles.metrics}>
        {/* Heart Rate */}
        <View style={styles.metricCardHeart}>
          <View style={styles.metricRow}>
            <HeartIcon width={20} height={20} color="#DF394C" />
            <Text style={styles.metricLabel}>AVG HEART RATE</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.metricValue}>
              {heartRate != null ? `${heartRate} BPM` : '–'}
            </Text>
            {heartStatus != null && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{heartStatus}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Steps */}
        <View style={styles.metricCardSteps}>
          <View style={styles.metricRow}>
            <StepsIcon width={20} height={20} color="#0EA5E9" />
            <Text style={styles.metricLabel}>STEPS</Text>
          </View>
          <Text style={styles.metricValue}>
            {steps != null ? `${stepsValue.toLocaleString()} steps` : '–'}
          </Text>
          {steps != null && (
            <>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stepProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stepsValue.toLocaleString()} / {stepGoal.toLocaleString()}{' '}
                steps ({Math.round(stepProgress * 100)}%)
              </Text>
            </>
          )}
        </View>

        {/* Sleep */}
        <View style={styles.metricCardSleep}>
          <View style={styles.metricRow}>
            <SleepIcon width={20} height={20} color="#6366F1" />
            <Text style={styles.metricLabel}>SLEEP</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.metricValue}>
              {getSleepLabel(sleepMinutes)}
            </Text>
            {sleepStatus != null && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusTextSleep}>{sleepStatus}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DailySummary;
