import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import styles from './styles';
import { useActivityToday } from './index';

const ActivityCard: React.FC = () => {
  const { activity } = useActivityToday();

  const getProgressStyle = (percent: number, color: string): ViewStyle => ({
    width: `${percent}%` as `${number}%`,
    backgroundColor: color,
  });

  return (
    <View style={styles.activityCard}>
      {/* ================= Header ================= */}
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <View style={styles.targetBadge}>
          {/* ✅ Hiển thị % đã thực hiện được so với target */}
          <Text style={styles.targetText}>
            {activity.progressCalories.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* ================= Stats ================= */}
      <View style={styles.statsRow}>
        {/* ---------- Footstep Stats ---------- */}
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FootstepIcon />
            <Text style={styles.statLabel}>FOOTSTEP</Text>
          </View>
          <Text style={styles.statValue}>
            {activity.steps.toLocaleString()}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(activity.progressSteps, '#10B981'),
              ]}
            />
          </View>
        </View>

        {/* ---------- Calories Stats ---------- */}
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FireIcon />
            <Text style={styles.statLabel}>CALO</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.statValue}>{activity.calories}</Text>
            <Text style={styles.unitText}> kcal</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(activity.progressCalories, '#EF4444'),
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
