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
  subtitle?: string;
  icon: React.ReactNode; // icon bất kỳ
  selected?: boolean; // có đang được chọn không
  onPress?: () => void;

  width?: number | string;
  height?: number;
}

export const AuthOptionCard: React.FC<AuthOptionCardProps> = ({
  label,
  subtitle,
  icon,
  selected = false,
  onPress,
  width = 150,
  height = 150,
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
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
  },
});
