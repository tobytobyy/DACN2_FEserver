import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '@navigation/AuthStack/AuthStack';
import BottomTab from '@navigation/BottomTab/BottomTab';

export type RootNavigatorProps = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorProps>();

const defaultStackScreenOptions = {
  headerShown: false,
};

const RootNavigator = () => {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = false;

  return (
    <Stack.Navigator
      screenOptions={defaultStackScreenOptions}
      initialRouteName={isAuthenticated ? 'App' : 'Auth'}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={BottomTab} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
