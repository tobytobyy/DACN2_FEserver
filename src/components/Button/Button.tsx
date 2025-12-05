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

  // icon bên trái (cho phép truyền bất cứ React node nào)
  leftIcon?: React.ReactNode;
  iconSpacing?: number; // khoảng cách icon - text

  // loading state
  loading?: boolean;
  loadingText?: string; // nếu muốn text khác khi loading
}

const Button: React.FC<ButtonProps> = ({
  title,
  width = '100%',
  height = 48,
  color = '#FFFFFF',
  backgroundColor = '#4A8A83',
  borderRadius = 10,
  onPress,

  leftIcon,
  iconSpacing = 10,

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
          {leftIcon ? (
            <View style={{ marginRight: iconSpacing }}>{leftIcon}</View>
          ) : null}
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fonts.nunito.regular,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
