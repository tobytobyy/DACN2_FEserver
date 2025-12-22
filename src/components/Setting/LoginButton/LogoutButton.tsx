import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import LogoutIcon from '@assets/icons/svgs/logout_2424.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';
import { theme } from '@assets/theme';

type Props = {
  /** Callback khi bấm logout */
  onPress?: () => void;

  /** Disable khi đang xử lý logout */
  disabled?: boolean;
};

/**
 * LogoutButton
 * - Nút đăng xuất trong Settings
 * - Không dùng inline styles
 */
const LogoutButton: React.FC<Props> = ({ onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.logoutButton, disabled && styles.logoutButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {/* Icon logout */}
      <LogoutIcon width={20} height={20} color={theme.colors.red} />

      {/* Text logout */}
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
