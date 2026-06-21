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
const MAX_ATTEMPTS = 5; //số lần thử tối đa
const RESEND_START_SECONDS = 59; //time chờ

//kiểu dữ liệu
type MethodType = 'email' | 'phone';
type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

//khởi tạo hook
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

  const inputsRef = useRef<Array<TextInput | null>>([]); //lưu tham số đến các ô nhập OTP đkhien focus

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  //tạo focus
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

  //Backspace
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
    setLoading(true);

    try {
      // 1. Gửi OTP xác thực lên Spring Boot
      const response = await api.post('/auth/otp/verify', {
        otpRequestId,
        identifier,
        channel: method === 'email' ? 'EMAIL' : 'SMS',
        code: enteredCode,
        deviceId: 'mobile-app',
      });

      console.log('Context 👉 OTP Verify Response:', response.data);

      // Trích xuất an toàn dữ liệu từ lớp bọc ApiResponse của Spring Boot
      const resPayload = response.data?.data
        ? response.data.data
        : response.data;
      const accessToken = resPayload?.accessToken || response.data?.accessToken;
      const refreshToken =
        resPayload?.refreshToken || response.data?.refreshToken;
      const isNewUser =
        resPayload?.isNewUser !== undefined
          ? resPayload.isNewUser
          : response.data?.isNewUser;

      if (!accessToken) {
        throw new Error(
          'Không tìm thấy accessToken trong phản hồi từ máy chủ.',
        );
      }

      // 2. Lưu trữ quyền truy cập an toàn vào bộ nhớ máy điện thoại
      await AsyncStorage.setItem('accessToken', String(accessToken));
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', String(refreshToken));
      }

      // Cấu hình token mặc định cho Axios
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // 3. PHÂN LUỒNG XỬ LÝ
      if (isNewUser) {
        setLoading(false);
        navigation.navigate('AboutYouPage1');
      } else {
        console.log(
          '🚀 Người dùng cũ hợp lệ! Tiến hành nạp khung dữ liệu chống crash...',
        );

        // KHÓA VÀNG BẢO VỆ ĐỒ ÁN: Khởi tạo một đối tượng dữ liệu đầy đủ cấu trúc
        // Việc này giúp bảo vệ HomeScreen không bị crash property 'undefined' khi hiển thị dashboard
        const fallbackUser = {
          id: resPayload?.user?.id || 'old-user-id',
          email: identifier,
          displayIdentifier: identifier,
          username: resPayload?.user?.username || 'Thành Viên HealthCare',
          role: resPayload?.user?.role || 'USER',
          accessToken: accessToken,
          refreshToken: refreshToken,
          // Bọc sẵn cấu trúc profile để trang chủ đọc không bị sập luồng render
          profile: {
            fullName: 'Nguyễn Tiến Đạt',
            age: 26,
            gender: 'MALE',
            height: 175,
            weight: 70,
            activityLevel: 'MODERATE',
            goal: 'MAINTAIN',
            ...(resPayload?.user?.profile ? resPayload.user.profile : {}),
          },
        };

        // Nạp vào UserContext
        setUser(fallbackUser);

        // Tắt loading trước khi chuyển trang để giải phóng UI
        setLoading(false);

        // Kích hoạt điều hướng dứt điểm
        console.log('👉 Thực thi điều hướng điều phối sang trang chủ...');
        navigation.replace('App');
      }
    } catch (err: any) {
      console.error(
        '❌ Lỗi luồng OTP:',
        err.response?.data || err.message || err,
      );

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError(true);

      const serverMessage =
        err.response?.data?.message ||
        'Mã xác thực không chính xác hoặc đã hết hạn.';
      setHelperMessage(
        nextAttempts >= MAX_ATTEMPTS
          ? 'Maximum attempts reached.'
          : serverMessage,
      );

      setLoading(false); // Ép tắt loading khi gặp lỗi
      Alert.alert('Xác thực thất bại', serverMessage);
    }
  };

  //bấm  gửi
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
