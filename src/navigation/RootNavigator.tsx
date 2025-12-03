import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
// import { useAuth } from '../context/AuthContext';

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
        // Login successful -> show the app
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        // No token found, user isn't signed in -> show auth flow
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
