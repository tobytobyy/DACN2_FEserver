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

interface ButtonProps {
  title?: string;
  width?: number | string;
  height?: number;
  color?: string; // text color
  backgroundColor?: string; // button background
  borderRadius?: number;
  onPress?: () => void;

  // loading state
  loading?: boolean;
  loadingText?: string; // nếu muốn text khác khi loading
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
  const showText = loading && loadingText ? loadingText : title;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={loading ? undefined : onPress} // đang loading thì không cho bấm
      style={[
        styles.button,
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          opacity: loading ? 0.8 : 1,
        } as ViewStyle,
      ]}
      disabled={loading}
    >
      {/* Nội dung bên trong button */}
      {loading ? (
        <View style={styles.content}>
          <ActivityIndicator size="small" color={color} />
          {/* Nếu vẫn muốn có text khi loading */}
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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs * 3,
  },
  content: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.lg,
    textAlign: 'center',
  },
});

export default Button;
