import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '../screens/AuthScreen/LogInScreen';

export type AuthStackParamList = {
  LogIn: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="Register" component={LogInScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
