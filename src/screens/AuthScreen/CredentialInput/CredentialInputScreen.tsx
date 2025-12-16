import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Button from '@components/Auth/Button/Button';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { styles } from './style.tsx';

type CredentialRouteProp = RouteProp<AuthStackParamList, 'CredentialInput'>;

type MethodType = 'email' | 'phone';

const CredentialInputScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<CredentialRouteProp>();
  const method: MethodType = route.params?.method ?? 'email';
  const [value, setValue] = useState('');

  const title =
    method === 'phone' ? 'Enter your phone number' : 'Enter your email address';
  const placeholder = method === 'phone' ? 'Phone number' : 'Email address';
  const subtitle =
    method === 'phone'
      ? 'We will send a 6-digit verification code to this phone number.'
      : 'We will send a 6-digit verification code to this email.';

  const handleContinue = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    navigation.navigate('OtpVerification', { method });
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.input}
          placeholder={placeholder}
          keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
          autoCapitalize={method === 'email' ? 'none' : 'sentences'}
          returnKeyType="done"
        />

        <Button
          title="Send code"
          backgroundColor="#19A596"
          color="#FFFFFF"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

export default CredentialInputScreen;
