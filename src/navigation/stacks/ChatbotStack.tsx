import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatbotScreen from '../../screens/AppScreen/ChatbotScreen';

const Stack = createNativeStackNavigator();

const ChatbotStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
    </Stack.Navigator>
  );
};

export default ChatbotStack;
