import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@components/Auth/Button/Button';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { styles } from './style.tsx';

type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

const CODE_LENGTH = 6;
const MOCK_CODE = '123456';
const MAX_ATTEMPTS = 5;
const RESEND_START_SECONDS = 59;

const OtpVerificationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<OtpRouteProp>();
  const method = route.params?.method ?? 'email';
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [helperMessage, setHelperMessage] = useState(
    `You have ${MAX_ATTEMPTS} attempts remaining.`,
  );
  const [secondsRemaining, setSecondsRemaining] =
    useState(RESEND_START_SECONDS);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsRemaining === 0) return;

    const timerId = setInterval(
      () => setSecondsRemaining(prev => Math.max(prev - 1, 0)),
      1000,
    );

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
    event: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (isLocked) {
      return;
    }

    const enteredCode = code.join('');

    if (enteredCode.length < CODE_LENGTH) {
      setError(true);
      setHelperMessage('Please enter the full 6-digit code.');
      return;
    }

    setError(false);
    setHelperMessage(`You have ${attemptsRemaining} attempts remaining.`);
    setLoading(true);

    if (enteredCode === MOCK_CODE) {
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('AboutYouPage1');
      }, 500);
      return;
    }

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
    setLoading(false);
  };

  const handleResend = () => {
    if (secondsRemaining > 0) return;

    setSecondsRemaining(RESEND_START_SECONDS);
    setCode(Array(CODE_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
    setError(false);
    setAttempts(0);
    setHelperMessage(
      `A new code has been sent. You have ${MAX_ATTEMPTS} attempts remaining.`,
    );
  };

  const methodLabel = method === 'phone' ? 'phone number' : 'email address';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to your {methodLabel}. Please enter it below to
          continue.
        </Text>

        <View style={styles.otpRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              style={[
                styles.otpInput,
                focusedIndex === index && styles.otpInputFocused,
                digit ? styles.otpInputFilled : null,
                error && styles.otpInputError,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              onChangeText={text => handleChange(text, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onKeyPress={event => handleKeyPress(event, index)}
              returnKeyType="next"
            />
          ))}
        </View>

        <Text style={[styles.helperText, error && styles.errorText]}>
          {helperMessage}
        </Text>

        <Button
          title="Verify code"
          loading={loading}
          loadingText="Verifying..."
          backgroundColor={isLocked ? '#E5E7EB' : undefined}
          color={isLocked ? '#9CA3AF' : undefined}
          onPress={!isLocked ? handleVerify : undefined}
        />

        <View style={styles.resendRow}>
          <TouchableOpacity
            activeOpacity={secondsRemaining > 0 ? 1 : 0.8}
            onPress={handleResend}
            style={[
              styles.resendButton,
              secondsRemaining > 0 && styles.resendButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.resendButtonText,
                secondsRemaining > 0 && styles.resendButtonTextDisabled,
              ]}
            >
              Resend code
            </Text>
          </TouchableOpacity>

          <Text style={styles.resendTimer}>
            {secondsRemaining > 0 ? `${secondsRemaining}s` : 'Ready to resend'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;
