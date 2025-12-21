import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

/**
 * Props cho MacroItem
 * - label: tên macro (Protein, Carbs, Fat…)
 * - value: giá trị hiển thị (vd: "120g")
 * - color: màu của progress bar
 * - percentage: % hoàn thành (0–100)
 */
type Props = {
  label: string;
  value: string;
  color: string;
  percentage: number;
};

/**
 * MacroItem
 * - Hiển thị thông tin macro dinh dưỡng
 * - Gồm label, value và progress bar
 */
export const MacroItem: React.FC<Props> = ({
  label,
  value,
  color,
  percentage,
}) => (
  <View style={styles.macroItem}>
    {/* Tên macro */}
    <Text style={styles.macroLabel}>{label}</Text>

    {/* Giá trị macro */}
    <Text style={styles.macroValue}>{value}</Text>

    {/* Thanh progress */}
    <View style={styles.macroTrack}>
      <View
        style={[
          styles.macroFill,
          {
            // Màu và độ rộng dựa trên % hoàn thành
            backgroundColor: color,
            width: `${percentage}%`,
          },
        ]}
      />
    </View>
  </View>
);
