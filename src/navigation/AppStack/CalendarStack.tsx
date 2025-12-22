import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import các screen thuộc Calendar flow
 * ====================================================== */
import CalendarScreen from '@screens/AppScreen/Calendar/CalendarScreen';
import AiAnalysisScreen from '@screens/AppScreen/AIAnalysis/AiAnalysisScreen';

/* ======================================================
 * 1. Định nghĩa Param List cho Calendar Stack
 * - Mỗi screen phải khai báo param (hoặc undefined)
 * - Giúp TypeScript kiểm soát navigate an toàn
 * ====================================================== */
export type CalendarStackParamList = {
  /** Màn hình lịch + tổng quan dữ liệu sức khoẻ */
  Calendar: undefined;

  /** Màn hình AI phân tích dữ liệu theo ngày */
  AiAnalysis: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<CalendarStackParamList>();

/* ======================================================
 * 3. Calendar Stack
 * - Chỉ chứa các screen liên quan tới Calendar
 * - headerShown: false → dùng header custom
 * ====================================================== */
const CalendarStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
      }}
    >
      {/* Calendar chính */}
      <Stack.Screen name="Calendar" component={CalendarScreen} />

      {/* AI Analysis chi tiết theo ngày */}
      <Stack.Screen name="AiAnalysis" component={AiAnalysisScreen} />
    </Stack.Navigator>
  );
};

export default CalendarStack;
