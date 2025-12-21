import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <Text style={[styles.floatingLabel, styles.surfaceLabel]}>{label}</Text>

    {/* Vùng bấm để mở modal / picker */}
    <TouchableOpacity style={styles.selector} onPress={onPress}>
      <Text style={styles.selectorText}>{value}</Text>
    </TouchableOpacity>
  </View>
);

export default FieldTrigger;
