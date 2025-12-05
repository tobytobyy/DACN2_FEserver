import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeartCareIcon from '@assets/icons/svgs/health-care-logo.svg';
import HeartLine from '@assets/icons/svgs/heart-line.svg';
import { AuthOptionCard } from '@components/AuthOptionCard/AuthOptionCard';
import GoogleIcon from '@assets/icons/svgs/google.svg';
import FaceIdIcon from '@assets/icons/svgs/face-id.svg';
import { theme } from '@assets/theme';

type AuthMethod = 'google' | 'faceId' | 'pin' | 'biometric';

const LogInScreen = () => {
  const [selected, setSelected] = useState<AuthMethod | null>(null);

  // Cấu hình các phương thức đăng nhập
  const authMethods = [
    {
      key: 'google' as AuthMethod,
      label: 'Google account',
      subtitle: 'Sync data',
      icon: <GoogleIcon width={24} height={24} />,
    },
    {
      key: 'faceId' as AuthMethod,
      label: 'Face ID',
      subtitle: 'Quick Access',
      icon: <FaceIdIcon width={24} height={24} />,
    },
    // Có thể thêm các phương thức khác sau này: pin, biometric...
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Name brand */}
        <View>
          <HeartCareIcon width={80} height={40} />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <HeartLine width={250} height={150} />
        </View>

        {/* Title */}
        <Text style={styles.title}>How do you want to log in?</Text>

        {/* Auth options */}
        <View style={styles.authOptions}>
          {authMethods.map(method => (
            <AuthOptionCard
              key={method.key}
              label={method.label}
              subtitle={method.subtitle}
              selected={selected === method.key}
              onPress={() => setSelected(method.key)}
              icon={method.icon}
            />
          ))}
        </View>
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
    paddingHorizontal: theme.spacing.gap * 2,
    paddingTop: theme.spacing.gap * 2,
  },
  banner: {
    transform: [{ translateX: -60 }],
    marginVertical: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size['2xl'],
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    width: '70%',
  },
  authOptions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm, // khoảng cách giữa các AuthOptionCard
  },
});

export default LogInScreen;
