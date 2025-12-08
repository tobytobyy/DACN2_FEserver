import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LogoutIcon from '@assets/icons/svgs/logout_2424.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

const LogoutButton = () => {
  return (
    <TouchableOpacity style={styles.logoutButton}>
      <LogoutIcon width={20} height={20} color="#EF4444" />
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
