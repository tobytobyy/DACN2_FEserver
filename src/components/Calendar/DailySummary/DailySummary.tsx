import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AiIcon from '@assets/icons/svgs/ai_icon_1111.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import StepsIcon from '@assets/icons/svgs/footprint_1515.svg';
import SleepIcon from '@assets/icons/svgs/sleep_2424.svg';

import styles from '../styles';
import { HealthSummary } from '../Calendar.types';

type DailySummaryProps = {
  selectedDate: string;
  summary?: HealthSummary;
  stepsValue: number;
  stepProgress: number;
  stepGoal: number;
  onPressAiAnalysis: () => void;
};

const DailySummary = ({
  selectedDate,
  summary,
  stepsValue,
  stepProgress,
  stepGoal,
  onPressAiAnalysis,
}: DailySummaryProps) => (
  <View style={styles.summaryBox}>
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryTitle}>Daily Summary</Text>
      <TouchableOpacity style={styles.aiButton} onPress={onPressAiAnalysis}>
        <AiIcon width={16} height={16} color="#2D8C83" />
        <Text style={styles.aiButtonText}>AI Analysis</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.summaryDate}>
      {new Date(selectedDate).toDateString()}
    </Text>

    <View style={styles.metrics}>
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

      <View style={styles.metricCardSteps}>
        <View style={styles.metricRow}>
          <StepsIcon width={20} height={20} color="#0EA5E9" />
          <Text style={styles.metricLabel}>STEPS</Text>
        </View>
        <Text style={styles.metricValue}>{summary?.steps ?? '0 steps'}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(stepProgress, 1) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {stepsValue} / {stepGoal} steps ({Math.round(stepProgress * 100)}%)
        </Text>
      </View>

      <View style={styles.metricCardSleep}>
        <View style={styles.metricRow}>
          <SleepIcon width={20} height={20} color="#6366F1" />
          <Text style={styles.metricLabel}>SLEEP</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.metricValue}>{summary?.sleep ?? '00h00m'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusTextSleep}>
              {summary?.sleepStatus ?? '(Unknown)'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default DailySummary;
