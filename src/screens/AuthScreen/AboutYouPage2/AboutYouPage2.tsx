import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@components/Auth/Button/Button';
import HeartPulse from '@assets/icons/svgs/heart_pulse.svg';
import Account from '@assets/icons/svgs/account_circle.svg';
import { theme } from '@assets/theme';
import { styles } from './styles';

const AboutYouPage2 = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // handle login action
  const handleNext = () => {
    setLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      navigation.getParent()?.navigate('App' as never);
      setLoading(false);
    }, 1500);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Logo */}
        <View style={styles.header}>
          <HeartPulse width={30} height={30} strokeWidth={3} />

          {/* Title */}
          <Text style={styles.title}>About you</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Listen to Your Heart Sub-headline: Your journey to a healthier life
          starts here.
        </Text>

        {/* Avatar */}
        <View style={styles.avatarBlock}>
          <Account width={60} height={60} color={theme.colors.text} />
          <Text style={styles.username}>Username/Email{'\n'}</Text>
        </View>

        <Text style={styles.description}>
          Welcome to your personal health companion. Whether you are tracking
          your daily steps, monitoring your heart rhythm, or improving your
          sleep quality, we are here to help you understand your body better. No
          extra hardware needed-just accurate insights at your fingertips.
        </Text>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Let's Get Started"
            loading={loading}
            loadingText="Loading..."
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutYouPage2;
