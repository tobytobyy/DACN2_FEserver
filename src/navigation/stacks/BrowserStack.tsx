import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowserScreen from '../../screens/AppScreen/BrowserScreen';

const Stack = createNativeStackNavigator();

const BrowserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Browser" component={BrowserScreen} />
    </Stack.Navigator>
  );
};

export default BrowserStack;
