// src/screens/WaterTracker/components/WaterHistoryItem/WaterHistoryItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
import styles from '@components/WaterTracking/WaterHistoryItem/styles';

type Props = {
  amount: number;
  time: string;
  onDelete: () => void;
};

const WaterHistoryItem: React.FC<Props> = ({ amount, time, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBg}>
          <WaterDropIcon
            width={16}
            height={16}
            color="#0EA5E9"
            fill="#0EA5E9"
          />
        </View>

        <View>
          <Text style={styles.amountText}>{amount} ml</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WaterHistoryItem;
