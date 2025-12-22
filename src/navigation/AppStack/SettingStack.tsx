import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import screen thuộc Setting flow
 * ====================================================== */
import SettingScreen from '@screens/AppScreen/Setting/SettingScreen';

/* ======================================================
 * 1. Định nghĩa Param List cho Setting Stack
 * - Setting hiện tại không nhận param
 * - Giúp TypeScript kiểm soát navigate
 * ====================================================== */
export type SettingStackParamList = {
  /** Màn hình Settings (Cài đặt ứng dụng) */
  Setting: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<SettingStackParamList>();

/* ======================================================
 * 3. Default options cho Stack
 * - Ẩn header mặc định để dùng header custom
 * ====================================================== */
const defaultStackScreenOptions = {
  headerShown: false,
};

/* ======================================================
 * 4. Setting Stack
 * - Chứa các màn hình liên quan tới cài đặt
 * - Có thể mở rộng thêm Account, Privacy, About, ...
 * ====================================================== */
const SettingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      {/* Settings chính */}
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default SettingStack;
