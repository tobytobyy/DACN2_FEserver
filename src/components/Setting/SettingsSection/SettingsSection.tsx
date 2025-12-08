import React from 'react';
import { View, Text } from 'react-native';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default SettingsSection;
