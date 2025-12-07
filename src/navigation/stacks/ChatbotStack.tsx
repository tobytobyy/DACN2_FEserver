import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatbotScreen from '../../screens/AppScreen/ChatbotScreen';
import HistoryChatScreen from '../../screens/AppScreen/ChatOptions/HistoryChatScreen';

// Khai báo kiểu cho các route trong Stack
export type ChatbotStackParamList = {
  Chatbot: undefined;
  HistoryChat: undefined;
};

// Truyền kiểu vào Stack
const Stack = createNativeStackNavigator<ChatbotStackParamList>();

const ChatbotStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen
        name="HistoryChat"
        component={HistoryChatScreen}
        options={{ title: 'History Chat AI' }}
      />
    </Stack.Navigator>
  );
};

export default ChatbotStack;
