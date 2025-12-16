import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeartCareLogo from '@assets/icons/svgs/health_care_logo.svg';
import HeartLine from '@assets/icons/svgs/heart_line.svg';
import GoogleIcon from '@assets/icons/svgs/google_5050.svg';
import EmailIcon from '@assets/icons/svgs/email_1512.svg';
import PhoneIcon from '@assets/icons/svgs/phone_5050.svg';
import { AuthOptionCard } from '@components/Auth/AuthOptionCard/AuthOptionCard';
import { styles } from './style';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type AuthMethod = 'google' | 'email' | 'phone';

const LogInScreen = () => {
  const [selected, setSelected] = useState<AuthMethod | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const lastTapRef = useRef<{ method: AuthMethod | null; time: number }>({
    method: null,
    time: 0,
  });

  const DOUBLE_TAP_DELAY = 300;

  // Cấu hình các phương thức đăng nhập
  const authMethods = useMemo(
    () => [
      {
        key: 'google' as AuthMethod,
        label: 'Google account',
        subtitle: 'Sync data',
        icon: <GoogleIcon width={50} height={50} />,
      },
      {
        key: 'email' as AuthMethod,
        label: 'Email',
        subtitle: 'Continue with email',
        icon: <EmailIcon width={50} height={50} />,
      },
      {
        key: 'phone' as AuthMethod,
        label: 'Phone number',
        subtitle: 'Continue with phone',
        icon: <PhoneIcon width={50} height={50} />,
      },
    ],
    [],
  );

  const handleAuthMethodPress = useCallback(
    (method: AuthMethod) => {
      const now = Date.now();
      const isSameMethod = lastTapRef.current.method === method;
      const isDoubleTap =
        isSameMethod && now - lastTapRef.current.time < DOUBLE_TAP_DELAY;

      lastTapRef.current = { method, time: now };

      if (isDoubleTap && (method === 'email' || method === 'phone')) {
        navigation.navigate('CredentialInput', { method });
        return;
      }
      setSelected(method);
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Name brand */}
        <View style={styles.nameBrand}>
          <HeartCareLogo width={40} height={40} />
          <Text style={styles.nameBrandText}>HeartCare</Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <HeartLine
            width={300}
            height={200}
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>How do you want to log in?</Text>
        <Text style={styles.subtitle}>
          Choose the sign-in option that works best for you and we will keep
          your data in sync.
        </Text>

        {/* Auth options */}
        <View style={styles.authOptionsContainer}>
          {authMethods.map(method => (
            <AuthOptionCard
              key={method.key}
              label={method.label}
              subtitle={method.subtitle}
              selected={selected === method.key}
              onPress={() => handleAuthMethodPress(method.key)}
              icon={method.icon}
              style={styles.authOptionCard}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogInScreen;
