import { theme } from '@assets/theme';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

/**
 * Button dùng chung cho toàn app
 * - Hỗ trợ loading state
 * - Có thể custom kích thước, màu sắc, border radius
 */
interface ButtonProps {
  /** Text hiển thị trên button */
  title?: string;

  /** Kích thước button */
  width?: number | string;
  height?: number;

  /** Màu chữ */
  color?: string;

  /** Màu nền button */
  backgroundColor?: string;

  /** Bo góc */
  borderRadius?: number;
  disabled?: boolean;

  /** Callback khi bấm */
  onPress?: () => void;

  /** Trạng thái loading */
  loading?: boolean;

  /** Text hiển thị khi loading (nếu muốn khác title) */
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  width = '100%',
  height,
  color = theme.colors.text,
  backgroundColor = theme.colors.white,
  borderRadius = 50,
  onPress,

  loading = false,
  loadingText,
}) => {
  /**
   * Quyết định text hiển thị:
   * - Nếu đang loading và có loadingText → dùng loadingText
   * - Ngược lại → dùng title
   */
  const showText = loading && loadingText ? loadingText : title;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // Khi đang loading thì disable onPress
      onPress={loading ? undefined : onPress}
      disabled={loading}
      style={[
        styles.button, // style base
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          opacity: loading ? 0.8 : 1, // giảm opacity khi loading
        } as ViewStyle,
      ]}
    >
      {/* Nội dung bên trong button */}
      {loading ? (
        <View style={styles.content}>
          {/* Spinner khi loading */}
          <ActivityIndicator size="small" color={color} />

          {/* Có thể hiển thị text song song với spinner */}
          {showText ? (
            <Text style={[styles.text, { color } as TextStyle]}>
              {showText}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, { color } as TextStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  /**
   * Style nền của button
   */
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs * 3,
  },

  /**
   * Wrapper cho nội dung bên trong button
   * - Dùng cho cả trạng thái thường và loading
   */
  content: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Text của button
   */
  text: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.lg,
    textAlign: 'center',
  },
});

export default Button;
