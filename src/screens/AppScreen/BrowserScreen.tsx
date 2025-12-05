import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BrowserScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="apps" size={40} color="#0EA5E9" />
      <Text style={styles.title}>Browser Screen</Text>
      <Text style={styles.subtitle}>
        Các chức năng chính của app sẽ nằm ở đây
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#555', marginTop: 8 },
});

export default BrowserScreen;
