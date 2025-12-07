import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';

export type RootNavigatorProps = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorProps>();

const RootNavigator = () => {
  // const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {true ? (
        <Stack.Screen name="App" component={BottomTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
