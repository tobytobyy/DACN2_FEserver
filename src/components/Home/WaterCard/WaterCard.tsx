// src/screens/HomeScreen/components/WaterCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
import WaterBackgroundIcon from '@assets/icons/svgs/water_background_119119.svg';

type WaterCardProps = {
  waterAmount: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const WaterCard: React.FC<WaterCardProps> = ({
  waterAmount,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.waterCard}>
      <View style={styles.bgIconWrapper}>
        <WaterBackgroundIcon
          fill="#959595ff"
          color="#959595ff"
          width="100px"
          height="100px"
        />
      </View>

      <View style={styles.waterContent}>
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#BAE6FD' }]}>
            <WaterDropIcon />
          </View>
          <Text style={styles.smallCardTitle}>Water</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.bigValue}>2000</Text>
          <Text style={styles.smallUnit}> mL</Text>
        </View>
      </View>

      <View style={styles.waterControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onDecrease}
          accessibilityLabel="Decrease water"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.waterCount}>{waterAmount}</Text>

        <TouchableOpacity
          style={[styles.controlBtn, styles.controlBtnPrimary]}
          onPress={onIncrease}
          accessibilityLabel="Increase water"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.controlText, styles.controlTextPrimary]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  waterCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bgIconWrapper: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  waterContent: {
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  bigValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  smallUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  controlText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  controlBtnPrimary: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  controlTextPrimary: {
    color: '#fff',
  },
  waterCount: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: '#000',
  },
});

export default WaterCard;
