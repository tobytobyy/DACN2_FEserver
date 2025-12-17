import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 1. Import Context
// Đảm bảo file src/context/WaterContext.tsx đã tồn tại.
// Nếu báo lỗi import, hãy thử kiểm tra lại đường dẫn ../../../context/WaterContext
import { useWater } from '../../../context/WaterContext';

// Import Icons
// Nếu thiếu file này, bạn có thể comment dòng này lại và xóa thẻ <WaterDropIcon /> bên dưới
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';

const WaterCard = () => {
  // 2. Sử dụng hook từ Context
  const context = useWater();

  // Kiểm tra an toàn: Nếu quên bọc Provider, tránh crash app
  if (!context) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: 'red' }}>Thiếu WaterProvider!</Text>
      </View>
    );
  }

  const { currentIntake, dailyTarget, cupSize, addWater } = context;

  // Hằng số cấu hình lấy từ context hoặc fallback
  const CUP_SIZE = cupSize || 250;
  const TARGET = dailyTarget || 2000;

  // Tính toán % tiến độ
  const progress =
    TARGET > 0 ? Math.min((currentIntake / TARGET) * 100, 100) : 0;

  // Số lượng cốc (ước tính) để hiển thị
  const cups = Math.round(currentIntake / CUP_SIZE);

  // Hàm xử lý tăng giảm
  const handleIncrease = () => addWater(CUP_SIZE);
  const handleDecrease = () => addWater(-CUP_SIZE);

  return (
    <View style={styles.container}>
      {/* Background Decor: Dùng View tròn đơn giản thay vì SVG để tránh lỗi thiếu file */}
      <View style={styles.bgDecor}>
        <View style={styles.circleDecor} />
      </View>

      <View style={styles.content}>
        {/* Header: Icon + Title */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            {/* Nếu WaterDropIcon lỗi, bạn có thể thay bằng <Text>💧</Text> */}
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
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* Info Text: Consumed / Target */}
        <View style={styles.infoRow}>
          <Text style={styles.currentValue}>{currentIntake}</Text>
          <Text style={styles.targetValue}> / {TARGET} ml</Text>
        </View>

        {/* Subtitle: Cups info */}
        <Text style={styles.subtitle}>
          {cups} cups ({CUP_SIZE}ml)
        </Text>
      </View>

      {/* Controls (+/- Buttons) */}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE', // Light blue background
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 20,
  },
  bgDecor: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  // Hình tròn trang trí thay thế SVG
  circleDecor: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0EA5E9',
    opacity: 0.1,
  },
  content: {
    zIndex: 1,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#BFDBFE',
    borderRadius: 3,
    marginBottom: 8,
    width: '90%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  targetValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  btnAdd: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  // Style cho text dấu -
  btnTextMinus: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    lineHeight: 22,
  },
  // Style cho text dấu +
  btnTextPlus: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 22,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
});

export default WaterCard;
