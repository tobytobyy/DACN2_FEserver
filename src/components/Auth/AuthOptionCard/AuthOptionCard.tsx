import { theme } from '@assets/theme';
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
          backgroundColor: selected ? '#DCD7D7' : '#FFFFFF',
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
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    borderRadius: theme.spacing.gap * 2,
    paddingHorizontal: theme.spacing.xs * 3,
    paddingVertical: theme.spacing.lg,
    justifyContent: 'center',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20, // blur
    shadowOffset: { width: 0, height: 0 }, // offset 0 0
    // Android shadow
    elevation: 10,
  },
  iconWrapper: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.regular,
  },
  subtitle: {
    color: theme.colors.subText,
    textAlign: 'center',
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.light,
    marginTop: theme.spacing.xs / 2,
  },
});
