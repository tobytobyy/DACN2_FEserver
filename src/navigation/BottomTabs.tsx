import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './stacks/HomeStack';
import ProfileStack from './stacks/ProfileStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Khai báo type cho các tab
export type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Tách icon ra ngoài để tránh định nghĩa trong render
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="home-outline" color={color} size={size} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons
    name="account-circle-outline"
    color={color}
    size={size}
  />
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
      {/* Tab Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />

      {/* Tab Profile */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
