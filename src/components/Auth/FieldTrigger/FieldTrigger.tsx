import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

type Props = {
  label: string;
  value: string;
  onPress: () => void;
};

const FieldTrigger: React.FC<Props> = ({ label, value, onPress }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.floatingLabel, styles.surfaceLabel]}>{label}</Text>
    <TouchableOpacity style={styles.selector} onPress={onPress}>
      <Text style={styles.selectorText}>{value}</Text>
    </TouchableOpacity>
  </View>
);

export default FieldTrigger;
