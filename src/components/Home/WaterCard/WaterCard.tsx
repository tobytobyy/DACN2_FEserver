// src/screens/HomeScreen/components/WaterCard/WaterCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Hook từ WaterContext (đảm bảo đã bọc WaterProvider ở tree cha)
import { useWater } from '@context/WaterContext';

// Icon giọt nước
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';

import styles from './styles';

/**
 * WaterCard
 * - Hiển thị lượng nước đã uống trong ngày
 * - Cho phép tăng/giảm theo kích thước cốc (cupSize)
 * - Render progress bar theo % hoàn thành so với dailyTarget
 */
const WaterCard: React.FC = () => {
  /**
   * Lấy state + actions từ WaterContext
   * - currentIntake: ml đã uống
   * - dailyTarget: mục tiêu ml/ngày
   * - cupSize: mỗi lần + / - bao nhiêu ml
   * - addWater: action tăng/giảm ml
   */
  const context = useWater();

  /**
   * Guard: nếu component không nằm trong WaterProvider
   * -> tránh crash và show thông báo lỗi
   */
  if (!context) {
    return (
      <View style={styles.missingProviderContainer}>
        <Text style={styles.missingProviderText}>Thiếu WaterProvider!</Text>
      </View>
    );
  }

  const { currentIntake, dailyTarget, cupSize, addWater } = context;

  /**
   * Fallback config
   * - CUP_SIZE: mặc định 250ml nếu context không cung cấp
   * - TARGET: mặc định 2000ml nếu context không cung cấp
   */
  const CUP_SIZE = cupSize || 250;
  const TARGET = dailyTarget || 2000;

  /**
   * Tính tiến độ (0 -> 100)
   * - clamp tối đa 100%
   * - tránh chia 0
   */
  const progress =
    TARGET > 0 ? Math.min((currentIntake / TARGET) * 100, 100) : 0;

  /**
   * Số cốc ước tính để hiển thị
   */
  const cups = Math.round(currentIntake / CUP_SIZE);

  /**
   * Handler tăng/giảm
   * - addWater nhận giá trị +/- CUP_SIZE
   */
  const handleIncrease = () => addWater(CUP_SIZE);
  const handleDecrease = () => addWater(-CUP_SIZE);

  return (
    <View style={styles.container}>
      {/* Background decor (vòng tròn trang trí) */}
      <View style={styles.bgDecor}>
        <View style={styles.circleDecor} />
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        {/* Header: icon + title */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            {/* Nếu SVG lỗi, có thể thay bằng <Text>💧</Text> */}
            <WaterDropIcon
              width={20}
              height={20}
              color="#0EA5E9"
              fill="#0EA5E9"
            />
          </View>
          <Text style={styles.title}>Water Intake</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          {/* width động theo progress (%), không inline */}
          <View style={styles.progressFill(progress)} />
        </View>

        {/* Text: Consumed / Target */}
        <View style={styles.infoRow}>
          <Text style={styles.currentValue}>{currentIntake}</Text>
          <Text style={styles.targetValue}> / {TARGET} ml</Text>
        </View>

        {/* Subtitle: Cups info */}
        <Text style={styles.subtitle}>
          {cups} cups ({CUP_SIZE}ml)
        </Text>
      </View>

      {/* Controls: nút +/- */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={handleDecrease}>
          <Text style={styles.btnTextMinus}>-</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.btn, styles.btnAdd]}
          onPress={handleIncrease}
        >
          <Text style={styles.btnTextPlus}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaterCard;
