// src/screens/SleepTracking/components/SleepDial/SleepDial.tsx
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import styles from '@components/SleepTracking/styles';

type Props = {
  /** tổng thời gian ngủ (string display) */
  totalSleep: string;
  /** sleep score từ 0 -> 100 */
  score: number;
};

/**
 * ✅ Dial hiển thị vòng tròn progress dựa theo score
 * - svg + circle với strokeDashoffset
 */
const SleepDial: React.FC<Props> = ({ totalSleep, score }) => {
  // Convert score 0-100 -> 0-1
  const progress = Math.max(0, Math.min(score / 100, 1));

  // Chu vi circle để tính strokeDasharray / offset
  const radius = 110;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const dashOffset = useMemo(
    () => circumference * (1 - progress),
    [circumference, progress],
  );

  return (
    <View style={styles.dialContainer}>
      <View style={styles.dialGlow} />

      <View style={styles.dialWrapper}>
        <Svg
          width={256}
          height={256}
          viewBox="0 0 256 256"
          style={styles.dialSvg}
        >
          {/* Background ring */}
          <Circle
            cx="128"
            cy="128"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="15"
            fill="none"
          />

          {/* Progress ring */}
          <Circle
            cx="128"
            cy="128"
            r={radius}
            stroke="#A5F3E0"
            strokeWidth="15"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Nội dung ở giữa dial */}
        <View style={styles.dialContent}>
          <MoonIcon width={32} height={32} color="#A5F3E0" fill="#A5F3E0" />
          <Text style={styles.totalSleepText}>{totalSleep}</Text>

          <Text style={styles.scoreText}>
            Sleep Score: <Text style={styles.scoreBold}>{score}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SleepDial;
