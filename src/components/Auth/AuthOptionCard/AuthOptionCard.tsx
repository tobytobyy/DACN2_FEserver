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

/**
 * Card option dùng cho màn Auth / Onboarding
 * - Hiển thị icon + label + subtitle (nếu có)
 * - Có trạng thái selected để đổi màu viền/nền + shadow
 */
export interface AuthOptionCardProps {
  /** Tiêu đề chính của card */
  label: string;

  /** Mô tả phụ (optional) */
  subtitle?: string;

  /** Icon truyền vào (có thể là SVG, Image, component...) */
  icon: React.ReactNode;

  /** Trạng thái đang được chọn hay không */
  selected?: boolean;

  /** Callback khi bấm vào card */
  onPress?: () => void;

  /** Cho phép custom kích thước card theo nhu cầu */
  width?: number | string;
  height?: number;

  /** Cho phép truyền style bên ngoài để override */
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
      activeOpacity={0.9} // độ mờ khi nhấn
      onPress={onPress}
      style={[
        styles.card, // style base
        {
          width,
          height,
        } as ViewStyle, // kích thước động
        selected && styles.cardSelected, // nếu selected thì apply style selected
        style, // style override từ ngoài
      ]}
    >
      {/* Wrapper icon (fixed size) để icon luôn cân giữa */}
      <View style={styles.iconWrapper}>{icon}</View>

      {/* Nhóm text: label + subtitle */}
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  /**
   * Card base: layout ngang, canh giữa theo trục dọc
   * Có border + shadow để nổi lên như 1 tile/cell
   */
  card: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing.gap * 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    justifyContent: 'flex-start',
    gap: theme.spacing.md, // khoảng cách giữa icon và text (RN >= 0.71)
    borderWidth: 1,
    borderColor: '#E7EBF0',

    // iOS shadow
    shadowColor: '#030712',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },

    // Android shadow
    elevation: 6,
  },

  /**
   * Style khi card được chọn
   * - Đổi nền + viền primary
   * - Tăng shadow để cảm giác "active"
   */
  cardSelected: {
    backgroundColor: '#F2F8F7',
    borderColor: theme.colors.primary,
    shadowOpacity: 0.14,
    elevation: 10,
  },

  /**
   * Khung icon cố định 56x56 để icon luôn nằm giữa, đồng nhất kích thước
   */
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Nhóm text:
   * - flex:1 để chiếm phần còn lại của row
   * - alignItems:'center' để text căn giữa theo trục ngang (tuỳ UI)
   */
  textGroup: {
    flex: 1,
    alignItems: 'center',
  },

  /** Label chính */
  label: {
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semibold,
  },

  /** Subtitle phụ */
  subtitle: {
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.regular,
    marginTop: theme.spacing.xs / 2,
  },
});
