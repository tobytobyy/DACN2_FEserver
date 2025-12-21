import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';
import { theme } from '@assets/theme';
import { MacroItem } from '../MacroItem/MacroItem';

/**
 * Props cho ResultSheet
 * - bottomInset: khoảng padding dưới (dùng cho safe area / bottom sheet)
 * - onClose: callback khi bấm nút đóng
 */
type Props = {
  bottomInset: number;
  onClose: () => void;
};

/**
 * ResultSheet
 * - Bottom sheet hiển thị kết quả phân tích món ăn
 * - Gồm tên món, calories và macro dinh dưỡng
 */
export const ResultSheet: React.FC<Props> = ({ bottomInset, onClose }) => (
  <View style={[styles.resultSheet, { paddingBottom: bottomInset }]}>
    {/* Drag handle để gợi ý có thể kéo */}
    <View style={styles.dragHandle} />

    {/* ===== Header ===== */}
    <View style={styles.sheetHeader}>
      {/* Tên món ăn */}
      <Text style={styles.resultTitle}>Avocado Toast</Text>

      {/* Nút đóng sheet */}
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>

    {/* ===== Calories ===== */}
    <View style={styles.calorieRow}>
      <Text style={styles.calorieValue}>320</Text>
      <Text style={styles.calorieUnit}>kcal</Text>
    </View>

    {/* ===== Macros ===== */}
    <View style={styles.macroRow}>
      <MacroItem label="Protein" value="12g" color="#0EA5E9" percentage={40} />
      <MacroItem label="Carbs" value="45g" color="#F59E0B" percentage={60} />
      <MacroItem label="Fat" value="18g" color="#EF4444" percentage={30} />
    </View>
  </View>
);
