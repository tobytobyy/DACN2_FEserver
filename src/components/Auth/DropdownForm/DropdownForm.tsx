import { theme } from '@assets/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowDown from '@assets/icons/svgs/arrow_right_2424.svg';

interface DropdownFormProps {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
}

const DropdownForm: React.FC<DropdownFormProps> = ({
  label,
  value,
  options,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 0 = normal, 1 = focused/đã chọn
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOpen || !!value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [anim, isOpen, value]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -10],
  });

  const labelFontSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 13],
  });

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#333333', theme.colors.primary],
  });

  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666666', theme.colors.primary],
  });

  const displayText = value || '';

  const toggleOpen = () => setIsOpen(prev => !prev);

  // const handleSelect = (item: string) => {
  //   onValueChange(item);
  //   setIsOpen(false);
  // };

  return (
    <View style={styles.dropdownContainer}>
      {/* Field + floating label */}
      <Animated.View style={[styles.wrapper, { borderColor }]}>
        <Animated.View
          style={[
            styles.labelContainer,
            {
              top: labelTop,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.label,
              { fontSize: labelFontSize, color: labelColor },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.touchArea}
          onPress={toggleOpen}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dropdownButtonText,
              !value && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {displayText}
          </Text>
          {/* Bạn có thể đổi chỉ bấm arrow: onPress của riêng ArrowDown cũng gọi toggleOpen */}
          <ArrowDown width={20} height={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Dropdown panel nằm ngay dưới field */}
      {isOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={{ maxHeight: 300 }}>
            {options.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                onPress={() => {
                  onValueChange(item);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === item && styles.selectedOptionText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    gap: 8,
    position: 'relative', // để dropdownMenu absolute dựa vào
  },
  wrapper: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  labelContainer: {
    position: 'absolute',
    left: 24,
    paddingHorizontal: 4,
    backgroundColor: '#ffffff',
  },
  label: {
    fontWeight: '600',
  },
  touchArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  placeholderText: {
    color: '#999999',
  },

  // dropdown kiểu popover
  dropdownMenu: {
    position: 'absolute',
    top: '100%', // hơi thấp hơn field; có thể dùng '100%' nếu muốn sát mép dưới
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
    marginTop: 4,
    zIndex: 20,
    elevation: 6, // Android
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default DropdownForm;
