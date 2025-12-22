import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import screen thuộc Home flow
 * ====================================================== */
import HomeScreen from '@screens/AppScreen/Home/HomeScreen';

/* ======================================================
 * 1. Định nghĩa Param List cho Home Stack
 * - Home không nhận param
 * ====================================================== */
export type HomeStackParamList = {
  /** Màn hình Home (Dashboard chính) */
  Home: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<HomeStackParamList>();

/* ======================================================
 * 3. Default options cho Stack
 * - Ẩn header mặc định để dùng custom header
 * ====================================================== */
const defaultStackScreenOptions = {
  headerShown: false,
};

/* ======================================================
 * 4. Home Stack
 * - Hiện tại chỉ có 1 màn hình
 * - Có thể mở rộng thêm Profile, Notification, ...
 * ====================================================== */
const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      {/* Home Dashboard */}
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
