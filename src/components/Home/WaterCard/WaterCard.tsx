// src/components/Home/WaterCard/WaterCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import WaterDropIcon from '@assets/icons/svgs/water_913.svg';
import WaterBackgroundIcon from '@assets/icons/svgs/water_background_119119.svg';
import { theme } from '@assets/theme';
import { useWater, WATER_TARGET } from './useWater';

type WaterCardProps = {
  title?: string;
  unit?: string;
  showGoalText?: boolean;
};

const WaterCard: React.FC<WaterCardProps> = ({
  title = 'Water',
  unit = 'mL',
  showGoalText = true,
}) => {
  const { waterAmount, increase, decrease } = useWater();

  const percent = Math.round((waterAmount / (WATER_TARGET || 1)) * 100);

  return (
    <View style={styles.waterCard}>
      {/* background icon */}
      <View style={styles.bgIconWrapper}>
        <View style={styles.waterBackgroundIcon}>
          <WaterBackgroundIcon width="380px" height="120px" />
        </View>
      </View>

      {/* left content */}
      <View style={styles.waterContent}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <WaterDropIcon />
          </View>
          <Text style={styles.smallCardTitle}>{title}</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.bigValue}>{waterAmount}</Text>
          <Text style={styles.smallUnit}> {unit}</Text>
        </View>

        {showGoalText && (
          <Text style={styles.goalText}>
            Goal: {WATER_TARGET} {unit} ({percent}%)
          </Text>
        )}
      </View>

      {/* right controls */}
      <View style={styles.waterControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={decrease}
          accessibilityLabel="Decrease water"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.waterCount}>{waterAmount}</Text>

        <TouchableOpacity
          style={[styles.controlBtn, styles.controlBtnPrimary]}
          onPress={increase}
          accessibilityLabel="Increase water"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.controlTextPrimary}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  waterCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bgIconWrapper: {
    position: 'absolute',
    right: -120,
    top: 10,
  },
  waterBackgroundIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  waterContent: {
    zIndex: 1,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1DBF8',
    marginRight: theme.spacing.xs,
  },
  smallCardTitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  bigValue: {
    fontSize: theme.fonts.size['2xl'],
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
  },
  smallUnit: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText,
    fontFamily: theme.fonts.poppins.regular,
    fontWeight: theme.fonts.weight.regular,
  },
  goalText: {
    marginTop: 4,
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText,
    fontFamily: theme.fonts.poppins.regular,
    fontWeight: theme.fonts.weight.regular,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
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
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  controlBtnPrimary: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
    marginLeft: 4,
  },
  controlText: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
  },
  controlTextPrimary: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
  },
  waterCount: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
    paddingHorizontal: 8,
    color: theme.colors.text,
  },
});

export default WaterCard;
