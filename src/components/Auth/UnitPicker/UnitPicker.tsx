import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

type Props = {
  type: 'weight' | 'height';
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (unit: string) => void;
};

const UnitPicker: React.FC<Props> = ({
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}) => (
  <View style={styles.unitPickerWrapper}>
    <TouchableOpacity
      style={[styles.unitSelector, isOpen && styles.unitSelectorActive]}
      onPress={onToggle}
    >
      <Text style={styles.unitSelectorText}>{value}</Text>
    </TouchableOpacity>

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
