import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './stacks/HomeStack';
import CalendarStack from './stacks/CalendarStack';
import ChatbotStack from './stacks/ChatbotStack';
import BrowserStack from './stacks/BrowserStack';
import SettingsStack from './stacks/SettingStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type BottomTabParamList = {
  ChatbotTab: undefined;
  CalendarTab: undefined;
  HomeTab: undefined;
  BrowserTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ✅ Tách icon ra ngoài để tránh cảnh báo ESLint
const ChatbotIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="chatbubble-outline" color={color} size={size} />
);

const CalendarIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons
    name="calendar-month-outline"
    color={color}
    size={size}
  />
);

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home" color={color} size={size} />
);

const BrowserIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="apps" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="settings-outline" color={color} size={size} />
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="ChatbotTab"
        component={ChatbotStack}
        options={{
          tabBarLabel: 'Chatbot',
          tabBarIcon: ChatbotIcon,
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStack}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: CalendarIcon,
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="BrowserTab"
        component={BrowserStack}
        options={{
          tabBarLabel: 'Browser',
          tabBarIcon: BrowserIcon,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
