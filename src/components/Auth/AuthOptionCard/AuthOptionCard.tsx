import { theme } from '@assets/theme';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
  StyleProp,
} from 'react-native';

export interface AuthOptionCardProps {
  label: string;
  subtitle?: string;
  icon: React.ReactNode; // icon bất kỳ
  selected?: boolean; // có đang được chọn không
  onPress?: () => void;

  width?: number | string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const AuthOptionCard: React.FC<AuthOptionCardProps> = ({
  label,
  subtitle,
  icon,
  selected = false,
  onPress,
  width = '100%',
  height = 70,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          width,
          height,
        } as ViewStyle,
        selected && styles.cardSelected,
        style,
      ]}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing.gap * 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    justifyContent: 'flex-start',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E7EBF0',
    shadowColor: '#030712',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardSelected: {
    backgroundColor: '#F2F8F7',
    borderColor: theme.colors.primary,
    shadowOpacity: 0.14,
    elevation: 10,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semibold,
  },
  subtitle: {
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.regular,
    marginTop: theme.spacing.xs / 2,
  },
});
