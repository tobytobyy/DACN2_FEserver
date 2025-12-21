import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles';

/**
 * CalendarHeader
 * - Header đơn giản cho màn Calendar
 * - Hiển thị tiêu đề ở phía trên
 */
const CalendarHeader = () => (
  <View style={styles.header}>
    {/* Tiêu đề Calendar */}
    <Text style={styles.headerText}>Calendar</Text>
  </View>
);

export default CalendarHeader;
