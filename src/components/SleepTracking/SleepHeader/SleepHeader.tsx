// src/screens/SleepTracking/components/SleepHeader/SleepHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import ChartIcon from '@assets/icons/svgs/cloud_2015.svg';

import styles from '@components/SleepTracking/styles';

type Props = {
  /** callback khi bấm back */
  onBack: () => void;
};

const SleepHeader: React.FC<Props> = ({ onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton} onPress={onBack}>
        <ArrowLeftIcon width={24} height={24} color="#FFF" fill="#FFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Sleep Tracker</Text>

      <TouchableOpacity style={styles.iconButton}>
        <ChartIcon width={24} height={24} color="#FFF" fill="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SleepHeader;
