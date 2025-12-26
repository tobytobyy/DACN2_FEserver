import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { api } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@context/UserContext';

const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;
const RESEND_START_SECONDS = 59;

type MethodType = 'email' | 'phone';
type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function useOtpVerificationLogic() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OtpRouteProp>();
  const { setUser } = useUser();

  const method: MethodType = route.params?.method ?? 'email';
  const otpRequestId = route.params?.otpRequestId;
  const identifier = route.params?.identifier;

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [helperMessage, setHelperMessage] = useState<string>(
    `You have ${MAX_ATTEMPTS} attempts remaining.`,
  );
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(RESEND_START_SECONDS);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsRemaining === 0) return;
    const timerId = setInterval(() => {
      setSecondsRemaining(prev => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [secondsRemaining]);

  const attemptsRemaining = Math.max(MAX_ATTEMPTS - attempts, 0);
  const isLocked = attempts >= MAX_ATTEMPTS;

  const handleChange = (value: string, index: number) => {
    const cleanedValue = value.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = cleanedValue;
    setCode(nextCode);

    if (error && !isLocked) {
      setError(false);
      setHelperMessage(`You have ${attemptsRemaining} attempts remaining.`);
    }

    if (cleanedValue && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (isLocked) return;

    const enteredCode = code.join('');
    if (enteredCode.length < CODE_LENGTH) {
      setError(true);
      setHelperMessage('Please enter the full 6-digit code.');
      return;
    }

    setError(false);
    setHelperMessage(`You have ${attemptsRemaining} attempts remaining.`);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/otp/verify', {
        otpRequestId,
        identifier,
        channel: method === 'email' ? 'EMAIL' : 'SMS',
        code: enteredCode,
        deviceId: 'mobile-app',
      });

      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);

      setUser({
        id: data.userId,
        displayIdentifier: data.displayIdentifier,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      if (data.isNewUser) {
        navigation.navigate('AboutYouPage1');
      } else {
        navigation.replace('App'); // vào thẳng BottomTab
      }
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError(true);
      setHelperMessage(
        nextAttempts >= MAX_ATTEMPTS
          ? 'You have reached the maximum number of attempts.'
          : `Incorrect code. ${MAX_ATTEMPTS - nextAttempts} attempt${
              MAX_ATTEMPTS - nextAttempts === 1 ? '' : 's'
            } left.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsRemaining > 0) return;

    setSecondsRemaining(RESEND_START_SECONDS);
    setCode(Array(CODE_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
    setError(false);
    setAttempts(0);
    setHelperMessage(
      `A new code has been sent. You have ${MAX_ATTEMPTS} attempts remaining.`,
    );

    try {
      await api.post('/auth/otp/request', {
        channel: method === 'email' ? 'EMAIL' : 'SMS',
        identifier,
      });
    } catch {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const methodLabel = method === 'phone' ? 'phone number' : 'email address';

  return {
    code,
    focusedIndex,
    setFocusedIndex,
    loading,
    attempts,
    error,
    helperMessage,
    secondsRemaining,
    inputsRef,
    handleChange,
    handleKeyPress,
    handleVerify,
    handleResend,
    navigation,
    isLocked,
    methodLabel,
  };
}
