// src/components/AuthOptionCard.tsx
import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';

export interface AuthOptionCardProps {
  label: string;
  icon: React.ReactNode; // icon bất kỳ
  selected?: boolean; // có đang được chọn không
  onPress?: () => void;

  width?: number | string;
  height?: number;
}

export const AuthOptionCard: React.FC<AuthOptionCardProps> = ({
  label,
  icon,
  selected = false,
  onPress,
  width = 150,
  height = 140,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          width,
          height,
          backgroundColor: selected ? '#D9D6D6' : '#FFFFFF',
        } as ViewStyle,
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    // shadow Android
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  labelSelected: {
    // nếu muốn khi selected thì text đậm hơn
    fontWeight: '600',
  },
});
