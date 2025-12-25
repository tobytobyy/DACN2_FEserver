// src/screens/SleepTracking/components/ScheduleRow/ScheduleRow.tsx
import React from 'react';
import { View, Text } from 'react-native';

import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import ClockIcon from '@assets/icons/svgs/clock_1818.svg';

import styles from '@components/SleepTracking/styles';

type Props = {
  bedTime: string;
  wakeTime: string;
};

/**
 * ✅ Hiển thị thông tin Bedtime & Wakeup
 */
const ScheduleRow: React.FC<Props> = ({ bedTime, wakeTime }) => {
  return (
    <View style={styles.scheduleRow}>
      <View style={styles.scheduleCard}>
        <View>
          <Text style={styles.scheduleLabel}>BEDTIME</Text>
          <Text style={styles.scheduleValue}>{bedTime}</Text>
        </View>
        <MoonIcon width={24} height={24} color="#818CF8" fill="#818CF8" />
      </View>

      <View style={styles.scheduleCard}>
        <View>
          <Text style={styles.scheduleLabel}>WAKE UP</Text>
          <Text style={styles.scheduleValue}>{wakeTime}</Text>
        </View>
        <ClockIcon width={24} height={24} color="#A5F3E0" fill="#A5F3E0" />
      </View>
    </View>
  );
};

export default ScheduleRow;
