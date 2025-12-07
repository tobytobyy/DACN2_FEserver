import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './stacks/HomeStack';
import CalendarStack from './stacks/CalendarStack';
import ChatbotStack from './stacks/ChatbotStack';
import BrowserStack from './stacks/BrowserStack';
import SettingsStack from './stacks/SettingStack';

import CustomBottomTabBar from './CustomBottomTabBar';

export type BottomTabParamList = {
  ChatbotTab: undefined;
  CalendarTab: undefined;
  HomeTab: undefined;
  BrowserTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="ChatbotTab" component={ChatbotStack} />
      <Tab.Screen name="CalendarTab" component={CalendarStack} />
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="BrowserTab" component={BrowserStack} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
