// src/screens/SleepTracking/components/NightBackground/NightBackground.tsx
import React from 'react';
import { View } from 'react-native';
import styles from '@components/SleepTracking/styles';

/**
 * ✅ Background "night vibe"
 * - Dùng View tròn nhỏ giả lập star
 * - Không inline style: tạo 3 style riêng trong file (đơn giản nhất)
 */
const NightBackground: React.FC = () => {
  return (
    <View style={styles.headerBackground}>
      {/* Các star sẽ đặt bằng absolute, tạo bằng View */}
      <View style={[styles.star, nightStarStyles.star1]} />
      <View style={[styles.star, nightStarStyles.star2]} />
      <View style={[styles.star, nightStarStyles.star3]} />
    </View>
  );
};

export default NightBackground;

/**
 * ✅ Các style absolute của từng ngôi sao
 * - Không đặt inline trong JSX
 */
import { StyleSheet } from 'react-native';

const nightStarStyles = StyleSheet.create({
  star1: { top: 40, left: 40, opacity: 0.7 },
  star2: { top: 80, right: 80, opacity: 0.5, width: 6, height: 6 },
  star3: { top: 160, left: 180, opacity: 0.6 }, // dùng số cụ thể để tránh % inline
});
