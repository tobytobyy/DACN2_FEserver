import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles';

/**
 * Props cho FieldTrigger
 * - label: nhãn hiển thị phía trên (floating label)
 * - value: giá trị hiện tại của field
 * - onPress: callback khi người dùng bấm để mở modal / picker
 */
type Props = {
  label: string;
  value: string;
  onPress: () => void;
};

/**
 * FieldTrigger
 * - Dùng để hiển thị một field dạng readonly
 * - Khi bấm sẽ trigger mở modal / bottom sheet để chọn giá trị
 * - Thường dùng cho gender, birthday, weight, height...
 */
const FieldTrigger: React.FC<Props> = ({ label, value, onPress }) => (
  <View style={styles.fieldContainer}>
    {/* Floating label phía trên field */}
    <Text
      pointerEvents="none"
      style={[styles.floatingLabel, styles.surfaceLabel]}
    >
      {label}
    </Text>

    {/* Vùng bấm để mở modal / picker */}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      hitSlop={8}
      style={({ pressed }) => [
        styles.selector,
        pressed && styles.selectorPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.selectorText}>{value}</Text>
    </Pressable>
  </View>
);

export default FieldTrigger;
