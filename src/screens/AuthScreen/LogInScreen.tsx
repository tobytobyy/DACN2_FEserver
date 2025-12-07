import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartCareLogo from '@assets/icons/svgs/health_care_logo.svg';
import HeartLine from '@assets/icons/svgs/heart_line.svg';
import GoogleIcon from '@assets/icons/svgs/google_5050.svg';
import FaceIdIcon from '@assets/icons/svgs/face_id_5050.svg';
import PinIcon from '@assets/icons/svgs/password_5050.svg';
import FingerIcon from '@assets/icons/svgs/fingerprint.svg';
import { AuthOptionCard } from '@components/AuthOptionCard/AuthOptionCard';
import { theme } from '@assets/theme';
import Button from '@components/Button/Button';
import { useNavigation } from '@react-navigation/native';
type AuthMethod = 'google' | 'faceId' | 'pin' | 'biometric';

const LogInScreen = () => {
  const [selected, setSelected] = useState<AuthMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Cấu hình các phương thức đăng nhập
  const authMethods = [
    {
      key: 'google' as AuthMethod,
      label: 'Google account',
      subtitle: 'Sync data',
      icon: <GoogleIcon width={50} height={50} />,
    },
    {
      key: 'faceId' as AuthMethod,
      label: 'Face ID',
      subtitle: 'Quick Access',
      icon: <FaceIdIcon width={50} height={50} />,
    },
    {
      key: 'pin' as AuthMethod,
      label: 'PIN Code',
      subtitle: 'Passcode',
      icon: <PinIcon width={50} height={50} />,
    },
    {
      key: 'biometric' as AuthMethod,
      label: 'Biometric',
      subtitle: 'Fingerprint',
      icon: <FingerIcon width={50} height={50} />,
    },
  ];

  // handle login action
  const handleContinue = () => {
    setLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      navigation.navigate('AboutYouPage1' as never);
      setLoading(false);
    }, 1500);
  };

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

        {/* Auth options */}
        <View style={styles.authOptionsContainer}>
          <View style={styles.authOptionsCard}>
            {authMethods.slice(0, 2).map(method => (
              <AuthOptionCard
                key={method.key}
                label={method.label}
                subtitle={method.subtitle}
                selected={selected === method.key}
                onPress={() => setSelected(method.key)}
                icon={method.icon}
                width={171}
                height={140}
              />
            ))}
          </View>

          <View style={styles.authOptionsCard}>
            {authMethods.slice(2, 4).map(method => (
              <AuthOptionCard
                key={method.key}
                label={method.label}
                subtitle={method.subtitle}
                selected={selected === method.key}
                onPress={() => setSelected(method.key)}
                icon={method.icon}
                width={171}
                height={140}
              />
            ))}
          </View>
        </View>

        <Button
          title="Continue"
          loading={loading}
          loadingText="Loading..."
          onPress={handleContinue}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFDFD',
  },
  nameBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  nameBrandText: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
  },
  banner: {
    transform: [{ translateX: -30 }],
  },
  title: {
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size['2xl'],
    marginBottom: theme.spacing.sm * 2,
    width: '80%',
  },
  authOptionsContainer: {
    gap: theme.spacing.gap * 2,
    marginBottom: theme.spacing.xl,
  },
  authOptionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.gap * 2,
  },
});

export default LogInScreen;
