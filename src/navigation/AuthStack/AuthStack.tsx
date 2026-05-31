import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import các screen thuộc Auth flow
 * ====================================================== */
import LogInScreen from '@screens/AuthScreen/Login/LogInScreen';
import CredentialInputScreen from '@screens/AuthScreen/CredentialInput/CredentialInputScreen';
import OtpVerificationScreen from '@screens/AuthScreen/OtpVerification/OtpVerificationScreen';
import AboutYouPage1 from '@screens/AuthScreen/AboutYouPage1/AboutYouPage1';
import AboutYouPage2 from '@screens/AuthScreen/AboutYouPage2/AboutYouPage2';

/* ======================================================
 * 1. Định nghĩa Param List cho Auth Stack
 * - Mỗi screen khai báo param hoặc undefined
 * - Giúp TypeScript bắt lỗi khi navigate sai param
 * ====================================================== */
export type AuthStackParamList = {
  /** Màn hình login chính */
  LogIn: undefined;
  CredentialInput: { method: 'email' | 'phone' };
  OtpVerification: {
    method: 'email' | 'phone';
    otpRequestId: string;
    identifier: string;
  };

  /** Onboarding thông tin cơ bản - trang 1 */
  AboutYouPage1: undefined;

  /** Onboarding thông tin cơ bản - trang 2 */
  AboutYouPage2: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<AuthStackParamList>();

/* ======================================================
 * 3. Auth Stack
 * - Chứa toàn bộ flow đăng nhập + onboarding ban đầu
 * - headerShown: false vì app dùng custom header / layout riêng
 * ====================================================== */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
      }}
    >
      {/* Login */}
      <Stack.Screen name="LogIn" component={LogInScreen} />

      {/* Nhập email/phone */}
      <Stack.Screen name="CredentialInput" component={CredentialInputScreen} />

      {/* Xác thực OTP */}
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />

      {/* Onboarding: About you */}
      <Stack.Screen name="AboutYouPage1" component={AboutYouPage1} />
      <Stack.Screen name="AboutYouPage2" component={AboutYouPage2} />
    </Stack.Navigator>
  );
};

export default AuthStack;
