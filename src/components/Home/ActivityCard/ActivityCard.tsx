import React from 'react';
import { View, Text } from 'react-native';

import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import styles from './styles';

/**
 * ActivityCard
 * - Hiển thị tổng quan hoạt động trong ngày
 * - Bao gồm: Footstep + Calories
 * - Có progress bar thể hiện mức độ hoàn thành
 */
const ActivityCard: React.FC = () => {
  return (
    <View style={styles.activityCard}>
      {/* ================= Header ================= */}
      <View style={styles.activityHeader}>
        {/* Tiêu đề card */}
        <Text style={styles.activityTitle}>Activity today</Text>

        {/* Badge hiển thị target hoàn thành */}
        <View style={styles.targetBadge}>
          <Text style={styles.targetText}>Target: 80%</Text>
        </View>
      </View>

      {/* ================= Stats ================= */}
      <View style={styles.statsRow}>
        {/* ---------- Footstep Stats ---------- */}
        <View style={styles.statItem}>
          {/* Label + Icon */}
          <View style={styles.statLabelRow}>
            <FootstepIcon />
            <Text style={styles.statLabel}>FOOTSTEP</Text>
          </View>

          {/* Giá trị footstep */}
          <Text style={styles.statValue}>6,240</Text>

          {/* Progress bar footstep */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: '60%', // % hoàn thành
                  backgroundColor: '#10B981',
                },
              ]}
            />
          </View>
        </View>

        {/* ---------- Calories Stats ---------- */}
        <View style={styles.statItem}>
          {/* Label + Icon */}
          <View style={styles.statLabelRow}>
            <FireIcon />
            <Text style={styles.statLabel}>CALO</Text>
          </View>

          {/* Giá trị calories + đơn vị */}
          <View style={styles.valueRow}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.unitText}> kcal</Text>
          </View>

          {/* Progress bar calories */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: '40%', // % hoàn thành
                  backgroundColor: '#EF4444',
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
