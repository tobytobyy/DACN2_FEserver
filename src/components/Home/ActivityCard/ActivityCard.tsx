import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import styles from './styles';

const DEFAULT_STEPS_TARGET = 10000;
const DEFAULT_CALORIES_TARGET = 1000;

type Props = {
  steps: number | null;
  calories: number | null;
  targetSteps?: number;
  targetCalories?: number;
};

const ActivityCard: React.FC<Props> = ({
  steps,
  calories,
  targetSteps = DEFAULT_STEPS_TARGET,
  targetCalories = DEFAULT_CALORIES_TARGET,
}) => {
  const progressSteps =
    steps != null ? Math.min((steps / targetSteps) * 100, 100) : 0;
  const progressCalories =
    calories != null ? Math.min((calories / targetCalories) * 100, 100) : 0;

  const getProgressStyle = (percent: number, color: string): ViewStyle => ({
    width: `${percent}%` as `${number}%`,
    backgroundColor: color,
  });

  const stepsLabel = steps != null ? steps.toLocaleString() : '–';
  const caloriesLabel = calories != null ? String(calories) : '–';

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Activity today</Text>
        <View style={styles.targetBadge}>
          <Text style={styles.targetText}>{progressCalories.toFixed(0)}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FootstepIcon />
            <Text style={styles.statLabel}>FOOTSTEP</Text>
          </View>
          <Text style={styles.statValue}>{stepsLabel}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(progressSteps, '#10B981'),
              ]}
            />
          </View>
          <Text style={styles.unitText}>
            Target: {targetSteps.toLocaleString()} steps
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FireIcon />
            <Text style={styles.statLabel}>CALO</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.statValue}>{caloriesLabel}</Text>
            {calories != null && <Text style={styles.unitText}> kcal</Text>}
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(progressCalories, '#EF4444'),
              ]}
            />
          </View>
          <Text style={styles.unitText}>Target: {targetCalories} kcal</Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
