import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import ChevronRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

type SettingRowProps = {
  IconComponent: React.ComponentType<any>;
  color?: string;
  iconColor?: string;
  title: string;
  value?: string;
  type?: 'link' | 'toggle';
  toggleState?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  isOriginalIcon?: boolean;
};

const SettingRow: React.FC<SettingRowProps> = ({
  IconComponent,
  color = '#FFF',
  iconColor,
  title,
  value,
  type = 'link',
  toggleState,
  onToggle,
  onClick,
  isOriginalIcon = false,
}) => {
  const handlePress = () => {
    if (type === 'toggle') {
      onToggle && onToggle();
    } else {
      onClick && onClick();
    }
  };

  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <IconComponent
            width={22}
            height={22}
            color={isOriginalIcon ? undefined : iconColor}
          />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>

      {type === 'toggle' ? (
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#2D8C83' }}
          thumbColor="#FFF"
          value={toggleState}
          onValueChange={onToggle}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={styles.valueText}>{value}</Text>}
          <ChevronRightIcon width={16} height={16} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SettingRow;
