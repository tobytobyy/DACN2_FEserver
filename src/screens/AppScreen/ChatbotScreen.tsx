import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatbotScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="chatbubble-outline" size={40} color="#0EA5E9" />
      <Text style={styles.title}>Chatbot Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 16 },
});

export default ChatbotScreen;
