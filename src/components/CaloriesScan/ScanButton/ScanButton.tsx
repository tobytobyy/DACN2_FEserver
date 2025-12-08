import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  style?: any;
};

const ScanButton: React.FC<Props> = ({
  label,
  icon,
  onPress,
  type = 'primary',
  style,
}) => {
  const isPrimary = type === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        style,
      ]}
    >
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            isPrimary ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {label}
        </Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default ScanButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: theme.spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.white,
    elevation: 2,
  },

  label: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.medium,
  },

  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.text,
  },
});
