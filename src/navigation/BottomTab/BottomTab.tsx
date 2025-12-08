import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

import HomeStack from '@navigation/AppStack/HomeStack';
import CalendarStack from '@navigation/AppStack/CalendarStack';
import ChatbotStack from '@navigation/AppStack/ChatbotStack';
import BrowserStack from '@navigation/AppStack/BrowserStack';
import SettingsStack from '@navigation/AppStack/SettingStack';

import CustomBottomTabBar from '@navigation/BottomTab/CustomBottomTabBar';

export type BottomTabParamList = {
  ChatbotTab: undefined;
  CalendarTab: undefined;
  HomeTab: undefined;
  BrowserTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const defaultTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

const BottomTab: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      initialRouteName="HomeTab"
      screenOptions={defaultTabScreenOptions}
    >
      <Tab.Screen name="ChatbotTab" component={ChatbotStack} />
      <Tab.Screen name="CalendarTab" component={CalendarStack} />
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="BrowserTab" component={BrowserStack} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default BottomTab;
