import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles';

const CalendarHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>Calendar</Text>
  </View>
);

export default CalendarHeader;
