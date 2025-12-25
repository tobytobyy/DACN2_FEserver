import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { api } from '../../../services/api';

type MethodType = 'email' | 'phone';

// Route type cho màn hình CredentialInput
type CredentialRouteProp = RouteProp<AuthStackParamList, 'CredentialInput'>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export function useCredentialInputLogic() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CredentialRouteProp>();

  const method: MethodType = route.params?.method ?? 'email';

  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const title =
    method === 'phone' ? 'Enter your phone number' : 'Enter your email address';
  const placeholder = method === 'phone' ? 'Phone number' : 'Email address';
  const subtitle =
    method === 'phone'
      ? 'We will send a 6-digit verification code to this phone number.'
      : 'We will send a 6-digit verification code to this email.';

  const handleContinue = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Please enter a valid value');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/otp/request', {
        channel: method === 'email' ? 'EMAIL' : 'SMS',
        identifier: trimmed,
      });

      navigation.navigate('OtpVerification', {
        method,
        otpRequestId: data.otpRequestId,
        identifier: trimmed,
      });
    } catch (err) {
      console.error('OTP request failed:', err);
      Alert.alert('Error', 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigation.goBack();

  return {
    title,
    subtitle,
    placeholder,
    value,
    setValue,
    loading,
    handleContinue,
    handleBack,
    method,
  };
}
