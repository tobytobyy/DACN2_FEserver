import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '@screens/AppScreen/Calendar/CalendarScreen';
import AiAnalysisScreen from '@screens/AppScreen/AIAnalysis/AiAnalysisScreen';

export type CalendarStackParamList = {
  Calendar: undefined;
  AiAnalysis: undefined;
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="AiAnalysis" component={AiAnalysisScreen} />
    </Stack.Navigator>
  );
};

export default CalendarStack;
