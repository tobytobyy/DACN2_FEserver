import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from '@screens/AppScreen/Setting/SettingScreen';

export type SettingStackParamList = {
  Setting: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

const defaultStackScreenOptions = {
  headerShown: false,
};

const SettingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default SettingStack;
