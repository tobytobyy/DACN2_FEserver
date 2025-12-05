import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="calendar-month-outline"
        size={40}
        color="#0EA5E9"
      />
      <Text style={styles.title}>Calendar Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 16 },
});

export default CalendarScreen;
