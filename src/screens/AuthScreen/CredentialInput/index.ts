import { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { API_BASE_URL, api } from '../../../services/api';

type MethodType = 'email' | 'phone';

const getOtpRequestErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err) && !err.response) {
    return `Không thể kết nối tới máy chủ OTP (${API_BASE_URL}). Vui lòng kiểm tra backend đã chạy và thiết bị/emulator có truy cập được địa chỉ này.`;
  }

  const status = axios.isAxiosError(err) ? err.response?.status : undefined;

  if (status === 400) {
    return 'Email hoặc số điện thoại không hợp lệ. Vui lòng kiểm tra lại.';
  }

  return 'Không thể gửi mã OTP. Vui lòng thử lại sau.';
};

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
      Alert.alert('Error', getOtpRequestErrorMessage(err));
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
