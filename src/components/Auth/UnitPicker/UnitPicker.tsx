import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

/**
 * Props cho UnitPicker
 * - type: xác định picker dùng cho weight hay height (phục vụ logic ngoài)
 * - value: đơn vị hiện tại (kg, lbs, cm, ft...)
 * - options: danh sách đơn vị cho phép chọn
 * - isOpen: trạng thái mở / đóng dropdown
 * - onToggle: mở / đóng dropdown
 * - onChange: callback khi chọn đơn vị mới
 */
type Props = {
  type: 'weight' | 'height';
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (unit: string) => void;
};

/**
 * UnitPicker
 * - Picker đơn vị đo (kg/lbs hoặc cm/ft)
 * - Hiển thị dạng dropdown nhỏ gọn
 * - Được dùng bên cạnh TextInput (weight/height)
 */
const UnitPicker: React.FC<Props> = ({
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}) => (
  <View style={styles.unitPickerWrapper}>
    {/* Button hiển thị đơn vị hiện tại */}
    <TouchableOpacity
      style={[styles.unitSelector, isOpen && styles.unitSelectorActive]}
      onPress={onToggle}
    >
      <Text style={styles.unitSelectorText}>{value}</Text>
    </TouchableOpacity>

    {/* Dropdown danh sách đơn vị */}
    {isOpen && (
      <View style={styles.unitDropdown}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.unitOption}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.unitOptionText,
                // Highlight đơn vị đang được chọn
                option === value && styles.unitOptionTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

export default UnitPicker;
