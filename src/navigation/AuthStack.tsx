import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '../screens/AuthScreen/LogInScreen';
import AboutYouPage1 from '@screens/AuthScreen/AboutYouPage1';
import AboutYouPage2 from '@screens/AuthScreen/AboutYouPage2';

export type AuthStackParamList = {
  LogIn: undefined;
  AboutYouPage1: undefined;
  AboutYouPage2: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="AboutYouPage1" component={AboutYouPage1} />
      <Stack.Screen name="AboutYouPage2" component={AboutYouPage2} />
    </Stack.Navigator>
  );
};

export default AuthStack;
