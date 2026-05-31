import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@components/Auth/Button/Button';
import { styles } from './style';
import { useOtpVerificationLogic } from './index'; // <-- import hook

const OtpVerificationScreen: React.FC = () => {
  const {
    code,
    focusedIndex,
    setFocusedIndex,
    loading,
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
  } = useOtpVerificationLogic();

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
              ref={el => {
                inputsRef.current[index] = el;
              }}
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
