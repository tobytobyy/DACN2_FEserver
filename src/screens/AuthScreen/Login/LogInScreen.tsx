import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeartCareLogo from '@assets/icons/svgs/health_care_logo.svg';
import HeartLine from '@assets/icons/svgs/heart_line.svg';
import GoogleIcon from '@assets/icons/svgs/google_5050.svg';
import FaceIdIcon from '@assets/icons/svgs/face_id_5050.svg';
import PinIcon from '@assets/icons/svgs/password_5050.svg';
import FingerIcon from '@assets/icons/svgs/fingerprint.svg';
import { AuthOptionCard } from '@components/Auth/AuthOptionCard/AuthOptionCard';
import { styles } from './style';
import Button from '@components/Auth/Button/Button';
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

export default LogInScreen;
