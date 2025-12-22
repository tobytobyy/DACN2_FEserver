import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

/* ======================================================
 * Import các Stack (mỗi tab là 1 Stack riêng)
 * ====================================================== */
import HomeStack from '@navigation/AppStack/HomeStack';
import CalendarStack from '@navigation/AppStack/CalendarStack';
import ChatbotStack from '@navigation/AppStack/ChatbotStack';
import BrowserStack from '@navigation/AppStack/BrowserStack';
import SettingStack from '@navigation/AppStack/SettingStack';

/* ======================================================
 * Custom Tab Bar
 * - Thay thế tab bar mặc định của React Navigation
 * - Bạn tự render icon, label, animation, ...
 * ====================================================== */
import CustomBottomTabBar from '@navigation/BottomTab/CustomBottomTabBar';

/* ======================================================
 * 1. Khai báo Param List cho Bottom Tab
 * - Mỗi tab là 1 route
 * - Giúp TypeScript bắt lỗi khi navigate giữa các tab
 * ====================================================== */
export type BottomTabParamList = {
  /** Tab Chat AI */
  ChatbotTab: undefined;

  /** Tab Calendar */
  CalendarTab: undefined;

  /** Tab Home */
  HomeTab: undefined;

  /** Tab Browser / Health Features */
  BrowserTab: undefined;

  /** Tab Settings */
  SettingsTab: undefined;
};

/* ======================================================
 * 2. Khởi tạo Bottom Tab Navigator với type
 * ====================================================== */
const Tab = createBottomTabNavigator<BottomTabParamList>();

/* ======================================================
 * 3. Default screen options cho toàn bộ tab
 * - headerShown: false vì các stack con đã handle header riêng
 * ====================================================== */
const defaultTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

/* ======================================================
 * 4. BottomTab Navigator
 * - Mỗi Screen trong Tab sẽ render 1 Stack tương ứng
 * - tabBar: dùng CustomBottomTabBar thay vì mặc định
 * - initialRouteName: tab mặc định khi mở app
 * ====================================================== */
const BottomTab: React.FC = () => {
  return (
    <Tab.Navigator
      /**
       * Custom tab bar nhận props từ navigator
       * (state, descriptors, navigation...)
       */
      tabBar={props => <CustomBottomTabBar {...props} />}
      initialRouteName="HomeTab"
      screenOptions={defaultTabScreenOptions}
    >
      {/* Chat AI */}
      <Tab.Screen name="ChatbotTab" component={ChatbotStack} />

      {/* Calendar */}
      <Tab.Screen name="CalendarTab" component={CalendarStack} />

      {/* Home */}
      <Tab.Screen name="HomeTab" component={HomeStack} />

      {/* Browser / Health modules */}
      <Tab.Screen name="BrowserTab" component={BrowserStack} />

      {/* Settings */}
      <Tab.Screen name="SettingsTab" component={SettingStack} />
    </Tab.Navigator>
  );
};

export default BottomTab;
