import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import các screen thuộc Chatbot flow
 * ====================================================== */
import ChatbotScreen from '@screens/AppScreen/ChatBot/ChatbotScreen';
import HistoryChatScreen from '@screens/AppScreen/ChatOptions/HistoryChatScreen';

/* ======================================================
 * 1. Định nghĩa Param List cho Chatbot Stack
 * - Mỗi screen phải khai báo param hoặc undefined
 * - Giúp TypeScript kiểm tra khi navigate
 * ====================================================== */
export type ChatbotStackParamList = {
  /** Màn hình chat AI chính */
  Chatbot: undefined;

  /** Màn hình lịch sử hội thoại */
  HistoryChat: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<ChatbotStackParamList>();

/* ======================================================
 * 3. Chatbot Stack
 * - Gom toàn bộ các screen liên quan tới Chat AI
 * - headerShown: false → dùng header custom
 * ====================================================== */
const ChatbotStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
      }}
    >
      {/* Chat AI chính */}
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />

      {/* Lịch sử chat AI */}
      <Stack.Screen
        name="HistoryChat"
        component={HistoryChatScreen}
        options={{
          title: 'History Chat AI', // title chỉ có tác dụng nếu bật header
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatbotStack;
