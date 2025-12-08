import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BrowserScreen from '@screens/AppScreen/Browser/BrowserScreen';
import HeartMeasurementScreen from '@screens/HeartMeasurement/HeartMeasurementScreen';
import CaloriesScanScreen from '@screens/CaloriesScan/CaloriesScanScreen';
import FootStepCountingScreen from '@screens/FootStepCounting/FootStepCountingScreen';
import SleepTrackingScreen from '@screens/SleepTracking/SleepTrackingScreen';
import HeartResultScreen from '@screens/HeartMeasurement/HeartResultScreen';

export type BrowserStackParamList = {
  Browser: undefined;
  HeartMeasurement: undefined;
  AiCaloriesScan: undefined;
  FootStepCounting: undefined;
  SleepTracking: undefined;
  HeartResult: { bpm: number };
};

const Stack = createNativeStackNavigator<BrowserStackParamList>();

const BrowserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Browser" component={BrowserScreen} />
      <Stack.Screen
        name="HeartMeasurement"
        component={HeartMeasurementScreen}
      />
      <Stack.Screen name="AiCaloriesScan" component={CaloriesScanScreen} />
      <Stack.Screen
        name="FootStepCounting"
        component={FootStepCountingScreen}
      />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="HeartResult" component={HeartResultScreen} />
    </Stack.Navigator>
  );
};

export default BrowserStack;
