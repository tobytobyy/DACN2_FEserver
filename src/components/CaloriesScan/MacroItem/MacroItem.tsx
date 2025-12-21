import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

type Props = {
  label: string;
  value: string;
  color: string;
  percentage: number;
};

export const MacroItem: React.FC<Props> = ({
  label,
  value,
  color,
  percentage,
}) => (
  <View style={styles.macroItem}>
    <Text style={styles.macroLabel}>{label}</Text>
    <Text style={styles.macroValue}>{value}</Text>
    <View style={styles.macroTrack}>
      <View
        style={[
          styles.macroFill,
          { backgroundColor: color, width: `${percentage}%` },
        ]}
      />
    </View>
  </View>
);
